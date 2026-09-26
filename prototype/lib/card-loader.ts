import type {UnitCard} from './types';
import {getSessionCard,saveSessionCard} from './session-cache.ts';
const pending=new Map<string,Promise<UnitCard>>();
export async function loadCard(id:string){
 const cached=getSessionCard(id);if(cached)return cached;
 if(pending.has(id))return pending.get(id)!;
 const work=(async()=>{try{const response=await fetch('/api/card?id='+encodeURIComponent(id));const data=await response.json() as UnitCard & {error?:string};if(!response.ok)throw Error(data.error||'Card unavailable');saveSessionCard(data);return data;}finally{pending.delete(id);}})();
 pending.set(id,work);return work;
}
export async function precacheCards(ids:string[],progress:(done:number,failed:string[])=>void){
 const queue=[...new Set(ids)],failed:string[]=[];let done=0;
 await Promise.all(Array.from({length:Math.min(3,queue.length)},async()=>{while(queue.length){const id=queue.shift()!;try{await loadCard(id);}catch{failed.push(id);}progress(++done,[...failed]);}}));
 return failed;
}
