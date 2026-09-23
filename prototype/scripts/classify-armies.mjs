import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
const units=JSON.parse(await readFile('data/catalogue.json','utf8'));
await mkdir('.sites-runtime/ownership',{recursive:true});
const names=[...new Set(units.map(u=>u.faction))];
const queue=[...new Set(units.map(u=>u.id.split('/')[0]))];
await Promise.all(Array.from({length:3},async()=>{while(queue.length){const slug=queue.shift();const url=`https://wahapedia.ru/wh40k11ed/factions/${slug}/datasheets.html`;const r=process.argv.includes('--cached')?null:await fetch(url);if(r&&!r.ok)throw Error(slug+': '+r.status);const html=r?await r.text():await readFile(`.sites-runtime/ownership/${slug}.html`,'utf8');await writeFile(`.sites-runtime/ownership/${slug}.html`,html);const {document}=parseHTML(html);if(!/11th edition/i.test(document.querySelector('meta[name="description"]')?.getAttribute('content')||''))throw Error('Edition');let n=0;
for(const root of document.querySelectorAll('.dsOuterFrame')){const anchor=root.previousElementSibling?.getAttribute('id');const unit=units.find(u=>u.id===slug+'/'+anchor);if(!unit)continue;const keys=root.querySelector('.dsRightСolKW')?.textContent?.replace(/^FACTION KEYWORDS:\s*/i,'').trim()||'';const aliases={'Space Marines':'ADEPTUS ASTARTES','Imperial Agents':'AGENTS OF THE IMPERIUM','Chaos Space Marines':'HERETIC ASTARTES','Chaos Daemons':'LEGIONES DAEMONICA','Aeldari':'ASURYANI'};const owner=names.find(f=>keys.toLowerCase().includes(f.toLowerCase())||(aliases[f]&&keys.includes(aliases[f])));if(owner){unit.nativeFaction=owner;unit.factionKeywords=keys;unit.factionSource={url,retrievedAt:new Date().toISOString()};n++;}}
console.log(slug,n);
}}));
await writeFile('data/catalogue.json',JSON.stringify(units,null,2)+'\n');
for(const f of ['Genestealer Cults','Astra Militarum'])console.log(f,units.filter(u=>u.faction===f).reduce((a,u)=>(a[u.nativeFaction||'UNKNOWN']=(a[u.nativeFaction||'UNKNOWN']||0)+1,a),{}));
