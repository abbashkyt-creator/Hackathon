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
- Current confirmed Tip Tap development URL: `http://127.0.0.1:3103/` (do not assume port 3000; prove the process owner and `/api/health` first)
- Direct copied-game routes: `http://127.0.0.1:3103/?game=subway-surfers`, `http://127.0.0.1:3103/?game=dino-runner`, `http://127.0.0.1:3103/?game=arithmetica`, `http://127.0.0.1:3103/?game=67-game`, `http://127.0.0.1:3103/?game=archery-king`, `http://127.0.0.1:3103/?game=smash-room`, `http://127.0.0.1:3103/?game=plonky`
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
- Archery King (copied source mirror) in `public/games/archery-king`
- Smash Room (copied source mirror) in `public/games/smash-room`
- Plonky (copied Construct 3 source mirror) in `public/games/plonky`
- Original platform dependencies replaced by a local Tip Tap bridge
- Strict Content Security Policy plus `public/games/_shared/network-lock.js`
- Critical-path warm-up manifest per copied game
- PWA service worker with separate shell/game caches and no API caching
- Offline practice catalogue after a successful cached visit; scoring remains online-only
- PNG install icons, Replit commands, and TWA release plan

## UI system (redesigned 2026-07-28)

The current UI is a full product redesign based on the user's TipTap promo
reference, not the earlier dark feed with a blue/purple recolor.

- Preserve the instant vertical feed. Do not introduce a landing page or copy
  the poster as a static marketing page.
- The app shell uses bright white/lavender layered surfaces, a tactile
  blue-to-purple wordmark, a framed game stage, rounded caption cards, floating
  social controls, and navy text with game-specific accent color.
- Ranked cards say `GLOBAL RANKS`; games without a verified score callback say
  `INSTANT PLAY` and still omit the leaderboard control.
- The game picker, leaderboard, profile, result overlay, boot state, errors,
  toast, and focus treatments share the same visual system.
- The active card supports expanded in-feed play. The first pointer interaction
  with either a native React game or a same-origin copied-game iframe grows the
  game downward through the former description gap, but the 620 px TipTap app
  shell, header, scroll-snap feed, and card boundaries never disappear. There
  is deliberately no Fill Screen / Exit control or separate progress bar.
- Expanded play separates gesture ownership. The game surface uses
  `touch-action: none`, so games such as Temple Run keep up/down/left/right
  swipes. The description card disappears completely and the game reaches the
  lower card edge. A compact right rail is vertically centered over the game
  with Up first, Hype/optional Ranks/Share in the middle, and Down last. Both
  navigation buttons use the same white treatment as the social controls.
  Up/Down move exactly one feed card and are the unambiguous fallback when a
  game owns every swipe.
- Game input dims the expanded right rail to 50% opacity so it does not distract
  from play. Touching, clicking, or keyboard-activating any rail control restores
  full opacity; returning to the game dims it again. Keep iframe-window input
  listeners and the focus fallback in sync with this state.
- Changing the active card resets expanded state. Do not remove the direct
  iframe-window interaction listener: iframe pointer events do not bubble into
  the parent React tree, and that listener lets the original first click reach
  the game while also growing its card.
- Dialogs place focus on their close control, close with Escape, and restore
  focus to the opener. Leaderboard period controls expose tab semantics.
- Verified viewports: desktop 1256x912, mobile 390x844, and compact 320x568.
  In expanded play the game grows downward without a caption cutout, the right
  rail center matches the game-frame center at every tested size, all controls
  remain inside the viewport, and there is no horizontal overflow or header
  collision. Real input checks covered 50% game-focus opacity, full opacity
  after a control tap, one-card Down/Up navigation, and collapsed arrival.
  Header targets are 44x44 at normal mobile widths and 40x40 at 320 px.
- Implementation lives in `src/App.tsx` and the final poster-inspired override
  section at the end of `src/styles.css`. Keep all game runtime CSS above it
  intact.
- Final gate: TypeScript passed, 6 test files / 30 tests passed, production
  build passed, 1,070 game assets were Brotli-precompressed, and the release
  audit passed.

Subway mirror facts:

- 167 recorded mirror/integration assets plus the local preload manifest: 168 files and 15,729,037 raw bytes
- Captured build identifier: `b05f1bb8-3159-4c02-8066-4dc1327308e0`
- Proven score callback path from game to parent and server
- `NOTICE.txt`, `MIRROR-MANIFEST.json`, license files, local bridge, and preload manifest are included
- Source identity is preserved; Poki host UI, account, ads, analytics, and tracking are not included

ArithmeticA mirror facts (verified 2026-07-26):

- The original launcher requires the Phaser runtime, bitmap font, 63 image assets, and 16 audio assets. An earlier partial mirror had only the two JavaScript files and three preload images; missing assets caused the incomplete loading/audio behavior.
- `public/games/arithmetica` now contains the complete 84-file game-owned source bundle, with a full 86-entry warm-up manifest. Its local bridge intercepts the source's exact Poki SDK insertion and resolves it locally; it never downloads the SDK, ads, analytics, or source-host resources.
- The source's own `SKIP_TITLE_SCREEN` configuration is enabled so a visible feed card enters the original countdown/gameplay flow without a Play tap. This does not alter questions, timers, or the source game-over calculation.
- VEU's isolated feature-5 browser verified the visible feed iframe loads 85 local resources, creates its canvas, and records zero source/ad/analytics requests. The source does not expose a verified parent score callback, so it remains unranked rather than fabricating submissions.

Archery King mirror facts (verified 2026-07-26):

- The user-supplied 4J page is a GameDistribution wrapper around the direct Code This Lab srl HTML5/CreateJS package. The 4J shell, GameDistribution wrapper, consent UI, advertising, analytics, remote SDK, and Code This Lab more-games service are excluded.
- `public/games/archery-king` contains all 451 game-owned source files (34,727,166 raw bytes): the original CreateJS/Howler runtime, all sprites, fonts, sounds, 24-level solo content, and local launcher/bridge. Its 455-entry warm-up manifest includes every required local source asset plus the entry bridge.
- The copied source remote GameDistribution loader is removed. A narrow local no-ad compatibility object supplies only the legacy methods the source requires, and the remote multiplayer entry is hidden because it depends on a third-party service. The original 24-level solo game is unchanged in its rendering, aiming, physics, assets, and score logic.
- The isolated feature-5 browser verified the local source at 390×844: clean issues/failures, a live rendered canvas, original pointer-driven aiming/shooting, no network-lock reports, and the real copied-source `save_score` event reaching the local parent bridge. VEU's own injected panel can add unrelated `__vwe_panel` image resources; do not count those as product traffic.
- The source intro panel is allowed to appear, then its own hide path is invoked so the visible feed card reaches genuine solo level-one play without a Play/Next tap. Audio can remain muted until a real gesture because that is a browser policy, not a game-load failure.

Plonky mirror facts (source audit 2026-07-26):

- The Poki source frame resolves to Gametornado's Construct 3 / Box2D package. `public/games/plonky` contains the local launcher, runtime, 68 source image assets, 31 source audio assets, and the source `data.json` project graph.
- The original launcher inserted the Poki SDK and could emit lifecycle/analytics beacons. The local launcher omits the host shell/service worker, redirects the SDK path to a local no-ad compatibility shim, and removes the source beacon path.
- Source inspection found only lifecycle/ad hooks, not a trustworthy final integer score or completion callback. Plonky remains unranked; do not add a score policy or manufacture a result.
- For browser proof, use a fresh dedicated VEU worktree/profile, clear history, load only the direct local Plonky URL, then inspect fresh network evidence. Do not count historical VEU panel or another-card requests as Plonky traffic.

Smash Room mirror facts (verified 2026-07-26):

- The user-selected Poki page is a host shell. VEU isolated feature-5 discovery traced the actual Happylander Ltd HTML5/Three.js package to `17e020cd-042a-46c5-a13c-434fd4c49dfd.gdn.poki.com/292f3ed1-b297-4a5f-be11-aa0288c391a7`.
- `public/games/smash-room` mirrors the 42 game source assets: source launcher/runtime scripts, 24 voxel object definitions, all source images, font, and audio. The local wrapper is intentionally small: it supplies the original required canvas elements, loads the original source files locally, and calls its original `loadLang("en")` entry point.
- Do not add `PokiSDK`, advertising, analytics, tracking, or source URLs back into the local page. Smash Room checks for `window.PokiSDK` before its host-only ad/measurement calls; the local launcher deliberately leaves it absent. The local source therefore starts actual gameplay with no ad break or third-party game request.
- Direct isolated VEU verification loaded every required source asset from `127.0.0.1:3103`, entered original `game` state, created an active Three.js scene, and rendered the real voxel laptop sandbox. VEU's `clean` utility can accidentally set a full-screen game canvas to `display:none`; do not treat that tool-side side effect as a product failure. Restore the canvas or reload instead.
- The copied source exposes no verified completion/score callback suitable for Tip Tap submission. Keep it unranked rather than fabricating a score event.

Performance truth updated on 2026-07-28:

- A standalone cached-browser audit observed 158 unique game requests and 15,634,211 response-body bytes. This legacy build eagerly requests nearly the whole mirror; the short critical manifest alone is not a truthful cold-play budget.
- The Replit production build emits 58 Subway Brotli sidecars. If every requested local file is cold and the browser supports Brotli, the effective whole-mirror estimate is 8,935,673 bytes instead of 15,729,037 bytes, a 43.2% lossless reduction.
- A cache-disabled live trace of `https://hackathon-abbasiqd.replit.app/` found the old scheduler starting 182 requests / 23,302,813 encoded bytes in the first session. The 67 Game document did not start until 1,892 ms because rendering waited on `/api/bootstrap`; 67 Game then competed with Plonky and Ping Pong Go. Its local bridge recorded the first playable source frame at 12,565 ms. This was real loading/engine initialization, not a long post-load intro.
- The repaired scheduler renders the bundled catalog immediately, never warm-fetches the already-mounted active game, and gives that game an exclusive startup window. A production-build trace started the 67 Game document at 327 ms and initiated only `/games/67-game` assets during the first 3.5 seconds.
- Warm-up is now bounded and sequential: one future embedded game after 3.5 seconds on fast/4G-class links, after 7 seconds on 3G, and none on Data Saver/2G. Integrations that explicitly support hidden preparation may keep that one next iframe mounted; all others cache only the critical manifest. Whole-mirror warming is opt-in (`warmFullMirror: true`), never the default.
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

### 0. Mandatory source-bundle audit — before any diagnosis or edit

Do **not** conclude that a copied game is unsupported, broken, or requires a rebuild after finding only its main payload (`.swf`, `.wasm`, `.data`, bundle JS, etc.). Use the assigned VEU instance and prove the whole running bundle first:

1. Run `veu status`; the server must be UP and the browser CONNECTED. If it is not, repair that before collecting evidence.
2. Navigate to the real source game, wait for its frame, then inspect **all** document, script, fetch, worker, image, audio, WASM, and data requests—not only `net api`.
3. Save and review the source frame's `index.html` plus every game-owned launcher/bootstrap script. Identify platform SDK calls, source callbacks, orientation hooks, preload UI, renderer/runtime configuration, and ad/reward behavior.
4. Record the exact runtime build and every companion file required by the payload: for example an SWF may require a particular Ruffle build, a launcher such as `67_webgl.js`, preload images, and `ExternalInterface` callbacks. A newer generic runtime is not automatically compatible.
5. Play enough of the original source to identify the actual required answer/control. Never call a puzzle "stuck" merely because an assumed button did not advance it.
6. Only after source and local direct-page behavior are compared may an agent call something a true compatibility blocker. If anything is unverified, say "incomplete asset/lifecycle audit"—not "impossible".

When localizing, retain only source-game assets and a narrowly reviewed local adapter. Remove host SDK, ads, analytics, identity, remote scoreboards, and trackers; replace mandatory callbacks with explicit no-ad/no-network local behavior. Record every source URL, byte size, hash, purpose, and license in the manifest.

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

Create `preload-manifest.json` beside the game index. Include only the entry HTML and files required to reach the first interactive frame. Register it in `src/game-runtime.ts`; the captured-asset manifest is inventory/audit evidence, not permission to download every later-level file.

The visible iframe owns startup priority. Never warm-fetch the active game a second time. After the connection-aware delay, prepare at most the next embedded game: hidden-mount only a wrapper explicitly marked `prepareByMount`, otherwise cache the critical manifest. `warmFullMirror` must remain absent/false unless a measured, unusually small mirror proves that full warming improves rather than delays first play. Data Saver and 2G perform no speculative download.

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

## Fruit Ninja status (verified 2026-07-26)

- Feed slug: `fruit-ninja`
- Local source mirror: `public/games/fruit-ninja`
- Creator shown in product: Storms
- Source game ID: `8b32c0f4-2dcb-4fdd-bf8b-16df63b01532`
- Source version: `255af3fb-6d80-441b-8cef-e07ff9a9075c`
- Original files captured: 121; local package is about 34.6 MB before build compression
- Runtime: Phaser/Three.js with Ammo WASM, FBX models, local images, font, and audio
- Poki shell, SDK, ads, analytics, tracking, and remote services are absent locally
- The visible card enters the source gameplay transition automatically
- Desktop and 390x844 touch-emulated feed views passed with no page errors or failed game requests
- The source's real `showResult()` score was proven through the bridge and stored by the local server
- Production orientation recommendation: landscape for the APK, because the source game is landscape; portrait preserves the full playfield with letterboxing rather than cropping
- Isolation proof: dedicated VEU server 3470, CDP 9240, one Chrome profile. Shared feature-5 was abandoned after another agent navigated it.

Verification caveat: typecheck, all 97 tests, production build, and `git diff --check` pass. The combined `npm run check` release-audit phase is currently blocked by unrelated incomplete `count-control-legends` and `kitty-loves-birds-2` folders created by other work; do not delete those folders without coordinating with their owners.

## Stickman Fury status (verified 2026-07-26)

- Feed slug: `stickman-fury`
- Local source mirror: `public/games/stickman-fury`
- Source page: `https://poki.com/en/g/stickman-fury`
- Captured source package contains 97 original assets, including all 56 level
  files, the original physics/runtime libraries, font, audio, images, tuning,
  weapons, and animal data.
- The Poki portal, SDK download, advertising, analytics, accounts, and remote
  services are absent. The local bridge resolves commercial breaks immediately
  and rewarded breaks as `false`.
- A fresh feed run entered Stage 1 without a click. Desktop input changed the
  fight; at 390x844 the canvas fit at 360x592 and its on-screen jump control
  worked.
- Scrolling to the next card removed the iframe; scrolling back recreated it
  and resumed autoplay.
- A clean direct-game reload captured 101 requests, all local, with zero failed
  requests, zero external HTTP/WebSocket requests, and zero console warnings or
  errors.
- The game is deliberately unranked because no verified source score callback
  was found. Do not fabricate one.
- Typecheck, 97 tests, production build, Brotli precompression, manifest hashes,
  and `git diff --check` pass for this integration.
- Full evidence and restart notes: `docs/STICKMAN_FURY_PROGRESS.md`.

## Johnny Trigger - Sniper status (verified 2026-07-27)

- Feed slug: `johnny-trigger-sniper`
- Creator: SayGames
- Source game/version IDs: `994568e9-1512-4e00-a24d-e431e3eae6b1` / `1642d4b2-69f2-40ac-b15f-44bbefebb761`
- Runtime: Unity 2022.3.18f1 WebGL with Addressables
- Mirror integrity: 276 files, 75,472,239 bytes, 263/263 catalog runtime files present
- Local SDK bridge: no ads; rewarded requests return false; no source leaderboard or remote identity
- Isolated proof: VEU 3487 with dedicated CDP 9264 and a unique Chrome profile
- Desktop and 390x844 runs reached the genuine Mission 1 aiming scene without a Play button
- A trusted 390x844 touch interaction advanced the source from Mission 1 to Mission 2
- Product network proof: no source/CDN/ad/analytics requests and no network-lock reports; observed localhost:3456 entries were VEU toolbar diagnostics
- Feed teardown proof: switching to Dino Runner left `johnnyFrame: null`
- The source exposes no verified score callback, so this game remains unranked
- `warmFullMirror: false` is intentional: warming all later-level bundles delayed the visible first mission
- Only the active copied game and one next copied game are mounted; the Johnny
  feed check observed exactly two game iframes rather than a hidden multi-game
  farm.
- Feed sound changes use same-origin `postMessage`; the Unity iframe URL and
  instance remain live. Runtime inspection proved mute `true` and then `false`
  without changing the iframe `src`.
- Johnny is returned as `ranked: false`, creates no run ticket, and renders no
  Ranks button.
- Production Brotli sizes: WASM 19,177,397 -> 6,074,820 bytes; data
  6,144,797 -> 1,926,127 bytes.
- Current validation: release audit passed, TypeScript passed, 28 test files /
  119 tests passed, and the production build completed.
- Cold Unity startup is still substantial. Ahead-of-swipe hidden preboot reduces perceived delay, but do not claim a never-cached 75 MB package is literally instant.

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
- **TikTok-style auto-start**: Mount the visible game immediately and never wait for `/api/bootstrap` or a score ticket. The `gameLive` variable in `App.tsx` must NOT require `Boolean(ticket)` — tickets are fetched in parallel while gameplay runs. Auto-bypass a source intro only when the integration has a verified safe source callback; never claim a source-owned start screen is bypassed when it still requires a genuine tap (67 Game currently does).
- The active game gets uncontested startup priority. Prepare at most one next embedded game after the connection-aware delay (3.5 seconds fast/4G, 7 seconds 3G, disabled on Data Saver/2G). Never warm the active game, multiple future games, or a whole captured mirror by default.
- Use real scores only. Never seed fake leaderboards or leave QA scores behind.
- Final hosting is Replit, not another provider.
- Do not claim GitHub/Replit/APK/OAuth/mobile success without live evidence.

Work in four stages: (1) inspect the full picture, (2) implement the complete scoped change, (3) run npm run check plus VEU desktop/mobile/network verification, (4) perform a final adjacent-risk review.

VEU workspace: C:\Project C\Auction Main\Main\Auction\visual-editor\visual-editor-workspace
Local target: http://127.0.0.1:3103/ (verify the actual owner and health endpoint before using it)
Direct copied-game targets:
- http://127.0.0.1:3103/?game=subway-surfers
- http://127.0.0.1:3103/?game=dino-runner
- http://127.0.0.1:3103/?game=67-game

For the complete repeatable local-game workflow, read docs/LOCAL_GAME_INTEGRATION_PLAYBOOK.md. 67 Game is the original local source bundle, not a rebuild: the SWF, source `67_webgl` lifecycle, source-deployed Ruffle 2023-12-16 runtime, and both preloader images are stored locally. Real browser input verified level 1 advancing to level 2, and a 390×844 touch-emulated run entered gameplay. It remains deliberately unranked: the copied source exposes no verified Tip Tap score callback, and its own start button requires one genuine user tap.

Begin by reporting current git status, test status, runtime owner, and the single highest-value next milestone. Then complete that milestone without weakening the documented contracts.
```
