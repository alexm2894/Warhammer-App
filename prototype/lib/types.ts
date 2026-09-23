export interface UnitImageReference {caption?:string;url:string;source:string;originalUrl?:string;sha256?:string;credit:string;kind:'miniature';background:'white'|'transparent';verifiedAt:string}
export interface CatalogueUnit { id: string; name: string; faction: string; url: string; aliases?: string[]; sizes?:import('./roster').SizeCost[]; pointsRetrievedAt?:string; image?:UnitImageReference }
export interface UnitCard extends CatalogueUnit {
  profiles: {name: string; stats: {label: string; value: string}[]}[];
  weapons: {name: string; kind: "ranged" | "melee"; keywords: string[]; range: string; attacks: string; skill: string; strength: string; ap: string; damage: string}[];
  sections: {title: string; paragraphs: string[]}[];
  wargear: string[];
  invulnerableSave: string;
  invulnerableCondition?: string;
  keywords: string;
  factionKeywords: string;
  source: {url: string; retrievedAt: string; parserVersion: number; edition: number; mode: "live" | "snapshot"};
  warning?: string;
}
