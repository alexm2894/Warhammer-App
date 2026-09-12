export interface SpeechSession { start(): void; stop(): void; abort(): void }
interface RecognitionResult {isFinal?: boolean; [index: number]: {transcript?: string}}
interface BrowserRecognition extends SpeechSession {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  onstart: (() => void) | null; onaudiostart: (() => void) | null;
  onresult: ((event: {results: ArrayLike<RecognitionResult>}) => void) | null;
  onerror: ((event: {error: string}) => void) | null; onend: (() => void) | null;
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => BrowserRecognition;
  webkitSpeechRecognition?: new () => BrowserRecognition;
};
export function createSpeechRecognition(callbacks: {onStart(): void; onAudioStart?(): void; onProcessing?(): void; onTranscript?(text: string): void; onResult(text: string): void; onError(message: string): void; onEnd(): void}): SpeechSession | null {
  const Constructor = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
  if (!Constructor) return null;
  const recognition = new Constructor();
  recognition.lang = "en-GB"; recognition.continuous = false; recognition.interimResults = true; recognition.maxAlternatives = 3;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  let ended=false;
  let transcript="";
  let delivered=false;
  function deliver(){if(delivered || !transcript)return;delivered=true;callbacks.onResult(transcript);}
  function finish(){if(ended)return;ended=true;clearTimeout(timer);clearTimeout(watchdog);callbacks.onEnd();}
  function stop(){if(ended)return;clearTimeout(timer);callbacks.onProcessing?.();clearTimeout(watchdog);watchdog=setTimeout(()=>{if(ended)return;callbacks.onError("The speech service did not finish. Try Chrome or Edge outside the preview, or type the name.");finish();recognition.abort();},8000);recognition.stop();}
  recognition.onstart = () => { callbacks.onStart(); timer = setTimeout(stop, 15000); };
  recognition.onaudiostart = () => callbacks.onAudioStart?.();
  recognition.onresult = (event) => {
    if(ended)return;
    const results=Array.from(event.results || []);
    const text=results.map(result=>result[0]?.transcript || "").join(" ").replace(/\s+/g," ").trim();
    if(!text)return;
    transcript=text;callbacks.onTranscript?.(text);
    if(results.every(result=>result.isFinal !== false)){deliver();finish();recognition.abort();}
  };
  recognition.onerror = (event) => {if(ended)return;callbacks.onError(({"not-allowed": "Microphone or speech access was denied. Try Test microphone to check capture separately, and allow this site in your browser settings.", "audio-capture": "No microphone was found. Use Test microphone to check your input device.", network: "The browser’s speech service could not connect. This can happen in an embedded preview even with working internet and microphone. Open this site in Chrome or Edge on PC, or Safari on iPad. Test microphone checks the hardware separately.", "no-speech": "No speech was detected. Try Test microphone to check the input signal, then speak closer to the microphone.", "service-not-allowed": "This browser’s speech service is unavailable. Open the site in Chrome or Edge on PC, or Safari on iPad."} as Record<string, string>)[event.error] || "Voice recognition stopped. Please try again or type the unit name.");finish();};
  recognition.onend = () => {if(!ended)deliver();finish();};
  return {start: () => {try{recognition.start();watchdog=setTimeout(()=>{if(ended)return;callbacks.onError("Speech recognition timed out. Try the microphone test, or open this site in a full browser.");finish();recognition.abort();},25000);}catch(error){clearTimeout(timer);clearTimeout(watchdog);throw error;}}, stop, abort: () => { ended=true;clearTimeout(timer);clearTimeout(watchdog);recognition.onend = null; recognition.onerror = null; recognition.abort(); }};
}
