import type {CatalogueUnit} from './types';
const memory=new Map<string,string[]>();
const prefix='field-cards-recent-11:';
function read(scope:string):string[]{if(memory.has(scope))return memory.get(scope)!;try{const data=JSON.parse(sessionStorage.getItem(prefix+scope)||'[]');if(Array.isArray(data)&&data.every(id=>typeof id==='string')){memory.set(scope,data);return data;}}catch{}return [];}
export function rememberUnit(scope:string,id:string){const ids=[id,...read(scope).filter(old=>old!==id)].slice(0,12);memory.set(scope,ids);try{sessionStorage.setItem(prefix+scope,JSON.stringify(ids));}catch{}}
export function recentUnits(scope:string,catalogue:CatalogueUnit[]){const allowed=new Map(catalogue.map(u=>[u.id,u]));return read(scope).flatMap(id=>allowed.has(id)?[allowed.get(id)!]:[]);}
