import type { CSSProperties } from "react";

// UI identifiers inspired by faction imagery, not universal army paint schemes.
export const factionPalette: Record<string, { base: string; accent: string }> = {
  "Adeptus Mechanicus": {base:"#743d23",accent:"#f1ac7c"},
  "Adeptus Custodes": { base: "#624817", accent: "#e3bc59" },
  "Space Marines": { base: "#173f78", accent: "#80baff" },
  "Necrons": { base: "#21512d", accent: "#8dde70" },
  "Genestealer Cults": { base: "#50316d", accent: "#c9a0ed" },
  "Tyranids": { base: "#682a51", accent: "#efa0d2" },
  "Imperial Agents": { base: "#712d32", accent: "#f0a19a" },
  "Imperial Knights": { base: "#245661", accent: "#88d0dc" },
  "Chaos Space Marines": { base: "#592e27", accent: "#d9a46a" },
  "Adepta Sororitas": {base:"#692d42",accent:"#f0a3ba"},
  "Astra Militarum": {base:"#454d2a",accent:"#c3d08c"},
  "Grey Knights": {base:"#485362",accent:"#d3dfef"},
  "Chaos Daemons": {base:"#64234e",accent:"#eea1d6"},
  "Chaos Knights": {base:"#503c33",accent:"#d9b99d"},
  "Death Guard": {base:"#495323",accent:"#c1d681"},
  "Emperor’s Children": {base:"#662b65",accent:"#eda7eb"},
  "Thousand Sons": {base:"#185a69",accent:"#87dce9"},
  "World Eaters": {base:"#752a23",accent:"#f6a99b"},
  "Aeldari": {base:"#286057",accent:"#a0e4d7"},
  "Drukhari": {base:"#254e4c",accent:"#7dd9c8"},
  "Leagues of Votann": {base:"#67502a",accent:"#f0cf88"},
  "Orks": {base:"#3d581f",accent:"#b6e473"},
  "T’au Empire": {base:"#745224",accent:"#ffd58b"},
};
export function factionStyle(faction: string): CSSProperties {
  const palette = factionPalette[faction] || { base: "#34474e", accent: "#b7ccd3" };
  return { "--faction-base": palette.base, "--faction-accent": palette.accent } as CSSProperties;
}
