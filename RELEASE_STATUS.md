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

# Live release � Warhammer Data Cards identity, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 19
- Version ID: appgprj_6aa33e6481d08191afbb08599691d2a2~appgver_5cd3d9633c9481918fb9ca1888500b93
- Deployment: appgdep_6ab415c1fd4c819183b6e54c91279eb8 � succeeded, 18:09:29 UTC
- GitHub source: e7deca442e5f480c59c0f4c3d14c74fa9ef7e968
- Hosting source: 7d6e2db4cf04cc0bfc15a44b4eab55437989a325
- Matching app tree: b3af8014ca111c1452bc4e28db91217dc9cc6004

App renamed Warhammer Data Cards in header, metadata and manifest. Original winged skull/shield SVG mark plus 180px Apple and 192/512px PWA PNG assets. Existing URL and storage keys preserved. Home battlefield adds staggered artillery descent/impacts/smoke/debris, full-width tank crossing and animated infantry. Shared metal frames extend to actions, saved slots, unit/rule tiles and roster dialogs while retaining faction colours. Pause includes every moving element; reduced motion disables all battlefield animation.

TypeScript and production build passed. Local browser verified 1180x820 and 800x400 layouts, no horizontal overflow, renamed document title, Apple icon metadata, active animation transforms, pause across shells/tank/legs, saved-army loading and compact Custodian Guard card image. Native deployment succeeded. Physical iPad and installed Home Screen icon refresh untested. No gameplay/data/storage changes. Windows packaging fallback used after source workflow push.

---

# Live release � landscape images and command menu, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 18
- Version ID: appgprj_6aa33e6481d08191afbb08599691d2a2~appgver_098b0157c7e48191a75a088f8d52bfc3
- Deployment: appgdep_6ab41367775c8191a738baedca7aa4ea � succeeded, 17:59:22 UTC
- GitHub application source: caaccfa90a3717aa4a19ddcfbda63df7d3d7334c
- Hosting source: 16f833d346d1a0c37bc30b3b419f5bcdcd9383e8
- Matching application tree: 89836027d83bb41411cd34fe3eb5f8ce6651823a

Landscape unit images now scale instead of disappearing below 850px. Portrait omits banner images. Removed fullscreen UI and home flavour copy; Home Screen standalone support remains. Original vector ruined battlefield animation, shield/blade menu emblems, pause control and reduced-motion support. No gameplay or storage changes.

Validation: TypeScript and production build passed. Browser checked 1180x820, 800x400 and 820x1180; landscape image loaded without horizontal page overflow, all weapon rows visible at iPad size, portrait hides image, menu pause and both navigation links work. Published menu, Saved Armies screen and Allarus lookup/image verified. Physical iPad untested. Native Windows packaging fallback used after workflow source push; pushed source and artifact tree match.

---

# Live release — separate allied armies, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 17
- Deployment: appgdep_6ab4100b651c819186e42942f5b45aa5 — succeeded, 17:45:07 UTC
- GitHub application source: 2b5881b2ea2b91d2fe197d541582dc4d5b0ec5f6
- Hosting source: 93127c7bf03faa48506164f2403959a92de8cdd6
- Matching application tree: c292f32b0900754ef3091aaad090399139948ad8

Native faction metadata verified from 11th-edition datasheet faction keywords. GSC source index comprises 25 native, 100 Astra Militarum and 14 Tyranid entries. Native builders and general lookup exclude allied source duplicates. Explicit allied rosters have separate selection lists and sidebar army selectors. Legacy selections migrate without loss. Named saves retain allied lists. Save/Edit/army management removed from viewer sidebar and available on selection screens.

Photos: native GSC 25/25. Astra Militarum 31/135 (nine reused verified assets plus 22 new photographed models). Remaining 104 entries still unverified; full photo request is NOT complete. Retailer APIs returned HTTP 429, archived gallery HTTP 403; accessible galleries were visually audited, rejecting packaging and mismatched variants. Exact missing list: prototype/data/IMAGE_COVERAGE.md.

Validation: full automated suite, native faction/legacy migration/idempotency tests, TypeScript and production build. Browser at 1180x820 confirmed 25-unit native GSC builder, adding Astra Militarum separately, saving/reloading both groups, isolated allied sidebar and Yarrick photograph, and zero sidebar management buttons. Physical iPad untested.

---

# Live release — compact card content, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 16
- Deployment: appgdep_6ab40b5e02e88191a97ea192b604a09c — succeeded, 17:25:18 UTC
- GitHub application source: 995b71c04d0cf3ed1b8c4864ce27ddd37f50f314
- Hosting source: f92c556dc9d7239e46339727cfb1dd0872128d0a
- Matching application tree: 04fa75eb2367db5bb27ef51c81d436f7ec4450a8

Source dates/cache disclosure/refresh moved to header in both viewers. Smaller responsive banner, stats and keywords; army-management controls collapsed. Weapons/abilities body receives priority. Themed illustrative navigation icons and exact-source effect highlighting retain conditions.

Validation: TypeScript, existing suite, source-preservation test across 16,338 rule strings and production build passed. Browser checks at 1024x471: card body 252px of 405px card (62%), keywords 24px. At 1180x820 all Allarus ranged and melee rows visible. Talons sheet verified highlighted Feel No Pain and roll modifier within full conditions. Physical iPad not tested.

Research: Wahapedia 11th-edition Custodes page and official Warhammer detachment coverage checked on 23 September. No consistent official detachment icon collection identified; app icons explicitly illustrative.

---

# Live release — saved armies, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 15
- Deployment: appgdep_6ab4087dee188191909073bcc14cada3 — succeeded, 17:12:54 UTC
- GitHub application source: 0e0a364c4d02c33f22315ee284abc0cebdbbef74
- Hosting source: b49d685d043dbc38e9e028a7e9a5f61ccfd06c73
- Matching application tree: dd13bc260e244dc688e343e9a1dab4156871c4c1

Game Data Cards opens on Saved Armies with four named local slots. Save after building/importing or from the viewer. Occupied-slot replacement requires confirmation; switching armies restores roster selections and loads cached cards. Existing faction drafts remain preserved.

Validation: full test suite, saved-army slot/reload/isolation/storage-failure tests, TypeScript and production build passed. Browser at 1180x820: build selection, name and save a slot, reload, load saved army and verify Custodian Guard card displayed. Physical iPad remains untested.

---

# Live release — grouped rule sheets, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 14
- Deployment: appgdep_6ab4062e98348191aff87dfe9391bc6d — succeeded, 17:03:02 UTC
- GitHub application source: c2a0c29cc8ed059a1c98abf2cff7180a694671e9
- Hosting source: 5880cf8c8db9f249b55fc471532a2308723697ec
- Matching application tree: d1b7c070971dba0b7dac6295f1c620a0c08585fa

Both viewers now contain sidebar and sheet scrolling independently. Selecting a new card resets its body to the top. Army/detachment sheets group their own stratagems with source CP/category/timing metadata, coloured rails and diamond badges. No individual stratagem sidebar buttons remain. All 23 faction snapshots refreshed from their 11th-edition sources.

Validation: full automated suite, TypeScript and production build passed. Interactive 1180x820 landscape preview confirmed two-column stratagem layout, sidebar scrolling while sheet stayed at top, sheet scrolling independently, and switching detachments reset the sheet while retaining sidebar scroll position. Native deployment succeeded. Physical iPad testing remains outstanding.

---

# Live release — viewer and rules cards, 23 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 13
- Deployment: appgdep_6ab3db7c43a08191b9cbcca2882b9553 — succeeded, 14:00:53 UTC
- GitHub application source: 16dc489de4f233f69ea9754566f58c451e037601
- Hosting source: cf1dc9cbd829943f67b8959aeefe322c3306e99d
- Matching application tree: 8edafca553ec768b3295f0c62739eadd75f9d6e3

Versus removed. Both card viewers expose shared army/detachment/stratagem reference cards with distinct sidebar tiles, detachment-specific stratagem lists, source dates, session caching and refresh. Custodes and Cult source snapshots refreshed from 11th-edition Wahapedia on 23 September.

Photo references total 318. Custodes 31/31 and native GSC coverage complete, including the Venerable Contemptor. The Hand Flamers card uses its demolition-charge member with an explicit photo caption. GSC's extended index has 42/139 photos; 97 allied entries remain missing. See IMAGE_COVERAGE.md.

Validation: TypeScript, existing viewer tests, new rule-card isolation/cache/refresh tests, production build; local home/lookup/game-cards returned 200 and removed Versus returned 404. Native deployment succeeded. Interactive browser checks were blocked by unreachable local preview in the browser tool; real iPad touch/voice/fullscreen validation remains outstanding.

---

# Live release — sidebar update, 16 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 12
- Deployment: appgdep_6aaa702bfd4c8191af5b610e1e5a8932 — succeeded, 10:32:24 UTC
- GitHub application source: b22e09318cf7bb94e97647552c5370cef1658a8a
- Hosting source: 1fac60b0ecf7d12f7a9432b21f2eb89e420caead
- Matching application tree: c8fd6d8f20d77f7a95f6e245abcee39e8b185b92

Game Data Cards now uses the lookup layout with a collapsible saved-card sidebar and compact thumbnail switching. Field Cards uses a direct main-menu link.

Validation: TypeScript, existing automated suite and production build passed. Published home, lookup, game-cards and versus routes returned successful responses with updated home navigation. Interactive iPad/browser testing was not performed for this release.

# Previous release — 16 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 11
- Deployment: appgdep_6aaa66a0330881918f3d0458b454b923 — succeeded, 09:51:47 UTC
- GitHub application source: 17f098c0829a389b2ee4539a69ccc971403ac1cb
- Hosting source: 67f911473f5ef9d9c6349c83668981003ec196f4
- Matching application tree: 5506f0ce42cceb12452cf7a5e6eeb38838464cda

Latest additions: Game Data Cards home tile and army selection/import flow; persistent downloaded cards and previously used ordering; full-width card switching via thumbnail strip; animated collapsible lookup search; larger shared model photos. Permanent photo references now total 302. See DESKTOP_HANDOVER.md for continued work on another PC.

Latest validation: TypeScript, full existing automated suite, production build, image provenance/hash audit. Browser checks at 1180×820 covered selecting two Custodes cards, loading and switching, reopening the saved army/cards after reload, dated cached-source warning, and lookup collapse/expand preserving the card and typed search. Long rules remain accessible through internal scrolling.

Previous release features retained: 23 main army choices; automatic 50/50 VS transition; selectable weapon applicability and critical-roll reminders; extended manual modifiers; unit/faction/stratagem/enhancement source reminders; older saved rule-pack upgrade; touch layout with weapon context and collapsed source references. The release workflow is recorded in prototype/AGENTS.md.

Validation: TypeScript, existing automated suite, production build, photo reference hashes; browser flow at 1180×820 from attacker/defender selection through automatic VS, cover and attack results.

## Still unfinished

- Complete photographic coverage for all requested regular armies: see IMAGE_COVERAGE.md. Missing photographs are explicitly unavailable, not replaced with box art or another miniature.
- Arbitrary unit/faction prose is not automatically calculated. Selectable reminders and manual adjustments are available; dice, casualties, rerolls and damage allocation remain manual.
- Terrain, range, movement, charge and attached-unit eligibility still require players to confirm table conditions.
- Long datasheets and condition lists can scroll inside their panels. A blanket no-scroll guarantee would hide rules or make text too small.

Pull GitHub main on another PC before making changes. The root release-report commit may differ from the application-source commit above without changing the deployed application tree.
