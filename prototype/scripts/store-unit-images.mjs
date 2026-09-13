import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('data/unit-images.json','utf8'));
await mkdir('public/images/units',{recursive:true});
for(const [id,photo] of Object.entries(manifest)){
 if(photo.url.startsWith('/images/units/'))continue;
 const response=await fetch(photo.url);if(!response.ok)throw Error(`${id}: ${response.status}`);
 const type=response.headers.get('content-type')||'';
 if(!/^image\/(jpeg|png|webp)/.test(type))throw Error(`Not an image: ${id}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 const hash=createHash('sha256').update(bytes).digest('hex');
 const extension=type.includes('png')?'png':type.includes('webp')?'webp':'jpg';
 const path=`images/units/${hash.slice(0,20)}.${extension}`;
 await writeFile('public/'+path,bytes);
 manifest[id]={...photo,originalUrl:photo.url,url:'/'+path,sha256:hash};
 console.log(id,bytes.length,'bytes stored');
}
await writeFile('data/unit-images.json',JSON.stringify(manifest,null,2)+'\n');
await import('./source-unit-images.mjs');
