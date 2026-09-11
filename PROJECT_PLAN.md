# Warhammer companion app — proposed foundation

Updated 11 September 2026. The first prototype is implemented and privately published at https://warhammer-field-cards.alexm2894.chatgpt.site. User confirmed a 10.9-inch iPad Air described as from 2023, running the latest available iPadOS, and no access to a Mac. Exact generation and OS build remain unverified; do not assume an M1 chip from the purchase year alone. Internet access is expected throughout use. Intended for the user's local gaming group, primarily on one iPad; no public distribution planned.

## Product scope

Implementation update: the first prototype lives in `prototype/`. Added optional army/allied-faction selection for narrowing lookup and device session caching for every opened card. Cache reuse skips network retrieval, survives page reload where sessionStorage is available, and can be cleared for a new game. Individual cards can be refreshed explicitly. Browser speech is the initial recognition provider; actual iPad microphone trials and provider latency comparison remain outstanding. The initial catalogue covers the test factions plus Imperial Agents and Imperial Knights; five representative cards have validated snapshots and live API checks.

Initial prototype: tap a microphone button, name a unit, retrieve its Wahapedia-derived data and display a card matching the supplied visual reference. Include listening/loading/error states, a minimal typed fallback and ambiguity choices so lookup failures can be recovered. Faction browsing, recent units, favourites, saved squads, equipment editing, photo uploads, sync, dice and combat assistance are later features, not prototype acceptance requirements.

Initial test coverage: Adeptus Custodes (including Custodian Guard), Necrons, Space Marines and the user's “Genestealers” army. Clarify whether that means Genestealer Cults or Tyranids/Genestealers before selecting that catalogue. These are test priorities rather than an architecture limited to four units or factions. Long-term intent remains lookup across factions.

User said “Wikipedia” in the latest clarification; interpret this as Wahapedia based on the original explicit URL and source request, unless corrected.

Use the supplied Terminator Squad image as a layout reference: image header, characteristic tiles, ranged and melee tables, abilities, saves and keywords. Build responsive text and tables rather than a flat screenshot. Long rules must remain readable; landscape comparison cards should not shrink text excessively.

## Recommended platform

Begin with a React/TypeScript progressive web app (PWA), served over HTTPS, with a small TypeScript server for source ingestion and optional speech transcription. This supports iPad and Windows PC from one UI codebase. Cache parsed cards for speed; offline operation is not a prototype requirement. Add persistent IndexedDB storage when local personalisation is introduced, and app-shell caching when useful rather than making offline support a milestone.

Given the confirmed lack of Mac access, the initial development and delivery path is web-only from Windows. Open the HTTPS app in Safari and add it to the iPad home screen; use the same app in a PC browser. Native builds are an optional later investment, not an initial dependency. Record exact iPad generation and OS version during device testing, and test microphone permissions, speech, camera access and local inference in both Safari and home-screen mode.

Keep microphone/transcription, camera/vision and storage behind narrow interfaces. If device trials demonstrate a need, use Capacitor to package the UI as an iPad app and implement native speech or Core ML bridges. Native capabilities require actual plugin/native implementation and device testing; packaging alone does not add them. PC continues using the web version.

TestFlight distributes native beta builds; it is not required for microphone/camera access in a web app. Native iOS builds require Apple's Xcode/macOS toolchain (local or hosted), and TestFlight requires Apple Developer Program membership.

## Voice lookup

1. User taps to speak; the app requests microphone permission and shows listening state.
2. A transcription provider returns text. Compare the viable browser recognition path with online transcription on the target iPad; choose by measured end-to-end speed and name accuracy. The user authorises online recognition and prefers whichever route is fastest in practice. Do not assume either local or cloud recognition wins. Investigate a dedicated local model only if measurements justify the loading, memory and implementation cost.
3. Resolve against known unit IDs using canonical names, curated aliases, fuzzy matching and faction/army context. For example, map “Custodian Guards” to “Custodian Guard”. Never construct a URL directly from an arbitrary transcript.
4. Open a clear match or display a small candidate list. Display the transcript so mistakes are easy to correct.
5. Render the locally cached structured card, fetching missing data from our server.

Do not assume browser speech is offline or consistently supported. Offline voice and offline cards are not required. Measure time from end of utterance to correct visible card, including transcription, name matching and fetching; compare first-use and warmed-up runs in quiet and gaming-group noise, noting errors as well as typical and slow-case latency. Always-on wake words are deferred; push-to-talk is confirmed acceptable. Keep API secrets server-side and avoid storing recordings by default.

## Rules ingestion and presentation

Proposed flow: source catalogue -> server fetch -> source-specific parser -> schema validation -> versioned structured dataset -> local cache -> card renderer.

The supplied Wahapedia page exposes characteristics, weapons, abilities and wargear options. This supports a parser prototype, but one page does not establish all-faction reliability. No supported public API, automated-access permission or redistribution licence has been verified. Check these before committing to broad ingestion/public distribution; retain an adapter boundary for alternative authorised imports. Browser cross-origin fetching cannot be assumed to work. A server solves the technical fetching boundary, not source permissions.

Store source URL, edition, retrieval time, content hash and parser/schema versions. Distinguish our retrieval time from a verified source rules-update date. Validate required fields and flag incomplete cards; never replace good data with a broken parse. Keep last-known-good revisions and do not silently change a battle's rules revision. Use controlled refreshes, caching and backoff rather than fetching Wahapedia for every spoken command.

Store variable expressions such as D6 and 2D6 as structured expressions plus display text. Keep weapon profile alternatives, model-specific characteristics, wargear and linked ability references. Imported rule prose is display content; executable rule support must be implemented and tested explicitly.

## Data model

| Entity | Responsibility |
| --- | --- |
| UnitDefinition / UnitRevision | Stable ID, faction, edition, characteristics, composition, source, revision |
| WeaponProfile / Ability | Structured values, profile choices, keywords and source text |
| SavedSquad | User name, referenced unit revision, model groups/counts, selected equipment, photo reference |
| ImageAsset | Local blob or storage key, owner, origin, crop/focal point, attribution/permission metadata |
| Army | Saved squad references and faction/detachment context |
| BattleSession | Attacker/defender instances, wounds, modifiers, phase and pinned rules revision |
| RollEvent | Roll stage, per-die values, detection confidence, corrections and reroll history |

Represent equipment per model or equivalent model group; a single weapon field per squad is insufficient for mixed loadouts. Multiple saved squads may share one unit definition. Updating that definition triggers loadout revalidation rather than deleting user selections. Future imports and database migrations use explicit schema versions.

When personalisation is introduced, start local-first with IndexedDB and export/import backups. Local-only saving is explicitly acceptable for testing. Browser storage can be evicted, so persistence requests alone are not a backup. Add accounts, server database and image object storage when cross-device sync is needed. Cross-device compatibility remains desirable, but automatic data sync is deferred. Do not build an account system or personalisation database for the first lookup milestone; preserve stable IDs and a storage boundary for later additions.

Use placeholders or approved assets first. Later allow uploads, crop adjustment and reuse of stored images. Automatic web image selection is a separate enrichment service: verify identity and permitted use, retain origin metadata, and allow user confirmation. Photos must not determine game statistics.

## Dice recognition and combat assistance

Keep perception and rule resolution separate. Vision detects dice positions and top-face values (1–6), attaches confidence, and proposes a roll. The user confirms/corrects it; a deterministic rules engine consumes confirmed rolls and explicitly selected battle context. AI should not invent rules or silently select a weapon.

First experiment: a fixed camera over a contrasting tray, ordinary pip dice, controlled lighting and stationary dice. Measure whole-roll accuracy and latency using held-out real photos, including crowded rolls. Train a model elsewhere if needed, then run inference on the device. Start with still capture before continuous live video. Decorated faces, symbols replacing sixes, glare, overlaps and cocked dice require explicit handling. Uncertain dice must be highlighted rather than guessed. A live system must avoid submitting the same stationary roll repeatedly.

WebAssembly enables local CPU inference; WebGPU may accelerate a compatible runtime/model. Safari added WebGPU in version 26, but browser API availability does not establish ML runtime compatibility or acceptable performance. Benchmark the exact iPad/OS/model. Use native Core ML if its CPU/GPU/Neural Engine execution materially improves measured results.

Build battle assistance with manually entered dice before connecting vision. Begin with a declared subset of attacks and explicit weapon/model count and modifiers. Expand rule support incrementally. Two datasheets alone do not capture all battle context; unsupported abilities need a visible manual step. Preserve per-die events, rerolls and undo history, not just face totals.

## Delivery sequence and completion gates

1. Feasibility: confirm iPad/OS, test microphone in Safari and home-screen mode, test source access/parsing, render representative cards. Gate: a workable speech route and trustworthy import route.
2. Lookup prototype: push-to-talk, name matching, Wahapedia import and reference-style card renderer, with minimal typed recovery, cache and source/revision display. Gate: named units from the initial test set resolve correctly on the iPad, card fields match their source, text is readable, lookup latency is recorded, and failures are recoverable. PC browser compatibility is a secondary check. Later expand catalogue coverage and add browsing/favourites.
3. Personalisation: saved squads, model equipment, photos, backup/restore. Gate: personal data survives reload/export/import and rules refresh without loss.
4. Battle workspace: side-by-side units and deterministic assistance with manual dice. Gate: known examples pass and unsupported effects are surfaced.
5. Dice experiment: stationary tray capture, confidence overlays and correction. Gate: measured accuracy/latency on the user's actual equipment supports practical use.
6. Assisted live play: roll-stage tracking, duplicate prevention and confirmed results into battle logic. Gate: corrections, rerolls and undo work end-to-end. Decide on native packaging using measured results.

First implementation slice: say or type “Custodian Guard”, resolve the indexed unit, and display a validated cached card. Include several structurally different units in parser trials before scaling the catalogue.

## Open decisions

- Exact iPad generation and OS build to record during testing (10.9-inch Air from 2023/latest available OS reported; no Mac access confirmed).
- Whether “Genestealers” means Genestealer Cults or Tyranids/Genestealer units. Other confirmed test priorities: Custodian Guard/Adeptus Custodes, Necrons and Space Marines.
- Representative unit choices within the initial armies can be selected during prototype preparation; broad all-faction support is later expansion.

## Technical references

- [Example source datasheet](https://wahapedia.ru/wh40k10ed/factions/adeptus-custodes/Custodian-Guard)
- [Microphone/camera permission and secure contexts](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Browser speech recognition and support limitations](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [Safari 26 WebGPU support](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
- [ONNX Runtime Web execution choices](https://onnxruntime.ai/docs/tutorials/web/)
- [Core ML device execution](https://developer.apple.com/documentation/CoreML)
- [Capacitor iOS](https://capacitorjs.com/docs/ios)
- [Apple beta distribution](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
- [Browser storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
