"use client";
import {useEffect,useState} from 'react';
import type {CatalogueUnit} from './types';
export function useCatalogue(){const [units,setUnits]=useState<CatalogueUnit[]>([]),[error,setError]=useState('');useEffect(()=>{let alive=true;fetch('/api/catalogue?edition=11',{cache:'no-store'}).then(async r=>{if(!r.ok)throw Error('Could not load unit index. Reload to retry.');return r.json() as Promise<{units:CatalogueUnit[]}>;}).then(d=>{if(alive)setUnits(d.units);}).catch(e=>{if(alive)setError(e.message);});return()=>{alive=false;};},[]);return {units,error};}
