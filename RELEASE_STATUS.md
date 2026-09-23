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
