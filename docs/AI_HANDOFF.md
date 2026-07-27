# Tip Tap Games — Full AI Agent Handoff

> Purpose: everything a fresh AI agent needs to continue this project with zero prior
> context. Written end-to-end. If something here conflicts with the code, trust the
> code and update this file.

Last updated by the previous agent after the session ending at commit `c4e08ac`.

---

## 1. What this project is

**Tip Tap Games** — a TikTok/Reels-style **vertical swipe feed where every card is a
playable mini-game** instead of a video. You land directly in a live game, play as long
as you like, and swipe up for a completely different game. It is a 12-hour hackathon
build ("Doomscroll — except you're the one playing").

The hackathon brief lives in the user-provided PDF and its two committed copies:
- `docs/AI_AGENT_HANDOFF.md` and other `docs/*.md` (older, partially stale — see §12)
- The brief's **Definition of Done** is the acceptance checklist (see §10).

Core loop the product must deliver: **Land → Play → Compete (leaderboard) → Swipe.**
No home screen, no tutorials, no loading walls, no forced exit, mobile-first (390×844).

---

## 2. Where the code is / how to run it

- **Repo (the real, live working tree):** `C:\Project C\Hackation` on branch **`main`**.
  This is the single source of truth. All work below is committed on `main`.
- There are OTHER git worktrees under `C:\Project C\Hackation\.claude\worktrees\` and
  `C:\Project C\Hackation worktrees\` (branches `claude/*`, `feature-1..5`). They are
  **stale leftovers** — everything unique was already merged into `main`. Ignore or prune
  them (`git worktree remove ...` + branch delete). Do NOT resume work in them.

**Run the dev server (serves the whole app + games):**
```bash
cd "C:/Project C/Hackation" && PORT=3103 npm run dev
```
- Dev server = `tsx server/index.ts` (Express + Vite middleware). Serves at
  **http://127.0.0.1:3103/**. Health check: `GET /api/health` → `{"ok":true,"service":"tip-tap-games"}`.
- **Port trap:** the server's DEFAULT port is 3000, but on this machine port 3000 is an
  unrelated **Open WebUI** instance. Always run Tip Tap with `PORT=3103` and verify via
  `/api/health`. Never assume 3000 is Tip Tap.
- **Gotcha:** killing all Node processes (e.g. `Get-Process node | Stop-Process`) also
  kills this dev server. If the app goes down mid-work, restart it with the command above.

**Production build (what Replit deploy runs):**
```bash
cd "C:/Project C/Hackation" && npm run build   # vite build + prune + brotli precompress + esbuild server
cd "C:/Project C/Hackation" && npm start        # node dist-server/index.js
```

**Full release gate (run before declaring "done"):**
```bash
cd "C:/Project C/Hackation" && npm run check    # audit:release + typecheck + vitest + build
```
Individually: `npm run audit:release`, `npx tsc --noEmit`, `npx vitest run`.

---

## 3. Tech stack & architecture

- **Frontend:** React 19 + Vite (TypeScript). Entry `src/main.tsx` → `src/App.tsx`.
- **Backend:** Express 5 (`server/`), TypeScript via `tsx` in dev, esbuild-bundled in prod.
- **DB:** `server/db.ts` uses **SQLite** locally (`tip-tap.db`, git-ignored) and **Postgres**
  when `DATABASE_URL` is set (production/Replit). Same `Store` class abstracts both.
- **Auth:** `server/oauth.ts` — Google/Discord OAuth **only** (no passwords/forms). Guest by
  default via a device id; guest scores merge on sign-in. OAuth is **disabled unless**
  `GOOGLE_CLIENT_ID/SECRET` and/or `DISCORD_CLIENT_ID/SECRET` env vars are set — the app
  stays fully playable guest-only without them.
- **Score integrity:** `server/score-policy.ts` — per-game caps validated server-side. Only
  games listed there are "ranked"; others are unranked (scores not persisted/validated).
- **CSP / game isolation:** `server/app.ts` sets a per-game Content-Security-Policy (see §7).
- **Deploy config:** `.replit` (`build = "npm run build"`, `run = "npm start"`, port 3000→80).

### The feed (src/App.tsx)
- `App` fetches `/api/bootstrap` → `{ player, games[], likes, auth }`. Falls back to
  `src/offline-catalog.ts` (`OFFLINE_BOOTSTRAP`) if the API fails.
- `entries` = the feed list, built by **`makeBatch()`** (see §8). Rendered as a column of
  `<GameCard>` inside `.feed` (CSS scroll-snap). An `IntersectionObserver` tracks the
  visible card → `activeIndex`.
- `GameCard` renders the game via a component map `GAME_COMPONENTS[slug]`. Each game gets
  props `{ active, preparing, runKey, soundEnabled, hapticsEnabled, onFinish }`.
  - `active` = this card is the current one (`index === activeIndex`).
  - `preparing` = warm the next few cards ahead of the swipe.
- New batches append as you near the end (infinite feed). Game order is a shuffle-bag (§8).

### The games (src/games/*.tsx)
Two kinds:
1. **Native React canvas games** (original, simple): `PulseLockGame`, `ColorClashGame`,
   `StackShiftGame`, `MemoryGridGame`, `MeteorDodgeGame`. Pure React/canvas; sound via
   `tone()` in `src/game-utils.ts`; only make sound while `active`.
2. **Embedded iframe games** (mirrored external games): each component renders an
   `<iframe src="/games/<slug>/index.html?...">`. The iframe assets live in
   `public/games/<slug>/`. They talk to the parent via `postMessage`
   (`{ source: "tiptap-parent", type: "set-muted" | "auto-start", ... }`) and report scores
   back with `{ source: "tiptap-<slug>", type: "score", score }`.

### Game runtime metadata (src/game-runtime.ts)
`RUNTIMES[slug]` marks which games are embedded and their preload/asset manifests, and
`warmGame()` prefetches assets. `isEmbeddedGame(slug)` gates the warm behavior.

---

## 4. The 23 games (slug → engine)

`pulse-lock, color-clash, stack-shift, memory-grid, meteor-dodge` — native React (original).
`arithmetica` — Phaser (iframe). `dino-runner` — Chrome dino JS (dir `dino-game`).
`subway-surfers` — SYBO PixiJS (iframe, had a Poki sitelock — see §6).
`67-game` — Flash `.swf` via **Ruffle** (wasm). `archery-king` — Unity/Construct.
`smash-room` — Three.js voxel. `temple-run-2-frozen-shadows` — Babylon.js + Draco.
`stickman-fury` — physics (opaque-origin sandbox). `plonky`, `kitty-loves-birds-2` —
Construct 3 (Box2D wasm + `new Function`). `fruit-ninja` — enable3d/Ammo (Three.js physics).
`count-control-legends, johnny-trigger-sniper, city-cab-rush, theft-city, supercar-legends`
— **Unity WebGL**. `ping-pong-go`, `ping-pong-bugs` — Happylander (share the ping-pong-go dir).

> Slug vs directory: they match except `dino-runner` → `public/games/dino-game/`.

---

## 5. Registering / wiring a game (the pattern)

To add or change a game you touch these, in sync:
- `src/types.ts` — add slug to the `GameSlug` union.
- `src/games/index.ts` — export the component.
- `src/games/<Name>Game.tsx` — the component (copy an existing iframe game as a template).
- `src/App.tsx` — `GAME_COMPONENTS`, `GAME_EYEBROWS`, the game-label exclusion (full-frame
  games), and the creator-line attribution chain.
- `src/offline-catalog.ts` — `OFFLINE_BOOTSTRAP.games` entry `{ slug, title, rule_text, accent }`.
- `server/db.ts` — `GAME_SEED` entry (the DB upserts these on every startup via
  `INSERT ... ON CONFLICT (slug) DO UPDATE`, so a restart re-seeds; SQLite is ephemeral).
- `server/score-policy.ts` — add a policy ONLY if the game should be ranked.
- `server/app.ts` — add a CSP route if the engine needs wasm/eval/blob (see §7).
- `public/games/<slug>/` — the mirrored assets (index.html MUST load
  `/games/_shared/network-lock.js` first; MUST have NOTICE.txt, MIRROR-MANIFEST.json,
  preload-manifest.json — enforced by `scripts/audit-release.mjs`).
- `tests/api.test.ts` — bump the game-count assertion (`toHaveLength`) and add slug checks.

---

## 6. The security/isolation model (READ before touching games)

- **`public/games/_shared/network-lock.js`** loads FIRST in every game's index.html. It
  blocks cross-origin network from inside games (fetch/XHR/WebSocket/EventSource/beacon/
  window.open) — only same-origin + `data:`/`blob:` allowed. This keeps mirrored games
  fully local (no Poki/telemetry/ads leaking out). It ALSO now:
  - Blocks cross-origin `location.assign/replace` + iframe navigations (best-effort).
  - Spoofs `document.referrer`/`location.ancestorOrigins` to look like Poki so framed
    "sitelock" checks don't trigger.
- Ads are neutralized per game (no PokiSDK loaded, or a local no-op stub). Reward/interstitial
  paths self-resume so nothing freezes waiting for an ad.

**IMPORTANT LEGAL CAVEAT:** the feed mixes **original** games (pulse-lock, color-clash,
stack-shift, memory-grid, meteor-dodge, arithmetica) with **mirrored copyrighted commercial
games** (Subway Surfers/SYBO, Temple Run/Imangi, Fruit Ninja/Halfbrick, Johnny Trigger/
SayGames, etc.). To embed Subway Surfers its anti-embedding **sitelock was disabled**.
Serving the commercial mirrors on a **public** URL is a real copyright/IP risk and is
arguably against the brief ("invent your own"). The original games already satisfy the
brief's "3+ distinct mechanics". Recommend: before public deploy, decide whether to keep
or drop/gate the commercial mirrors. This was flagged to the user; they chose to proceed.

---

## 7. CSP modes (server/app.ts) — the #1 cause of "game stuck loading"

`securityHeaders(mode)` builds the CSP. Modes and which games use them:
- `game` (default) — `script-src 'self'`. Blocks ALL WebAssembly + eval + blob scripts.
- `legacy-game` — `script-src 'self' 'unsafe-eval'`. For Construct 3 / older engines:
  `plonky`, `kitty-loves-birds-2`, `city-cab-rush`.
- `wasm-game` — `script-src 'self' 'wasm-unsafe-eval' blob:`. For anything using WebAssembly:
  `theft-city`, `supercar-legends`, `count-control-legends`, `johnny-trigger-sniper`,
  `fruit-ninja`, `temple-run-2-frozen-shadows`, `67-game` (Ruffle).
- `subway-surfers` uses `legacy-game`; `stickman-fury` has an opaque-origin sandbox with a
  special asset header branch.

**Rule of thumb:** if a game logs `WebAssembly.instantiate ... violates CSP` or is stuck at
"XX% Loading", it needs `wasm-game`. If it logs an `unsafe-eval`/`new Function` violation, it
needs `legacy-game`. Add a `const <name>SecurityHeaders = securityHeaders("...")` and a
`req.path.startsWith("/games/<slug>/")` branch in the `app.use` router. **Restart the server
after editing `server/app.ts`.**

---

## 8. Feed ordering (src/App.tsx `makeBatch`)

- `PINNED_FIRST_SLUG = "67-game"` — 67 Game is pinned to the **very first card on open**
  (batch 0). A `?game=<slug>` deep link (challenge links) overrides that first slot.
- Every batch is a **full shuffle of ALL games** (shuffle-bag): each game appears exactly
  once per cycle, so the player sees every game before any repeat. After batch 0, 67 shuffles
  in like everything else (it is NOT re-pinned each batch — that was the old "looping" bug).
- New batches never open with the game that just closed the previous batch (no seam repeat).
- Helper `gameMonogram(title)` makes the 1-2 char fallback badge for the jump sheet.

---

## 9. Features added this session (with the "why")

All committed on `main`. Newest → oldest:
- `c4e08ac` **Audio**: sound defaults ON (was off → users heard nothing until manual unmute).
  A central `App` effect mutes EVERY game iframe except the active card's on each scroll /
  sound-toggle (with 150/600/1500ms re-runs to catch just-mounted warm iframes). Result: only
  the live game is audible; the Tip Tap mute button still silences everything.
- `98f1138` **Real thumbnails** in the jump sheet — captured live from each game, cropped to
  160px squares in `public/thumbs/<slug>.jpg`. Monogram tile is the `onError` fallback.
- `a918b34` accent monogram tiles (superseded visually by thumbnails).
- `ae12dec` **Quick-jump** — grid button in the header opens a bottom-sheet list of all games;
  tap one to snap the feed to it. Feed-native overlay (not a replacement home screen).
- `001403d`/`3fa039a` **Feed order** — 67 first on open, shuffle-bag the rest, no early loop.
- `0d99aea`/`57aba50` **Game-label fade** — the "PERFECT TIMING / PULSE LOCK" title overlay
  stays until the player starts, then fades **3s** after the first interaction.
- `1c3dac2` re-synced smash-room provenance hash after the game.css fix.
- `160d7a3` **Subway Surfers sitelock + 67 Game wasm** (see §6, §7).
- `6044f47` **Temple Run 2 Draco** — mirrored the Babylon Draco decoder into
  `public/games/temple-run-2-frozen-shadows/vendor/` and rewrote the config to
  `self.location.origin + "/games/.../vendor/..."` (a root-relative URL is invalid inside the
  decoder Web Worker), + wasm-game CSP.
- `7945796` **CSP wasm/blob + Ammo + Poki-SDK localization** — fixed count-control, johnny,
  fruit-ninja (wasm), kitty (Construct + local Poki stub), johnny slideshow null guard.
- `b456ac3` **Combined all worktrees** into `main` (folded in Supercar Legends + Ping Pong Go).

---

## 10. Definition of Done status (brief acceptance)

| Requirement | Status |
|---|---|
| Vertical snap feed (touch + wheel) | ✅ done |
| 3+ genuinely different playable games | ✅ 23 games |
| Auto start / auto stop, no stacked audio | ✅ done (see `c4e08ac`) |
| Guest play, then optional Google/Discord login | ✅ code done; needs OAuth env on deploy |
| Persisted scores (survive refresh + device) | ⚠️ needs `DATABASE_URL` in prod (SQLite is ephemeral) |
| Live leaderboard (per-game, own rank) | ✅ `LeaderboardSheet` + `/api/leaderboard` |
| Endless feed | ✅ shuffle-bag batches |
| **Deployed public URL** | ❌ NOT deployed yet — user must deploy on Replit |

---

## 11. Deploying to Replit (what the USER must do — an agent can't)

1. Push/import this repo to Replit; hit **Deploy** (uses `.replit`: build → start). Localhost
   is a hackathon fail — a public URL/QR is required.
2. Set **Secrets**: `SESSION_SECRET` (long random), optionally `GOOGLE_CLIENT_ID/SECRET`
   and/or `DISCORD_CLIENT_ID/SECRET` + `PUBLIC_BASE_URL` (enables login), and `DATABASE_URL`
   (Replit Postgres — needed for scores to truly persist; without it SQLite resets on redeploy).
3. Decide the copyright question in §6 before going public.

---

## 12. Tooling & verification workflow (how the previous agent worked)

There is **no visible screenshot from the in-app browser** (the `mcp__Claude_Browser__`
pane doesn't composite headlessly — `computer screenshot` fails with "pane not displayed").
So verification was done with an **isolated Chrome driven over CDP**:

- Launch (memory: keep it isolated so other agents don't fight over it):
  ```
  chrome.exe --remote-debugging-port=9227 --user-data-dir=%LOCALAPPDATA%\VEU_SMASH_Profile-9227b
    --no-first-run --no-default-browser-check --disable-background-timer-throttling
    --disable-backgrounding-occluded-windows --disable-renderer-backgrounding
  ```
  Chrome is at `C:\Program Files\Google\Chrome\Application\chrome.exe`. The anti-throttle
  flags matter — an off-screen tab otherwise pauses `requestAnimationFrame` and freezes games,
  which looks like a bug but isn't.
- Drive it with small Node scripts in `/tmp` that talk raw CDP over the WebSocket
  (`http://127.0.0.1:9227/json` → `webSocketDebuggerUrl`). Patterns used: `Page.navigate`,
  `Runtime.evaluate` (returnByValue), `Page.captureScreenshot` (with `clip` for thumbnails),
  `Input.dispatchMouseEvent`/`dispatchKeyEvent`, `Network`/`Log`/`Runtime` events for errors.
  A reusable helper was `/tmp/cdp.mjs` (`nav|eval|shot|list`). Always give these scripts a
  hard timeout + `process.exit` — a heavy WebGL page can hang `captureScreenshot`.
- Games are same-origin iframes (`allow-same-origin`), so from the parent you can read
  `frame.contentWindow` game globals to diagnose (e.g. `gameState`, `sceneManager`, Ruffle
  `ruffle-player`, `window.muted`, `Howler._muted`). Beware: a game that navigated itself
  cross-origin (old Subway sitelock) makes `contentDocument` null.
- The user calls this the **"VEU tool"** (a CDP-driven browser for inspecting/comparing games
  against the Poki originals). Poki reference URLs are like `https://poki.com/en/g/<slug>`.

---

## 13. Persistent memory (already written, auto-loaded each session)

`C:\Users\Abbas\.claude\projects\C--Project-C-Hackation\memory\` has an index `MEMORY.md`
plus: `tip-tap-dev-port.md`, `veu-isolated-instance-ppg.md`, `smash-room-input-fix.md`,
`game-csp-requirements.md`, and integration notes. Read `game-csp-requirements.md` first when
a game won't load — it maps each engine to its required CSP mode and lists the de-Poki fixes.

---

## 14. Known caveats / gotchas for the next agent

- Restart the dev server after ANY `server/*.ts` edit; static `public/` edits are picked up
  live (Vite), and `src/*` hot-reloads.
- After editing a game's own integration files (index.html/game.css/bootstrap), the release
  audit tracks their sha256 in `MIRROR-MANIFEST.json` under `integrationFiles`. Re-sync with a
  small script that recomputes bytes+sha256 for changed entries (see commit `1c3dac2`).
- Some longer game titles ellipsize in the jump-sheet chips (bigger thumbnail tiles). Cosmetic.
- `tip-tap.db`, `.codex-runtime/`, `artifacts/`, local screenshots are git-ignored scratch.
- Do not reintroduce a "games library as the product" — the brief forbids it. The jump sheet is
  a discreet overlay, which is acceptable.

---

## 15. Suggested next steps

1. Deploy to Replit + set secrets/DB (§11) — the last blocking DoD item.
2. Resolve the commercial-mirror copyright question (§6) for the public URL.
3. Prune the stale worktrees/branches so only `main` remains.
4. Optional polish: hybrid real-icon/monogram, per-game thumbnails refresh, challenge-link
   QA, daily leaderboard, "you beat X%" hook (brief's community hooks — ship at least two).
