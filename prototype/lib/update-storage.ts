import {openLibrary} from './game-card-library.ts';
import type {UnitCard,CatalogueUnit} from './types';
import type {FactionRules} from './faction-rules';
export type UpdateData={units:CatalogueUnit[];rules:Record<string,FactionRules>;checkedAt?:string;attemptedAt?:string;failures:string[]};
export const emptyUpdate=():UpdateData=>({units:[],rules:{},failures:[]});
export async function readUpdate():Promise<UpdateData>{const db=await openLibrary();try{return await new Promise((resolve,reject)=>{const r=db.transaction('updates').objectStore('updates').get('current');r.onsuccess=()=>resolve(r.result||emptyUpdate());r.onerror=()=>reject(r.error);});}finally{db.close();}}
export async function storedCardIds():Promise<string[]>{const db=await openLibrary();try{return await new Promise((resolve,reject)=>{const r=db.transaction('cards').objectStore('cards').getAllKeys();r.onsuccess=()=>resolve(r.result.map(String));r.onerror=()=>reject(r.error);});}finally{db.close();}}
// One transaction commits the batch. An interrupted or failed write cannot replace half a library.
export async function commitUpdate(data:UpdateData,cards:UnitCard[],signal:AbortSignal){
 signal.throwIfAborted();const db=await openLibrary();try{signal.throwIfAborted();await new Promise<void>((resolve,reject)=>{
 const tx=db.transaction(['cards','updates'],'readwrite');const abort=()=>tx.abort();signal.addEventListener('abort',abort,{once:true});
 tx.oncomplete=()=>{signal.removeEventListener('abort',abort);resolve();};tx.onabort=tx.onerror=()=>{signal.removeEventListener('abort',abort);reject(tx.error||new Error('Update cancelled. Existing data kept.'));};
 for(const card of cards)tx.objectStore('cards').put(card);tx.objectStore('updates').put(data,'current');
 });}finally{db.close();}
}
export function mergeCatalogue(base:CatalogueUnit[],updates:CatalogueUnit[]){const map=new Map(base.map(u=>[u.id,u]));for(const u of updates){const b=map.get(u.id);map.set(u.id,{...b,...u,image:b?.image||u.image});}return [...map.values()];}

export async function keepRulePack(pack:FactionRules){const db=await openLibrary();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('updates','readwrite'),store=tx.objectStore('updates'),r=store.get('current');r.onsuccess=()=>{const data:UpdateData=r.result||emptyUpdate();data.rules[pack.faction]=pack;store.put(data,'current');};tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
