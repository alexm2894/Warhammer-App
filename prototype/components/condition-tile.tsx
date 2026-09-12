import type {ReactNode} from 'react';
import {Check,Shield,Mountain,Target,Swords,Sparkles,Flag} from 'lucide-react';
export default function ConditionTile({checked,change,text,title,benefit,icon}:{checked:boolean;change:(v:boolean)=>void;text:string;title?:string;benefit?:string;icon?:ReactNode}){
 const inferred=/Plunging/.test(text)?['Plunging fire','Improve BS by 1',<Mountain key="i"/>]:/Cover/.test(text)?['Benefit of Cover','Attacker BS worsens by 1',<Shield key="i"/>]:/Heavy/.test(text)?['Heavy','+1 to hit',<Target key="i"/>]:/Lance/.test(text)?['Lance · charged','+1 to wound',<Swords key="i"/>]:/Against All Odds/.test(text)?['Against All Odds','+1 to hit and wound',<Sparkles key="i"/>]:['Confirm conditions','Ready to resolve',<Flag key="i"/>];
 return <div className="condition-option"><button type="button" className="condition-tile" aria-pressed={checked} onClick={()=>change(!checked)}>{icon||inferred[2]}<strong>{title||inferred[0]}</strong><span>{benefit||inferred[1]}</span><span className="tile-check" aria-hidden="true">{checked?<Check size={18}/>:null}</span></button><details><summary>When it applies</summary><p>{text}</p></details></div>;
}
