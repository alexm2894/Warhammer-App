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
};
export function factionStyle(faction: string): CSSProperties {
  const palette = factionPalette[faction] || { base: "#34474e", accent: "#b7ccd3" };
  return { "--faction-base": palette.base, "--faction-accent": palette.accent } as CSSProperties;
}
