import bundled from '@/data/catalogue.json';
import {parseHTML} from 'linkedom';
import {parseCatalogue,parseCard} from './wahapedia';
import type {CatalogueUnit} from './types';
export const baseUnits=bundled as CatalogueUnit[];
export const factionSlugs=new Map(baseUnits.map(u=>[u.faction,u.id.split('/')[0]]));
export async function sourceHtml(url:string,fragment=false){
 const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{Accept:'text/html'},cache:'no-store'});
 if(!r.ok)throw Error(`Wahapedia returned ${r.status}`);
 const html=await r.text();if(html.length>8_000_000)throw Error('Source page is too large');
 const doc=parseHTML(html).document;
 const edition=fragment?!!doc.querySelector('.armylist_header')&&!!doc.querySelector('a[href="'+url.replace('armylist.html','datasheets.html').replace('https://wahapedia.ru','')+'"]')&&!Array.from(doc.querySelectorAll('a[href]')).some(a=>/\/wh40k(?!11ed)[0-9]+ed\//.test(a.getAttribute('href')||'')):/11th edition/i.test(doc.querySelector('meta[name="description"]')?.getAttribute('content')||'');
 if(!edition)throw Error('Source is not verified as 11th edition');
 return html;
}
const pending=new Map<string,Promise<CatalogueUnit[]>>();
export async function liveFaction(faction:string):Promise<CatalogueUnit[]>{
 const slug=factionSlugs.get(faction);if(!slug)throw Error('Unknown faction');
 if(pending.has(faction))return pending.get(faction)!;
 const work=(async()=>{
  const url=`https://wahapedia.ru/wh40k11ed/factions/${slug}/armylist.html`;
  // The army-list endpoint is an HTML fragment without metadata. Verify its parent page too.
  await sourceHtml(url.replace('armylist.html',''));
  const parsed=parseCatalogue(await sourceHtml(url,true),slug,faction);if(!parsed.length)throw Error('No supported unit list found');
  const result:CatalogueUnit[]=[];
  for(const unit of parsed){
   const known=baseUnits.find(u=>u.id===unit.id);
   if(known){result.push({...known,...unit});continue;}
   // An allied unit can appear in several faction indexes. Preserve its native identity.
   const canonical=baseUnits.find(u=>u.id.split('/')[1]===unit.id.split('/')[1]&&(!u.nativeFaction||u.nativeFaction===u.faction));
   if(canonical){result.push({...canonical,...unit,nativeFaction:canonical.faction});continue;}
   if(result.filter(u=>!baseUnits.some(b=>b.id===u.id)).length>=50)throw Error('Too many new units to verify in one check');
   const card=parseCard(await sourceHtml(unit.url),unit);
   const normal=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
   const owner=[...factionSlugs.keys()].find(f=>card.factionKeywords.split(/[;,]/).some(k=>normal(k)===normal(f)||(f==='Space Marines'&&normal(k)==='adeptusastartes')||(f==='Chaos Space Marines'&&normal(k)==='hereticastartes')));
   if(!owner)throw Error(`Could not verify the native army for ${unit.name}`);
   result.push({...unit,nativeFaction:owner,factionKeywords:card.factionKeywords});
  }
  return result;
 })();pending.set(faction,work);try{return await work;}finally{pending.delete(faction);}
}
export async function resolveUnit(id:string){
 const known=baseUnits.find(u=>u.id===id);if(known)return known;
 const match=id.match(/^([a-z0-9-]+)\/([A-Z][A-Za-z0-9-]+)$/);if(!match)return;
 const faction=[...factionSlugs].find(([,slug])=>slug===match[1])?.[0];if(!faction)return;
 return (await liveFaction(faction)).find(u=>u.id===id);
}
