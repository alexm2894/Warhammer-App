"use client";
import CardSource from './card-source';
import RuleIcon from './rule-icon';
import {effectParts} from '@/lib/rule-emphasis';
import {useEffect,useState} from 'react';
import {BookOpen,Flag,RefreshCw,ArrowUp,ArrowDown,ArrowLeftRight} from 'lucide-react';
import type {FactionRules,RuleSection} from '@/lib/faction-rules';
import {loadRuleCards,ruleCards,type ReferenceCard} from '@/lib/rule-cards';
import {factionStyle} from '@/lib/factions';
export function useRuleLibrary(faction:string){
 const [pack,setPack]=useState<FactionRules>(),[error,setError]=useState(''),[loading,setLoading]=useState(false),[revision,setRevision]=useState(0),[detachment,setDetachment]=useState('');
 useEffect(()=>{let active=true;setError('');if(!faction){setLoading(false);return;}setLoading(true);try{setDetachment(localStorage.getItem('field-rule-detachment:'+faction)||'');}catch{setDetachment('');}
  void loadRuleCards(faction,revision>0).then(value=>{if(active)setPack(value);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};
 },[faction,revision]);
 const current=pack?.faction===faction?pack:undefined;
 const activeDetachment=current?.detachments.some(d=>d.id===detachment)?detachment:current?.detachments[0]?.id||'';
 return {cards:current?ruleCards(current,activeDetachment):[],pack:current,error,loading,activeDetachment,refresh:()=>setRevision(v=>v+1),choose:(id:string)=>{setDetachment(id);try{localStorage.setItem('field-rule-detachment:'+faction,id);}catch{}}};
}
export function RuleLibrary({library,selected,onSelect,collapsed=false}:{library:ReturnType<typeof useRuleLibrary>;selected?:string;onSelect:(card:ReferenceCard)=>void;collapsed?:boolean}){
 return <section className={`rule-library ${collapsed?'rules-compact':''}`} aria-label="Army and detachment cards">
 {!collapsed&&<h2>Rules & stratagems</h2>}
 {library.loading&&<p role="status">Loading rules…</p>}{library.error&&<p role="alert">{library.error}</p>}
 {(['Army rule','Detachment'] as const).map(kind=><div className="rule-group" key={kind}>{library.cards.filter(c=>c.kind===kind).map(c=><button key={c.key} className={`rule-tile rule-${kind.toLowerCase().replace(' ','-')}`} style={factionStyle(c.faction)} data-active-detachment={c.kind==='Detachment'&&c.id===library.activeDetachment} aria-pressed={selected===c.key} aria-label={`${c.kind}: ${c.name}`} title={`${c.kind}: ${c.name}`} onClick={()=>{if(c.kind==='Detachment')library.choose(c.id);onSelect(c);}}><RuleIcon name={c.kind==='Army rule'?c.faction:c.name} army={kind==='Army rule'}/><span><small>{kind}</small><strong>{c.name}</strong></span></button>)}</div>)}
 {!collapsed&&<button className="action" disabled={library.loading} onClick={library.refresh}><RefreshCw size={18}/>Refresh rules</button>}
 </section>;
}
function EffectText({text}:{text:string}){return <>{effectParts(text).map((part,i)=>part.highlight?<mark className="rule-effect" key={i}>{part.text}</mark>:part.text)}</>;}
function RuleText({text}:{text:string}){
 return <>{text.replace(/\s*(WHEN:|TARGET:|EFFECT:|RESTRICTIONS:)/g,'\n$1').split('\n').map(t=>t.trim()).filter(Boolean).map((line,i)=>{const match=line.match(/^(WHEN:|TARGET:|EFFECT:|RESTRICTIONS:)\s*([\s\S]*)$/);return <p key={i} className={line.startsWith("EFFECT:")?"rule-effect-paragraph":line.startsWith("Designer")?"rule-designer-note":""}>{match?<><b>{match[1]}</b> <EffectText text={match[2]}/></>:<EffectText text={line}/>}</p>;})}</>;
}
function Stratagem({rule}:{rule:RuleSection}){
 const timing=rule.timing||'unknown',cp=rule.cp||rule.name.match(/(\d+\s*CP)\b/i)?.[1];
 return <section className={`stratagem-block timing-${timing}`}>
 <div className="stratagem-rail" aria-hidden="true"><span className="stratagem-diamond">{timing==='your'?<ArrowUp size={18}/>:timing==='enemy'?<ArrowDown size={18}/>:<ArrowLeftRight size={18}/>}</span>{cp&&<span className="stratagem-diamond cp-badge"><b>{cp}</b></span>}</div>
 <div className="stratagem-copy"><h3>{rule.name.replace(/\s*·\s*(\d+\s*CP|Stratagem)$/i,'')}</h3><div className="stratagem-meta">{rule.category||'Stratagem'}{cp&&<span className="sr-only"> · {cp}</span>}</div><RuleText text={rule.text}/></div>
 </section>;
}
export function RuleCard({card,refresh,busy}:{card:ReferenceCard;refresh:()=>void;busy:boolean}){
 return <article className="datasheet reference-card" style={factionStyle(card.faction)}><header className="card-banner"><div className="banner-copy"><span className="eyebrow">{card.faction} · {card.kind}</span><h2>{card.name}</h2></div></header><div className="reference-body" tabIndex={0} aria-label={`${card.name} rules and stratagems`}>
 <CardSource date={card.retrievedAt} url={card.url} warning={card.warning} refresh={refresh} busy={busy}/>
 <section className="detachment-rule-text"><h3>{card.kind==='Detachment'?'Detachment rules':'Army rules'}</h3><RuleText text={card.text}/></section>
 {card.stratagems.length>0&&<><h3 className="stratagem-heading">Stratagems</h3><div className="stratagem-legend"><span className="timing-your">Blue · your turn</span><span className="timing-either">Green · either turn</span><span className="timing-enemy">Red · opponent’s turn</span></div><div className="stratagem-grid">{card.stratagems.map((rule,i)=><Stratagem key={rule.id+':'+i} rule={rule}/>)}</div></>}
 </div></article>;
}
