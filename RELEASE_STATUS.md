# Live release — 13 September 2026

- URL: https://warhammer-field-cards.alexm2894.chatgpt.site
- Sites version: 10
- Deployment: appgdep_6aa6eea46a648191a9fd914d15e0cf2b — succeeded, 18:43:04 UTC
- GitHub application source: ceee1e994ae0b5edc14fc47f1a27aae9879db745
- Hosting source: aabecea5db9b6b3beec22b2e9e8f1ccc17ab9786
- Matching application tree: 242a833ff6fc3a9862862e7e823a9b138b6bc7d4

Included: 23 main army choices; permanent model-only photographs for 271 catalogue entries, including datacards and search results; automatic 50/50 VS transition; selectable weapon applicability and critical-roll reminders; extended manual modifiers; unit/faction/stratagem/enhancement source reminders; older saved rule-pack upgrade; touch layout with weapon context and collapsed source references. The release workflow is recorded in prototype/AGENTS.md.

Validation: TypeScript, existing automated suite, production build, photo reference hashes; browser flow at 1180×820 from attacker/defender selection through automatic VS, cover and attack results.

## Still unfinished

- Complete photographic coverage for all requested regular armies: see IMAGE_COVERAGE.md. Missing photographs are explicitly unavailable, not replaced with box art or another miniature.
- Arbitrary unit/faction prose is not automatically calculated. Selectable reminders and manual adjustments are available; dice, casualties, rerolls and damage allocation remain manual.
- Terrain, range, movement, charge and attached-unit eligibility still require players to confirm table conditions.
- Long datasheets and condition lists can scroll inside their panels. A blanket no-scroll guarantee would hide rules or make text too small.

Pull GitHub main on another PC before making changes. The root release-report commit may differ from the application-source commit above without changing the deployed application tree.
