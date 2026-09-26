"use client";
import {useEffect,useRef,useState} from 'react';
import {RefreshCw,X} from 'lucide-react';
import {runDataUpdate,type UpdateProgress} from '@/lib/data-updates';
import {readUpdate,type UpdateData} from '@/lib/update-storage';
import {updateDue} from '@/lib/update-policy';
export default function DataUpdates(){
 const [data,setData]=useState<UpdateData>(),[progress,setProgress]=useState<UpdateProgress>(),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);const controller=useRef<AbortController|null>(null);
 async function check(){
  if(controller.current)return;const run=new AbortController();controller.current=run;setBusy(true);setMessage('Checking Wahapedia…');
  try{const result=await runDataUpdate(run.signal,setProgress);if(!run.signal.aborted){setData(result);setMessage(result.failures.length?`Checked with ${result.failures.length} issues. Previous data kept where refresh failed.`:'Cards, rules and unit lists checked.');}}
  catch(e){if(!run.signal.aborted)setMessage((e instanceof Error?e.message:'Update failed')+'. Existing data kept.');}
  finally{if(controller.current===run){controller.current=null;setBusy(false);setProgress(undefined);}}
 }
 useEffect(()=>{let active=true;void readUpdate().then(saved=>{if(!active)return;setData(saved);if(updateDue(saved.checkedAt,saved.attemptedAt))void check();}).catch(()=>{if(active)setMessage('Local update storage is unavailable. Enable browser storage and retry.');});
  return()=>{active=false;controller.current?.abort();controller.current=null;};
 },[]);
 function cancel(){controller.current?.abort();controller.current=null;setBusy(false);setProgress(undefined);setMessage('Update cancelled. Existing data kept.');}
 return <section className="data-updates" aria-label="Data updates"><div className="update-actions"><button className="action" disabled={busy} onClick={()=>void check()}><RefreshCw size={20}/>{busy?'Checking for updates…':'Check for updates'}</button>{busy&&<button className="action" onClick={cancel}><X size={18}/>Cancel</button>}<span>{data?.checkedAt?`Last full check: ${new Date(data.checkedAt).toLocaleString()}`:'No full update check yet'}</span></div>
 <p role="status">{progress?`${progress.done}/${progress.total} · ${progress.label}`:message||'Checks daily on the main menu. Saved armies are preserved.'}</p>{busy&&<progress value={progress?.done||0} max={progress?.total||1}/>}
 {!!data?.failures.length&&!busy&&<details><summary>Items needing another check ({data.failures.length})</summary><ul>{data.failures.map((f,i)=><li key={i}>{f}</li>)}</ul></details>}
 </section>;
}
