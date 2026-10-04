import {parseWeaponAbilities,weaponRulesUrl} from '@/lib/parse-weapon-abilities';
export async function GET(){
 try{
  const response=await fetch(weaponRulesUrl,{signal:AbortSignal.timeout(12000),cache:'no-store'});
  if(!response.ok)throw Error('Source unavailable');
  return Response.json(parseWeaponAbilities(await response.text(),new Date().toISOString()));
 }catch{return Response.json({error:'Unable to refresh verified 11th-edition weapon abilities.'},{status:502});}
}
