"use client";
import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
export default function CardSource({date,url,edition=11,warning,refresh,busy,photo}:{date:string;url:string;edition?:number;warning?:string;refresh?:()=>void;busy?:boolean;photo?:{source:string;credit:string;caption?:string}}){
 const [host,setHost]=useState<HTMLElement|null>(null);useEffect(()=>setHost(document.getElementById('card-source-slot')),[]);
 if(!host)return null;
 return createPortal(<details className="header-source" key={url}><summary>{warning?'Cached · ':''}{new Date(date).toLocaleDateString()} · Source</summary><div className="header-source-popover">{warning&&<p role="status">{warning}</p>}<p>{edition}th edition · Retrieved {new Date(date).toLocaleString()}</p><a href={url} target="_blank" rel="noreferrer">Wahapedia source ↗</a>{refresh&&<button className="action" disabled={busy} onClick={refresh}>Refresh rules / card</button>}{photo&&<a href={photo.source} target="_blank" rel="noreferrer">Photo: {photo.credit}{photo.caption?' · '+photo.caption:''}</a>}</div></details>,host);
}
