"use client";
import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";

export default function FullscreenControl() {
  const [active, setActive] = useState(false);
  const [help, setHelp] = useState("");
  useEffect(() => {
    const update = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  async function toggle() {
    setHelp("");
    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone) {
      setHelp("You’re already using the Home Screen app without browser tabs."); return;
    }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.fullscreenEnabled && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else setHelp("For an app view on iPad: open in Safari, tap Share, then Add to Home Screen and open Warhammer Data Cards from its icon. On PC, try your browser’s fullscreen command (usually F11).");
    } catch {
      setHelp("This browser couldn’t enter fullscreen. On iPad, use Safari → Share → Add to Home Screen, then open the app from its icon. On PC, try F11.");
    }
  }
  return <div className="fullscreen-control"><button onClick={toggle} aria-pressed={active}>{active ? <Minimize size={18}/> : <Maximize size={18}/>} {active ? "Exit fullscreen" : "Fullscreen"}</button>{help && <div className="fullscreen-help" role="status"><p>{help}</p><button onClick={() => setHelp("")}>Close</button></div>}</div>;
}
