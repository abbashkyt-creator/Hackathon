# Theft City integration completion handoff

Updated: 2026-07-26

## Goal

Integrate the original permitted Theft City Unity WebGL game into Tip Tap, locally hosted with no Poki/source/ad/analytics runtime traffic, automatic startup, desktop/mobile support, and a feed entry.

## Completed

- Source game/version discovered with the private isolated VEU:
  - game id: `629eee0a-0c5c-469a-b388-7eb076f7054f`
  - version id: `1e5722e5-0d6a-43d7-8fbf-ecff22f44fe5`
- Core Unity build mirrored under `public/games/theft-city/Build`.
- Addressables catalog parsed.
- All 518 real `.bundle` files mirrored under
  `public/games/theft-city/StreamingAssets/aa/WebGL`.
  - 518 other catalog strings were confirmed aliases (404), not files.
  - Bundle download total: 87,198,841 bytes.
  - Zero download failures.
- Complete local package: 530 files / 141,947,575 bytes.
- Added local launcher:
  - `public/games/theft-city/index.html`
  - `public/games/theft-city/tiptap-bootstrap.js`
  - `public/games/theft-city/tiptap-platform-bridge.js`
  - `public/games/theft-city/tiptap-shell.css`
  - `public/games/theft-city/NOTICE.txt`
  - `public/games/theft-city/MIRROR-MANIFEST.json`
  - `public/games/theft-city/preload-manifest.json`
- Source Poki SDK/ads/analytics are not loaded. The shared network lock is the
  first script in the launcher.
- Added `TheftCityGame.tsx` and registered the slug/component in:
  - `src/types.ts`
  - `src/games/index.ts`
  - `src/App.tsx`
  - `src/game-runtime.ts`
  - `src/offline-catalog.ts`
  - `server/db.ts`
- Added Theft City build MIME handling in `server/app.ts`.
- Added resumable helper `scripts/mirror-theft-city-addressables.mjs`.

## Important runtime finding and applied fix

The first real browser load reached the local page but stayed at 0%. VEU proved
Chrome reported `ERR_CONTENT_DECODING_FAILED`.

Cause: the source filenames ended in `.br`, but the CDN HTTP client had already
decompressed their bytes. The local server advertised Brotli again, causing a
second decompression attempt.

Fix already applied:

- Renamed the three decompressed Unity files to `.data`, `.framework.js`, and
  `.wasm`.
- Updated `tiptap-bootstrap.js` URLs.
- Removed `Content-Encoding: br` for Theft City and retained correct MIME types.
- Regenerated the mirror/preload manifests and hashes.

Do not undo this fix or re-add Brotli encoding unless the actual stored bytes
are replaced with Brotli-compressed bytes.

## Previous interruption (resolved)

The shared Windows machine previously became heavily saturated after
writing/scanning 518 new bundle files. The reboot resolved that condition and
the verification below was completed.

## Final fixes completed after reboot

- Repaired the local Poki compatibility lifecycle:
  - `ready` is delivered whether the Unity bridge or Unity instance initializes
    first.
  - commercial breaks complete immediately with no ad.
  - rewarded breaks return `false` with no ad.
  - share/user/token/login callbacks now return the Unity completion/rejection
    messages expected by the original game.
- Guarded pointer-lock failures so automation or embedded WebViews cannot crash
  the Unity player.
- Added first-load focus/activation without adding an outer Play button.
- Added a data favicon to prevent a useless 404.
- Losslessly Brotli-compressed the Unity core:
  - raw core: 54,423,031 bytes
  - compressed core: 22,611,207 bytes
  - complete source package: 110,138,271 bytes
- Added repeatable maintenance tools:
  - `scripts/mirror-theft-city-addressables.mjs`
  - `scripts/compress-theft-city-core.mjs`
  - `scripts/refresh-theft-city-manifest.mjs`
  - `scripts/audit-theft-city.mjs`

## Final verification

- TypeScript: passed.
- Theft City audit: 530 files, 11 critical preloads, zero errors.
- Repository release audit: passed.
- Test suite: passed (6 files, 27 tests in the final run).
- Vite production client build: passed.
- Deployment prune: passed.
- Deployment Brotli precompression: passed (1,046 assets).
- Production server bundle: passed.
- Direct Unity cold-cache readiness on loopback: about 2.1 seconds.
- Tip Tap iframe readiness:
  - warm desktop run: about 3.2 seconds
  - lifecycle-active isolated run: about 14 seconds using software WebGL
- Desktop feed at 1440x900:
  - Unity ready and visible
  - tutorial starts automatically
  - joystick/shoot/jump UI visible
- Mobile feed at 390x844:
  - parent and iframe both visible
  - Unity ready
  - responsive portrait layout
  - character, target, crosshair, joystick, shoot and jump controls visible
- Runtime endpoint audit:
  - all game requests were local `127.0.0.1`
  - no Poki, ad, analytics, or source-CDN runtime request
  - `localhost` traffic seen in screenshots/network logs belonged only to the
    injected VEU development toolbar and is absent from the shipped game.

## How to test

1. Work in `C:\Project C\Hackation`.
2. Start a dedicated app server on a free port (for example 3105):
   - PowerShell: `$env:PORT='3105'; npm run dev`
3. Test direct game:
   - `http://127.0.0.1:3105/games/theft-city/index.html?embedded=tiptap&autoplay=1&muted=1`
4. Test feed URL:
   - `http://127.0.0.1:3105/?game=theft-city`
5. Run:
   - `node scripts/audit-theft-city.mjs`
   - `npm run typecheck`
   - `npm test`
   - `npm run audit:release`
   - `npm run build`

## Replit final deployment requirements

The Replit commands are already configured:

- build: `npm run build`
- run: `npm start`

Before production deployment, configure these Replit secrets:

- `DATABASE_URL`: a persistent PostgreSQL connection string.
- `SESSION_SECRET`: a unique random value of at least 32 characters.

The server intentionally refuses production startup without these values so
scores/sessions cannot silently use ephemeral storage.

## Private VEU state before restart

- VEU server was `http://127.0.0.1:3471`
- CDP port was `9231`
- Chrome profile was
  `C:\Users\Abbas\AppData\Local\VEU_Identities\kitty-loves-birds-2-codex`

After reboot, new isolated ports/profile may be safer than reusing these.
