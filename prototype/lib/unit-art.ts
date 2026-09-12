// Remove only near-white pixels connected to an image edge, preserving enclosed white details.
export function clearWhiteBackdrop(pixels:Uint8ClampedArray,width:number,height:number){
 const visited=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
 const add=(index:number)=>{if(visited[index])return;visited[index]=1;const i=index*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];if(Math.min(r,g,b)<238||Math.max(r,g,b)-Math.min(r,g,b)>14)return;queue[tail++]=index;};
 for(let x=0;x<width;x++){add(x);add((height-1)*width+x);}for(let y=0;y<height;y++){add(y*width);add(y*width+width-1);}
 while(head<tail){const i=queue[head++],x=i%width;pixels[i*4+3]=0;if(x>0)add(i-1);if(x<width-1)add(i+1);if(i>=width)add(i-width);if(i+width<width*height)add(i+width);}
 return tail;
}
const prepared=new Map<string,string>();
const pending=new Map<string,Promise<string|null>>();
export async function prepareUnitArt(url:string):Promise<string|null>{
 if(prepared.has(url))return prepared.get(url)!;if(pending.has(url))return pending.get(url)!;
 const work=new Promise<string|null>(resolve=>{
  const img=new Image();img.crossOrigin='anonymous';const timer=setTimeout(()=>resolve(null),10000);
  const finish=(value:string|null)=>{clearTimeout(timer);resolve(value);};
  img.onerror=()=>finish(null);img.onload=()=>{try{
   const scale=Math.min(1,480/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
   const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return finish(null);ctx.drawImage(img,0,0,canvas.width,canvas.height);
   const data=ctx.getImageData(0,0,canvas.width,canvas.height);const removed=clearWhiteBackdrop(data.data,canvas.width,canvas.height);
   if(removed<canvas.width*canvas.height*.05)return finish(null);ctx.putImageData(data,0,0);const result=canvas.toDataURL('image/png');
   if(prepared.size>=60)prepared.delete(prepared.keys().next().value!);prepared.set(url,result);finish(result);
  }catch{finish(null);}};img.src=url;
 });pending.set(url,work);try{return await work;}finally{pending.delete(url);}
}
