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
3. Run `veu status` first. Require `server: UP` and `browser: CONNECTED`; otherwise repair VEU before treating any browser evidence as valid.
4. Use the assigned VEU browser on the source page. Record creator, device controls, actual game-frame URL, and **all** document/script/fetch/worker/WASM/data/image/audio requests—not only API traffic.
5. Save the game-frame document and every game-owned bootstrap/launcher script. Inventory runtime configuration, preload UI/assets, source callbacks, orientation behavior, platform SDK calls, ad/tracker calls, and first-puzzle controls. A payload file alone is never a complete integration.
6. Classify the full bundle before promising work: HTML5 canvas/DOM is usually best; Unity WebGL requires every data/WASM/Addressables file; SWF may require the exact source Ruffle build plus companion launcher/callback files.
7. Inventory every required asset, content type, SHA-256, platform SDK call, ad/tracker call, and license condition. Play the original far enough to prove the real answer/control; do not call it stuck based on a guessed interaction. If it cannot be localized legally and completely, reject it.

## Stage 2 — mirror locally

1. Create `public/games/<slug>/` with the original relative asset layout, including the source launcher/bootstrap, exact compatible runtime, preload assets, and required game callbacks—not merely the main payload. Do not scrape logins, bypass challenges, or copy ads/trackers.
2. Add `MIRROR-MANIFEST.json` with provenance, local files, runtime/license, and honest limitations. Add `NOTICE.txt` with attribution and deployment-permission reminder.
3. Add `index.html`; the first executable script must be `/games/_shared/network-lock.js`. All game paths must be local. Preserve the source launch order and replace any host SDK with a narrowly scoped local bridge for required source lifecycle, mute, no-ad behavior, and verified score forwarding only.
4. Replace any mandatory platform SDK with a minimal local no-ad adapter. A rewarded/ad request must resolve honestly as no reward; it must never download or display an outside ad.
5. For SWF, self-host Ruffle beside the game, set `publicPath` to that local directory, set `allowNetworking: 'none'`, and set `allowScriptAccess: false` unless a reviewed source callback requires it. Keep Ruffle's MIT/Apache notices.
6. Add `preload-manifest.json` with the actual entry page, bridge, runtime bootstrap, runtime binary, and game payload. It enables same-origin pre-warming, but it cannot make a large cold payload literally instantaneous.

## Stage 3 — wire the app

1. Add the slug to `src/types.ts`, `server/db.ts`, and `src/offline-catalog.ts` with matching title/rule/accent.
2. Add manifests to `src/game-runtime.ts`.
3. Add `src/games/<Game>Game.tsx`: mount only while active, forward
   mute/auto-start, and prefer an opaque-origin sandbox such as
   `sandbox="allow-scripts allow-pointer-lock"`. Validate `event.source` plus a
   private message discriminator. If the source needs synchronous storage,
   expose only its documented save keys through a parent bridge. Use
   `allow-same-origin` only when an opaque sandbox is proven incompatible and
   document the resulting parent-origin access risk.
4. Export it from `src/games/index.ts`; add it to `GAME_COMPONENTS`, `GAME_EYEBROWS`, captions, and CSS in `src/App.tsx`.
5. Add a `server/score-policy.ts` rule only after an actual source score signal is proved. If no callback exists, leave the game playable and visibly unranked rather than creating fake leaderboard data.
6. Update tests and all handoff/demo/architecture docs. A doc may not say a game works unless its catalog, wrapper, local folder, browser proof, and network proof all exist.

## Stage 4 — verify

1. Run `npm run check` and `git diff --check`.
2. Use a confirmed Tip Tap port. Test `/?game=<slug>` and `/games/<slug>/index.html?embedded=tiptap&autoplay=1` in the assigned VEU browser.
3. At 390x844 and desktop, verify the exact source start behavior, advancing gameplay, touch/pointer input, mute, reload repeatability, and iframe unmount after a swipe. A genuine source user-gesture requirement is a documented product exception/blocker; never hide it with a fake DOM event or claim the game auto-started.
4. Inspect every network request in VEU. Normal local play may use only the Tip Tap origin, local VEU tooling, and browser-internal URLs—never Poki, GDN, ads, analytics, trackers, remote config, or source leaderboards.
5. Clear VEU history, reload, then inspect fresh issues and CSP. A blocked external request is not a pass if it leaves the game broken. Verify no network-lock report during normal play, and distinguish VEU tooling traffic from product traffic.
6. If ranked, finish a real run and prove `/api/scores` plus `/api/leaderboard`. If unranked, prove no score is submitted and document why.
7. For an unranked game, also prove the feed omits the Ranks button, run-ticket
   request, result sheet, and permanent syncing indicator.

## 67 Game reference implementation

VEU found the source is a bundle, not just `67.swf` (3,961,719 bytes): it also loads `67_webgl.js`, the source-deployed `ruffle_2023_12_16` core/WASM, and portrait/landscape preload images. The local integration preserves the required source lifecycle through a reviewed no-ad bridge, with only Poki SDK, ads, analytics, and remote services removed. Real browser input verified original level 1 advancing to level 2; a 390×844 touch-emulated run also entered original gameplay. JavaScript-generated DOM clicks cannot start the source SWF because browsers mark them untrusted.

The production 67 Game card is the original local SWF bundle in `public/games/67-game`, hosted by `src/games/SixtySevenGame.tsx`. It has no source-site, ad, or analytics dependency. Its own start screen requires one genuine tap, and the source does not expose a verified score/completion callback, so it must remain unranked until the rights holder supplies a documented callback or source project.

## Archery King reference implementation

The 4J source page was only a wrapper. VEU traced the actual direct game frame to GameDistribution and then audited its source HTML, local loader, runtime, assets, SDK calls, and jQuery events before copying anything. `public/games/archery-king` mirrors 451 game-owned source files in their original relative layout. The local `index.html` omits the remote wrapper, more-games service, and SDK; `tiptap-platform-bridge.js` provides the minimal no-ad `gdsdk` methods the source actually calls; `tiptap-bootstrap.js` preserves the source launcher/event order, starts the genuine solo level one after preload, and forwards only its original `save_score` event.

At 390×844 in isolated VEU, the direct local page produced a live canvas, accepted original pointer-driven aiming/shooting, and emitted the real score event through the bridge without product-origin external or blocked network requests. The source's remote multiplayer button is intentionally hidden because that feature depends on a proprietary third-party service; document such an exclusion instead of silently replacing it with fake multiplayer.

## Plonky reference implementation

Plonky is a Construct 3 / Box2D package, not a video or Poki iframe. Its source index starts `scripts/main.js`, which loads `scripts/c3main.js`, `data.json`, Box2D, image sheets, and local audio. Mirror that full relative graph under `public/games/plonky` before wiring the card.

The source `main.js` contains a Poki adapter that injects the remote SDK and can send lifecycle beacons. Preserve the Construct runtime, but replace that one SDK path with `scripts/tiptap-poki-sdk.js` and remove the beacon function. The shim supplies only local no-op lifecycle/no-ad methods. Do not rely on the network lock as the normal control path: regular local play must not attempt those external calls.

The source exposes no verified final score/completion event. `PlonkyGame.tsx` mounts it only while active, forwards mute/auto-start, reports runtime errors, and intentionally submits no score. Add a server policy only after a future source audit proves an actual integer score callback.

## Smash Room reference implementation

Smash Room demonstrates the lightweight HTML5/Three.js path. The Poki page is not the source package: isolated VEU network discovery identified the actual Happylander Ltd frame, then captured its original app loader, Three.js/GSAP/Howler dependencies, source images, font, audio, text, settings, and each object JSON file before copying any asset.

The local page creates the original `canvas-wrapper` and `canvas` elements, loads the original source scripts in dependency order, and invokes the source's `loadLang("en")` function from an external same-origin bootstrap file. Its optional `window.PokiSDK` branches handle host measurements and ad breaks, so the local page must not create that object. This lets the real source use its own no-SDK fallback with no third-party runtime traffic.

Keep `MIRROR-MANIFEST.json` hashes current after every local integration-file change, and list every game-owned runtime asset in `preload-manifest.json`. Verify a direct local URL before feed integration: source `gameState` should become `game`, a Three.js canvas should be present, and network requests should resolve only under the local `/games/smash-room/` prefix. VEU's `clean` action may hide a full-screen canvas as if it were a cookie overlay; inspect the canvas inline style before diagnosing a blank game.

## Fruit Ninja reference implementation

The Poki page identifies the browser edition's developer as Storms. The page's
current `games.poki.com` wrapper points at version
`255af3fb-6d80-441b-8cef-e07ff9a9075c` on game ID
`8b32c0f4-2dcb-4fdd-bf8b-16df63b01532`. This is a Phaser/Three.js game with
Ammo WASM, FBX fruit models, original audio, and a fixed landscape playfield.

Audit the source from its live cross-origin game frame, not by opening the GDN
index directly: Cloudflare may reject a bare index request even though the
normal embedded session and game-owned assets work. Use the frame's Performance
resource entries plus the copied `main.bundle.js` preload declarations to prove
the complete asset graph. The verified startup graph contains 121 original
files; the local mirror is about 34.6 MB before deployment compression.

Remove the external Poki SDK scripts from the launcher. The local bridge may
resolve lifecycle and commercial breaks immediately, but `rewardedBreak` must
resolve `false` because no reward ad was shown. The source's genuine game-over
path is `showResult()`, and its real integer score is `this.gameData.score`;
forward only that value. Auto-start uses the same source transition as slicing
the menu watermelon (`changeCurrentScreen("GameScreen")` then
`moveToGameplay()`), after the source finishes loading its home scene.

For browser isolation, do not trust a named profile merely because it was
assigned earlier. Re-check the CDP target immediately before each navigation.
If another agent changes it, stop using that profile and launch a dedicated VEU
server, CDP port, and Chrome user-data directory. Fruit Ninja was verified in a
dedicated VEU server on 3470 with isolated CDP 9240.

## Johnny Trigger - Sniper reference implementation

Johnny Trigger is a SayGames Unity 2022.3.18f1 WebGL build with Addressables.
The authorized local package is not only the WASM/data/framework trio: its
catalog contains 263 runtime bundles. `scripts/mirror-johnny-trigger.mjs`
captures that exact graph through the resolved source frame, and
`scripts/finalize-johnny-trigger.mjs` fails if any catalog entry is absent
before regenerating file hashes.

The verified local package contains 276 files and 75,472,239 bytes, with
263/263 catalog runtime files present. The Poki page shell, SDK, ads, analytics,
tracking, remote identity, sharing, and source leaderboards are excluded. The
local bridge supplies only the lifecycle methods the Unity build needs;
commercial breaks complete immediately and rewarded breaks return `false`.

The original game reached the Mission 1 live aiming scene without a Play
button in an isolated desktop run and at 390x844. Product code made no external
requests and the network lock reported none; `localhost:3456` records visible
in that session belonged to the injected VEU toolbar, not the game. Switching
the feed to Dino Runner removed the Johnny iframe completely. A trusted
390x844 touch interaction advanced the original game from Mission 1 to Mission
2, proving the mobile control path rather than only the responsive layout.

Do not warm this game's entire mirror. Most bundles are later levels, and
fetching all 75 MB while Unity boots makes Mission 1 slower. Its runtime entry
sets `warmFullMirror: false`, so ahead-of-swipe warming uses the launcher,
Unity build, catalog, gameplay bundle, and first-level bundle only. Even with
that optimization, a never-cached Unity build is not literally instant; place
it far enough ahead in the feed for hidden preboot and do not promise
TikTok-speed cold launch on a slow connection.

The 2026-07-27 hardening pass also established these reusable rules:

- Changing the feed sound setting must post state to the live iframe. Never put
  the changing mute value in the iframe URL, because that reloads Unity and
  discards the player's current mission.
- Keep only the active copied game plus one next copied game mounted. Preparing
  several hidden Unity/WebGL games at once competes for network, memory, CPU,
  and audio resources.
- Precompress `.wasm`, `.data`, and `.bundle` files as well as text assets.
  Johnny's 19,177,397-byte WASM transfers as a 6,074,820-byte Brotli sidecar
  and its 6,144,797-byte data file as 1,926,127 bytes, without changing the
  original files.
- If a game has no verified score callback, the bootstrap must mark it
  `ranked: false`; the feed must omit both run-ticket creation and the Ranks
  control.

## Replit and APK gate

- Build with the documented Node version and `npm run build`; ensure every `public/games/<slug>` file deploys.
- Set `DATABASE_URL` for production rankings. Never use Replit's ephemeral filesystem as a production leaderboard.
- Repeat mobile, desktop, network, CSP, and service-worker tests against the Replit URL. Confirm native games and copied-game assets remain same-origin.
- Create a TWA/APK only after the final HTTPS Replit URL, package name, signing-key custody, asset-link facts, Android device test, and offline behavior are verified. A local browser run is not APK proof.
# Stickman Fury reference integration

The `stickman-fury` integration is the current reference for a small,
canvas-based Poki package:

1. Use an isolated VEU server, CDP port, and browser profile. Record the real
   iframe package URL and every game-CDN request after playing the source.
2. Mirror only the game package. Exclude the portal shell, advertising,
   analytics, account, and recommendation requests.
3. Reconstruct a local CSP-safe `index.html` with the shared network lock first,
   then the local platform bridge, original libraries, original `app.js`, and a
   tiny external bootstrap.
4. Implement the source SDK contract precisely. For Stickman Fury,
   `commercialBreak()` resolves immediately and `rewardedBreak()` resolves
   `false`; neither performs a network request.
5. Mount the iframe while its card is preparing, send pause/resume and mute
   messages, and focus the canvas when active. This preserves native keyboard,
   mouse, and touch controls while preventing the feed from stealing gestures.
6. Add the slug to the shared types, server and offline catalogs, component map,
   runtime/preload map, theme, creator caption, and API coverage.
7. Verify the source manifest hashes, CSP/no-inline-script rule, TypeScript,
   tests, production build, desktop controls, mobile touch controls, autoplay,
   and a clean local network trace.
