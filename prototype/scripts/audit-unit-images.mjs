import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,sep} from 'node:path';
const manifest=JSON.parse(await readFile('data/unit-images.json','utf8'));
const catalogue=JSON.parse(await readFile('data/catalogue.json','utf8'));
const root=resolve('public/images/units');
let bytes=0;const unique=new Set();
for(const [id,photo] of Object.entries(manifest)){
 const unit=catalogue.find(u=>u.id===id);
 if(!unit||JSON.stringify(unit.image)!==JSON.stringify(photo))throw Error(`Catalogue photo differs from manifest: ${id}`);
 if(photo.kind!=='miniature'||!['white','transparent'].includes(photo.background)||!photo.source||!photo.credit)throw Error(`Missing photo provenance: ${id}`);
 if(!photo.url.startsWith('/images/units/'))throw Error(`Photo is not stored locally: ${id}`);
 const file=resolve('public'+photo.url);if(!file.startsWith(root+sep))throw Error(`Invalid photo path: ${id}`);
 await access(file);const data=await readFile(file);
 if(createHash('sha256').update(data).digest('hex')!==photo.sha256)throw Error(`Photo hash mismatch: ${id}`);
 const isImage=data.subarray(0,3).equals(Buffer.from([255,216,255]))||data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||(data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP');
 if(!isImage)throw Error(`Photo is not a JPEG, PNG or WebP: ${id}`);
 if(!unique.has(file)){unique.add(file);bytes+=data.length;}
}
for(const faction of ['astra-militarum','genestealer-cults']){
 const units=catalogue.filter(u=>u.id.startsWith(faction+'/')&&(u.nativeFaction||u.faction)===u.faction);
 const missing=units.filter(u=>!manifest[u.id]);
 console.log(`${faction}: ${units.length-missing.length}/${units.length} photos`);
 for(const unit of missing)console.log(`  Missing: ${unit.name}`);
}
console.log(`PASS: ${Object.keys(manifest).length} mappings, ${unique.size} local files, ${(bytes/1048576).toFixed(2)} MiB; hashes, image signatures, provenance and catalogue consistency verified.`);
