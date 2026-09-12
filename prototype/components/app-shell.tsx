import Link from 'next/link';
import {Shield} from 'lucide-react';
import FullscreenControl from './fullscreen-control';
export default function AppShell({children,title}:{children:React.ReactNode;title:string}){return <main><header className="app-header"><Link href="/" className="brand"><Shield size={24}/> FIELD CARDS</Link><span className="edition">{title} · 11TH EDITION</span><FullscreenControl/></header>{children}</main>;}
