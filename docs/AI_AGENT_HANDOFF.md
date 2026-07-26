# Tip Tap Games — complete AI agent handoff

## Mission

Win the hackathon with one fully implemented product: **Tip Tap Games**, a TikTok-speed vertical feed where every card is a playable game. The user should land directly in play, understand one rule, compete on a real leaderboard, and swipe immediately to another game. It must be excellent on desktop and especially on a real phone.

The production target is **Replit**, imported from GitHub. The Android target is a Trusted Web Activity APK built from that final Replit PWA, so the web deployment remains the single source of truth.

## Non-negotiable product contract

1. No landing page, game library, download gate, account gate, or tutorial wall.
2. The first default card is a lightweight native game and starts immediately.
3. Only the visible game runs. Inactive embedded games must be unmounted, stopping rendering, timers, and audio.
4. Warm only the next copied game's critical path. Never download the whole catalogue at launch.
5. Preserve copied assets byte-for-byte unless the user separately approves a quality tradeoff. HTTP gzip/Brotli and browser caching are lossless.
6. Copied games must make **zero requests to source sites**, ad networks, analytics, identity providers, or remote CDNs.
7. Every leaderboard entry must come from a real accepted run. No fake players, fake scores, or seeded judge theatre.
8. Before integrating another external game, list the candidates and wait for the user's explicit choice. The user has said permission exists, but preserve the written grant and confirm it covers GitHub redistribution plus the Replit deployment.
9. Never claim GitHub, Replit, OAuth, APK, or real-device completion without actually proving it.
10. A visible game must enter live gameplay automatically. An intro, logo, or loading animation may appear, but it must flow into the real playable state without a tap, click, keypress, “Continue,” or navigation step. The user swipes to play; they must never face a host page, game-selection page, “Play” button, or “Press to play” gate.

## Repository and tools

- Product repository: `C:\Project C\Hackation`
- VEU browser toolkit: `C:\Project C\Auction Main\Main\Auction\visual-editor\visual-editor-workspace`
- Local product URL currently used: `http://localhost:3000/`
- Direct copied-game routes: `http://localhost:3000/?game=subway-surfers`, `http://localhost:3000/?game=dino-runner`, `http://localhost:3000/?game=arithmetica`
- VEU launcher: run `.\veu.cmd` from the VEU workspace

Quality gate:

```powershell
cd "C:\Project C\Hackation"
npm install
npm run check
```

The gate statically enforces the copied-game packaging contract, validates PWA icons and Replit commands, typechecks, runs API/policy tests, and creates both client and server builds.

## Current implementation

- React 19 + TypeScript + Vite client
- Express 5 server, one same-origin deployment
- SQLite only for local development/test
- PostgreSQL required in production; production fails closed without `DATABASE_URL`
- Guest-first identity, optional Discord/Google OAuth, score claiming
- One-time run tickets, server elapsed time, per-game plausibility policy, replay protection, and rate limiting
- Real all-time/daily leaderboards, SSE refresh, challenge links, likes, sharing
- Five lightweight original games (Pulse Lock, Color Clash, Stack Shift, Memory Grid, Meteor Dodge)
- Authorized local Subway Surfers, Dino Runner mirrors in `public/games`
- ArithmeticA (copied game) in `public/games/arithmetica`
- Original platform dependencies replaced by a local Tip Tap bridge
- Strict Content Security Policy plus `public/games/_shared/network-lock.js`
- Critical-path warm-up manifest per copied game
- PWA service worker with separate shell/game caches and no API caching
- Offline practice catalogue after a successful cached visit; scoring remains online-only
- PNG install icons, Replit commands, and TWA release plan

Subway mirror facts:

- 167 recorded mirror/integration assets plus the local preload manifest: 168 files and 15,729,037 raw bytes
- Captured build identifier: `b05f1bb8-3159-4c02-8066-4dc1327308e0`
- Proven score callback path from game to parent and server
- `NOTICE.txt`, `MIRROR-MANIFEST.json`, license files, local bridge, and preload manifest are included
- Source identity is preserved; Poki host UI, account, ads, analytics, and tracking are not included

Performance truth recorded on 2026-07-26:

- A standalone cached-browser audit observed 158 unique game requests and 15,634,211 response-body bytes. This legacy build eagerly requests nearly the whole mirror; the short critical manifest alone is not a truthful cold-play budget.
- The Replit production build emits 58 Subway Brotli sidecars. If every requested local file is cold and the browser supports Brotli, the effective whole-mirror estimate is 8,935,673 bytes instead of 15,729,037 bytes, a 43.2% lossless reduction.
- The feed scans three cards ahead and warms all recorded local assets. The service worker strips version query strings from game cache keys and deduplicates a warm-up request racing the active iframe request.
- A first-ever direct link on a slow connection cannot be literally instant; no client code can remove the need to transfer required bytes. Normal feed entry, ahead-of-swipe warming, Brotli, and repeat/offline caching are the supported fast path. Reject future copied games whose first playable state cannot be separated from a very large monolithic bundle.
- Embedded Subway receives `autoplay=1`. After the local game reports loading complete, `tiptap-platform-bridge.js` sends a local synthetic touch/click to its canvas and stops retrying as soon as the real SDK emits `gameplay-start`. No source host or game-selection navigation is involved.

Dino mirror facts:

- Local package: 23 files and 85,200 raw bytes, including notices and manifests
- Captured version identifier: `09a3212c-2757-4232-93dc-c002f4ac007f`
- The original inline runtime was extracted into `js/dino-runner.js`; production keeps the strict no-inline-script, no-eval game CSP
- `autoplay=1` works on the direct game document without relying on parent-message timing. The bridge waits for the real Runner instance, begins its intro, and guarantees the intro hands off to gameplay
- Every completed run reports its actual normalized distance, not only a new high score; the crash state emits `gameplay-stop` and no longer emits a false `gameplay-start`
- VEU proof at 390×844 observed a live Runner with advancing distance, 21 same-origin game requests, no failed requests, and no product request to a source/ad/analytics host
- Visible feed proof observed an untouched auto-started run complete with score 28 and rank #2, then verified that swiping away removed the Dino iframe

## Architecture boundaries

```text
Judge browser / installed TWA
          |
          | one HTTPS origin
          v
Replit Express process
  |-- React feed + service worker
  |-- /games/* local copied assets
  |-- /api/* tickets, scores, boards, auth
          |
          v
Replit PostgreSQL
```

For copied games there are two isolation layers:

- Production CSP allows game documents to load/connect only to the Replit origin plus local `data:`/`blob:` resources.
- `network-lock.js`, loaded before every game script, blocks cross-origin fetch, XHR, WebSocket, EventSource, beacon, and popup attempts and records them in `window.__TIPTAP_BLOCKED_NETWORK__`.

Do not weaken either layer to make an old remote call succeed. Localize the required asset or replace the host API with a minimal local bridge.

## Standard operating procedure for each new copied game

### 1. Candidate review before edits

Give the user a concise table with the candidate, source URL, mobile controls, approximate bundle size, score-hook confidence, third-party runtime dependencies, license/permission evidence needed, and integration risk. Rank them, recommend one, and wait for the user's choice.

### 2. Permission and provenance

Record:

- rights holder and permission date,
- exact version/build and source URLs,
- whether public GitHub redistribution is allowed,
- whether public Replit hosting is allowed,
- required attribution and license texts.

Put the human-readable record in `NOTICE.txt`. Put every captured file, source URL, byte count, and checksum in `MIRROR-MANIFEST.json`. Do not fabricate permission evidence.

### 3. Read-only VEU discovery

Use VEU to inspect the approved source runtime before copying:

- mobile viewport and touch behavior,
- entry document and complete request graph,
- service workers, workers, WebAssembly, fonts, audio, models, bundles, and lazy levels,
- platform SDK calls, ads, analytics, login, remote configuration, leaderboards,
- score and lifecycle callbacks,
- gameplay completion and restart behavior.

Capture evidence. Do not automate CAPTCHA or bypass access controls.

### 4. Mirror only the game runtime

Copy the gameplay runtime and required notices. Exclude host navigation, ad stack, analytics, trackers, source login, cookies, and unrelated recommendation UI. Preserve original bytes for gameplay assets.

### 5. Localize dependencies

Every required CDN/config/API dependency must become:

- a local file under that game directory,
- a same-origin Tip Tap API, or
- a deterministic local bridge response.

Never add a source domain to CSP. Do not silently ignore a dependency that affects gameplay correctness.

### 6. Install network isolation first

The first external script in the copied `index.html` must be:

```html
<script src="/games/_shared/network-lock.js"></script>
```

Then load the game-specific platform bridge. Run `npm run audit:release`; it fails if this order or packaging contract is broken.

### 7. Add lossless ahead-of-swipe warm-up

Create `preload-manifest.json` beside the game index. Include the entry HTML and files required to reach the first interactive frame. Register both that file and the local captured-asset manifest in `src/game-runtime.ts`. The feed scans three cards ahead and warms the copied bundle into the game cache without instantiating the iframe. Constrained/save-data connections intentionally warm only the entry page.

The production build generates Brotli sidecars for compressible copied-game files. `server/production-client.ts` serves those sidecars only when the browser advertises Brotli support and otherwise falls back to the original asset plus normal HTTP compression. Do not precompress already-compressed audio or images, and never remove source assets: this is lossless transport compression, not asset-quality reduction.

### 8. Build the platform adapter

Create a React wrapper under `src/games` and a local browser bridge under the copied game. Map:

- active/unmount lifecycle,
- actual final integer score,
- retry/run key,
- global muted state,
- optional haptics,
- ads to a truthful local result,
- remote leaderboard calls to Tip Tap or an empty result.

Do not infer a score from DOM pixels if a stable game callback exists.

### 9. Register product and server policy

Update:

- `src/types.ts`
- `src/games/index.ts`
- `src/App.tsx`
- database game seed/migration
- `server/score-policy.ts`
- API/policy tests
- CSP only if the game genuinely needs a narrowly scoped legacy primitive such as `unsafe-eval`

Default new copied games must remain on the strict no-eval game policy.

### 10. Verify on real mobile and desktop

At minimum:

- desktop feed and direct `?game=slug` link,
- 390×844 touch viewport,
- first interactive frame and restart,
- swipe-away hard teardown,
- sound toggle and background/foreground,
- real score accepted once and replay rejected,
- no console errors that affect play,
- zero external requests after fresh cache,
- warm-cache repeat load,
- service-worker offline replay after a successful online visit,
- full `npm run check`.

Use VEU request evidence, not only fixture tests. Delete any synthetic QA score inserted during bridge diagnostics.

## Replit production checklist

1. Push a clean reviewed commit to GitHub.
2. Import that repository into Replit.
3. Add Replit PostgreSQL and confirm `DATABASE_URL`.
4. Add deployment secrets:
   - `SESSION_SECRET` (at least 32 random characters)
   - `PUBLIC_BASE_URL` (exact final HTTPS origin)
   - optional Discord/Google client IDs and secrets
5. Use an Autoscale deployment. The included `.replit` runs `npm run build` then `npm start`.
6. Verify `/api/health`, bootstrap, a real score, daily/all-time board, challenge link, and refresh persistence.
7. Verify game asset cache headers and compression from the public origin.
8. Run the full phone demo on the actual public URL.

Current external blockers: no destination GitHub remote, Replit app/database, final hostname, deployment secrets, OAuth registrations, or public production smoke test have been provided in this workspace.

## APK checklist

Follow `docs/APK-RELEASE.md` only after the Replit URL is final. The permanent external inputs are:

- package ID,
- release keystore,
- SHA-256 signing certificate fingerprint,
- deployed `/.well-known/assetlinks.json`.

Never commit the keystore. Never publish the placeholder asset-links template. A real Android phone must pass fullscreen launch, gameplay, background/foreground, reconnect, and score tests before calling the APK complete.

## Winning demo

The strongest three-minute story is:

1. Scan/open and watch Pulse Lock already running—no Play button.
2. Finish and show the real server-backed rank.
3. Swipe directly into Subway Surfers and show the run starting automatically with no press-to-play gate, redirect, or source-site dependency.
4. Swipe into Dino Runner, keep both hands away, and let its intro become live gameplay and a real ranked result automatically.
5. Share a canonical challenge to the second phone.
6. Show the install icon or launch the verified APK.
7. Close with: “Short-form feeds removed every decision before entertainment. Tip Tap keeps that speed and replaces watching with play.”

Have real team runs on the leaderboard before judging, not generated records.

## Exact continuation prompt

The canonical copy-paste prompt is [docs/AI_AGENT_MASTER_PROMPT.md](AI_AGENT_MASTER_PROMPT.md). The shorter emergency form is below:

```text
Continue Tip Tap Games in C:\Project C\Hackation. Read docs/AI_AGENT_HANDOFF.md, README.md, docs/ARCHITECTURE.md, docs/APK-RELEASE.md, git status, and all applicable AGENTS.md files before editing.

Mission: win the hackathon with one complete Replit-first product—a TikTok-speed vertical feed of real playable games, excellent at 390x844 and desktop, with a final TWA APK after the Replit URL is fixed.

Non-negotiables:
- Preserve all existing user changes and the working Subway Surfers and Dino Runner mirrors. Do not claim Ping Pong Go, Supercar Legends, or 67 Game is integrated unless its local folder, catalog entry, wrapper, browser proof, and network proof all exist.
- Before integrating any additional external game, list candidates for Abbas to review and wait for his explicit selection.
- Permission is represented by the user, but do not fabricate proof; confirm it covers public GitHub and Replit distribution and preserve notices.
- Preserve copied gameplay assets byte-for-byte unless Abbas explicitly approves a quality tradeoff.
- Copied games must make zero source-site/CDN/ad/analytics requests. Keep strict CSP and load /games/_shared/network-lock.js before all game scripts. Localize dependencies; never whitelist the source host.
- **TikTok-style auto-start**: Every game must be PLAYING the instant its card is visible in the feed. No waiting for server tickets, no "SYNCING RUN" overlays, no play buttons. The `gameLive` variable in `App.tsx` must NOT require `Boolean(ticket)` — tickets are fetched in parallel while gameplay runs. If the game ends before the ticket arrives, show a retry message. For copied games, the bridge must call `playIntro()` or equivalent to bypass intro animations. For native games, the game loop starts immediately when `active=true`.
- Only the visible iframe runs. On normal connections, warm copied games up to three cards ahead from local manifests; on constrained/data-saver connections warm only the entry page.
- Use real scores only. Never seed fake leaderboards or leave QA scores behind.
- Final hosting is Replit, not another provider.
- Do not claim GitHub/Replit/APK/OAuth/mobile success without live evidence.

Work in four stages: (1) inspect the full picture, (2) implement the complete scoped change, (3) run npm run check plus VEU desktop/mobile/network verification, (4) perform a final adjacent-risk review.

VEU workspace: C:\Project C\Auction Main\Main\Auction\visual-editor\visual-editor-workspace
Local target: http://localhost:3000/
Direct copied-game targets:
- http://localhost:3000/?game=subway-surfers
- http://localhost:3000/?game=dino-runner
- http://localhost:3000/?game=67-game

For the complete repeatable local-game workflow, read docs/LOCAL_GAME_INTEGRATION_PLAYBOOK.md. 67 Game is the original local SWF hosted through local Ruffle, not a rebuild. A real browser input verified its start and first phone-puzzle interaction. It remains deliberately unranked: the copied source exposes no verified Tip Tap score callback, and its own start button requires one genuine user tap.

Begin by reporting current git status, test status, runtime owner, and the single highest-value next milestone. Then complete that milestone without weakening the documented contracts.
```
