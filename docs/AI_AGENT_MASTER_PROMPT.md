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
5. Identify the current runtime owner and verify http://localhost:3000/api/health.
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
- 67 Game is the locally hosted original SWF running in local Ruffle. Do not substitute a lookalike/rebuild and do not invent a score. Its source-owned start icon needs one genuine user tap because browser JavaScript cannot create a trusted gesture; after that, its original phone puzzles run locally with no Poki or ad request.
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

Stage 2 — Complete implementation
- Implement the entire scoped change, including adjacent states and documentation.
- Preserve user changes and do not rewrite unrelated work.
- Prefer simple, fail-closed architecture over fragile patches.

Stage 3 — Verification
- Run npm run check.
- Use the VEU workspace for real browser verification:
  C:\Project C\Auction Main\Main\Auction\visual-editor\visual-editor-workspace
- Test http://localhost:3000/ at 390x844 and desktop.
- Test the direct copied-game page and the real feed swipe path.
- Prove the game starts without a Play/Press-to-play gate.
- Confirm the real gameplay-start signal, changing frames, touch controls, score callback, and off-screen iframe removal.
- Clear network history and prove project traffic uses only the Tip Tap/Replit origin plus intentional local data/blob URLs.
- Treat any VEU-injected __vwe_panel resources as tooling, not product resources, and verify product-origin entries separately.

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
