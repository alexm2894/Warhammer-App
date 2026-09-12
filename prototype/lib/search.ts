import type {CatalogueUnit} from "./types";
export const normalize = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[’']/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\b(show|me|the|please|pull|up|card|datasheet|for|find)\b/g, " ").replace(/\s+/g, " ").trim();
function distance(a: string, b: string) {
  let row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 0; i < a.length; i++) { const next = [i + 1]; for (let j = 0; j < b.length; j++) next.push(Math.min(next[j] + 1, row[j + 1] + 1, row[j] + Number(a[i] !== b[j]))); row = next; }
  return row[b.length];
}
export function rankUnits(query: string, units: CatalogueUnit[]) {
  const q = normalize(query).slice(0, 120); if (!q) return [];
  return units.map(unit => ({unit, score: Math.max(...[unit.name, ...(unit.aliases || [])].map(name => {
    const n = normalize(name); if (n === q) return 1;
    if (n.replace(/s\b/g, "") === q.replace(/s\b/g, "")) return 0.97;
    if (n.includes(q)) return 0.76 + 0.1 * q.length / n.length;
    return 1 - distance(q, n) / Math.max(q.length, n.length);
  }))})).filter(r => r.score >= 0.48).sort((a, b) => b.score - a.score);
}
