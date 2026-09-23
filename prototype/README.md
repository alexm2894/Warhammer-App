# Field Cards

An iPad-first, landscape-friendly Warhammer 40,000 card viewer, also usable on desktop.

- **Datasheet lookup:** voice or text unit search, opened-unit sidebar and faction rule cards.
- **Game Data Cards:** build/import a local army roster, preload unit cards and switch cards through a collapsible sidebar.
- **Rule cards:** army and detachment sheets include their associated stratagems, with source timing colours and CP badges. The saved-card sidebar and displayed sheet scroll independently; selecting a new sheet starts at the top. Rule packs are cached for the browser session; Refresh retrieves source updates. Dates and fallback warnings remain visible.
- **Photographs:** permanent, verified miniature photos and provenance are in public/images/units and data/unit-images.json. The Hand Flamers unit photo depicts its demolition-charge model, identified in the photo caption.

Rules come from Wahapedia's 11th-edition pages. This viewer does not calculate attacks or validate army legality. Versus has been removed. Local roster/card storage is retained; personal saved armies do not sync through GitHub.

Run npm ci, npm run dev, npm run typecheck, npm test and npm run build from this directory. GitHub is canonical; follow AGENTS.md and the root release handover for publication.
