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
