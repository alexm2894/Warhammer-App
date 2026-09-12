import type {UnitCard} from './types';
import type {FactionRules} from './faction-rules';
export type Weapon=UnitCard['weapons'][number];
export interface Player {id:string;team:0|1;name:string;faction:string;ally:string;detachment:string;roster?:import('./roster').ArmyRoster}
export interface Game {version:1;sessionId?:string;players:Player[];rules:Record<string,FactionRules>}
export interface Combatant {playerId:string;card:UnitCard;profile:number}
// Future camera adapters submit dice observations separately; they never alter source profiles.
export interface DiceObservation {stage:'hit'|'wound'|'save'|'damage';faces:number[];origin:'manual'|'camera';confidence?:number;confirmed:boolean}
export interface Conditions {cover:boolean;plunging:boolean;heavy:boolean;charged:boolean;isolated:boolean;katah:'none'|'sustained'|'lethal';hit:number;wound:number;ap:number;save:number;reviewed:boolean}
export const defaults:Conditions={cover:false,plunging:false,heavy:false,charged:false,isolated:false,katah:'none',hit:0,wound:0,ap:0,save:0,reviewed:false};
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function woundTarget(s:number,t:number){return s>=2*t?2:s>t?3:s===t?4:s*2<=t?6:5;}
export function stat(c:Combatant,label:string){return Number.parseInt(c.card.profiles[c.profile]?.stats.find(s=>s.label===label)?.value||'');}
export function lionsEligible(a:Combatant,p:Player,rules?:FactionRules){return a.card.faction===p.faction&&p.faction==='Adeptus Custodes'&&!/\bVEHICLES?\b/i.test(a.card.keywords)&&!!rules?.detachments.find(d=>d.id===p.detachment&&/Lions of the Emperor/i.test(d.name)&&/excluding VEHICLES/i.test(d.text));}
export function resolveAttack(a:Combatant,d:Combatant,w:Weapon,c:Conditions,p:Player,rules?:FactionRules){
 const notes:string[]=[],keywords=[...w.keywords],ranged=w.kind==='ranged',has=(word:string)=>keywords.some(k=>k.toLowerCase().includes(word));
 const isolated=c.isolated&&lionsEligible(a,p,rules);let hitMod=c.hit+(isolated?1:0),woundMod=c.wound+(isolated?1:0);
 if(isolated)notes.push('Against All Odds: +1 hit and wound; isolation confirmed.');
 if(c.heavy&&ranged&&has('heavy')){hitMod++;notes.push('Heavy eligibility confirmed: +1 hit roll.');}
 if(c.charged&&!ranged&&has('lance')){woundMod++;notes.push('Lance after charging: +1 wound roll.');}
 const katah=!ranged&&a.card.faction===p.faction&&p.faction==='Adeptus Custodes'&&a.card.sections.some(s=>s.paragraphs.some(t=>/Martial Ka.tah/i.test(t)));
 if(katah&&c.katah!=='none')keywords.push(c.katah==='lethal'?'Lethal Hits':'Sustained Hits 1');
 let skill=Number.parseInt(w.skill),strength=Number.parseInt(w.strength);const toughness=stat(d,'T'),save=stat(d,'SV');
 if(!/^\d+$/.test(w.strength.trim())){if(/^[-–—*]$|^N\/A$/i.test(w.strength.trim()))strength=1;else throw Error('Variable weapon Strength needs manual resolution.');}
 if(!Number.isFinite(toughness)||!Number.isFinite(save)||(!Number.isFinite(skill)&&!has('torrent')))throw Error('This profile needs manual resolution: its characteristic could not be read.');
 if(ranged&&c.cover&&!has('ignores cover')){skill++;notes.push('Cover: BS worsened by 1 (11th edition).');}
 if(ranged&&c.plunging&&!/AIRCRAFT/i.test(a.card.keywords+' '+d.card.keywords)){skill--;notes.push('Plunging fire conditions confirmed: BS improved by 1.');}
 skill=clamp(skill,2,6);hitMod=clamp(hitMod,-1,1);woundMod=clamp(woundMod,-1,1);
 const hit=has('torrent')?'Automatic':clamp(skill-hitMod,2,6)+'+',wound=clamp(woundTarget(strength,toughness)-woundMod,2,6)+'+';
 const ap=Math.min(0,Number.parseInt(w.ap)-c.ap);if(!Number.isFinite(ap))throw Error('Weapon AP needs manual resolution.');
 const armour=Math.max(2,save-ap-c.save),condition=d.card.invulnerableCondition||'';
 let invul=Number.parseInt(d.card.invulnerableSave);
 if(condition){if(/against ranged attacks only/i.test(condition)){if(!ranged){invul=NaN;notes.push('Defender’s invulnerable save is ranged only; excluded from melee.');}}else if(/against melee attacks only/i.test(condition)){if(ranged)invul=NaN;}else{invul=NaN;notes.push('Conditional invulnerable save needs manual review: '+condition);}}
 const best=Math.min(armour,Number.isFinite(invul)?invul:Infinity);
 return {hit,wound,armour:armour>6?'No normal save':armour+'+',invulnerable:Number.isFinite(invul)?invul+'+':'Not applicable',recommended:best>6?'No save':Math.max(2,best)+'+',strength,toughness,ap,hitMod,woundMod,keywords:[...new Set(keywords)],notes,attacks:w.attacks,damage:w.damage};
}
