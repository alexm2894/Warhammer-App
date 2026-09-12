"use client";
import {useEffect,useRef,useState} from "react";
import {Mic,Square} from "lucide-react";
import type {CatalogueUnit,UnitCard} from "@/lib/types";
import type {RosterEntry} from "@/lib/roster";
import {rankUnits} from "@/lib/search";
import {createSpeechRecognition,type SpeechSession} from "@/lib/speech";
import {loadCard} from "@/lib/card-loader";
import UnitImage from "@/components/unit-image";
import {rememberUnit,recentUnits} from "@/lib/recent-units";
import {factionStyle} from "@/lib/factions";

interface Props {
 catalogue: CatalogueUnit[];
 onCard: (card: UnitCard) => void;
 onSearching?: () => void;
 recentScope?: string;
 roster?: RosterEntry[];
 rosterLabel?: string;
 disabled?: boolean;
}

export default function UnitSearch({catalogue,onCard,onSearching,recentScope,roster=[],rosterLabel='Selected army',disabled=false}:Props){
 const [query,setQuery]=useState(''),[listening,setListening]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[choices,setChoices]=useState<CatalogueUnit[]>([]);
 const speech=useRef<SpeechSession|null>(null),input=useRef<HTMLInputElement>(null),request=useRef(0);
 useEffect(()=>()=>{request.current++;speech.current?.abort();},[]);
 async function open(unit:CatalogueUnit){const seq=++request.current;setBusy(true);onSearching?.();setChoices([]);setMessage('Opening '+unit.name+'…');try{const card={...unit,...await loadCard(unit.id),image:unit.image};if(seq===request.current){if(recentScope)rememberUnit(recentScope,card.id);onCard(card);setMessage(card.warning||'');}}catch(e){if(seq===request.current)setMessage(e instanceof Error?e.message:'Lookup failed.');}finally{if(seq===request.current)setBusy(false);}}
 function lookup(value:string){setQuery(value);if(!value.trim())return;const ranked=rankUnits(value,catalogue);if(!ranked.length){setChoices([]);setMessage('No match in the available factions. Try a full unit name.');return;}if(ranked[0].score>=.86&&(!ranked[1]||ranked[0].score-ranked[1].score>.08))void open(ranked[0].unit);else{setChoices(ranked.slice(0,6).map(result=>result.unit));setMessage('Choose your unit.');}}
 function speak(){if(listening){speech.current?.stop();return;}speech.current?.abort();input.current?.blur();setQuery('');setChoices([]);setMessage('Starting microphone…');let heard=false;const session=createSpeechRecognition({onStart:()=>setListening(true),onAudioStart:()=>setMessage('Say a unit name.'),onTranscript:setQuery,onResult:value=>{heard=true;lookup(value);},onError:value=>{heard=true;setMessage(value);},onEnd:()=>{setListening(false);if(!heard)setMessage('No speech captured. Try again or type.');}});if(!session){setMessage('Speech is unavailable in this browser. Type a unit name.');return;}speech.current=session;try{setListening(true);session.start();}catch{setListening(false);setMessage('Check microphone permissions and try again.');}}

 const rosterById=new Map<string,RosterEntry[]>();
 for(const entry of roster){const entries=rosterById.get(entry.unitId)||[];entries.push(entry);rosterById.set(entry.unitId,entries);}
 const rosterUnits=[...rosterById].flatMap(([id,entries])=>{const unit=catalogue.find(candidate=>candidate.id===id);return unit?[{unit,entries}]:[];});
 const rosterIds=new Set(rosterUnits.map(({unit})=>unit.id));
 const recents=(recentScope?recentUnits(recentScope,catalogue):[]).filter(unit=>!rosterIds.has(unit.id));
 const rosterSummary=(entries:RosterEntry[])=>entries.map(entry=>entry.count===1?`${entry.models} model${entry.models===1?'':'s'}`:`${entry.count} units · ${entry.models} models each`).join(' · ');

 return <div className="unit-search">
  {rosterUnits.length>0&&<section className="roster-quick" aria-label={`Units in ${rosterLabel}`}><div className="roster-quick-heading"><h3>Choose from {rosterLabel}</h3><span>{rosterUnits.length} datasheet{rosterUnits.length===1?'':'s'}</span></div><div className="roster-unit-choices">{rosterUnits.map(({unit,entries})=><button key={unit.id} className="faction-tile" style={factionStyle(unit.faction)} disabled={disabled||busy||listening} onClick={()=>void open(unit)}><UnitImage unit={unit}/><span className="roster-choice-copy"><strong>{unit.name}</strong><small>{rosterSummary(entries)}</small></span></button>)}</div></section>}
  <div className="unit-search-tools"><button className="voice-button" disabled={disabled||busy||!catalogue.length} onClick={speak}>{listening?<Square size={20}/>:<Mic size={20}/>} {listening?'Finish listening':'Tap to speak'}</button><form className="search-box" onSubmit={event=>{event.preventDefault();lookup(query);}}><input ref={input} aria-label="Unit name" placeholder={rosterUnits.length?'Or find another unit…':'Unit name…'} value={query} onChange={event=>setQuery(event.target.value)} readOnly={listening} inputMode={listening?'none':'text'} onFocus={event=>{if(listening)event.currentTarget.blur();}}/><button disabled={disabled||busy||listening||!catalogue.length}>Find</button></form></div>
  {message&&<p role="status">{message}</p>}
  {recents.length>0&&<section className="recent-quick" aria-label="Previously used by this player"><h3>Recently used</h3><div className="recent-units">{recents.map(unit=><button key={unit.id} className="faction-tile" style={factionStyle(unit.faction)} disabled={disabled||busy||listening} onClick={()=>void open(unit)}><UnitImage unit={unit}/><span>{unit.name}</span></button>)}</div></section>}
  <div className="candidates">{choices.map(unit=><button key={unit.id} disabled={busy||listening||disabled} style={factionStyle(unit.faction)} className="faction-tile" onClick={()=>void open(unit)}><strong>{unit.name}</strong><span>{unit.faction}</span></button>)}</div>
 </div>;
}
