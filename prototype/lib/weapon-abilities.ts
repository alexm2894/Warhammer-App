// Wahapedia 11th edition core rules, section 24, verified 2026-09-12.
// Only typed, explicitly supported effects affect calculations; prose is never executed.
export const abilitySource='https://wahapedia.ru/wh40k11ed/the-rules/core-rules/';
export function targetHas(keywords:string,target:string){
 const normalize=(s:string)=>s.trim().toUpperCase().replace(/S$/,'');
 return keywords.split(/[,;\n]/).some(k=>normalize(k)===normalize(target));
}
export function abilityApplies(keyword:string,target:string){
 const anti=keyword.match(/^ANTI-(NON-)?(.+?)\s+([2-6])\+/i);
 if(anti)return anti[1]?!targetHas(target,anti[2]):targetHas(target,anti[2]);
 const condition=keyword.split(':')[1];
 return !condition||condition.split(/\/|\s+OR\s+/i).some(k=>targetHas(target,k));
}
export function activeAbilities(keywords:string[],target:string,overrides:Record<string,boolean>={}){
 return keywords.filter(k=>overrides[k]??abilityApplies(k,target));
}
export function criticalWound(keywords:string[]){return Math.min(6,...keywords.map(k=>Number(k.match(/^ANTI-(?:NON-)?[\w -]+\s+([2-6])\+/i)?.[1]||6)));}
export function abilityDescription(keyword:string,critical=6,criticalHit=6){
 const k=keyword.toUpperCase(),amount=k.match(/(?:HITS|MELTA|FIRE|BLAST|CLEAVE)\s+(D\d+|\d+)/)?.[1]||'1';
 if(k.startsWith('ANTI-'))return `Against the named target type, unmodified wound rolls of ${k.match(/([2-6])\+/)?.[1]||6}+ are critical wounds, regardless of Toughness.`;
 if(k.startsWith('LETHAL HITS'))return `An unmodified hit roll of ${criticalHit}+ is a critical hit. You may auto-wound; doing so skips the wound roll and cannot trigger Devastating Wounds.`;
 if(k.startsWith('SUSTAINED HITS'))return `An unmodified hit roll of ${criticalHit}+ generates ${amount} additional hits. Additional hits are not themselves critical hits.`;
 if(k.startsWith('DEVASTATING WOUNDS'))return `Critical wounds (unmodified ${critical}+) inflict mortal damage instead of normal damage. Resolve after normal damage; each critical can damage at most one model.`;
 if(k.startsWith('TORRENT'))return 'Automatically hits. No hit roll is made, so critical-hit effects do not trigger.';
 if(k.startsWith('TWIN-LINKED'))return 'You may re-roll wound rolls.';
 if(k.startsWith('IGNORES COVER'))return 'The target receives no Benefit of Cover against this weapon, including cover granted by abilities.';
 if(k.startsWith('MELTA'))return `Within half range when targets were selected: add ${amount} to Damage. Confirm half range below.`;
 if(k.startsWith('RAPID FIRE'))return `Within half range when targets were selected: add ${amount} attacks per weapon. Confirm half range below.`;
 if(k.startsWith('BLAST'))return `Add ${amount} attacks for each complete group of five models in the target unit.`;
 if(k.startsWith('CLEAVE'))return `If all this weapon’s attacks target one unit, add ${amount} attacks per complete group of five target models. Confirm single target below.`;
 if(k.startsWith('HEAVY'))return 'Shooting phase: +1 hit if unengaged, not set up this turn, and no model moved more than 3 inches. Confirm eligibility below.';
 if(k.startsWith('LANCE'))return '+1 wound roll if the attacking unit charged this turn. Confirm charge below.';
 if(k.startsWith('PSYCHIC'))return 'You may ignore any or all BS/WS and hit-roll modifiers. Review any ignored modifiers manually; this attack is Psychic for other rules.';
 if(k.startsWith('PRECISION'))return 'A visible Character allocation group can be selected first. Confirm visibility and the correct defending profile at the table.';
 if(k.startsWith('HAZARDOUS'))return 'After the unit’s attacks, make one hazard roll per selected Hazardous weapon.';
 if(k.startsWith('ONE SHOT'))return 'This weapon can be selected only once per battle. Confirm it has not already been used.';
 if(k.startsWith('EXTRA ATTACKS'))return 'Resolve this weapon in addition to the model’s other selected melee weapon.';
 if(/^(PISTOL|CLOSE-QUARTERS)/.test(k))return 'Enables close-quarters shooting. Check the shooting type and which other ranged weapons can be used.';
 if(k.startsWith('INDIRECT FIRE'))return 'Enables indirect shooting. Shooting-type restrictions and visibility must be checked at the table.';
 return 'Review the source rule and resolve its effect manually; this ability has no automatic numeric adjustment yet.';
}
