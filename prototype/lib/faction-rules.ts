import {parseHTML} from "linkedom";
export interface RuleSection {id:string; name:string; text:string; url:string}
export interface FactionRules {faction:string; edition:11; retrievedAt:string; url:string; army:RuleSection; detachments:RuleSection[]; warning?:string}
export function parseFactionRules(html:string,faction:string,url:string):FactionRules {
 const {document}=parseHTML(html);
 if(!/11th edition/i.test(document.querySelector('meta[name="description"]')?.getAttribute('content')||'')) throw Error('Faction page is not verified as 11th edition.');
 document.querySelectorAll('script,style,.tooltip_templates,nav,#siteNav,.contents').forEach(e=>e.remove());
 const groups:{id:string;name:string;text:string}[]=[];let current:typeof groups[number]|undefined;
 function walk(node: Node){
   if(node.nodeType===3){if(current)current.text+=node.textContent;return;}
   if(node.nodeType!==1)return;
   const element=node as Element;
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
 }
 if(!detachments.length)throw Error('Detachment rules could not be read.');
 return {faction,edition:11,retrievedAt:new Date().toISOString(),url,army:out(army),detachments};
}
