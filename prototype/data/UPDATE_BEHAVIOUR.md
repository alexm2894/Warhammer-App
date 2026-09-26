# Data updates

The main menu checks once per 24 hours after a successful full check. Failed checks back off for one hour; the manual button can retry immediately. Checks run only while the menu is open. Cancellation/navigation aborts pending work; fetched cards and rules are staged until a single IndexedDB transaction commits. Existing on-screen games do not subscribe to the new data.

Each check retrieves the supported factions' unit lists from Wahapedia, retaining old IDs for saved-army compatibility. The HTML fragment is accepted only with its 11th-edition parent page and matching collated-datasheet link; mixed-edition links are rejected. New units must belong to an allowlisted faction and be found in its index before the card API opens them. Existing native-faction annotations and model images are preserved. Newly discovered units have no invented model photo; new photographs and completely new factions still need a curated app release.

Saved army slots, allied selections, draft rosters and pasted exports are never rewritten by the updater. It refreshes all locally stored/session cards plus selected units in saved armies and drafts, and those factions' army/detachment/stratagem packs. Successful cards also update their dated roster size/points metadata. Other units' bundled roster costs retain their original verification date.

Only live verified 11th-edition cards and rule packs replace previous records. Fallback snapshots and warnings are reported as failures, not a successful fresh check. Valid parts of a partial check may be committed; failed parts retain prior copies and remain listed under update issues. The last full-check date advances only when every requested task succeeds. Checking Wahapedia does not independently verify that it contains every official erratum.

Storage migrates the existing card library from version1 to2 by adding an updates store; cards and all army-slot keys remain intact. A transaction failure rolls back the staged batch. The last-attempt timestamp is recorded separately to prevent repeated automatic network attempts. Current published image metadata wins when merging stored unit lists.

Validation: daily boundary/failure backoff/stale-source rejection tests; existing regression suite; TypeScript/build; real Astra Militarum and Genestealer list refresh; complete 30-item browser check; persistence after reload; cancellation; saved army slots/card reopening.
