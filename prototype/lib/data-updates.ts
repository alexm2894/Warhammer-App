import {ARMY_SLOTS_KEY,parseArmySlots} from './saved-armies';
import {validRoster} from './roster';
import {readUpdate,storedCardIds,commitUpdate,mergeCatalogue,type UpdateData} from './update-storage';
import {saveSessionCard,sessionCardIds} from './session-cache';
import {isFreshCard} from './update-policy';
import type {CatalogueUnit,UnitCard} from './types';
import type {FactionRules} from './faction-rules';
export type UpdateProgress={done:number;total:number;label:string};
async function get<T>(url:string,signal:AbortSignal):Promise<T>{const r=await fetch(url,{cache:'no-store',signal:AbortSignal.any([signal,AbortSignal.timeout(90000)])});const d=await r.json() as T & {error?:string};if(!r.ok)throw Error(d.error||'Source unavailable');return d;}
export async function runDataUpdate(signal:AbortSignal,progress:(p:UpdateProgress)=>void):Promise<UpdateData>{
 const previous=await readUpdate();signal.throwIfAborted();
 await commitUpdate({...previous,attemptedAt:new Date().toISOString()},[],signal);
 const base=(await get<{units:CatalogueUnit[]}>('/api/catalogue',signal)).units;
 const ids=new Set([...await storedCardIds(),...sessionCardIds()]);const factions=new Set<string>();
 const add=(group:{faction:string;roster:{entries:{unitId:string;count:number}[]}})=>{factions.add(group.faction);for(const e of group.roster.entries)if(e.count>0)ids.add(e.unitId);};
 for(const army of parseArmySlots(localStorage.getItem(ARMY_SLOTS_KEY)))if(army){add(army);for(const ally of army.allies||[])add(ally);}
 // Include unsaved build/import drafts without rewriting their selections or pasted text.
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)!;if(!key.startsWith('field-game-cards-11:')||key.endsWith('last-army'))continue;
  const draft=JSON.parse(localStorage.getItem(key)||'null');if(draft&&validRoster(draft.roster)){add({faction:key.slice('field-game-cards-11:'.length),roster:draft.roster});for(const ally of draft.allies||[])if(validRoster(ally.roster))add(ally);}
 }
 for(const id of ids){const unit=base.find(u=>u.id===id)||previous.units.find(u=>u.id===id);if(unit)factions.add(unit.nativeFaction||unit.faction);}
 for(const faction of Object.keys(previous.rules))factions.add(faction);
 const allFactions=[...new Set(base.map(u=>u.faction))];const failures:string[]=[];let units=mergeCatalogue(base,previous.units);const rules={...previous.rules};const cards:UnitCard[]=[];
 let done=0;const total=allFactions.length+factions.size+ids.size;
 const jobs:[string,()=>Promise<void>][]=[
  ...allFactions.map(faction=>[`${faction} unit list`,async()=>{const result=await get<{units:CatalogueUnit[]}>('/api/catalogue?faction='+encodeURIComponent(faction),signal);if(!result.units?.length)throw Error('Empty unit list');units=mergeCatalogue(units,result.units);}] as [string,()=>Promise<void>]),
  ...[...factions].map(faction=>[`${faction} rules`,async()=>{const pack=await get<FactionRules>('/api/faction-rules?faction='+encodeURIComponent(faction),signal);if(pack.warning||pack.edition!==11||pack.faction!==faction||!pack.army?.text||!Array.isArray(pack.detachments))throw Error('Live rules could not be verified');rules[faction]=pack;}] as [string,()=>Promise<void>]),
  ...[...ids].map(id=>[units.find(u=>u.id===id)?.name||id,async()=>{const card=await get<UnitCard>('/api/card?id='+encodeURIComponent(id)+'&refresh=1',signal);if(!isFreshCard(card)||card.id!==id)throw Error('Live card could not be verified');cards.push(card);}] as [string,()=>Promise<void>])
 ];
 await Promise.all(Array.from({length:2},async()=>{while(jobs.length){signal.throwIfAborted();const [label,job]=jobs.shift()!;progress({done,total,label});try{await job();}catch(e){signal.throwIfAborted();failures.push(`${label}: ${e instanceof Error?e.message:'Could not refresh'}`);}progress({done:++done,total,label});}}));
 signal.throwIfAborted();for(const card of cards){const existing=units.find(u=>u.id===card.id);if(existing)units=mergeCatalogue(units,[{...existing,sizes:card.sizes,pointsRetrievedAt:card.pointsRetrievedAt}]);}const now=new Date().toISOString();const result:UpdateData={units,rules,failures,attemptedAt:now,checkedAt:failures.length?previous.checkedAt:now};
 await commitUpdate(result,cards,signal);for(const card of cards)saveSessionCard(card);return result;
}
