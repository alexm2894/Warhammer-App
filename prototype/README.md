# Field Cards — Warhammer Companion

## Start on a new PC

Install Node.js 24 LTS (Node 22.18+ is supported), npm and Git. From the repository root:

```sh
cd prototype
npm ci
npm run dev
```

Open http://localhost:5173. The default execution profile is portable; no Sites plugin or API credentials are required for local preview. The local sign-in mock is for development only. Live datasheets and missing test samples require access to Wahapedia. Local browser drafts and sessions are device/origin-specific and are not transferred by Git.

## Verify changes

```sh
npm run lint -- --max-warnings 0
npm run typecheck
npm test
npm run build
```

The first test run downloads two public source-page samples into ignored `.sites-runtime/`. Later runs reuse them. A download failure is reported as a failure; tests are not silently skipped. To check a running preview's API, run `node scripts/verify.mjs --http`. Canonical card snapshots and their retrieval dates are not rewritten by test setup.

## Application

Home, Lookup and Versus share datasheet search, parsing and caching. The catalogue has 694 entries across eight factions. Versus supports one or two players on each side, army and detachment selection, roster building/reviewed text import, attacker/defender selection, one weapon profile at a time, confirmed conditions and roll-target summaries. It is not a complete rules engine, roster-legality validator or casualty simulator.

Browser speech, actual iPad touch/fullscreen behaviour and gaming-room speech accuracy still need device testing. Typed lookup remains available. See AGENTS.md for design and source-verification requirements and PROTOTYPE.md for development history; later notes supersede earlier scope descriptions.

## Repository contents

Source, lockfile, scripts, catalogue, dated snapshots, source assets and non-secret hosting configuration belong in Git. Dependencies, builds, downloaded samples, credentials, local environment files and browser data do not. The root repository contains ordinary files under `prototype/`: do not initialize or embed a second Git repository there.

GitHub stores this source backup. Pushing to GitHub does not publish changes to the existing Sites app.
