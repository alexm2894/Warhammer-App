import {baseUnits,liveFaction} from '@/lib/live-catalogue';
export async function GET(request:Request){
 const faction=new URL(request.url).searchParams.get('faction');
 try{return Response.json({units:faction?await liveFaction(faction):baseUnits,retrievedAt:faction?new Date().toISOString():undefined},{headers:{'Cache-Control':'no-store'}});}
 catch(error){return Response.json({error:error instanceof Error?error.message:'Unit list refresh failed'},{status:502,headers:{'Cache-Control':'no-store'}});}
}
