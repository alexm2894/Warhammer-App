import ConditionTile from './condition-tile';
import type {Combatant,Game} from '@/lib/battle';
export function availableRuleSelections(combatant:Combatant,game:Game){
 const player=game.players.find(p=>p.id===combatant.playerId)!;
 const ownRules=game.rules[combatant.card.faction],main=player.faction===combatant.card.faction;
 const detachment=main?ownRules?.detachments.find(d=>d.id===player.detachment):undefined;
 return [...(ownRules?[{id:'army',name:`${combatant.card.faction} army rule`,text:ownRules.army.text}]:[]),...(detachment?[{id:'detachment',name:detachment.name,text:detachment.text},...(detachment.options||[])]:[]),...combatant.card.sections.filter(s=>!/COMPOSITION|WARGEAR OPTIONS|FACTION KEYWORDS|KEYWORDS/i.test(s.title)).flatMap((s,i)=>s.paragraphs.map((text,j)=>({id:`unit-${i}-${j}`,name:s.title,text})))].map(o=>({...o,id:`${combatant.playerId}:${combatant.card.id}:${o.id}`}));
}
export default function RuleSelections({combatant,game,selected,change}:{combatant:Combatant;game:Game;selected:string[];change:(ids:string[])=>void}){
 const options=availableRuleSelections(combatant,game);
 return <details className="rule-selections"><summary>Other unit / faction effects · {options.filter(o=>selected.includes(o.id)).length} selected</summary><p>Select rules that apply to this engagement, including purchased enhancements and available stratagems. These are manual reminders: enter their confirmed numeric changes under Advanced modifiers. Selection does not spend CP or establish eligibility.</p>{options.map(o=><ConditionTile key={o.id} title={o.name} benefit="Manual effect · review source and adjustments" text={o.text} checked={selected.includes(o.id)} change={v=>change(v?[...selected,o.id]:selected.filter(s=>s!==o.id))}/>)}</details>;
}
