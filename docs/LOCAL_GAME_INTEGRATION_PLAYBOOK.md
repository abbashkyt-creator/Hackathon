# Local Game Integration Playbook

This is the repeatable process for adding a licensed external game to Tip Tap Games. It is intentionally explicit so an inexpensive coding agent can follow it without guessing. The result must be a local, mobile-playable game card with no source-site, ad, analytics, or source-leaderboard traffic.

## Rules that never change

- The owner must have permission to redistribute every copied asset. Preserve the creator, source URL, capture date, and a public-release permission reminder in `public/games/<slug>/NOTICE.txt`.
- Never iframe or link to the source host. The final app serves every needed asset itself.
- Load `public/games/_shared/network-lock.js` before copied-game code. Do not weaken CSP or whitelist an original CDN when a copied game breaks.
- A visible card enters real gameplay automatically. Do not fake gameplay with video, and do not fake a score or a completion event.
- Only publish a score if VEU proves that the source provides a real integer score/completion signal. Never derive scores from time, OCR, pixels, DOM guesses, or a guessed level counter.
- Do not touch another agent's worktree or browser. Each agent must use its own VEU server, CDP port, and Chrome profile.

## Multi-agent VEU isolation

| Worktree | VEU server | Chrome CDP |
| --- | ---: | ---: |
| `C:\Project C\Hackation worktrees\feature-1` | 3456 | 9222 |
| `feature-2` | 3457 | 9223 |
| `feature-3` | 3458 | 9224 |
| `feature-4` | 3459 | 9225 |
| `feature-5` | 3460 | 9226 |

From the assigned worktree, run `start-veu.cmd`, then `veu up`, `veu doctor`, and `veu go <URL>`. If Chrome does not launch, use that worktree's CDP port with a unique `--user-data-dir`; never reuse another worker's port/profile. Browser evidence belongs to the worktree that gathered it. Merge code only after reviewing the patch.

## Stage 1 — investigate before edits

1. Read `README.md`, `docs/ARCHITECTURE.md`, `docs/AI_AGENT_HANDOFF.md`, `docs/APK-RELEASE.md`, and applicable `AGENTS.md` files.
2. Run `git status --short`; preserve unrelated changes. Verify the actual Tip Tap server and health URL. On this PC, `localhost:3000` can be another Docker/Open WebUI service, so prove the owner before testing.
3. Use the assigned VEU browser on the source page. Record creator, device controls, actual game-frame URL, requests, byte sizes, and source-game lifecycle.
4. Classify the payload before promising work: HTML5 canvas/DOM is usually best; Unity WebGL requires every data/WASM/Addressables file; SWF requires a local Ruffle runtime and has a major cold-load cost.
5. Inventory every required asset, content type, SHA-256, platform SDK call, ad/tracker call, and license condition. If it cannot be localized legally and completely, reject it.

## Stage 2 — mirror locally

1. Create `public/games/<slug>/` with the original relative asset layout. Do not scrape logins, bypass challenges, or copy ads/trackers.
2. Add `MIRROR-MANIFEST.json` with provenance, local files, runtime/license, and honest limitations. Add `NOTICE.txt` with attribution and deployment-permission reminder.
3. Add `index.html`; the first executable script must be `/games/_shared/network-lock.js`. All game paths must be local. Add a small `js/tiptap-platform-bridge.js` only for parent lifecycle, mute, automatic real start, and verified score forwarding.
4. Replace any mandatory platform SDK with a minimal local no-ad adapter. A rewarded/ad request must resolve honestly as no reward; it must never download or display an outside ad.
5. For SWF, self-host Ruffle beside the game, set `publicPath` to that local directory, set `allowNetworking: 'none'`, and set `allowScriptAccess: false` unless a reviewed source callback requires it. Keep Ruffle's MIT/Apache notices.
6. Add `preload-manifest.json` with the actual entry page, bridge, runtime bootstrap, runtime binary, and game payload. It enables same-origin pre-warming, but it cannot make a large cold payload literally instantaneous.

## Stage 3 — wire the app

1. Add the slug to `src/types.ts`, `server/db.ts`, and `src/offline-catalog.ts` with matching title/rule/accent.
2. Add manifests to `src/game-runtime.ts`.
3. Add `src/games/<Game>Game.tsx`: mount only while active, use a same-origin sandbox, forward mute/auto-start, and validate event origin/source.
4. Export it from `src/games/index.ts`; add it to `GAME_COMPONENTS`, `GAME_EYEBROWS`, captions, and CSS in `src/App.tsx`.
5. Add a `server/score-policy.ts` rule only after an actual source score signal is proved. If no callback exists, leave the game playable and visibly unranked rather than creating fake leaderboard data.
6. Update tests and all handoff/demo/architecture docs. A doc may not say a game works unless its catalog, wrapper, local folder, browser proof, and network proof all exist.

## Stage 4 — verify

1. Run `npm run check` and `git diff --check`.
2. Use a confirmed Tip Tap port. Test `/?game=<slug>` and `/games/<slug>/index.html?embedded=tiptap&autoplay=1` in the assigned VEU browser.
3. At 390x844 and desktop, verify without a click: advancing gameplay, touch/pointer input, mute, reload repeatability, and iframe unmount after a swipe.
4. Inspect every network request in VEU. Normal local play may use only the Tip Tap origin, local VEU tooling, and browser-internal URLs—never Poki, GDN, ads, analytics, trackers, remote config, or source leaderboards.
5. Inspect issues and CSP. A blocked external request is not a pass if it leaves the game broken. Verify no network-lock report during normal play.
6. If ranked, finish a real run and prove `/api/scores` plus `/api/leaderboard`. If unranked, prove no score is submitted and document why.

## 67 Game reference implementation

VEU found `67.swf` (3,961,719 bytes) behind `https://poki.com/en/g/67-game`. It is now hosted locally through the local Ruffle runtime. A privileged real-browser click verified the original start screen and level-one red hang-up interaction; JavaScript-generated clicks cannot start the source SWF because browsers mark them untrusted.

The production 67 Game card is the original local SWF in `public/games/67-game`, hosted by `src/games/SixtySevenGame.tsx`. It has no source-site, ad, or analytics dependency. Its own start screen requires one genuine tap, and the source does not expose a verified score/completion callback, so it must remain unranked until the rights holder supplies a documented callback or source project.

## Replit and APK gate

- Build with the documented Node version and `npm run build`; ensure every `public/games/<slug>` file deploys.
- Set `DATABASE_URL` for production rankings. Never use Replit's ephemeral filesystem as a production leaderboard.
- Repeat mobile, desktop, network, CSP, and service-worker tests against the Replit URL. Confirm native games and copied-game assets remain same-origin.
- Create a TWA/APK only after the final HTTPS Replit URL, package name, signing-key custody, asset-link facts, Android device test, and offline behavior are verified. A local browser run is not APK proof.
