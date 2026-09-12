"use client";
import {useEffect, useRef, useState} from "react";
import {microphoneError} from "@/lib/microphone";
export default function MicrophoneTest({disabled,onActiveChange}: {disabled:boolean; onActiveChange(active:boolean):void}) {
  const [active,setActive]=useState(false), [level,setLevel]=useState(0), [status,setStatus]=useState("");
  const run=useRef(0), stream=useRef<MediaStream|null>(null), context=useRef<AudioContext|null>(null), frame=useRef(0), timer=useRef<ReturnType<typeof setTimeout>|null>(null), detected=useRef(false);
  function release(){
    cancelAnimationFrame(frame.current); if(timer.current) clearTimeout(timer.current);
    stream.current?.getTracks().forEach(track=>track.stop()); stream.current=null;
    void context.current?.close().catch(()=>{}); context.current=null;
  }
  function stop(){run.current++;release();setActive(false);setLevel(0);onActiveChange(false);setStatus(detected.current ? "Microphone test passed: an input signal was detected. Now try Tap to speak. If recognition fails, the speech service is a separate issue." : "Test ended without a detectable input signal. Check the selected Windows input device, mute switch and input volume.");}
  useEffect(()=>()=>{run.current++;release();},[]);
  async function test(){
    if(active){stop();return;}
    if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia){setStatus("Microphone capture is unavailable here. Open the HTTPS site in a full browser.");return;}
    const id=++run.current;detected.current=false;setActive(true);onActiveChange(true);setStatus("Allow microphone access if prompted…");
    timer.current=setTimeout(()=>{if(run.current===id){run.current++;release();setActive(false);onActiveChange(false);setStatus("Microphone permission did not complete. Check for a permission prompt, or try the site in Chrome/Edge outside the preview.");}},20000);
    try {
      const audio=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
      if(run.current!==id){audio.getTracks().forEach(track=>track.stop());return;}
      stream.current=audio;if(timer.current)clearTimeout(timer.current);
      const Audio = window.AudioContext || (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
      if(!Audio) throw Error("Audio meter unavailable");
      const ctx:AudioContext=new Audio();context.current=ctx;await ctx.resume();
      if(run.current!==id){audio.getTracks().forEach(track=>track.stop());void ctx.close().catch(()=>{});return;}
      const analyser=ctx.createAnalyser();analyser.fftSize=1024;
      ctx.createMediaStreamSource(audio).connect(analyser); // No destination connection: never plays back microphone audio.
      const samples=new Uint8Array(analyser.fftSize);
      setStatus(`Microphone open: ${audio.getAudioTracks()[0]?.label || "default input"}. Speak now and watch the meter.`);
      function sample(){if(run.current!==id)return;analyser.getByteTimeDomainData(samples);let sum=0;for(const value of samples)sum+=((value-128)/128)**2;const rms=Math.sqrt(sum/samples.length);if(rms>.008)detected.current=true;setLevel(Math.min(100,Math.round(rms*550)));frame.current=requestAnimationFrame(sample);}
      sample();timer.current=setTimeout(stop,10000);
    }catch(error){if(run.current!==id)return;run.current++;release();setActive(false);onActiveChange(false);setLevel(0);setStatus(microphoneError(error));}
  }
  return <div className="mic-test"><button type="button" disabled={disabled && !active} onClick={()=>void test()}>{active ? "Stop microphone test" : "Test microphone"}</button>{active && <meter aria-label="Microphone input level" min={0} max={100} value={level}/>}<p role="status">{status || "Check your input device. This test stays on your device and does not record or upload audio."}</p></div>;
}
