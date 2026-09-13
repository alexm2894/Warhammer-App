import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parseCatalogue} from '../lib/wahapedia.ts';
import {parseFactionRules} from '../lib/faction-rules.ts';
const base='https://wahapedia.ru';
async function get(url){const r=await fetch(url);if(!r.ok)throw Error(`${url}: ${r.status}`);return r.text();}
const nav=await get(`${base}/wh40k11ed/nav.html`);
const armies=[...nav.matchAll(/href="(\/wh40k11ed\/factions\/([^"/]+))"[^>]*>([^<]+)<\/a>/g)].map(m=>({name:m[3],slug:m[2],url:base+m[1]+'/'}));
if(armies.length<20)throw Error('Incomplete army index');
const units=JSON.parse(await readFile('data/catalogue.json','utf8'));
const rules=JSON.parse(await readFile('data/faction-rules.json','utf8'));
await mkdir('.sites-runtime/armies',{recursive:true});
for(const army of armies){
 if(army.slug==='adeptus-titanicus')continue; // Titans have no main-army detachment on this source.
 const html=await get(army.url); // parseFactionRules rejects a different edition.
 const parsed=parseFactionRules(html,army.name,army.url);
 const index=await get(army.url+'armylist.html');
 const found=parseCatalogue(index,army.slug,army.name);
 if(!found.length)throw Error(`No units for ${army.name}`);
 rules[army.name]=parsed;
 const known=new Set(units.map(u=>u.id));for(const u of found)if(!known.has(u.id))units.push(u);
 await writeFile(`.sites-runtime/armies/${army.slug}.html`,html);
 console.log(army.name,found.length,'units',parsed.detachments.length,'detachments');
}
await writeFile('data/catalogue.json',JSON.stringify(units,null,2)+'\n');
await writeFile('data/faction-rules.json',JSON.stringify(rules,null,2)+'\n');
await writeFile('data/armies.json',JSON.stringify({source:base+'/wh40k11ed/nav.html',retrievedAt:new Date().toISOString(),edition:11,armies},null,2)+'\n');
