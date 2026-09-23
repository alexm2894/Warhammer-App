import type {FactionRules,RuleSection} from './faction-rules';
export type ReferenceCard=Omit<RuleSection,'kind'> & {key:string;kind:'Army rule'|'Detachment'|'Stratagem';faction:string;detachment?:string;retrievedAt:string;warning?:string};
export function ruleCards(pack:FactionRules,detachmentId:string):ReferenceCard[]{
 const make=(rule:RuleSection,kind:ReferenceCard['kind'],detachment?:string):ReferenceCard=>({...rule,key:[pack.faction,kind,detachment||'',rule.id].join('|'),kind,faction:pack.faction,detachment,retrievedAt:pack.retrievedAt,warning:pack.warning});
 const detachment=pack.detachments.find(d=>d.id===detachmentId);
 return [make(pack.army,'Army rule'),...pack.detachments.map(d=>make(d,'Detachment')), ...(detachment?.options||[]).filter(r=>r.kind==='stratagem'||(!r.kind&&!/^Enhancements/.test(r.id)&&/\b\d+\s*CP\b|Stratagem/i.test(r.name))).map(r=>make(r,'Stratagem',detachment!.name))];
}
const cache=new Map<string,FactionRules>(),pending=new Map<string,Promise<FactionRules>>();
export async function loadRuleCards(faction:string,refresh=false):Promise<FactionRules>{
 if(!refresh&&cache.has(faction))return cache.get(faction)!;
 if(pending.has(faction))return pending.get(faction)!;
 const request=(async()=>{const response=await fetch('/api/faction-rules?faction='+encodeURIComponent(faction));const pack=await response.json() as FactionRules & {error?:string};if(!response.ok||pack.edition!==11||pack.faction!==faction||!Array.isArray(pack.detachments)||!pack.army?.text)throw Error(pack.error||'Army rules unavailable.');cache.set(faction,pack);return pack as FactionRules;})();
 pending.set(faction,request);try{return await request;}finally{pending.delete(faction);}
}
