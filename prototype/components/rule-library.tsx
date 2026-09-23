"use client";
import {useEffect,useState} from 'react';
import {BookOpen,Flag,Zap,RefreshCw} from 'lucide-react';
import type {FactionRules} from '@/lib/faction-rules';
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
 {(['Army rule','Detachment','Stratagem'] as const).map(kind=><div className="rule-group" key={kind}>{!collapsed&&kind==='Stratagem'&&<h3>{library.pack?.detachments.find(d=>d.id===library.activeDetachment)?.name} · Stratagems</h3>}{library.cards.filter(c=>c.kind===kind).map(c=><button key={c.key} className={`rule-tile rule-${kind.toLowerCase().replace(' ','-')}`} style={factionStyle(c.faction)} data-active-detachment={c.kind==='Detachment'&&c.id===library.activeDetachment} aria-pressed={selected===c.key} aria-label={`${c.kind}: ${c.name}`} title={`${c.kind}: ${c.name}`} onClick={()=>{if(c.kind==='Detachment')library.choose(c.id);onSelect(c);}}>{kind==='Army rule'?<BookOpen/>:kind==='Detachment'?<Flag/>:<Zap/>}<span><small>{kind}</small><strong>{c.name}</strong></span></button>)}</div>)}
 {!collapsed&&<button className="action" disabled={library.loading} onClick={library.refresh}><RefreshCw size={18}/>Refresh rules</button>}
 </section>;
}
export function RuleCard({card,refresh,busy}:{card:ReferenceCard;refresh:()=>void;busy:boolean}){
 const paragraphs=card.text.replace(/\s*(WHEN:|TARGET:|EFFECT:|RESTRICTIONS:)/g,'\n$1').split('\n').map(t=>t.trim()).filter(Boolean);
 return <article className="datasheet reference-card" style={factionStyle(card.faction)}><header className="card-banner"><div className="banner-copy"><span className="eyebrow">{card.faction} · {card.kind}</span><h2>{card.name}</h2>{card.detachment&&<p>{card.detachment}</p>}</div></header><div className="reference-body">{card.warning&&<p className="error" role="status">{card.warning}</p>}{paragraphs.map((text,i)=><p key={i}>{text}</p>)}<details className="reference-source"><summary>Source · 11th edition · {new Date(card.retrievedAt).toLocaleDateString()}</summary><a href={card.url} target="_blank" rel="noreferrer">View rule on Wahapedia ↗</a><button className="action" disabled={busy} onClick={refresh}>Refresh rules</button></details></div></article>;
}
