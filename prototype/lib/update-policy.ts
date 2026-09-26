export const DAY=24*60*60*1000;
export function updateDue(lastSuccess:string|undefined,lastAttempt:string|undefined,now=Date.now()){
 const elapsed=(date:string|undefined)=>date&&Number.isFinite(Date.parse(date))?Math.max(0,now-Date.parse(date)):Infinity;
 return elapsed(lastSuccess)>=DAY&&elapsed(lastAttempt)>=60*60*1000;
}
export function isFreshCard(card:{source?:{edition?:number;mode?:string};warning?:string}){return card.source?.edition===11&&card.source.mode==='live'&&!card.warning;}
