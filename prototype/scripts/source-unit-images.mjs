import {readFile,writeFile} from 'node:fs/promises';
const products=[];
if(process.argv.includes('--cached'))products.push(...JSON.parse(await readFile('.sites-runtime/image-products.json','utf8')));
else {
for(let page=1;page<=12;page++){
 const r=await fetch(`https://travellingman.com/collections/games-workshop/products.json?limit=250&page=${page}`,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('Image catalogue unavailable: '+r.status);
 const d=await r.json();products.push(...d.products);await writeFile('.sites-runtime/image-products.json',JSON.stringify(products));console.log('Image page',page,d.products.length);if(d.products.length<250)break;
}
await writeFile('.sites-runtime/image-products.json',JSON.stringify(products));
}
const units=JSON.parse(await readFile('data/catalogue.json','utf8'));
const norm=s=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const aliases={'Purestrain Genestealers':'Genestealers','Custodian Guard':'Custodian Guard Squad','Necron Warriors':'Necrons Warriors'};
let found=0;
for(const unit of units){
 delete unit.image;
 const name=norm(aliases[unit.name]||unit.name);
 const matches=products.filter(p=>/games workshop/i.test(p.vendor||'')&&p.images?.length&&!/Age Of Sigmar|AoS |Old World|Horus Heresy|Legions Imperialis/i.test((p.tags||[]).join(' '))&&!/combat patrol|battleforce|dice|datacards|paint|upgrade|patrol box|boarding patrol|strike force|codex|army set|horus heresy/i.test(p.title)&&(` ${norm(p.title)} `).endsWith(` ${name} `));
 const exact=matches.sort((a,b)=>a.title.length-b.title.length)[0];
 if(!exact)continue;
 const image=exact.images[0];const url=new URL(image.src);if(!['cdn.shopify.com','travellingman.com'].includes(url.hostname))continue;
 url.searchParams.set('width','480');
 unit.image={url:url.toString(),source:`https://travellingman.com/products/${exact.handle}`,credit:'Games Workshop / Travelling Man'};found++;
}
await writeFile('data/catalogue.json',JSON.stringify(units,null,2)+'\n');
console.log('Image references',found,'of',units.length,'from',products.length,'products');
console.log('Unmatched',units.filter(u=>!u.image).slice(0,20).map(u=>u.name));
