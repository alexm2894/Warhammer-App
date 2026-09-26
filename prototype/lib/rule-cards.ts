import {readUpdate,keepRulePack} from './update-storage.ts';
import type {FactionRules,RuleSection} from './faction-rules';
export type ReferenceCard=Omit<RuleSection,'kind'> & {key:string;kind:'Army rule'|'Detachment';stratagems:RuleSection[];faction:string;detachment?:string;retrievedAt:string;warning?:string};
export function isStratagem(rule:RuleSection){return rule.kind==='stratagem'||(!rule.kind&&!/^Enhancements/.test(rule.id)&&/\b\d+\s*CP\b|Stratagem/i.test(rule.name));}
export function ruleCards(pack:FactionRules,_detachmentId?:string):ReferenceCard[]{
 const make=(rule:RuleSection,kind:ReferenceCard['kind']):ReferenceCard=>({...rule,key:[pack.faction,kind,'',rule.id].join('|'),kind,faction:pack.faction,retrievedAt:pack.retrievedAt,warning:pack.warning,stratagems:(rule.options||[]).filter(isStratagem)});
 return [make(pack.army,'Army rule'),...pack.detachments.map(d=>make(d,'Detachment'))];
}
const cache=new Map<string,FactionRules>(),pending=new Map<string,Promise<FactionRules>>();
export async function loadRuleCards(faction:string,refresh=false):Promise<FactionRules>{
 if(!refresh&&cache.has(faction))return cache.get(faction)!;
 if(pending.has(faction))return pending.get(faction)!;
 const request=(async()=>{ if(!refresh){try{const saved=(await readUpdate()).rules[faction];if(saved){cache.set(faction,saved);return saved;}}catch{}}const response=await fetch('/api/faction-rules?faction='+encodeURIComponent(faction));const pack=await response.json() as FactionRules & {error?:string};if(!response.ok||pack.edition!==11||pack.faction!==faction||!Array.isArray(pack.detachments)||!pack.army?.text)throw Error(pack.error||'Army rules unavailable.');cache.set(faction,pack);if(!pack.warning){try{await keepRulePack(pack);}catch{}}return pack as FactionRules;})();
 pending.set(faction,request);try{return await request;}finally{pending.delete(faction);}
}
