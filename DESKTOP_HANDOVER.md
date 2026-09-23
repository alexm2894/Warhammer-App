## Latest update � Warhammer Data Cards

Version 19 is live at the existing URL. New app identity/icon (including Apple/PWA PNGs), artillery/infantry/tank animation, shared command-frame button/tile styling. Home menu tiles preserved. GitHub e7deca4; exact IDs in RELEASE_STATUS.md. No storage-key migration. Existing installations may retain cached launcher names/icons until re-added. Photo backlog unchanged. Pull main before editing elsewhere.

## Latest update � landscape photos and command menu

Version 18 is live. Banner photos scale in landscape and hide in portrait. Fullscreen button and home flavour copy removed; themed animated vector battlefield and new menu emblems added, with pause/reduced-motion support. GitHub source caaccfa9. Release IDs and viewport verification in RELEASE_STATUS.md. Photo coverage work is unchanged: Astra Militarum still has 104 outstanding entries. Pull main before editing on another PC.

## Latest update — main and allied armies

Version 17 is live. Native faction ownership separates source-index allies. Explicit allied rosters and four saved slots preserve separate unit groups; selection menus own all management actions. GSC photo coverage 25/25, Astra Militarum 31/135; 104 photographs remain outstanding (prototype/data/IMAGE_COVERAGE.md). Do not report full AM coverage. GitHub app source 2b5881b; exact release IDs and checks in RELEASE_STATUS.md. Pull main before editing on another PC.

## Latest update — compact cards

Version 16 is live. Source and refresh now live in the top bar; card bodies take priority over headers and keywords at all landscape heights. Army tools collapse; rule icons and source-preserving effect highlights added. GitHub app commit 995b71c. See RELEASE_STATUS.md for exact release IDs and responsive checks. Pull main before editing elsewhere.

## Latest update — Saved Armies

Version 15 is live. Four named local saved-army slots are the first screen in Game Data Cards. Save and load selections with replacement confirmation, reusing the existing card cache. Personal armies remain device/browser-local. GitHub app commit 0e0a364; see RELEASE_STATUS.md for exact matching source and deployment IDs. Tests, type checks, build and browser save/reload/load flow passed.

## Latest update — 23 September 2026

Version 14 is live. GitHub app source c2a0c29 and hosting source 5880cf8 have identical app trees. Both viewers use independent sidebar/card scrolling and grouped army/detachment sheets containing their stratagems. Source timing colours, CP badges and source dates are retained. Full tests, type checks, production build and landscape browser checks passed. See RELEASE_STATUS.md for exact release IDs. Pull main before editing on another computer.

# Desktop handover — 23 September 2026

Pull GitHub main before editing. The app is in prototype/. GitHub is canonical; the hosting repository uses the same application tree at its root.

## Current product

- Two modes only: Datasheet lookup and Game Data Cards. Versus route, setup UI and battle resolver were removed at the user's request.
- Both modes share unit cards and new army/detachment/stratagem reference cards. Pick a faction in lookup, or use the prepared army in Game Data Cards. Tap a detachment card to select its stratagem list. Detachment preference persists locally; rule packs reuse a session cache and have explicit refresh.
- Collapsible sidebars retain selectable unit thumbnails and distinctive labelled rule tiles.
- Custodes and GSC rule snapshots were checked on Wahapedia on 23 September. Rules remain source prose, not executable combat effects.
- All 31 Custodes and all native GSC entries have model photos. GSC's extended allied index remains incomplete: 42/139 images overall. See IMAGE_COVERAGE.md. The Hand Flamers photo is a demolition-charge member, identified in the source caption.

## Validation and limits

TypeScript, automated viewer tests, Solar Spearhead stratagem/cache/edition tests and production build passed. Local home/lookup/game-cards routes returned 200; Versus returned 404. Interactive browser QA could not run because the browser tool reported an unreachable local preview. Test touch scrolling, collapsed rule labels, voice and fullscreen on the real iPad.

Publication details are recorded in RELEASE_STATUS.md.
