# Live release — 16 September 2026

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
