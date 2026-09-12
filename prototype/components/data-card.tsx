"use client";
import UnitImage from "@/components/unit-image";
import {Crosshair,Swords} from "lucide-react";
import type {UnitCard} from "@/lib/types";
import {factionStyle} from "@/lib/factions";
export default function DataCard({card,selected,onSelect}:{card:UnitCard;selected?:UnitCard["weapons"][number];onSelect?:(weapon:UnitCard["weapons"][number])=>void}){return <article className="datasheet" style={factionStyle(card.faction)}>
      <div className="card-banner"><div className="banner-copy"><span className="eyebrow">{card.faction} · {card.source.edition}TH EDITION</span><h2>{card.name}</h2><div className="profiles">{card.profiles.map((profile, i) => <div className="profile" key={i}>{profile.name && <p>{profile.name}</p>}<div className="stats">{profile.stats.map(stat => <div className="stat" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong>{stat.label === "SV" && card.invulnerableSave && <div className="header-invulnerable"><b>{card.invulnerableSave}</b><span>INVULNERABLE SAVE{card.invulnerableCondition && <small>{card.invulnerableCondition}</small>}</span></div>}</div>)}</div></div>)}</div></div><UnitImage key={card.id} unit={card}/></div>
      {card.warning && <p className="card-warning" role="alert">{card.warning}</p>}
      <div className="card-body" tabIndex={0} role="region" aria-label="Unit rules and weapons; scroll for longer datasheets"><div className="weapons-column"><WeaponTable weapons={card.weapons.filter(w => w.kind === "ranged")} kind="ranged" selected={selected} onSelect={onSelect}/><WeaponTable weapons={card.weapons.filter(w => w.kind === "melee")} kind="melee" selected={selected} onSelect={onSelect}/>{card.wargear.length > 0 && <section className="wargear"><h3>Wargear options</h3>{card.wargear.map((text, i) => <p key={i}>{text}</p>)}</section>}</div>
      <aside className="abilities-column">{card.sections.map((section, i) => <section key={i}><h3>{section.title}</h3>{section.paragraphs.map((text, j) => <p key={j}>{text}</p>)}</section>)}</aside></div>
      <footer className="card-keywords"><div><b>KEYWORDS</b><span>{card.keywords}</span></div><div><b>FACTION KEYWORDS</b><span>{card.factionKeywords}</span></div></footer>

    </article>;}
function WeaponTable({weapons, kind, selected, onSelect}: {weapons: UnitCard["weapons"]; kind: "ranged" | "melee"; selected?: UnitCard["weapons"][number]; onSelect?: (weapon: UnitCard["weapons"][number]) => void}) {
  if (!weapons.length) return null;
  return <section className="weapon-section"><h3>{kind === "ranged" ? <Crosshair size={18}/> : <Swords size={18}/>} {kind === "ranged" ? "Ranged weapons" : "Melee weapons"}</h3><div className="table-scroll"><table><thead><tr>{["Weapon", "Range", "A", kind === "ranged" ? "BS" : "WS", "S", "AP", "D"].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{weapons.map((w, i) => <tr key={i} className={selected === w ? "selected-weapon" : ""}><th scope="row">{onSelect ? <button className="weapon-pick" aria-pressed={selected === w} onClick={() => onSelect(w)}>{w.name}</button> : w.name}{w.keywords.length > 0 && <small>{w.keywords.join(" · ")}</small>}</th>{[w.range, w.attacks, w.skill, w.strength, w.ap, w.damage].map((v, j) => <td key={j}>{v}</td>)}</tr>)}</tbody></table></div></section>;
}
