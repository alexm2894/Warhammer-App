import {parseHTML} from "linkedom";
export interface RuleSection {id:string; name:string; text:string; url:string; options?:RuleSection[];kind?:'stratagem'|'enhancement'}
export interface FactionRules {faction:string; edition:11; retrievedAt:string; url:string; army:RuleSection; detachments:RuleSection[]; warning?:string}
export function parseFactionRules(html:string,faction:string,url:string):FactionRules {
 const {document}=parseHTML(html);
 if(!/11th edition/i.test(document.querySelector('meta[name="description"]')?.getAttribute('content')||'')) throw Error('Faction page is not verified as 11th edition.');
 document.querySelectorAll('script,style,.tooltip_templates,nav,#siteNav,.contents,.ShowFluff').forEach(e=>e.remove());
 const groups:{id:string;name:string;text:string;options?:RuleSection[]}[]=[];let current:typeof groups[number]|undefined;
 function walk(node: Node){
   if(node.nodeType===3){if(current)current.text+=node.textContent;return;}
   if(node.nodeType!==1)return;
   const element=node as Element;
   if(current&&element.classList.contains('str11Wrap')){
    const title=element.querySelector('.str11Name'),body=element.querySelector('.str11Text');
    if(title?.textContent&&body?.textContent)(current.options??=[]).push({kind:'stratagem',id:title.id,name:`${title.textContent.trim()} · ${element.querySelector('.str11CP')?.textContent?.trim()||'Stratagem'}`,text:body.textContent.trim(),url:url+'#'+title.id});
   }
   if(current&&element.classList.contains('EnhancementsPts')){
    const title=element.querySelector('li')?.textContent?.trim(),body=element.closest('td');
    if(title&&body)(current.options??=[]).push({kind:'enhancement',id:`${current.id}-${current.options?.length||0}`,name:title,text:[...body.querySelectorAll('p')].map(p=>p.textContent).join('\n'),url:url+'#'+current.id});
   }
   if(element.tagName==='H2'){current={id:element.id,name:(element.textContent||'').trim().replace(/\d+DP$/,''),text:''};groups.push(current);return;}
   for(const child of [...node.childNodes])walk(child);
   if(current && ['P','DIV','LI','TR','H3','BR'].includes(element.tagName))current.text+='\n';
 }
 walk(document.body);
 const army=groups.find(g=>g.id==='Army-Rules');if(!army)throw Error('Army rules could not be read.');
 const firstDetachment=groups.findIndex((g,i)=>i>groups.indexOf(army)&&/^Detachment-Rule/.test(g.id));
 for(let i=groups.indexOf(army)+1;i<firstDetachment-1;i++)army.text+='\n'+groups[i].name+'\n'+groups[i].text;
 if(!army.text.trim())throw Error('Army rules were empty.');
 const out=(g:typeof groups[number],name=g.name):RuleSection=>({id:g.id,name,text:g.text.replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim(),url:url+'#'+g.id});
 const detachments:RuleSection[]=[];
 for(let i=groups.indexOf(army)+1;i<groups.length;i++){
  if(/Crusade|Boarding|Combat-Patrol/i.test(groups[i].id))break;
  if(/^Detachment-Rule/.test(groups[i].id)&&groups[i-1]&&groups[i].text.trim())detachments.push(out(groups[i],groups[i-1].name));
  if(/^(Enhancements|Stratagems)/.test(groups[i].id)&&detachments.length&&groups[i].options?.length){const detachment=detachments.at(-1)!;(detachment.options??=[]).push(...groups[i].options!);}
 }
 if(!detachments.length)throw Error('Detachment rules could not be read.');
 return {faction,edition:11,retrievedAt:new Date().toISOString(),url,army:out(army),detachments};
}
