"use client";
import {useEffect,useRef,useState} from 'react';
import {prepareUnitArt} from '@/lib/unit-art';
import {Shield} from 'lucide-react';
import type {CatalogueUnit} from '@/lib/types';
export default function UnitImage({unit}:{unit:CatalogueUnit}){
 const [failed,setFailed]=useState('');
 const [art,setArt]=useState<{original:string;url:string}|null>(null),host=useRef<HTMLDivElement>(null);
 useEffect(()=>{let cancelled=false;const url=unit.image?.url;if(!url||!host.current)return;
  const prepare=()=>{void prepareUnitArt(url).then(result=>{if(!cancelled&&result)setArt({original:url,url:result});});};
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();prepare();}},{rootMargin:'80px'});observer.observe(host.current);return()=>{cancelled=true;observer.disconnect();};
 },[unit.image?.url]);
 if(!unit.image||unit.image.kind!=='miniature'||!['white','transparent'].includes(unit.image.background)||failed===unit.image.url)return <div className="unit-art placeholder" aria-label={`Verified model photo unavailable for ${unit.name}`}><Shield size={40}/></div>;
 const cutout=art?.original===unit.image.url;
 // Native images support the browser-generated cutout data URLs and remote fallback.
 // eslint-disable-next-line @next/next/no-img-element
 return <div ref={host} className={`unit-art ${cutout?'cutout':''}`} title={`Photo: ${unit.image.credit}`}><img loading="lazy" decoding="async" src={cutout?art.url:unit.image.url} alt={`${unit.name} miniatures`} onError={()=>setFailed(unit.image!.url)}/></div>;
}
