# Desktop handover — 16 September 2026

GitHub `main` is the canonical source. Pull before editing on another PC. The application is in `prototype/` within this repository; run `npm ci` there, then `npm run dev`. Local development uses port 5173. The original public URL is recorded in RELEASE_STATUS.md; localhost is only a preview.

## Latest completed implementation

- Home now offers Data Cards, Game Data Cards, and Versus.
- Lookup has an animated narrow search rail with a large expand button, preserving the current card and search state.
- Shared cards show larger model photographs.
- Game Data Cards lets players choose an army, select cards through the shared builder, or upload/paste a Warhammer app text export and review it before replacing the selection.
- Selected cards preload through the shared loader and are retained in IndexedDB. A top strip of named model thumbnails switches the full card below it. Previously used units sort first when preparing that army again.
- Custodes and Genestealer Cults lead the army list. Army choices and imported drafts persist locally; they do not sync between PCs through GitHub. Saved cards retain their source date and Refresh control. This is not a promise that the whole website works offline.
- Permanent photographs and their provenance are versioned with the app. IMAGE_COVERAGE.md records the exact remaining gaps. The known autopistol image was removed from the hand-flamer variant to avoid misidentifying its weapons.

## Remaining scope from earlier requests

- Complete all missing regular-army photographs listed in IMAGE_COVERAGE.md. Custodes currently has 29/31 entries; Knight-centura and Venerable Contemptor remain. Genestealer counts include allied datasheets, not just native Cult units. A correct hand-flamer variant photograph still needs verification.
- Rules prose not supported by typed calculations stays visible as manual reminders; a working dice/casualty/damage system is future work. Never silently infer rules from prose.
- Maintain the 11th-edition Wahapedia verification rule and iPad-first layout in prototype/AGENTS.md. No gameplay values were changed by the latest card-library UI work.

Release source, deployment status, and validation evidence are recorded separately in RELEASE_STATUS.md. Do not assume an unrecorded local build has been published.
