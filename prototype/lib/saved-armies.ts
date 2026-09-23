import {validRoster,type ArmyRoster} from './roster.ts';
export const ARMY_SLOTS_KEY='field-saved-armies-11:v1';
export type SavedArmy={name:string;faction:string;roster:ArmyRoster;used:string[];savedAt:string};
export type ArmySlots=(SavedArmy|null)[];
export function parseArmySlots(raw:string|null):ArmySlots{
 const empty:ArmySlots=[null,null,null,null];
 if(!raw)return empty;
 const data:unknown=JSON.parse(raw);
 if(!Array.isArray(data)||data.length>4)throw Error('Saved armies could not be read. Existing saves have not been changed.');
 return empty.map((_,i)=>{const a=data[i];if(a==null)return null;
 if(typeof a.name!=='string'||!a.name.trim()||a.name.length>60||typeof a.faction!=='string'||!a.faction||!validRoster(a.roster)||!Array.isArray(a.used)||!a.used.every((id:unknown)=>typeof id==='string')||typeof a.savedAt!=='string')throw Error('Saved armies could not be read. Existing saves have not been changed.');
 return a as SavedArmy;});
}
export function saveArmySlot(storage:Pick<Storage,'getItem'|'setItem'>,slot:number,army:SavedArmy):ArmySlots{
 if(!Number.isInteger(slot)||slot<0||slot>3)throw Error('Choose one of the four army slots.');
 const slots=parseArmySlots(storage.getItem(ARMY_SLOTS_KEY));
 slots[slot]=structuredClone({...army,name:army.name.trim()});
 const raw=JSON.stringify(slots);parseArmySlots(raw);
 storage.setItem(ARMY_SLOTS_KEY,raw);return slots;
}
