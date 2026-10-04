import {parseHTML} from 'linkedom';
import type {WeaponAbilityPack} from './weapon-abilities';
export const weaponRulesUrl='https://wahapedia.ru/wh40k11ed/the-rules/core-rules/';
export function parseWeaponAbilities(html:string,retrievedAt:string):WeaponAbilityPack{
 const {document}=parseHTML(html);
 if(!/11th edition/i.test(document.querySelector('meta[name="description"]')?.getAttribute('content')||''))throw Error('11th-edition weapon rules could not be verified.');
 const abilities:Record<string,string>={};
 const plain=(node:Element)=>{const copy=node.cloneNode(true) as HTMLElement;copy.querySelectorAll('br,li,p').forEach(e=>{e.before('\n');e.after('\n');});return copy.textContent.replace(/[^\S\n]+/g,' ').replace(/\n\s*\n/g,'\n').trim();};
 for(const box of document.querySelectorAll('.abWrap')){
  const heading=box.querySelector('.abName');
  const key=heading?.textContent.match(/^\[([^\]]+)\]/)?.[1];
  if(!key||abilities[key])continue;
  const clone=box.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.abNameWrap,.abLegend,.ShowFluff').forEach(e=>e.remove());
  clone.querySelectorAll('br,li,p').forEach(e=>{e.before('\n');e.after('\n');});
  abilities[key]=clone.textContent.replace(/[^\S\n]+/g,' ').replace(/\n\s*\n/g,'\n').trim();
 }
 for(const [key,id] of [['ASSAULT','ASSAULT-SHOOTING'],['CLOSE-QUARTERS','CLOSE-QUARTERS-SHOOTING'],['INDIRECT FIRE','INDIRECT-SHOOTING']]){
  const action=document.getElementById(id)?.closest('.str11Wrap');
  if(action&&abilities[key])abilities[key]+='\n\n'+plain(action);
 }
 // This restriction follows the Torrent box in the source rather than sitting inside it.
 const torrent=[...document.querySelectorAll('.abWrap')].find(e=>e.querySelector('.abName')?.textContent.startsWith('[TORRENT]'));
 if(torrent){let extra='';for(let node=torrent.nextSibling;node;node=node.nextSibling){if(node.nodeType===1&&(node as Element).classList.contains('abWrap'))break;extra+=node.textContent||'';}if(extra.includes('cannot have'))abilities.TORRENT+='\n'+extra.replace(/\s+/g,' ').trim();}
 if(!abilities['TWIN-LINKED']||!abilities['SUSTAINED HITS']||Object.keys(abilities).length<15)throw Error('Weapon rules response was incomplete.');
 return {edition:11,retrievedAt,url:weaponRulesUrl,abilities};
}
