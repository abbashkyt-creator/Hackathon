# Tip Tap Games — Session Handoff (2026-08-15)

> **Give this to the next AI agent verbatim as the opening prompt.**
> Repo: `C:\Project C\Hackation` — full details below.

---

## COPY-PASTE PROMPT FOR THE NEXT AGENT

```
Continue Tip Tap Games in C:\Project C\Hackation. Read docs/SESSION-HANDOFF-2026-08-15.md
FIRST (this file), then docs/AI_AGENT_HANDOFF.md and README.md. Also read
docs/AUTO-INGEST-PIPELINE.md if it exists; if it does not, the pipeline details
are in scripts/auto/*.mjs (self-documenting).

MISSION (standing goal, set by the operator): "do all games literally 100% with
no exception" — ingest as many REAL Poki games as possible into the Tip Tap feed
using the automated intake pipeline, at the existing quality bar. The operator
has authorization from Poki for competition use. Do NOT use open-source/GitHub
games as substitutes — only the same/similar commercial sources (Poki CDN).

CRITICAL CURRENT STATE:
- ~34 games are registered in shared/catalog.ts and pass the release audit for
  existing games. 52 folders exist under public/games (some unregistered
  leftovers from an interrupted batch — audit which are complete before use).
- 68 modified/untracked files in git — NOT COMMITTED. Do not run `git clean`
  or `git checkout .` — it deletes the whole pipeline and all fixes.
- The auto-ingest pipeline lives in scripts/auto/ (ingest-game.mjs,
  ingest-batch.mjs, verify-game.mjs, discover-game.mjs, cleanup.mjs, lib/*).
  It is PROVEN: 6 games were ingested end-to-end and verified (domino, foosball,
  ludo-hero, moto-x3m, bubble-storm, spider-solitaire) in a previous session.
- The last batch run (28 games, --workers 4 --verify) CRASHED with Chrome
  renderer failures (base::AddressSpaceReservation — memory pressure from 4
  parallel headless Chrome instances + prior leaks). Do NOT run 4+ workers on
  this machine. Use --workers 2, or run games one at a time (ingest-game.mjs).
- The dev server runs on http://127.0.0.1:3000 (node --import tsx server/index.ts).
  Restart it after registering new games (the games table seeds on boot).

KNOWN FIXES ALREADY APPLIED (re-apply if files were reset):
- scripts/auto/lib/cdp.mjs: random CDP ports (10000-40000), tree-kill close()
  via taskkill /T /F + PowerShell profile-dir sweep, sweepIngestChromes() on
  every launch. The old code used a fixed base port and leaked 600+ Chrome
  processes.
- public/games/_shared/network-lock.js: load-time marker
  window.__TIPTAP_NETWORK_LOCK__ = true; HTMLScriptElement.src override +
  MutationObserver (blocks runtime-injected SDK/analytics scripts);
  HTMLImageElement.src override (blocks pixel beacons).
- src/App.tsx: try/catch around gameWindow.removeEventListener in the cleanup
  path (a game iframe that navigates cross-origin threw SecurityError and
  crashed the whole feed).
- Release-audit fixes for the original 12 broken games (manifests stamped via
  scripts/refresh-integration-provenance.mjs; index.html inline scripts
  extracted for level-devil, tic-tac-toe, master-chess, penalty-shooters-2,
  go-battle-2; external URLs removed from 2048-game; network-lock order fixed).
- server/app.ts: ludo-hero uses the narrowly-scoped legacy-game CSP
  (unsafe-eval only — its MarketJS runtime needs it).

VERIFICATION BAR (do not lower it):
- npm run audit:release must pass (isolation contract: network-lock first,
  ad-client second, no inline scripts, no external URLs, manifests with exact
  sha256/bytes).
- npm run typecheck && npm test (64 tests) must pass.
- Each new game must pass scripts/auto/verify-game.mjs (headless boot: canvas
  has content / engine-resized, zero external requests, network-lock + bridge
  executed, no fatal console errors, no failed or masked-404 asset requests).
- The build (npm run build) may be blocked if the operator has a Notepad window
  open on dist\games\kitty-loves-birds-2 (file lock) — do NOT kill that
  Notepad (it contains the operator's prompt draft); ask them to close it.

NEXT BEST ACTIONS (in order):
1. Clean up leftover unregistered game folders (audit which of the 52 folders
   are complete vs partial; register complete ones, delete partial ones).
2. Re-run the 8 previously-verified games one at a time
   (node scripts/auto/ingest-game.mjs <slug>) to re-register them after the
   crash: domino, foosball, ludo-hero, moto-x3m, bubble-storm, spider-solitaire,
   master-checkers, four-in-a-row.
3. Then run new games with --workers 2 (never 4): the 20 in
   tmp/batch-all.txt after the first 8.
4. Run npm run check, then commit (conventional commits, one game per commit
   or one batch per commit).
5. Push to GitHub (remote: abbashkyt-creator/Hackathon) and republish the
   Replit app (hackathon-abbasiqd.replit.app) so the live site goes from its
   stale 23-game build to the current catalog.

TOOLS AVAILABLE:
- VEU browser toolkit at C:\Project C\Auction Main\Main\Auction\visual-editor\
  visual-editor-workspace (run .\veu.cmd, or use the veu-browser MCP). Use it
  for runtime verification with VISION on every page/action (the operator
  requires vision checks). The MCP may be configured for port 3457 — verify
  with "status" first; keep it isolated (do not run "kill"/"down" — it kills
  other agents' VEU servers too).
- DeepSeek V4 Flash subagents (deepseek-code) for text-only coding tasks.
- MiMo vision (mimo-vision MCP) for image analysis of screenshots.

DO NOT: fabricate scores, seed fake leaderboards, weaken the CSP/network-lock,
use open-source games as substitutes, run `git clean`, or claim completion
without running the full verification bar.
```

---

## Detailed state for the next agent

### What the product is
Tip Tap Games — a TikTok-speed vertical feed of instant one-thumb mini games,
mobile-first (390×844), React 19 + Vite + Express + SQLite/PostgreSQL. The
feed loads at https://hackathon-abbasiqd.replit.app (LIVE but STALE — 23
games; local has ~34+). Each card is a playable game; games are either native
React games or mirrored HTML5 games in sandboxed iframes with a strict
isolation contract.

### The mission
"do all games literally 100% with no exception" — scale the game library from
~34 to as many real Poki games as possible, automatically, at the same quality
bar. The operator knows the honest ceiling: the sources we're allowed (Poki +
similar commercial platforms) hold ~40-60K quality titles, NOT 300K. The
pipeline targets thousands, not 300K. Do not substitute open-source games.

### The pipeline (scripts/auto/)
Built and proven. Files:
- `lib/cdp.mjs` — dedicated headless Chrome per task. Random ports. Tree-kill
  + profile sweep on close. sweepIngestChromes() kills ALL tiptap-ingest
  Chrome instances (call it before/after batches).
- `lib/fetch.mjs` — HTTP fetch with Poki Referer/Origin headers + retry.
- `lib/crawl.mjs` — full asset crawler: BFS over html/css/js/json refs,
  Construct 3 data.json file graphs, Cocos MA1_ multiatlas variants,
  Google Fonts localization, dir-relative resolution. Byte-for-byte saves
  with sha256.
- `lib/localize.mjs` — generates the localized index.html (network-lock →
  ad-client → universal shim → universal bridge → source scripts), extracts
  inline scripts to js/tiptap-inline-N.js, neutralizes source site-locks
  (poki.com/sitelock obfuscation, 4 recipes), writes NOTICE.txt +
  preload-manifest.json.
- `lib/register.mjs` — registers a game in ALL product surfaces: wrapper
  component, src/games/index.ts, src/App.tsx (import+registry+tagline),
  shared/catalog.ts, src/types.ts, src/offline-catalog.ts, src/game-runtime.ts,
  server/db.ts, server/score-policy.ts + thumbnail.
- `discover-game.mjs` — finds a game's source CDN base (gdn.poki.com) via
  headless browser, with preroll-ad retry.
- `ingest-game.mjs` — orchestrates: discover → crawl → localize → register →
  manifest → verify(+recover). Idempotent.
- `verify-game.mjs` — headless verification: canvas has content (canvasSized
  or toDataURL >6KB), zero external requests, network-lock + bridge executed,
  no fatal console errors, no failed/masked-404 asset requests. Tolerances:
  source-absent audio (Construct "Failed to load audio"/"Unable to decode"),
  Phaser "Failed to process file"/"File failed" when the asset 404s on the
  source CDN too.
- `ingest-batch.mjs` — parallel runner (--workers N, --verify). On THIS
  machine use --workers 2 max.
- `cleanup.mjs` — kills leaked tiptap-ingest Chrome instances.

### Why the last batch crashed
4 parallel headless Chrome instances + previously leaked processes caused
Chrome renderer crashes (base::AddressSpaceReservation errors). Fix: workers 2,
or sequential ingest-game.mjs runs. Run `node scripts/auto/cleanup.mjs` before
starting anything.

### The original 12-game release-gate fix (re-applied once, do not lose it)
The release audit (npm run audit:release) was RED for 12 recently-added games.
Fixed by: stamping MIRROR-MANIFEST.json integrationFiles with exact
bytes/sha256 (scripts/refresh-integration-provenance.mjs), extracting inline
scripts to external files (level-devil ×8, tic-tac-toe ×3, master-chess ×1,
penalty-shooters-2 ×1, go-battle-2 ×1), removing external URLs (2048-game,
level-devil), and fixing network-lock script order (master-chess, level-devil).
The audit now passes for all existing games.

### Critical anti-patterns (learned the hard way)
1. **Never run `git clean` or `git checkout .`** — it deleted the entire
   pipeline + all fixes once already (some orchestrator action did this
   between sessions).
2. **Never use VEU `kill`/`down`** — `kill` force-kills ALL VEU servers,
   including other agents' (it killed the other agent's 3456 server once;
   it was restored). Use session-scoped commands only.
3. **Never run 4+ headless Chrome workers** on this machine — memory pressure
   crashes the renderers.
4. **The dev server's SPA fallback masks missing assets** as 200 HTML — the
   verifier detects masked 404s (content-type text/html for asset URLs).
5. **The operator's open Notepad** on dist\games\kitty-loves-birds-2 blocks
   npm run build — do NOT kill it; ask the operator to close it.

### Infrastructure
- Dev server: `node --import tsx server/index.ts` on port 3000. Restart after
  registering games (db seeds on boot).
- VEU: workspace at C:\Project C\Auction Main\Main\Auction\visual-editor\
  visual-editor-workspace. MCP may point at port 3457 (slot 1). The operator
  requires VISION verification on every page/action — use mimo-vision on
  screenshots.
- GitHub: remote origin = github.com/abbashkyt-creator/Hackathon. The last
  push was stale (23-game era). Pushing updates the Replit app IF the Replit
  deployment auto-imports from GitHub; otherwise republish manually on Replit.
- Orchestrator (24/7 loop): C:/Users/Abbas/opencode-orchestrator —
  mission/GOAL.md holds "do all games literally 100% with no exception".
  Status via `node src/cli.mjs status`.

### Current uncommitted work (68 files)
- scripts/auto/* (the rebuilt pipeline)
- public/games/_shared/network-lock.js (hardening)
- src/App.tsx (feed-crash fix)
- server/app.ts (ludo-hero CSP)
- Release-audit fixes across ~12 game folders (manifests + index.html)
- src/games/* wrapper components for newly registered games
- tmp/batch-all.txt (28-slug batch list)
- docs/AI_AGENT_HANDOFF.md (updated) + docs/SESSION-HANDOFF-2026-08-15.md (this)

Commit these as soon as the gate passes so a future `git clean` can't destroy
them again.
