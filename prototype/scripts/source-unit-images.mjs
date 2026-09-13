import {readFile,writeFile} from 'node:fs/promises';

const units=JSON.parse(await readFile('data/catalogue.json','utf8'));
const curated=JSON.parse(await readFile('data/unit-images.json','utf8'));
const ids=new Set(units.map(unit=>unit.id));

for(const [id,image] of Object.entries(curated)){
 if(!ids.has(id))throw Error(`Curated image has no matching unit: ${id}`);
 if(image.kind!=='miniature'||!['white','transparent'].includes(image.background))throw Error(`Curated image must be a model on white or transparent background: ${id}`);
 if(!image.source.startsWith('https://')||!(image.url.startsWith('https://')||/^\/images\/units\/[\w.-]+$/.test(image.url)))throw Error(`Invalid curated image URL: ${id}`);
 if(!image.credit||!/^\d{4}-\d{2}-\d{2}$/.test(image.verifiedAt))throw Error(`Curated image needs credit and a verification date: ${id}`);
}

for(const unit of units){
 delete unit.image;
 if(curated[unit.id])unit.image=curated[unit.id];
}

await writeFile('data/catalogue.json',JSON.stringify(units,null,2)+'\n');
console.log(`Applied ${Object.keys(curated).length} individually verified model photos to ${units.length} units.`);
