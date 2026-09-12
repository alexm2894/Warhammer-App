import type {UnitCard} from "./types";
const PREFIX = "field-cards-session-11-v3:";
const memory = new Map<string, UnitCard>();
function isCard(value: unknown, id: string): value is UnitCard {
  const card = value as UnitCard | null;
  return !!card && card.id === id && typeof card.name === "string" && Array.isArray(card.profiles) && Array.isArray(card.weapons) && Array.isArray(card.sections) && card.source?.parserVersion === 3 && card.source?.edition === 11;
}
export function getSessionCard(id: string): UnitCard | undefined {
  if(memory.has(id)) return memory.get(id);
  try { const raw = sessionStorage.getItem(PREFIX + id); if(!raw) return; const card: unknown = JSON.parse(raw); if(isCard(card,id)){ memory.set(id,card); return card; } } catch {}
}
export function saveSessionCard(card: UnitCard) {
  memory.set(card.id,card);
  try { sessionStorage.setItem(PREFIX+card.id,JSON.stringify(card)); } catch {} // Memory remains usable when browser storage is full/disabled.
}
export function sessionCardCount(): number {
  const ids=new Set(memory.keys());
  try { for(let i=0;i<sessionStorage.length;i++){const key=sessionStorage.key(i); if(key?.startsWith(PREFIX)) ids.add(key.slice(PREFIX.length));} } catch {}
  return ids.size;
}
export function clearSessionCards() {
  memory.clear();
  try { const keys=[]; for(let i=0;i<sessionStorage.length;i++){const key=sessionStorage.key(i); if(key?.startsWith(PREFIX)) keys.push(key);} for(const key of keys) sessionStorage.removeItem(key); } catch {}
}
