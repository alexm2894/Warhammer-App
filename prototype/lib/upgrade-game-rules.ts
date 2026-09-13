import type {Game} from './battle';
import type {FactionRules} from './faction-rules';

// Older saves predate selectable stratagem/enhancement source sections.
// Upgrade through the shared endpoint so source dates and fallback warnings survive.
export async function upgradeGameRules(game:Game):Promise<Game>{
 const rules={...game.rules};
 await Promise.all(Object.entries(rules).map(async([faction,pack])=>{
  if(pack.detachments.some(d=>d.options?.length))return;
  try{
   const response=await fetch('/api/faction-rules?faction='+encodeURIComponent(faction),{signal:AbortSignal.timeout(20000)});
   if(!response.ok)return;
   const next=await response.json() as FactionRules;
   if(next.edition===pack.edition&&next.faction===faction&&Array.isArray(next.detachments)&&next.detachments.length)rules[faction]=next;
  }catch{/* Keep the dated saved rules when offline; Refresh remains available. */}
 }));
 return {...game,rules};
}
