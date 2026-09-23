"use client";

import {useEffect,useRef,useState,useSyncExternalStore} from 'react';

import {BookOpen,FolderOpen,Save,Plus,RefreshCw,PanelLeftClose,PanelLeftOpen} from 'lucide-react';

import AppShell from '@/components/app-shell';

import RosterEditor from '@/components/roster-editor';

import DataCard from '@/components/data-card';

import {RuleLibrary,RuleCard,useRuleLibrary} from '@/components/rule-library';

import UnitImage from '@/components/unit-image';

import {useCatalogue} from '@/lib/use-catalogue';

import {emptyRoster,validRoster,type ArmyRoster} from '@/lib/roster';

import {libraryCard,keepCard} from '@/lib/game-card-library';

import {subscribeHydration,clientHydrated,serverHydrated} from '@/lib/hydration';

import {factionStyle} from '@/lib/factions';

import {ARMY_SLOTS_KEY,parseArmySlots,saveArmySlot,type ArmySlots,type SavedArmy} from '@/lib/saved-armies';

import {nativeUnits,separateArmies,type ArmySelection} from '@/lib/army-groups';

import type {UnitCard} from '@/lib/types';

const PREFIX='field-game-cards-11:';

type Saved=ArmySelection;

function read(faction:string):Saved{try{const d=JSON.parse(localStorage.getItem(PREFIX+faction)||'null');if(d&&validRoster(d.roster))return {roster:d.roster,allies:Array.isArray(d.allies)?d.allies.filter((a:any)=>a&&typeof a.faction==='string'&&validRoster(a.roster)&&Array.isArray(a.used)):[],used:Array.isArray(d.used)?d.used.filter((id:unknown)=>typeof id==='string').slice(0,500):[]};}catch{}return {roster:emptyRoster(),used:[]};}

export default function GameCards(){const ready=useSyncExternalStore(subscribeHydration,clientHydrated,serverHydrated);return <AppShell title="Game Data Cards">{ready?<Library/>:<p>Loading saved armies…</p>}</AppShell>;}

function Library(){

 const saveDialog=useRef<HTMLDialogElement>(null);
 const [shelf,setShelf]=useState(true),[slots,setSlots]=useState<ArmySlots>([null,null,null,null]),[slotError,setSlotError]=useState(''),[saveOpen,setSaveOpen]=useState(false),[saveName,setSaveName]=useState(''),[activeSlot,setActiveSlot]=useState<number|null>(null),[replaceSlot,setReplaceSlot]=useState<number|null>(null);
 useEffect(()=>{const dialog=saveDialog.current;if(saveOpen)dialog?.showModal();return()=>dialog?.close();},[saveOpen]);
 useEffect(()=>{try{setSlots(parseArmySlots(localStorage.getItem(ARMY_SLOTS_KEY)));}catch{setSlotError('Saved armies could not be read. Existing saves have not been changed.');}},[]);
 const {units,error}=useCatalogue();const [faction,setFaction]=useState(()=>{try{return localStorage.getItem(PREFIX+'last-army')||'';}catch{return '';}});

 const [saved,setSaved]=useState(()=>read(faction)),[editing,setEditing]=useState(''),[playing,setPlaying]=useState(false),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[storageError,setStorageError]=useState('');

 const [cards,setCards]=useState<Record<string,UnitCard>>({}),[selected,setSelected]=useState(''),[failed,setFailed]=useState<string[]>([]);

 const [alliesOpen,setAlliesOpen]=useState(false),[ruleFaction,setRuleFaction]=useState(''),[viewFaction,setViewFaction]=useState('');
 useEffect(()=>{if(!units.length||!faction)return;setSaved(old=>{const next=separateArmies(old,faction,units);return JSON.stringify(next)===JSON.stringify(old)?old:next;});},[units,faction]);
 const groups=[{faction,roster:saved.roster,used:saved.used},...(saved.allies||[])];
 const ids=[...new Set(groups.flatMap(g=>g.roster.entries).filter(e=>e.count>0&&units.some(u=>u.id===e.unitId)).map(e=>e.unitId))];
 const editGroup=groups.find(g=>g.faction===editing);
 function addAlly(value:string){setSaved(old=>({...old,allies:[...(old.allies||[]),{faction:value,roster:emptyRoster(),used:[]}]}));setAlliesOpen(false);setEditing(value);}


 const factions=[...new Set(units.map(u=>u.faction))].sort((a,b)=>{const order=['Adeptus Custodes','Genestealer Cults'];return (order.includes(a)?order.indexOf(a):-1)===-1?(order.includes(b)?1:a.localeCompare(b)):(order.includes(b)?order.indexOf(a)-order.indexOf(b):-1);});

 useEffect(()=>{if(!faction)return;try{localStorage.setItem(PREFIX+faction,JSON.stringify(saved));localStorage.setItem(PREFIX+'last-army',faction);setStorageError('');}catch{setStorageError('This browser could not save the army selection. It remains available while this page is open.');}},[faction,saved]);

 function chooseFaction(value:string){setActiveSlot(null);setFaction(value);setRuleFaction('');setViewFaction('');setSaved(read(value));setCards({});setSelected('');setFailed([]);setStatus('');}

 async function prepare(requested=ids,rosterSaved=saved){if(!requested.length)return;setBusy(true);setFailed([]);const result:Record<string,UnitCard>={},missing:string[]=[];let done=0,unsaved=false;const queue=[...requested];await Promise.all(Array.from({length:Math.min(3,queue.length)},async()=>{while(queue.length){const id=queue.shift()!;try{const card=await libraryCard(id);result[id]={...card,image:units.find(u=>u.id===id)?.image};try{await keepCard(card);}catch{unsaved=true;}}catch{missing.push(id);}setStatus(`Preparing cards ${++done}/${requested.length}`);}}));setCards(result);setFailed(missing);setSelected(requested.find(id=>result[id])||requested[0]);setSaved({...rosterSaved,used:[...new Set([...requested,...rosterSaved.used])]});setBusy(false);setPlaying(true);setStatus(missing.length?`${missing.length} cards could not load. Retry them when connected.`:unsaved?'Cards ready. This browser could not retain all cards for another session.':'Cards ready · saved on this device.');}

 async function refresh(id:string){setBusy(true);setStatus('Refreshing card…');try{const response=await fetch('/api/card?id='+encodeURIComponent(id)+'&refresh=1');const card=await response.json() as UnitCard&{error?:string};if(!response.ok)throw Error(card.error||'Card unavailable');setCards(old=>({...old,[id]:{...card,image:units.find(u=>u.id===id)?.image}}));setFailed(old=>old.filter(v=>v!==id));try{await keepCard(card);setStatus(card.warning||'Card refreshed and saved.');}catch{setStatus('Card refreshed, but could not be saved for another session.');}}catch(e){setStatus(e instanceof Error?e.message:'Refresh failed.');}finally{setBusy(false);}}

 function openSaved(army:SavedArmy,index:number){
 const restored=separateArmies(army,army.faction,units);setFaction(army.faction);setRuleFaction('');setViewFaction('');setSaved(structuredClone(restored));setActiveSlot(index);setShelf(false);setStatus('');setCards({});
 void prepare([...new Set([restored.roster,...(restored.allies||[]).map(a=>a.roster)].flatMap(r=>r.entries).filter(e=>e.count>0).map(e=>e.unitId))],restored);
 }
 function beginSave(){setSaveName(activeSlot===null?faction:slots[activeSlot]?.name||faction);setReplaceSlot(null);setSaveOpen(true);}
 function persistSlot(index:number){try{const next=saveArmySlot(localStorage,index,{name:saveName,faction,roster:saved.roster,used:saved.used,allies:saved.allies,savedAt:new Date().toISOString()});setSlots(next);setActiveSlot(index);setSaveOpen(false);setSlotError('');setStatus(`Saved “${next[index]!.name}” on this device.`);}catch(e){setSlotError(e instanceof Error?e.message:'This device could not save the army. Free some browser storage and try again.');}}
 const [collapsed,setCollapsed]=useState(false);

 const rules=useRuleLibrary(ruleFaction||faction);

 const rule=rules.cards.find(r=>r.key===selected);

 const card=cards[selected];

 if(shelf)return <section className="army-shelf"><header className="stage-heading"><h1>Saved Armies</h1><button className="action" disabled={busy} onClick={()=>{setActiveSlot(null);setShelf(false);setPlaying(false);}}><Plus/>Build / import army</button></header><div className="army-slot-grid">{slots.map((army,index)=><article className="army-slot faction-tile" key={index} style={factionStyle(army?.faction||'')}><span className="eyebrow">Slot {index+1}</span><FolderOpen size={30}/><strong>{army?.name||'Empty slot'}</strong><span>{army?.faction||'Build an army to save here'}</span>{army?.allies?.map(a=><small key={a.faction}>Ally · {a.faction}</small>)}{army&&<><span>{new Set([army.roster,...(army.allies||[]).map(a=>a.roster)].flatMap(r=>r.entries).map(e=>e.unitId)).size} data cards</span><div className="army-slot-images">{army.roster.entries.slice(0,3).map(e=>{const unit=units.find(u=>u.id===e.unitId);return unit?<UnitImage key={e.unitId} unit={unit}/>:null;})}</div><div className="stage-actions"><button className="action" disabled={busy||!units.length} onClick={()=>openSaved(army,index)}>Load army</button><button className="action" disabled={busy||!units.length} onClick={()=>{setFaction(army.faction);setSaved(separateArmies(army,army.faction,units));setActiveSlot(index);setShelf(false);setPlaying(false);}}>Edit army</button></div></>}{!army&&<button className="action" onClick={()=>{setActiveSlot(null);setShelf(false);setPlaying(false);}}>Build army</button>}</article>)}</div><p className="setup-note">Up to four armies, saved in this browser on this device.</p>{(slotError||error)&&<p role="alert">{slotError||error}</p>}</section>;
 return <div className={`game-card-page ${playing?'cards-playing':''}`}>{!playing&&<header className="stage-heading"><h1>{playing?faction+' · Game Data Cards':'Build your army'}</h1>{playing&&<button className="action" disabled={busy} onClick={()=>setPlaying(false)}><FolderOpen size={22}/>Edit army</button>}</header>}{!playing?<><section className="game-card-setup"><div className="stage-actions"><button className="action" disabled={busy} onClick={()=>setShelf(true)}><FolderOpen/>Saved Armies</button><button className="action" disabled={!ids.length||busy} onClick={beginSave}><Save/>Save army</button></div><label>Main army<select value={faction} disabled={busy} onChange={e=>chooseFaction(e.target.value)}><option value="">Choose an army…</option>{factions.map(f=><option key={f}>{f}</option>)}</select></label><p>Build your selection or import a Warhammer app army export. Previously used units appear first.</p><div className="stage-actions"><button className="action" disabled={!faction||busy} onClick={()=>setEditing(faction)}><FolderOpen/>Build / import army</button><button className="action primary" disabled={!ids.length||busy} onClick={()=>void prepare()}><BookOpen/>{busy?'Preparing…':`Open ${ids.length} data cards`}</button></div><button className="action" disabled={!faction||busy} onClick={()=>setAlliesOpen(v=>!v)}><Plus/>Add allied army</button>{alliesOpen&&<div className="allied-army-picker">{factions.filter(f=>!groups.some(g=>g.faction===f)).map(f=><button className="action faction-tile" style={factionStyle(f)} key={f} onClick={()=>addAlly(f)}>{f}</button>)}</div>}{groups.filter(g=>g.faction).map((g,index)=><section className="army-unit-group" key={g.faction}><header><h2>{index===0?'Main army':'Allied army'} · {g.faction}</h2><button className="action" disabled={busy} onClick={()=>setEditing(g.faction)}>Select units</button>{index>0&&<button className="action" disabled={busy} onClick={()=>{if(window.confirm(`Remove ${g.faction} and its selected units from this draft? Saved army slots are unchanged until you save.`))setSaved(old=>({...old,allies:old.allies?.filter(a=>a.faction!==g.faction)}));}}>Remove ally</button>}</header><div className="game-card-selected">{g.roster.entries.map(e=>units.find(u=>u.id===e.unitId)).filter(Boolean).map(u=><div className="faction-tile" style={factionStyle(g.faction)} key={u!.id}><UnitImage unit={u!}/><strong>{u!.name}</strong></div>)}</div></section>)}<p className="setup-note">Allies are separate card collections. This viewer does not validate army-building restrictions.</p></section><p className="setup-note">Army selections and downloaded cards are saved in this browser on this device. GitHub synchronises the app, not your personal saved armies.</p></>:<div className={`workspace lookup-workspace game-library-workspace ${collapsed?"search-collapsed":""}`}><aside className="lookup-panel collapsible-search"><button className="action search-collapse" aria-label={collapsed?"Expand saved cards":"Collapse saved cards"} aria-expanded={!collapsed} aria-controls="saved-card-list" onClick={()=>setCollapsed(v=>!v)}>{collapsed?<PanelLeftOpen size={24}/>:<PanelLeftClose size={24}/>}<span>{collapsed?"Cards":"Hide cards"}</span></button><div className="library-army-tools" hidden={collapsed}><h1>{activeSlot===null?faction:slots[activeSlot]?.name||faction}</h1>{groups.length>1&&<nav className="army-view-tabs" aria-label="Choose main or allied army">{groups.map((g,index)=><button key={g.faction} className="action faction-tile" style={factionStyle(g.faction)} aria-pressed={(viewFaction||faction)===g.faction} onClick={()=>setViewFaction(g.faction)}>{index===0?'Main':'Ally'} · {g.faction}</button>)}</nav>}</div><div id="saved-card-list" className="saved-card-scroll">{groups.filter(g=>g.faction===(viewFaction||faction)).map((g)=><section className="sidebar-army-group" key={g.faction}><h2 title={g.faction}>{collapsed?g.faction===faction?'Main':'Ally':`${g.faction===faction?'Main':'Ally'} · ${g.faction}`}</h2><nav className="game-card-tabs saved-card-list" aria-label={`${g.faction} data cards`}>{[...new Set(g.roster.entries.map(e=>e.unitId))].map(id=>{const u=units.find(u=>u.id===id);return u?<button className="faction-tile" key={id} style={factionStyle(g.faction)} aria-label={u.name+(failed.includes(id)?' · Retry needed':'')} title={u.name} aria-pressed={selected===id} onClick={()=>setSelected(id)}><UnitImage unit={u}/><span>{u.name}{failed.includes(id)&&<small>Retry needed</small>}</span></button>:null;})}</nav><GroupRules faction={g.faction} selected={selected} collapsed={collapsed} onSelect={key=>{setRuleFaction(g.faction);setSelected(key);}}/></section>)}</div></aside>{rule?<RuleCard key={rule.key} card={rule} refresh={rules.refresh} busy={rules.loading}/>:card?<DataCard key={card.id} card={card} refresh={()=>void refresh(selected)} busy={busy}/>:<section className="empty-card"><h2>This card could not load</h2><button className="action" disabled={busy} onClick={()=>void refresh(selected)}>Retry card</button></section>}</div>}{(storageError||error||(status&&!status.startsWith('Cards ready')))&&<p className="library-status" role="status">{storageError||error||status}</p>}{saveOpen&&<dialog ref={saveDialog} onCancel={e=>{e.preventDefault();setSaveOpen(false);}} aria-label="Save army" className="army-save-dialog"><h2>Save army</h2><label>Army name<input autoFocus maxLength={60} value={saveName} onChange={e=>{setSaveName(e.target.value);setReplaceSlot(null);}}/></label><p>Choose a slot. Existing armies are only replaced after confirmation.</p><div className="army-save-slots">{slots.map((army,index)=><button className="action" key={index} disabled={!saveName.trim()} onClick={()=>army?setReplaceSlot(index):persistSlot(index)}>Slot {index+1} · {army?.name||'Empty'}</button>)}</div>{replaceSlot!==null&&<div role="alert"><p>Replace “{slots[replaceSlot]?.name}” with this selection?</p><button className="action primary" onClick={()=>persistSlot(replaceSlot)}>Replace saved army</button></div>}{slotError&&<p role="alert">{slotError}</p>}<button className="action" onClick={()=>setSaveOpen(false)}>Cancel</button></dialog>}{editing&&<RosterEditor name={editing} units={nativeUnits(units,editing)} value={editGroup?.roster} preferredIds={editGroup?.used} cardsOnly onChange={roster=>setSaved(old=>editing===faction?{...old,roster}:{...old,allies:old.allies?.map(a=>a.faction===editing?{...a,roster}:a)})} onClose={()=>setEditing('')}/>}</div>;

}


function GroupRules({faction,selected,collapsed,onSelect}:{faction:string;selected:string;collapsed:boolean;onSelect:(key:string)=>void}){const library=useRuleLibrary(faction);return <RuleLibrary library={library} selected={selected} collapsed={collapsed} onSelect={r=>onSelect(r.key)}/>;}
