import { parseHTML } from "linkedom";
import type { CatalogueUnit, UnitCard } from "./types";
const clean = (value: string | null | undefined) => (value || "").replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
function plain(element: Element | null): string {
  if (!element) return "";
  const copy = element.cloneNode(true) as Element;
  copy.querySelectorAll("script,style,.tooltip_templates").forEach(e => e.remove());
  copy.querySelectorAll("br,.dsLineHor").forEach(e => e.replaceWith("\n"));
  copy.querySelectorAll("ul,ol").forEach(e => e.prepend("\n"));
  copy.querySelectorAll("li").forEach(e => { e.prepend("• "); e.append("\n"); });
  copy.querySelectorAll("td,th").forEach(e => e.append(" "));
  copy.querySelectorAll("tr").forEach(e => e.append("\n"));
  return clean(copy.textContent);
}
export function parseCatalogue(html: string, factionSlug: string, faction: string): CatalogueUnit[] {
  const { document } = parseHTML(html);
  const prefix = `/wh40k11ed/factions/${factionSlug}/`;
  const found = new Map<string, CatalogueUnit>();
  document.querySelectorAll(".armylist_header").forEach(header => {
    header.parentElement?.querySelectorAll("a[href]").forEach(anchor => {
      const path = anchor.getAttribute("href") || "";
      const slug = path.slice(prefix.length);
      if (!path.startsWith(prefix) || !/^[A-Z][A-Za-z0-9-]+$/.test(slug)) return;
      const name = plain(anchor); if (!name) return;
      const id = `${factionSlug}/${slug}`;
      found.set(id, {id, name, faction, url: `https://wahapedia.ru${path}`});
    });
  });
  return [...found.values()];
}
function readSizes(root:Element):NonNullable<CatalogueUnit['sizes']>{
 const sizes:NonNullable<CatalogueUnit['sizes']>=[];let from=1,to:number|null=null;
 for(const row of root.querySelectorAll('table tr')){
  const header=row.querySelector('.dsUnitCostHeader')?.textContent||'';
  if(header){const nums=[...header.matchAll(/\d+/g)].map(m=>Number(m[0]));from=nums[0]||1;to=nums[1]??(/\+/.test(header)?null:nums[0]||null);}
  const price=row.querySelector('.PriceTag');if(!price)continue;
  const label=row.querySelector('td')?.textContent?.trim()||'',m=label.match(/^(\d+)\s+models?$/i);
  const composition=!m&&label.split(/,\s*/).every(part=>/^\d+\s+[A-Za-z]/.test(part));if(!m&&!composition)continue;
  const points=Number(price.textContent?.trim());if(!Number.isFinite(points))continue;
  sizes.push({models:m?Number(m[1]):[...label.matchAll(/(?:^|,\s*)(\d+)/g)].reduce((n,m)=>n+Number(m[1]),0),points,from,to,...(!m?{label}:{})});
 }
 return [...new Map(sizes.map(s=>[JSON.stringify(s),s])).values()];
}
export function parseCard(html: string, unit: CatalogueUnit, retrievedAt = new Date().toISOString()): UnitCard {
  const { document } = parseHTML(html);
  if (!unit.url.startsWith("https://wahapedia.ru/wh40k11ed/") || !/Warhammer 40,000 11th edition/i.test(document.querySelector('meta[name="description"]')?.getAttribute("content") || "")) throw Error("The source is not verified as 11th edition. It was not imported.");
  const root = document.querySelector(".dsOuterFrame");
  if (!root) throw Error("The source did not contain a supported datasheet.");
  const name = clean(root.querySelector(".dsH2Header > div")?.textContent);
  if (!name || name.toLowerCase() !== unit.name.toLowerCase()) throw Error("The source returned a different unit. The card was not updated.");
  const profiles = [...root.querySelectorAll(".dsProfileWrap")].map(profile => ({
    name: plain(profile.querySelector(".dsProfileName")),
    stats: [...profile.querySelectorAll(".dsCharWrap")].map(stat => ({label: plain(stat.querySelector(".dsCharName")).toUpperCase(), value: plain(stat.querySelector(".dsCharValue"))})),
  })).filter(profile => profile.stats.length);
  if (!profiles.length || profiles.some(p => p.stats.length !== 6 || p.stats.some(s => !s.value))) throw Error("The source characteristics could not be read completely.");
  const weapons: UnitCard["weapons"] = [];
  let kind: "ranged" | "melee" = "ranged";
  root.querySelectorAll(".wTable tr").forEach(row => {
    if (row.querySelector(".dsMeleeIcon")) kind = "melee";
    if (row.querySelector(".dsRangedIcon")) kind = "ranged";
    const nameCell = row.querySelector(".wTable2_short");
    if (!nameCell) return;
    const cells = [...row.children].filter(c => c.tagName === "TD");
    const nameIndex = cells.indexOf(nameCell);
    const values = cells.slice(nameIndex + 1).map(c => plain(c));
    if (values.length !== 6 || values.some(v => !v)) throw Error("A weapon profile is incomplete. Check the source datasheet.");
    const keywords = [...nameCell.querySelectorAll(".kwb2, .kwbw")].map(k => plain(k));
    const copy = nameCell.cloneNode(true) as Element;
    copy.querySelectorAll(".kwb2, .kwbw").forEach(k => k.remove());
    weapons.push({name: plain(copy), kind, keywords, range: values[0], attacks: values[1], skill: values[2], strength: values[3], ap: values[4], damage: values[5]});
  });
  if (!weapons.length) throw Error("No supported weapon profiles were found.");
  const sections: UnitCard["sections"] = [];
  const right = root.querySelector(".dsRightColFlat, .dsRightСol"); // Source uses a Cyrillic capital C.
  if (!right) throw Error("The abilities section could not be read.");
  right.querySelectorAll(".dsCoreArmy tr").forEach(row => { const title = plain(row.querySelector(".dsCoreArmyLabel")); const value = plain(row.querySelector(".dsCoreArmyValue")); if(title && value) sections.push({title, paragraphs: [value]}); });
  let current: UnitCard["sections"][number] | null = null;
  for (const child of [...right.children]) {
    if (child.classList.contains("dsHeader")) { current = {title: plain(child), paragraphs: []}; sections.push(current); }
    else if (current) { const value = plain(child); if (value) current.paragraphs.push(value); }
  }
  const wargear: string[] = [];
  const left = root.querySelector(".dsLeftColFlat, .dsLeftСol");
  let collecting = false;
  for (const child of [...(left?.children || [])]) {
    if (child.classList.contains("dsHeader")) { collecting = plain(child) === "WARGEAR OPTIONS"; continue; }
    if (!collecting) continue;
    if (child.tagName === "UL") for (const li of [...child.children]) { const value = plain(li); if(value) wargear.push(value); }
    else {const value = plain(child); if(value) wargear.push(value);}
  }
  return {...unit, name, sizes:readSizes(root),pointsRetrievedAt:retrievedAt, profiles, weapons, sections: sections.filter(s => s.paragraphs.length), wargear,
    invulnerableSave: plain(root.querySelector(".dsCharInvulValue")),
    invulnerableCondition: plain(root.querySelector(".dsInvulComment")).replace(/^\*\s*/, "") || (plain(root.querySelector(".dsCharInvulText")).includes("*") ? "Conditional save — check source" : ""),
    keywords: plain(root.querySelector(".dsLeftСolKW")).replace(/^KEYWORDS:\s*/i, ""),
    factionKeywords: plain(root.querySelector(".dsRightСolKW")).replace(/^FACTION KEYWORDS:\s*/i, ""),
    source: {url: unit.url, retrievedAt, parserVersion: 3, edition: 11, mode: "live"}};
}
