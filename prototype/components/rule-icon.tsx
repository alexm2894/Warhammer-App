import {BookOpen,Sun,Shield,Crown,Eye,Flame,Skull,Swords,Target,Footprints,Mountain,Zap,Bug,Wrench,Orbit,Hammer,Feather,Flag} from 'lucide-react';
// Illustrative navigation symbols, not official detachment emblems or rules indicators.
export default function RuleIcon({name,army=false}:{name:string;army?:boolean}){
 const choices:[RegExp,typeof Sun][]=[[/solar|star|sun/i,Sun],[/shield|bastion|bulwark|defen/i,Shield],[/lion|champion|auric|hero|noble/i,Crown],[/hunt|silent|shadow|veil|recon/i,Eye],[/flame|fire|inferno/i,Flame],[/death|dead|grim|morbid/i,Skull],[/blade|talon|sword|duel/i,Swords],[/hammer|moritoi|armour/i,Hammer],[/wing|angel|flight/i,Feather],[/ascen|mount|stone/i,Mountain],[/storm|lightning|surge/i,Zap],[/swarm|brood|hive|spawn/i,Bug],[/forge|engine|machine|cyber/i,Wrench],[/warp|psy|cult|arcane/i,Orbit],[/spear|lance|strike|assault/i,Target],[/outrider|rider|speed|path/i,Footprints]];
 const Icon=army?(/custodes/i.test(name)?Shield:/genestealer|tyranid/i.test(name)?Bug:/mechanicus/i.test(name)?Wrench:/necron/i.test(name)?Skull:/marine/i.test(name)?Swords:BookOpen):choices.find(([pattern])=>pattern.test(name))?.[1]||Flag;
 return <span className="rule-symbol" title="Illustrative rule icon"><Icon size={26}/>{!army&&<small>{name.split(/\s+/).slice(0,2).map(w=>w[0]).join('')}</small>}</span>;
}
