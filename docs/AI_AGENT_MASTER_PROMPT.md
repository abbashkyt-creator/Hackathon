# Tip Tap Games — Master Continuation Prompt

Copy everything inside the text block into any capable AI coding agent.

```text
Continue and improve Tip Tap Games in:
C:\Project C\Hackation

This is a hackathon product intended to win through one polished idea, not a collection of disconnected prototypes. The product is a TikTok-speed vertical feed of real playable mobile games. Opening the app immediately starts the visible game. Swiping reveals another game that immediately enters gameplay. The user must never press Play, choose a game inside a copied portal, follow a redirect, or wait on host-site navigation.

Before editing:
1. Read docs/AI_AGENT_HANDOFF.md completely.
2. Read README.md, docs/ARCHITECTURE.md, docs/APK-RELEASE.md, and this file.
3. Read every applicable AGENTS.md.
4. Inspect git status and preserve all existing/user changes.
5. Identify the current runtime owner and verify its actual `/api/health` endpoint. Do not assume `localhost:3000`: on this PC it can be an unrelated service. The last confirmed Tip Tap development server was `http://127.0.0.1:3103/`.
6. Run the existing release audit and focused tests before assuming any capability works.

Product mission:
- Make playing as frictionless as watching a short-form video.
- The visible card is already live and interactive.
- Swipe vertically to the next live game.
- Only one heavy copied-game iframe may run at a time.
- Off-screen native games must stop animation/timers; off-screen copied games must be unmounted.
- Warm upcoming copied games up to three cards ahead on normal connections.
- Respect Save-Data, slow-2g, and 2g by warming only the entry page.
- Keep mobile 390x844 as the primary acceptance viewport while preserving excellent desktop behavior.
- Use one Replit web deployment as the source of truth, then package that deployed PWA as a Trusted Web Activity APK after the final URL and signing facts exist.

Immediate-play contract (TikTok-style):
- Every game must be PLAYING the instant its card is visible. No waiting for server tickets. The `gameLive` variable in `App.tsx` must NOT require `Boolean(ticket)` — tickets are fetched in parallel while gameplay runs.
- Every native mini-game begins its animation, countdown, sequence, or hazard loop as soon as its card is active — no ticket wait required.
- A copied game must bypass Play, Press to Play, game-selection, portal, login, ad, and host-navigation gates through a narrowly scoped local adapter.
- A logo, intro, or loading animation may display, but it must transition into the real playable state automatically. Requiring a tap, click, keypress, Continue action, or host navigation after that intro violates the contract.
- For Subway Surfers, preserve embedded=tiptap and autoplay=1. The local bridge may synthesize the verified canvas touch needed to enter the run, but it must stop retries when the real gameplay-start event appears.
- For Dino Runner, preserve embedded=tiptap and autoplay=1. The local bridge must call `playIntro()` to bypass the standing-T-Rex state and start the intro animation which auto-hands-off to gameplay.
- 67 Game is the locally hosted original source bundle: SWF, source `67_webgl` lifecycle, source-deployed Ruffle 2023-12-16 runtime, and mobile/desktop preload images. Do not substitute a lookalike/rebuild and do not invent a score. Its first phone puzzle advances through the green call button; do not misdiagnose the red button as a broken control. The copied source remains unranked because no trustworthy score callback exists.
- ArithmeticA is a locally hosted original Phaser bundle with its full image, font, and audio set. Its bridge must replace only the source SDK insertion with the local no-ad implementation, and its source `SKIP_TITLE_SCREEN` configuration enables automatic entry to the real countdown/gameplay flow. Do not replace it with a lookalike, permit the Poki SDK/ads, or invent a score callback; the current source mirror is unranked.
- Archery King is the local Code This Lab CreateJS source package captured through the 4J-supplied GameDistribution frame. Keep all 451 source-owned assets local. Do not restore GameDistribution, Code This Lab more-games, ads, tracking, consent UI, or remote multiplayer. The local bridge supplies only no-ad `gdsdk` compatibility methods required by the source. It starts genuine source solo level one after the source preloader; it may briefly show then hides the source's own touch tutorial. Its original `save_score` jQuery event is verified and may be ranked only through `tiptap-archery-king` same-origin parent messages.
- Plonky is the local Gametornado Construct 3 / Box2D package in `public/games/plonky`. Preserve the original runtime, `data.json`, images, and audio. Keep `network-lock.js` first, omit the host offline/service-worker files, route only the source's Poki SDK insertion to `scripts/tiptap-poki-sdk.js`, and keep that shim local/no-ad/no-tracking. The source has no verified final-score callback, so Plonky stays playable but unranked.
- Smash Room is the local Happylander Ltd HTML5/Three.js source package. Keep its 42 source assets local in `public/games/smash-room`; its original `loadLang("en")` entry point starts the genuine sandbox after the source preloader. Do not create `PokiSDK` or restore Poki, ads, analytics, tracking, or remote source URLs. The source has no verified parent score/completion callback, so it remains unranked.
- Stickman Fury is the local Happylander Ltd canvas/Planck source package in
  `public/games/stickman-fury`. Keep the Tip Tap title overlay off its canvas,
  because it covers the original Stage/weapon UI. Its iframe intentionally
  omits `allow-same-origin`; preserve the narrow `stickmanfuryv4` parent save
  bridge and `Origin: null` asset headers. Keep the source physics panel blocked,
  keep ads/platform services local no-op, and keep the game unranked until a
  trustworthy source completion/score callback exists.
- Do not fake gameplay with a video.
- Do not generate a fake gameplay-start event. Verify the original game itself emits its real start signal or visibly advances frames.
- Browser autoplay rules may keep sound muted until a real user gesture. Gameplay must still start; never weaken browser security to force sound.
- If a game cannot safely auto-enter real gameplay, reject it during candidate review rather than adding a broken card.
- The "SYNCING RUN" overlay is replaced by a non-blocking `run-syncing-badge` in the top-right corner. It never blocks gameplay.

Copied-game security and independence:
- The user represents that permission exists, but never fabricate permission documents.
- Confirm permission covers public GitHub redistribution and public Replit hosting, and preserve required notices and attribution.
- Preserve copied gameplay/source assets byte-for-byte unless Abbas explicitly approves a quality tradeoff.
- Lossless Brotli/gzip transport compression and browser caching are allowed.
- A copied game must make zero requests to its source site, original CDN, ad network, analytics, remote configuration, source account, or source leaderboard.
- Load /games/_shared/network-lock.js before every copied-game script.
- Keep production CSP fail-closed. Never whitelist a source host to make an old dependency work.
- Localize required dependencies under /public/games, replace platform APIs with minimal local bridge behavior, or reject the game.
- Ads must not display or download. Rewarded-ad calls must return a truthful no-ad result.
- Preserve original creator identity; do not present copied work as created by Tip Tap.

Server and leaderboard contract:
- Start each run through POST /api/runs/start.
- Submit the real final integer score through POST /api/scores.
- Read rankings through GET /api/leaderboard.
- Use /api/events plus the polling fallback for live refresh.
- Production persistence must use PostgreSQL through DATABASE_URL.
- Production must fail closed without DATABASE_URL; never store leaderboards on Replit’s ephemeral filesystem.
- Never seed fake players, fake scores, fake likes, or demo theatre.
- Do not leave QA runs in a user/production leaderboard.
- Be honest that browser-side validation is server-validated, not cheat-proof, unless deterministic server replay has actually been implemented.

Performance contract:
- Measure the true cold first-play request count and bytes for every copied candidate before integration.
- Do not confuse a small hand-written preload manifest with the game’s real eager runtime traffic.
- Use local ahead-of-swipe warming, query-normalized service-worker caching, in-flight request deduplication, and build-time Brotli sidecars.
- Never claim a never-seen 30 MB monolithic game is literally instant on a slow connection.
- Prefer games whose menu/first level can become interactive from a small independently loadable chunk.
- Reject or source-split monolithic candidates rather than hiding long waits behind dishonest UI.
- Do not create inactive iframes merely to preload.

Candidate-selection rule:
- Before adding another external game, give Abbas a concise ranked table.
- Include source URL, mobile control fit, raw bundle size, measured first-play bytes, auto-start feasibility, score-hook confidence, third-party runtime dependencies, permission evidence required, and integration risk.
- Recommend exactly one candidate, then wait for Abbas’s explicit approval before copying or editing it into the product.

Replit production requirements:
- GitHub is the handoff source; Replit is the final host.
- Use an Autoscale deployment, not Static, because the app has Express APIs, sessions, SSE, and PostgreSQL.
- Required production values include DATABASE_URL, SESSION_SECRET, and PUBLIC_BASE_URL.
- Keep .replit build as npm run build and run as npm start.
- Verify the public HTTPS URL, database persistence after restart/redeploy, score submission, leaderboard, SSE/poll fallback, caching headers, Brotli delivery, CSP, and zero source/ad requests before claiming deployment success.
- Check whether the Replit plan adds a visible platform badge and disable it in Publishing settings when the account permits.

APK requirements:
- Do not claim the APK is complete until the final Replit hostname, Android package ID, release keystore, certificate SHA-256 fingerprint, and /.well-known/assetlinks.json are real.
- Never commit the signing keystore.
- Test the final TWA on a real Android phone: install, fullscreen launch, swipe, touch controls, auto-start, pause/background/foreground behavior, sound after gesture, offline practice, reconnect, and real leaderboard submission.

Required work method:
Stage 1 — Full inspection
- Investigate the whole relevant flow before editing.
- Use targeted searches and inspect adjacent routes, overlays, responsive states, service worker, security headers, database path, and deployment configuration.
- Distinguish verified facts from assumptions.
- For every copied game, perform a **source-bundle audit before diagnosis**: VEU must be online (`status`: server UP and browser CONNECTED); inspect every game-frame document/script/fetch/WASM/data/image/audio request; save the source frame HTML and its bootstrap scripts; identify the exact runtime build, preload assets, source callbacks, platform SDK/ad hooks, orientation hooks, and first real puzzle action. Finding only the main payload is never enough evidence to call a game incompatible.
- Compare the real source behavior against the local direct-page behavior before editing the feed. If the asset or lifecycle audit is incomplete, say so plainly—never claim the game is impossible or needs a rebuild.

Stage 2 — Complete implementation
- Implement the entire scoped change, including adjacent states and documentation.
- Preserve user changes and do not rewrite unrelated work.
- Prefer simple, fail-closed architecture over fragile patches.

Stage 3 — Verification
- Run npm run check.
- Use the VEU workspace for real browser verification:
  C:\Project C\Auction Main\Main\Auction\visual-editor\visual-editor-workspace
- Test the confirmed Tip Tap port (last verified: `http://127.0.0.1:3103/`) at 390x844 and desktop.
- Test the direct copied-game page and the real feed swipe path.
- Prove the game starts without a Play/Press-to-play gate.
- Confirm the real gameplay-start signal, changing frames, touch controls, score callback, and off-screen iframe removal.
- Clear network history and prove project traffic uses only the Tip Tap/Replit origin plus intentional local data/blob URLs.
- Treat any VEU-injected __vwe_panel resources as tooling, not product resources, and verify product-origin entries separately.
- Do not treat old VEU console/network history as a current product failure. Clear it, reload the exact local page, and then inspect only the fresh product-origin records.

Stage 4 — Zero-trust review
- Review the diff, run git diff --check, rerun focused tests, and inspect mobile/desktop again.
- Search for reachable bypasses, stale documentation, hidden source URLs, ad hooks, unsafe external requests, duplicate downloads, zombie timers/audio, fake capability claims, and Replit persistence mistakes.
- If a real issue remains inside scope, fix it before reporting completion.

Current verified Subway facts as of 2026-07-26:
- Local mirror: public/games/subway-surfers
- Captured build: b05f1bb8-3159-4c02-8066-4dc1327308e0
- Raw local package: 15,729,037 bytes
- Observed eager runtime response bodies: 15,634,211 bytes across 158 unique requests
- Estimated Brotli-capable whole-mirror cold transfer: 8,935,673 bytes
- Platform SDK, ads, remote leaderboard, analytics, and source network dependencies are locally replaced or blocked.
- The original game reaches a PRESS TO PLAY canvas. The Tip Tap bridge auto-dispatches the verified local canvas interaction and waits for the original SDK gameplay-start signal.

Current verified Dino facts as of 2026-07-26:
- Local mirror: public/games/dino-game
- Captured version: 09a3212c-2757-4232-93dc-c002f4ac007f
- Raw local package: 85,200 bytes across 23 files
- Its runtime is an external same-origin script, so the strict production CSP does not require unsafe-inline or unsafe-eval.
- A 390x844 direct-page VEU run reached gameplay automatically and advanced distance with only same-origin product requests.
- A visible feed run required no Play interaction, completed with a real score, and its iframe was removed after swiping away.
- Platform ads and remote calls are replaced or fail closed locally.

Current verified Fruit Ninja facts as of 2026-07-26:
- Local mirror: `public/games/fruit-ninja`
- Source creator: Storms
- Source game/version IDs: `8b32c0f4-2dcb-4fdd-bf8b-16df63b01532` / `255af3fb-6d80-441b-8cef-e07ff9a9075c`
- 121 original files were captured; the local package is about 34.6 MB before build compression.
- The Poki SDK, ads, analytics, tracking, and remote services are replaced or absent.
- Auto-start follows the source's own home-to-gameplay transition.
- The real source `showResult()` integer score is forwarded to the same-origin Tip Tap server.
- Dedicated browser evidence used VEU 3470 and isolated CDP 9240 after shared feature-5 was proven unsafe.
- Portrait preserves the landscape playfield with letterboxing; use landscape orientation for the final APK demo.

Current verified Stickman Fury facts as of 2026-07-26:
- Local mirror: `public/games/stickman-fury`
- The captured package has 97 original assets, including all 56 levels.
- The local bridge removes the Poki SDK/ads/analytics dependency, resolves
  commercial breaks immediately, and declines rewarded placements.
- Feed autoplay reached Stage 1 without a click; desktop controls and the
  390x844 on-screen jump control changed gameplay.
- Scrolling off-card removes the iframe; returning recreates and resumes it.
- A clean direct reload observed 101 local requests, zero external requests,
  zero failures, and zero warnings/errors.
- Leave it unranked until the source owner supplies a verified score callback.
- Detailed evidence: `docs/STICKMAN_FURY_PROGRESS.md`.

Current verified Johnny Trigger - Sniper facts as of 2026-07-27:
- Local mirror: `public/games/johnny-trigger-sniper`
- Source creator: SayGames
- Source game/version IDs: `994568e9-1512-4e00-a24d-e431e3eae6b1` / `1642d4b2-69f2-40ac-b15f-44bbefebb761`
- Unity 2022.3.18f1 package: 276 files, 75,472,239 bytes, and 263/263 Addressables catalog files present.
- The local Poki bridge is ad-free; rewarded requests fail closed with no reward.
- Isolated desktop and 390x844 browser runs reached the original Mission 1 aiming scene without a Play button.
- A trusted 390x844 touch interaction advanced the original game from Mission 1 to Mission 2.
- Product traffic stayed same-origin with no network-lock reports. VEU toolbar localhost:3456 diagnostics are not product traffic.
- Feed teardown was proven by switching to Dino Runner and observing no Johnny iframe.
- No verified source score callback exists, so the game is deliberately unranked.
- Keep `warmFullMirror: false`; preload only startup and first-play assets. Warming all later levels competes with Unity startup.
- Keep only the active copied-game iframe and one next copied-game preboot.
- Sound toggles must post mute state into the existing iframe and must not
  rebuild its URL or reload Unity.
- Production Brotli sidecars reduce the main WASM from 19,177,397 to 6,074,820
  bytes and the main data file from 6,144,797 to 1,926,127 bytes, losslessly.
- The 2026-07-27 gate passed the release audit, TypeScript, all 119 tests, the
  production build, live desktop autoplay, 390x844 responsive layout, live
  mute/unmute, and zero external frame requests.
- Do not promise an instantaneous never-cached launch for this 75 MB Unity package. Use ahead-of-swipe hidden preboot and state cold-start limits honestly.

Known external blockers:
- No destination GitHub remote has been supplied.
- No final Replit app, production database, hostname, or deployment secrets have been supplied.
- OAuth production registrations are not supplied.
- APK signing identity and final asset-links values are not supplied.
- Never claim those external steps are complete without live evidence.

At the beginning of your work, report:
1. current git status without overwriting user changes,
2. current test/build status,
3. current local runtime and port owner,
4. the single highest-value next milestone,
5. any external fact that genuinely blocks completion.

Then complete the highest-value in-scope milestone rather than only describing it.
```
