import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {parseCard,parseCatalogue} from '../lib/wahapedia.ts';
const sources = [
 ['adeptus-custodes','Adeptus Custodes','Custodian-Guard','Custodian Guard'],
 ['necrons','Necrons','Necron-Warriors','Necron Warriors'],
 ['space-marines','Space Marines','Terminator-Squad','Terminator Squad'],
 ['genestealer-cults','Genestealer Cults','Purestrain-Genestealers','Purestrain Genestealers'],
 ['tyranids','Tyranids','Genestealers','Genestealers'],
];
await mkdir('data',{recursive:true});
const units=new Map(), cards=[];
for(const [slug,faction,unitSlug,name] of sources){
 const html=await readFile(`.sites-runtime/samples-11/${slug}.html`,'utf8');
 const unit={id:`${slug}/${unitSlug}`,name,faction,url:`https://wahapedia.ru/wh40k11ed/factions/${slug}/${unitSlug}`};
 for(const entry of parseCatalogue(await readFile(`.sites-runtime/samples-11/${slug}-armylist.html`,'utf8'),slug,faction)) units.set(entry.id,entry);
 units.set(unit.id,unit);
 const retrievedAt=(await stat(`.sites-runtime/samples-11/${slug}.html`)).mtime.toISOString();
 const card=parseCard(html,unit,retrievedAt); card.source.mode='snapshot'; cards.push(card);
 console.log(`${name}: ${card.weapons.length} weapon profiles, ${card.sections.length} sections`);
}
for(const [slug,faction] of [['imperial-agents','Imperial Agents'],['imperial-knights','Imperial Knights']]){
 for(const entry of parseCatalogue(await readFile(`.sites-runtime/samples-11/${slug}-armylist.html`,'utf8'),slug,faction)) units.set(entry.id,entry);
}
await writeFile('data/catalogue.json',JSON.stringify([...units.values()],null,2));
await writeFile('data/snapshots.json',JSON.stringify(cards,null,2));
console.log(`Indexed ${units.size} units; saved ${cards.length} validated sample cards.`);
