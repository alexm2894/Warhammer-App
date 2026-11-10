# Adeptus Custodes â€” 10 November 2026
Checked the [native datasheet index](https://wahapedia.ru/wh40k11ed/factions/adeptus-custodes/datasheets.html) and [faction rules](https://wahapedia.ru/wh40k11ed/factions/adeptus-custodes/). The index contains 27 standard cards, two Forge World and seven Legends. The edition was checked on each card's book marker. Each packaged card records its individual source URL, book, and retrieval timestamp. The army page lists the October 2026 app update (v2.8.1).

Old and current URLs can differ **only in capitalisation** and both may still serve a datasheet. Preserve existing roster identifiers where the mapping is unambiguous, but fetch the exact URL in the current index. Never use the old Dread Foe profile as the Achillus fallback. The four split datasheets require the player to select the correct replacement when opening a saved army.

To repeat the import, download the two linked HTML pages freshly, run `node scripts/import-custodes.mjs <datasheets.html> <faction.html>`, then review the changed source, points and regression checks before release.
