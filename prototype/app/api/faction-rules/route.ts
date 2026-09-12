import catalogue from '@/data/catalogue.json';
import saved from '@/data/faction-rules.json';
import {parseFactionRules,type FactionRules} from '@/lib/faction-rules';
export async function GET(request:Request){
 const faction=new URL(request.url).searchParams.get('faction')||'';
 const unit=catalogue.find(u=>u.faction===faction);if(!unit)return Response.json({error:'Faction is not indexed.'},{status:404});
 const url=`https://wahapedia.ru/wh40k11ed/factions/${unit.id.split('/')[0]}/`;
 try{const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('Source unavailable');const html=await r.text();if(html.length>5_000_000)throw Error('Source too large');return Response.json(parseFactionRules(html,faction,url),{headers:{'Cache-Control':'no-store'}});}
 catch{const fallback=(saved as Record<string,FactionRules>)[faction];return fallback?Response.json({...fallback,warning:'Saved 11th-edition rules; live refresh failed. Check the source date.'},{headers:{'Cache-Control':'no-store'}}):Response.json({error:'11th-edition rules could not be verified for this faction.'},{status:502});}
}
