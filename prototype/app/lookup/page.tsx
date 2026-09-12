"use client";
import {useState} from 'react';
import AppShell from '@/components/app-shell';
import DataCard from '@/components/data-card';
import UnitSearch from '@/components/unit-search';
import type {UnitCard} from '@/lib/types';
import {useCatalogue} from '@/lib/use-catalogue';
import {clearSessionCards,saveSessionCard} from '@/lib/session-cache';
export default function Lookup(){const {units,error}=useCatalogue(),[card,setCard]=useState<UnitCard|null>(null),[message,setMessage]=useState('');async function refresh(){if(!card)return;setMessage('Refreshing…');try{const r=await fetch('/api/card?id='+encodeURIComponent(card.id)+'&refresh=1');const d=await r.json() as UnitCard & {error?:string};if(!r.ok)throw Error(d.error);saveSessionCard(d);setCard(d);setMessage(d.warning||'Refreshed.');}catch(e){setMessage(e instanceof Error?e.message:'Refresh failed.');}}
 return <AppShell title="Datasheet lookup"><div className="workspace"><aside className="lookup-panel"><h1>Find a unit</h1><p>Search all indexed factions.</p><UnitSearch catalogue={units} onCard={setCard}/>{error&&<p role="alert">{error}</p>}<details className="source-details"><summary>Session & source</summary><button className="action" onClick={()=>{clearSessionCards();setCard(null);}}>Clear session cache</button>{card&&<><p>{card.source.edition}th edition · Retrieved {new Date(card.source.retrievedAt).toLocaleDateString()}</p><a href={card.source.url} target="_blank" rel="noreferrer">View on Wahapedia</a><button className="action" onClick={refresh}>Refresh card</button>{card.image&&<p><a href={card.image.source} target="_blank" rel="noreferrer">Photo: {card.image.credit}</a></p>}</>}</details><p role="status">{message}</p></aside>{card?<DataCard card={card}/>:<section className="empty-card"><h2>Your unit, at a glance</h2><p>Speak or type a name to open a datasheet.</p></section>}</div></AppShell>;
}
