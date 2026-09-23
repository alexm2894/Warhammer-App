# Priority army photo audit - 23 September 2026

- Astra Militarum: **134/135** native catalogue entries have verified assembled-miniature photographs (previously 31/135).
- Genestealer Cults: **25/25** native entries have verified photographs. Source-index allies are excluded.
- Added 103 Astra Militarum image mappings. Photos are permanent local assets with original URL, source, credit, verification date and SHA-256 in `unit-images.json`.

## Remaining exception

`astra-militarum/Dominus-Armoured-Siege-Bombard`: no official production miniature identified. No proxy or invented image supplied. Reference: https://wh40k.lexicanum.com/wiki/Dominus_Armoured_Bombard (checked 23 September 2026).

## Representation notes

Photos show assembled models, never packaging. Retired resin kits may be unpainted, and archived catalogue photographs can be lower resolution or greyscale. Preserve source badges and attribution. Rein and Raus uses a photo of Rein with a visible accessibility/tooltip caption identifying him as one member of the two-model unit. Ogryn Bodyguard uses a compatible assembled kit build; its caption identifies that representation. Some battery photographs show multiple teams. Commander variants can reuse their corresponding assembled kit photo.

Run `node scripts/audit-unit-images.mjs` to check local assets, file signatures, hashes, source metadata, catalogue consistency and priority-faction coverage. Unit lookup and Game Data Cards both take current image metadata from the catalogue, including for cached rules; saved armies need not be cleared.
