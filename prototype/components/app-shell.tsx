import {Shield} from 'lucide-react';
import FullscreenControl from './fullscreen-control';
export default function AppShell({children,title}:{children:React.ReactNode;title:string}){return <main><header className="app-header"><a href="/" className="brand" aria-label="Field Cards main menu"><Shield size={24}/> FIELD CARDS</a><span className="edition">{title} · 11TH EDITION</span><FullscreenControl/></header>{children}</main>;}
