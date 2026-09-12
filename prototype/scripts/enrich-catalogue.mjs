import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
const units=JSON.parse(await readFile('data/catalogue.json','utf8'));
await mkdir('.sites-runtime/roster',{recursive:true});
for(const slug of [...new Set(units.map(u=>u.id.split('/')[0]))]){
 const url=`https://wahapedia.ru/wh40k11ed/factions/${slug}/datasheets.html`;
 let html;try{html=await readFile(`.sites-runtime/roster/${slug}.html`,'utf8');}catch{const response=await fetch(url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error(`${slug}: ${response.status}`);html=await response.text();await writeFile(`.sites-runtime/roster/${slug}.html`,html);}
 const {document}=parseHTML(html);
 if(!/11th edition/i.test(document.querySelector('meta[name="description"]')?.getAttribute('content')||''))throw Error('Wrong edition');
 let count=0;
 for(const root of document.querySelectorAll('.dsOuterFrame')){
  const name=root.querySelector('.dsH2Header > div')?.textContent?.trim();
  const anchor=root.previousElementSibling?.getAttribute('id');
  const unit=units.find(u=>u.id===slug+'/'+anchor&&u.name.toLowerCase()===name?.toLowerCase());if(!unit)continue;
  const sizes=[];let from=1,to=null;
  for(const row of root.querySelectorAll('table tr')){
   const header=row.querySelector('.dsUnitCostHeader')?.textContent||'';
   if(header){const nums=[...header.matchAll(/\d+/g)].map(m=>Number(m[0]));from=nums[0]||1;to=nums[1]??(/\+/.test(header)?null:nums[0]||null);}
   const price=row.querySelector('.PriceTag');if(!price)continue;
   const label=row.querySelector('td')?.textContent?.trim()||'';
   const m=label.match(/^(\d+)\s+models?$/i);const composition=!m&&label.split(/,\s*/).every(part=>/^\d+\s+[A-Za-z]/.test(part));if(!m&&!composition)continue;
   const points=Number(price.textContent?.trim());if(!Number.isFinite(points))continue;
   sizes.push({models:m?Number(m[1]):[...label.matchAll(/(?:^|,\s*)(\d+)/g)].reduce((n,m)=>n+Number(m[1]),0),points,from,to,...(!m?{label}:{})});
  }
  unit.sizes=[...new Map(sizes.map(s=>[JSON.stringify(s),s])).values()];unit.pointsRetrievedAt=(await stat(`.sites-runtime/roster/${slug}.html`)).mtime.toISOString();count++;
 }
 console.log(slug,count,'units',units.filter(u=>u.id.startsWith(slug+'/')&&!u.sizes?.length).map(u=>u.name));
 await writeFile('data/catalogue.json',JSON.stringify(units,null,2)+'\n');
}
await writeFile('data/catalogue.json',JSON.stringify(units,null,2)+'\n');
