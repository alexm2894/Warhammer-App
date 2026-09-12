import catalogue from "@/data/catalogue.json";
import snapshots from "@/data/snapshots.json";
import {parseCard} from "@/lib/wahapedia";
import type {UnitCard} from "@/lib/types";
const cache = new Map<string, {card: UnitCard; }>();
const pending = new Map<string, Promise<UnitCard>>();
async function retrieve(id: string): Promise<UnitCard> {
  const unit = catalogue.find(u => u.id === id);
  if (!unit) throw Error("Unknown unit.");
  const cached = cache.get(id);
  if(pending.has(id)) return pending.get(id)!;
  const work: Promise<UnitCard> = (async (): Promise<UnitCard> => {
    try {
      const response = await fetch(unit.url, {headers: {Accept: "text/html"}, signal: AbortSignal.timeout(12000), redirect: "manual"});
      if (!response.ok) throw Error(`Source returned ${response.status}`);
      const html = await response.text();
      if (html.length > 4_000_000) throw Error("Source page exceeded the supported size.");
      const card = parseCard(html, unit);
      if(cache.size >= 60) cache.delete(cache.keys().next().value!);
      cache.set(id,{card});
      return card;
    } catch (error) {
      console.warn("Wahapedia import unavailable", unit.id, error instanceof Error ? error.message : "Unknown error");
      const fallback = cached?.card || snapshots.find(c => c.id === id) as UnitCard | undefined;
      if (fallback) return {...unit,...fallback,image:unit.image,source:{...fallback.source,mode:"snapshot"},warning:"Wahapedia couldn’t be refreshed. Showing a saved 11th-edition copy, not a fresh verification; check its retrieval date below."};
      throw Error("An 11th-edition datasheet could not be verified. No older-edition card has been substituted. Please retry or check Wahapedia.");
    } finally {pending.delete(id);}
  })();
  pending.set(id,work); return work;
}
export async function GET(request: Request) {
  const url = new URL(request.url), id = url.searchParams.get("id") || "";
  if (!catalogue.some(u => u.id === id)) return Response.json({error:"This unit isn’t in the prototype index."},{status:404});
  try { return Response.json(await retrieve(id),{headers:{"Cache-Control":"no-store"}}); }
  catch(error) {return Response.json({error:error instanceof Error ? error.message : "The card couldn’t be loaded."},{status:502});}
}
