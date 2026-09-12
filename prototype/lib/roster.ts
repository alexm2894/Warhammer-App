import type {CatalogueUnit} from './types';
export interface SizeCost {models:number;points:number;from:number;to:number|null;label?:string}
export interface RosterEntry {unitId:string;models:number;count:number;option?:string}
export interface ArmyRoster {mode:'none'|'build'|'import';entries:RosterEntry[];text:string}
export const emptyRoster=():ArmyRoster=>({mode:'none',entries:[],text:''});
export function rosterTotal(entries:RosterEntry[],units:CatalogueUnit[]){
 const counts=new Map<string,number>();let points=0,unknown=0;
 for(const e of entries)for(let i=0;i<e.count;i++){
  const ordinal=(counts.get(e.unitId)||0)+1;counts.set(e.unitId,ordinal);
  const costs=units.find(u=>u.id===e.unitId)?.sizes?.filter(s=>s.models===e.models&&(!e.option||s.label===e.option)&&ordinal>=s.from&&(s.to===null||ordinal<=s.to))||[];
  if(costs.length&&new Set(costs.map(s=>s.points)).size===1)points+=costs[0].points;else unknown++;
 }
 return {points,unknown};
}
const normalize=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]/g,'');
export interface ImportRow {name:string;unitId:string;models:number;exportPoints:number;body:string;option?:string}
// Only top-level headings with explicit points become units. Wargear is retained as text, never executed.
export function parseArmyExport(text:string,units:CatalogueUnit[]):ImportRow[]{
 if(text.length>100000)throw Error('Please paste an army export under 100,000 characters.');
 const lines=text.replace(/&#x20;|&#32;|&nbsp;/gi,' ').replace(/\r/g,'').split('\n'),rows:ImportRow[]=[];
 for(let i=0;i<lines.length;i++){
  const match=lines[i].match(/^([^\s•+][^\n]*?)\s*\((\d[\d,]*)\s*(?:points?|pts?)\)\s*$/i);
  if(!match)continue;
  const name=match[1].trim();
  const matches=units.filter(u=>normalize(u.name)===normalize(name)||u.aliases?.some(a=>normalize(a)===normalize(name)));
  const unit=matches.length===1?matches[0]:undefined;
  let j=i+1;while(j<lines.length&&!/^[^\s•+].*\(\d[\d,]*\s*(?:points?|pts?)\)\s*$/i.test(lines[j]))j++;
  const body=lines.slice(i+1,j).join('\n');
  // A list title has no model bullets; retain unknown unit headings with bullets for explicit review.
  const modelLines=body.split('\n').filter(l=>/^\s*[•*]\s*\d+\s*x\s+/i.test(l));
  const indents=modelLines.map(l=>l.search(/\S/)),minIndent=Math.min(...indents);
  const modelCount=modelLines.filter((_,k)=>indents[k]===minIndent).reduce((n,l)=>n+Number(l.match(/(\d+)\s*x/i)?.[1]||0),0);
  if(!unit&&!modelLines.length)continue;
  const singleModel=!!unit?.sizes?.length&&unit.sizes.every(s=>s.models===1);
  rows.push({name,unitId:unit?.id||'',models:singleModel?1:modelCount||unit?.sizes?.[0]?.models||0,exportPoints:Number(match[2].replace(/,/g,'')),body});
 }
 return rows;
}
export function validRoster(value:unknown):value is ArmyRoster{
 const r=value as ArmyRoster;return !!r&&['none','build','import'].includes(r.mode)&&typeof r.text==='string'&&r.text.length<=100000&&Array.isArray(r.entries)&&r.entries.length<=500&&r.entries.every(e=>e&&typeof e==='object'&&(e.option===undefined||typeof e.option==='string')&&typeof e.unitId==='string'&&Number.isInteger(e.models)&&e.models>0&&Number.isInteger(e.count)&&e.count>0&&e.count<=30);
}
