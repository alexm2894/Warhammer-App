"use client";

import {useState} from 'react';

import {PanelLeftClose,PanelLeftOpen} from 'lucide-react';

import AppShell from '@/components/app-shell';

import DataCard from '@/components/data-card';

import UnitSearch from '@/components/unit-search';

import UnitImage from '@/components/unit-image';

import {RuleLibrary,RuleCard,useRuleLibrary} from '@/components/rule-library';

import type {UnitCard} from '@/lib/types';

import {useCatalogue} from '@/lib/use-catalogue';

import {factionStyle} from '@/lib/factions';

import {clearSessionCards,saveSessionCard} from '@/lib/session-cache';

export default function Lookup(){

 const {units,error}=useCatalogue(),[card,setCard]=useState<UnitCard|null>(null),[message,setMessage]=useState(''),[collapsed,setCollapsed]=useState(false),[faction,setFaction]=useState(''),[selectedRule,setSelectedRule]=useState(''),[opened,setOpened]=useState<UnitCard[]>([]);

 const rules=useRuleLibrary(faction),rule=rules.cards.find(r=>r.key===selectedRule);

 function open(card:UnitCard){setCard(card);setSelectedRule('');setFaction(card.faction);setOpened(old=>[card,...old.filter(c=>c.id!==card.id)].slice(0,20));}

 async function refresh(){if(!card)return;setMessage('Refreshing…');try{const r=await fetch('/api/card?id='+encodeURIComponent(card.id)+'&refresh=1');const d=await r.json() as UnitCard & {error?:string};if(!r.ok)throw Error(d.error);saveSessionCard(d);open({...d,image:units.find(u=>u.id===d.id)?.image});setMessage(d.warning||'Refreshed.');}catch(e){setMessage(e instanceof Error?e.message:'Refresh failed.');}}

 return <AppShell title="Datasheet lookup"><div className={`workspace lookup-workspace ${collapsed?'search-collapsed':''}`}><aside className="lookup-panel collapsible-search"><button className="action search-collapse" aria-label={collapsed?'Expand unit search':'Collapse unit search'} aria-expanded={!collapsed} aria-controls="lookup-controls" onClick={()=>setCollapsed(v=>!v)}>{collapsed?<PanelLeftOpen size={24}/>:<PanelLeftClose size={24}/>}<span>{collapsed?'Cards':'Hide search'}</span></button><div id="lookup-controls" className="lookup-controls" hidden={collapsed}><h1>Find a unit</h1><UnitSearch catalogue={units} onCard={open}/>{error&&<p role="alert">{error}</p>}<label className="rule-army-select">Army rules<select value={faction} onChange={e=>{setFaction(e.target.value);setSelectedRule('');}}><option value="">Choose an army…</option>{[...new Set(units.map(u=>u.faction))].sort().map(f=><option key={f}>{f}</option>)}</select></label></div>

 <div className="lookup-card-library saved-card-scroll"><nav className="game-card-tabs saved-card-list" aria-label="Opened unit cards">{opened.map(c=><button key={c.id} className="faction-tile" style={factionStyle(c.faction)} aria-label={c.name} title={c.name} aria-pressed={!selectedRule&&card?.id===c.id} onClick={()=>open(c)}><UnitImage unit={c}/><span>{c.name}</span></button>)}</nav>{faction&&<RuleLibrary library={rules} selected={selectedRule} collapsed={collapsed} onSelect={r=>setSelectedRule(r.key)}/>}</div>

 {message&&<p role="status">{message}</p>}</aside>{rule?<RuleCard key={rule.key} card={rule} refresh={rules.refresh} busy={rules.loading}/>:card?<DataCard key={card.id} card={card} refresh={()=>void refresh()}/>:<section className="empty-card"><h2>Your cards, at a glance</h2><p>Speak or type a unit name, or choose an army for its rules.</p></section>}</div></AppShell>;

}

