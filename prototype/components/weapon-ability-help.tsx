"use client";
import {useEffect,useId,useRef,useState} from 'react';
import snapshot from '@/data/weapon-abilities.json';
import {findWeaponAbility,type WeaponAbilityPack} from '@/lib/weapon-abilities';
let cached:WeaponAbilityPack={...snapshot,edition:11};
let pending:Promise<WeaponAbilityPack>|undefined;
let checked=false;
async function loadRules(force=false){
 if(!force&&checked)return cached;
 if(pending)return pending;
 pending=(async()=>{
  const response=await fetch('/api/weapon-abilities');
  const data=await response.json() as WeaponAbilityPack;
  if(!response.ok||data.edition!==11||!data.abilities?.['TWIN-LINKED']||!data.abilities?.['SUSTAINED HITS'])throw Error('Unable to refresh rules. Showing the dated saved copy.');
  cached=data;checked=true;return cached;
 })();
 try{return await pending;}finally{pending=undefined;}
}
export default function WeaponAbilityHelp({label,onClose}:{label:string;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),title=useId();
 const [pack,setPack]=useState(cached),[busy,setBusy]=useState(false),[warning,setWarning]=useState('');
 useEffect(()=>{const element=dialog.current!,opener=document.activeElement as HTMLElement|null;element.showModal();element.querySelector<HTMLButtonElement>('[data-close]')?.focus();return()=>{element.close();opener?.focus();};},[]);
 useEffect(()=>{let active=true;setBusy(true);loadRules().then(p=>{if(active)setPack(p);}).catch(e=>{if(active)setWarning(e.message);}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[]);
 async function refresh(){setBusy(true);setWarning('');try{setPack(await loadRules(true));}catch(e){setWarning((e as Error).message);}finally{setBusy(false);}}
 const text=findWeaponAbility(label,pack);
 return <dialog ref={dialog} className="weapon-ability-dialog" aria-labelledby={title} onCancel={onClose} onClose={onClose}>
  <header><span className="eyebrow">Weapon ability · 11th edition</span><h2 id={title}>{label}</h2></header>
  <div className="weapon-ability-explanation">{text?<><p>{text}</p>{label.includes(':')&&<p className="ability-restriction">Applies only against a target with one of the keywords shown after the colon in this weapon’s ability label.</p>}</>:<p>No verified explanation is available for this ability. Check the weapon’s datasheet and the linked core rules.</p>}</div>
  <footer><small>Wahapedia · retrieved {new Date(pack.retrievedAt).toLocaleDateString()}{busy?' · Checking source…':''}{warning?' · '+warning:''}</small><div><a href={pack.url} target="_blank" rel="noreferrer">Core rules</a><button type="button" onClick={refresh} disabled={busy}>Refresh</button><button type="button" data-close onClick={onClose}>Close</button></div></footer>
 </dialog>;
}
