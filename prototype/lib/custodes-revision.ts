// Cache contract for the November 2026 Custodes catalogue. Never clear roster storage.
export const CUSTODES='Adeptus Custodes';
export const custodesRevision='custodes-codex-2026-10';
export function currentUnit(u:{faction?:string;id?:string;rulesRevision?:string}) {
 return !(u.faction===CUSTODES||u.id?.startsWith('adeptus-custodes/'))||u.rulesRevision===custodesRevision;
}
export const choices:Record<string,string[]>={
 "Custodian-Guard":["Custodian-Guard-Sodality","Sentinel-Guard-Sodality"],
 "Aquilon-Custodians":["Aquilon-Terminators-with-Solarite-Power-Gauntlets","Aquilon-Terminators-with-Solarite-Power-Talons"],
 "Venatari-Custodians":["Venatari-with-Kinetic-Destroyers","Venatari-with-Verutum-Lances"],
 "Custodian-Guard-With-Adrasite-And-Pyrithite-Spears":["Custodian-Guard-Sodality-with-Adrasite-Spears","Custodian-Guard-Sodality-with-Pyrithite-Spears"]};
export const splitIds=Object.keys(choices).map(s=>'adeptus-custodes/'+s);
