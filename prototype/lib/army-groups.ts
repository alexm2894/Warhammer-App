import {emptyRoster,type ArmyRoster} from './roster.ts';
import type {CatalogueUnit} from './types';
import type {AlliedArmy} from './saved-armies';
export type ArmySelection={roster:ArmyRoster;used:string[];allies?:AlliedArmy[]};
export function nativeUnits(units:CatalogueUnit[],faction:string){return units.filter(u=>u.faction===faction&&(u.nativeFaction||u.faction)===faction);}
// Retain old selections while moving source-index allies into their own faction group.
export function separateArmies(saved:ArmySelection,faction:string,units:CatalogueUnit[]):ArmySelection{
 const groups=new Map<string,AlliedArmy>();groups.set(faction,{faction,roster:{...saved.roster,entries:[]},used:saved.used});
 for(const group of [{faction,roster:saved.roster,used:saved.used},...(saved.allies||[])]){
  if(!groups.has(group.faction))groups.set(group.faction,{...group,roster:{...group.roster,entries:[]}});
  for(const entry of group.roster.entries){const unit=units.find(u=>u.id===entry.unitId);const owner=unit?.nativeFaction||unit?.faction||group.faction;
   const canonical=unit&&units.find(u=>u.faction===owner&&(u.nativeFaction||owner)===owner&&u.id.split('/')[1]===unit.id.split('/')[1]);
   if(!groups.has(owner))groups.set(owner,{faction:owner,roster:{...emptyRoster(),mode:'build'},used:[]});
   groups.get(owner)!.roster.entries.push({...entry,unitId:canonical?.id||entry.unitId});
  }
 }
 return {...saved,roster:groups.get(faction)!.roster,allies:[...groups.values()].filter(g=>g.faction!==faction)};
}
