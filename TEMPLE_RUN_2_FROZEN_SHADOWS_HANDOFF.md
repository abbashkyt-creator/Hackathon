# Temple Run 2: Frozen Shadows — continuation handoff

## Goal

Ship the authorized Temple Run 2: Frozen Shadows source mirror as a fast, ad-free Tip Tap feed game. It must run from this repository and eventual Replit deployment only: no Poki iframe, Poki SDK, leaderboard, ad, analytics, or source-site runtime request.

## What is implemented

- Complete local runtime mirror: `public/games/temple-run-2-frozen-shadows/`.
- The captured Imangi/Babylon/WebGL package includes its JavaScript chunks, Arctic track packs, model files, textures, audio, font, and local Draco decoder.
- `index.html` loads `poki-sdk-local.js`, a no-op local compatibility surface. It makes no network, advertising, leaderboard, or analytics call.
- `scripts/patch-temple-run-local.cjs` removes the captured release host redirect, redirects Draco WASM to `./vendor/draco_decoder_gltf.wasm`, and shortens only the original first-run scripted tutorial timers. The source still owns the actual PLAY/start handler.
- `tiptap-autostart.js` watches for the source-owned `PLAY` button and clicks it once only when `autoplay=1` is present.
- Feed registry, game component, styles, runtime/preload configuration, offline catalog, server seed catalog, and API test all include `temple-run-2-frozen-shadows`.
- The currently used local development database was updated with the same game row; a fresh server automatically seeds it from `server/db.ts`.

## Key files

- `src/games/TempleRun2FrozenShadowsGame.tsx` — active-card local iframe.
- `src/App.tsx`, `src/types.ts`, `src/games/index.ts`, `src/game-runtime.ts`, `src/offline-catalog.ts`, `src/styles.css` — Tip Tap integration.
- `server/db.ts` — durable server catalog entry.
- `tests/api.test.ts` — bootstrap count and Temple entry assertion.
- `scripts/extract-temple-run-from-har.cjs` — HAR extractor; treats binary HAR text as base64 even when VEU omits `encoding`.
- `scripts/recover-temple-run-cache-assets.cjs` — recovered the two already-captured missing base packs from the isolated Chrome cache.
- `scripts/extract-temple-run-draco.cjs` — extracts the captured Draco decoder.
- `scripts/generate-temple-run-manifest.cjs` — regenerate hashes after every local runtime patch.

## Original capture evidence and isolation

- Original page: `https://poki.com/en/g/temple-run-2-frozen-shadows`.
- Captured source package origin: `https://43a9c68e-4e5a-4916-8fdd-d4a23bc94d04.gdn.poki.com/a43bfe6b-00c1-42e0-bb51-c2bd5a1c0395/`.
- Isolated VEU: server `http://127.0.0.1:3499`, Chrome CDP port `9255`, profile `C:\Users\Abbas\AppData\Local\VEU_ChromeProfile-9255`.
- Use this isolated pair only for further source checks. Do not attach VEU to the in-app browser or another agent’s Chrome.
- Captured HAR: `C:\Project C\Auction Main\Main\Auction\visual-editor\visual-editor-workspace\projects\visual-editor-ultimate-v3.0-USE-THIS\data\easy-net\xray-capture-1785097814950.har`.

## Verification already completed

1. Direct local mirror rendered the real Frozen Shadows WebGL level and the source title screen in the isolated VEU browser.
2. Direct local network capture had no failed requests or console errors after local Draco routing. Game endpoints were only `127.0.0.1`; VEU toolbar WebSocket warnings are tooling-only and not game runtime traffic.
3. The Tip Tap catalog route `/?game=temple-run-2-frozen-shadows` displayed the new title, rule, source-credit line, and local iframe before the prior local dev server stopped.
4. `npm run typecheck` passed.
5. `npm test -- --run tests/api.test.ts` passed: 7 files, 41 tests.

## Resume checklist

1. From `C:\Project C\Hackation`, start the local development server on port 3103 (or another unused port):

   ```powershell
   $env:PORT = '3103'
   $env:SQLITE_PATH = './data/tip-tap.db'
   npm run dev
   ```

2. Confirm `GET /api/bootstrap` contains 20 games and the Temple slug.
3. In the isolated VEU session, open `http://127.0.0.1:3103/?game=temple-run-2-frozen-shadows`, wait through source loading, and use `veu shot` plus VEU's frame-aware `look`/`read` commands to confirm that the source is in its running scene rather than left on an intro or `PLAY` screen. Do not infer a failure from VEU's injected toolbar WebSocket notices.
4. Run `veu issues` and `veu xray endpoints`. Accept only local `127.0.0.1` game endpoints; `localhost:3456` messages belong to the VEU toolbar and must not be treated as game failures.
5. Set a 390 x 844 mobile emulation viewport in the same isolated CDP browser, reload the feed route, and verify source canvas, auto-start, and swipe controls. Keep `touch-action: none` on `.temple-run-2-frozen-shadows-game`.
6. Before Replit deployment, run `npm run check`; make sure `public/games/temple-run-2-frozen-shadows/` is committed and deploy the repository. Do not use a Poki URL or external source runtime in Replit.

## Rules for future agents

- Do not replace this source with a lookalike.
- Do not send gameplay, score, leaderboard, ad, or analytics requests to Poki/Imangi/third parties.
- If changing any mirror file, run both:

  ```powershell
  node scripts/patch-temple-run-local.cjs public/games/temple-run-2-frozen-shadows/bundle.js
  node scripts/generate-temple-run-manifest.cjs
  ```

- Keep the original source credit in the feed but do not claim source-hosted functionality.
- Replit will serve the same local files. APK packaging is a separate final wrapper step (for example Capacitor) after the Replit web build is stable.
