import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parseFactionRules} from '../lib/faction-rules.ts';
import {parseCatalogue,parseCard} from '../lib/wahapedia.ts';
await mkdir('.sites-runtime/versus',{recursive:true});
const catalogue=JSON.parse(await readFile('data/catalogue.json','utf8'));
const factions=[...new Map(catalogue.map(u=>[u.faction,u.id.split('/')[0]])).entries(),['Adeptus Mechanicus','adeptus-mechanicus']];
const rules={};
for(const [faction,slug] of factions){
 const url=`https://wahapedia.ru/wh40k11ed/factions/${slug}/`;
 const response=await fetch(url);if(!response.ok)throw Error(`${faction}: ${response.status}`);
 const html=await response.text();await writeFile(`.sites-runtime/versus/${slug}.html`,html);
 rules[faction]=parseFactionRules(html,faction,url);
 console.log(faction,rules[faction].detachments.map(d=>d.name).join(', '));
 if(faction==='Adeptus Mechanicus'){
  const r=await fetch(url+'armylist.html');if(!r.ok)throw Error('Mechanicus index failed');
  catalogue.push(...parseCatalogue(await r.text(),slug,faction));
 }
}
await writeFile('data/faction-rules.json',JSON.stringify(rules,null,2));
await writeFile('data/catalogue.json',JSON.stringify([...new Map(catalogue.map(u=>[u.id,u])).values()],null,2));
const cards=JSON.parse(await readFile('data/snapshots.json','utf8'));
for(let i=0;i<cards.length;i++){const file=`.sites-runtime/samples-11/${cards[i].id.split('/')[0]}.html`;cards[i]=parseCard(await readFile(file,'utf8'),catalogue.find(u=>u.id===cards[i].id),cards[i].source.retrievedAt);cards[i].source.mode='snapshot';}
await writeFile('data/snapshots.json',JSON.stringify(cards,null,2));
