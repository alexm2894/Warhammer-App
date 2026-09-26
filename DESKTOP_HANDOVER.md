# Live release - daily and manual data updates, 26 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 21
- Version ID: appgprj_6aa33e6481d08191afbb08599691d2a2~appgver_94dee6ab31388191bbb69928ac0cc013
- Deployment: appgdep_6ab7d3211bd481918589a80f4d8ea8b0 - succeeded, 14:14:12 UTC
- GitHub source: 18d17bcba88c1450020fc040edb01d04fcf1e196
- Hosting source: ef49a4245850e31bd50a42464804719899cd80fc
- Matching app tree: e5aebbc8db81b435576dfc05661a0eab8d99d979

Main menu Check for updates plus daily automatic check at the safe menu boundary. Refreshes supported faction lists, locally stored/session cards, saved/draft army selections and their faction rule packs. Dynamic units are verified against an allowlisted live index; allies retain native identity. Successful live card size/points metadata updates with its retrieval date. Fallback snapshots never replace good records during a batch check. Atomic IndexedDB commit, cancellation/navigation abort, per-item failures and last full-check timestamp. Saved army slot/draft keys unchanged. New photos and wholly new factions remain curated release work. See prototype/data/UPDATE_BEHAVIOUR.md.

Validation: full regression suite and new daily/backoff/stale-data policy tests passed, TypeScript and production build passed. HTTP verified five live cards, invalid-URL rejection, Astra Militarum and Genestealer live lists. Local browser completed a 30-item check, retained date on reload, cancelled another check, preserved both saved army slots and reopened refreshed Custodian Guard. Pointer automation did not activate existing or new buttons in this browser session; keyboard activation verified; physical iPad untested. Original publishing helper disappeared from the installed plugin path mid-turn; existing Sites tools remained available. Source pushed with a short-lived in-memory credential, current Worker build packaged in the previously verified archive structure, native deployment succeeded. Published menu completed a full data check at 15:15:10 local time and displayed the successful check date.

---

# Live release - Astra Militarum photos, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 20
- Version ID: appgprj_6aa33e6481d08191afbb08599691d2a2~appgver_959e09fe9bc081918d146566ab5fc495
- Deployment: appgdep_6ab43caaa0208191b1c9dd659fde42ec - succeeded, 20:55:30 UTC
- GitHub source: b5dbf71650d7a7be62091b062d0e00f2b9e1e9da
- Hosting source: bc9e6ce16ee6d679b6874a9d67bf0693a4309d45
- Matching app tree: cb1793933abf7e511c6e0732936e17ba58cc639f

Added 103 verified Astra Militarum photo mappings, increasing coverage from 31/135 to 134/135. Dominus Armoured Siege Bombard remains without a verified official miniature; no proxy supplied. Genestealer Cults remains 25/25. Photos are permanent local assets with provenance and hashes. Archived kits can be unpainted or lower resolution; Rein and Raus uses an explicitly captioned Rein photo. No gameplay or storage changes.

Validation: catalogue/file/hash/signature/provenance audit passed (464 mappings, 404 unique files, 43.82 MiB). TypeScript and production build passed. Local iPad-landscape browser verified Manticore image in banner/sidebar, saved-army loading and separate allied Astra Militarum list. Windows packaging fallback used after successful source push. Native deployment succeeded. Published home navigation, Manticore lookup and both model images verified loaded. Physical iPad untested.

---

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
