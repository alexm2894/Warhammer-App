// Rebuild the native Custodes catalogue from a single current index, not historical unit URLs.
import {readFileSync,writeFileSync,statSync} from 'node:fs';
import {parseHTML} from 'linkedom';
import {parseCard} from '../lib/wahapedia.ts';
import {parseFactionRules} from '../lib/faction-rules.ts';
import {CUSTODES as faction,custodesRevision} from '../lib/custodes-revision.ts';
const [collated,factionFile]=process.argv.slice(2);
const read=p=>JSON.parse(readFileSync(p,'utf8')),write=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2));
const catalogue=read('data/catalogue.json'),old=catalogue.filter(u=>u.faction===faction);
const doc=parseHTML(readFileSync(collated,'utf8')).document,meta=doc.querySelector('meta[name=description]');
if(!/11th edition.*Adeptus Custodes/i.test(meta?.getAttribute('content')||''))throw Error('Unexpected index');
const url='https://wahapedia.ru/wh40k11ed/factions/adeptus-custodes/',date=statSync(collated).mtime.toISOString();
const renamed={'Prosecutor-Squad':'Prosecutors','Vigilator-Squad':'Vigilators','Witchseeker-Squad':'Witchseekers','Sagittarum-Custodians-Sodality':'Sagittarum-Custodians','Gyrfalcon-Jetbike-Sodality':'Agamatus-Custodians'};
const units=[],cards=[];
for(const frame of doc.querySelectorAll('.dsOuterFrame')){
 const slug=frame.previousElementSibling?.id,name=frame.querySelector('.dsH2Header > div')?.textContent.trim();
 if(!slug||!name||!/^[-A-Za-z0-9]+$/.test(slug))throw Error('Missing unit anchor');
 const prior=old.find(u=>u.url===url+slug||u.id.split('/')[1].toLowerCase()===(renamed[slug]||slug).toLowerCase());
 const unit={...prior,id:prior?.id||'adeptus-custodes/'+slug,url:url+slug,name,faction,nativeFaction:faction,rulesRevision:custodesRevision};
 if(prior?.name&&prior.name!==name)unit.aliases=[...new Set([...(prior.aliases||[]),prior.name])];
 if(['Sentinel-Guard-Sodality','Custodian-Guard-Sodality'].includes(slug))unit.aliases=['Custodian Guard','Custodian Guards'];
 const card=parseCard(meta.outerHTML+frame.outerHTML,unit,date);
 if(!card.source.book||!card.sections.some(s=>s.title==='ABILITIES')||!card.sizes.length||!card.factionKeywords)throw Error('Incomplete card: '+name);
 card.source.mode='snapshot';cards.push(card);units.push({...unit,sizes:card.sizes,pointsRetrievedAt:date,factionKeywords:card.factionKeywords});
}
if(new Set(cards.map(c=>c.id)).size!==cards.length||cards.length<36)throw Error('Incomplete or duplicated roster');
const rules=read('data/faction-rules.json');rules[faction]=parseFactionRules(readFileSync(factionFile,'utf8'),faction,url);
rules[faction].retrievedAt=statSync(factionFile).mtime.toISOString();
write('data/faction-rules.json',rules);write('data/catalogue.json',[...units,...catalogue.filter(u=>u.faction!==faction)]);write('data/snapshots.json',[...cards,...read('data/snapshots.json').filter(c=>c.faction!==faction)]);
console.log('Verified',cards.length,'Custodes cards and',rules[faction].detachments.length,'detachments');
