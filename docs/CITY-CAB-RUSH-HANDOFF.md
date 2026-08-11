# City Cab Rush handoff — 2026-07-27

## What is saved

City Cab Rush is integrated into the real Tip Tap checkout at
`C:\Project C\Hackation`, not the auxiliary worktree.

- Feed slug: `city-cab-rush`
- Local Unity game: `public/games/city-cab-rush/`
- React feed component: `src/games/CityCabRushGame.tsx`
- Runtime registration: `src/game-runtime.ts`
- Catalog/server registration: `src/offline-catalog.ts`, `server/db.ts`, and
  `src/types.ts`

The source used was the active U.S. mobile embedded build, discovered in the
isolated feature-5 VEU session:

```
https://05106d2f-b06f-497f-bfcf-4e719bde3d3a.gdn.poki.com/
28588554-220e-42ca-a0ad-a44c7cfa55cc/
```

The four captured runtime files are local and their hashes are in
`public/games/city-cab-rush/MIRROR-MANIFEST.json`.

## Runtime repairs already made

The source host transparently decompressed its response when the files were
captured. They therefore contain uncompressed Unity bytes even though the
source names ended in `.gz`. The local names were intentionally changed to:

- `Build/TaxiRush-V1.3.4.data`
- `Build/TaxiRush-V1.3.4.framework.js`
- `Build/TaxiRush-V1.3.4.wasm`

`tiptap-bootstrap.js`, the preload manifest, and the mirror manifest already
refer to those extensionless/uncompressed paths. Do not change them back to
`.gz` or add a `Content-Encoding: gzip` header; doing that causes
`ERR_CONTENT_DECODING_FAILED`.

Two local integration details are also required for this Unity build:

- City Cab is the only Unity mirror besides Subway Surfers that needs the
  narrowly-scoped `script-src 'self' 'unsafe-eval'` policy. Unity's
  WebAssembly compiler otherwise aborts before startup. The policy remains
  same-origin and `connect-src` remains local-only.
- `tiptap-shell.css` must preserve the browser's `hidden` state for the
  loading and error overlays. The base loading style sets `display: grid`, so
  without the explicit `[hidden] { display: none !important; }` rule, Unity
  runs successfully behind the dark loading overlay and appears blank.

## Local behavior implemented

- no external Poki SDK, adverts, source-host leaderboard, account, or
  analytics calls; the local compatibility object completes only the Unity
  lifecycle callbacks that the offline game needs
- shared network lock loaded first in `index.html`
- local Unity compatibility bridge with disabled-by-default owned-ad routing
- source Space plus a centered touch start are sent during the first five
  seconds after Unity becomes ready when `autoplay=1`; this covers the source
  build's desktop and mobile entry paths without repeating a gameplay action
- muted state is received from the Tip Tap parent
- coarse-pointer devices receive visible hold controls for left, right,
  accelerate, and brake; the controls map to Unity's arrow-key axes and
  release every held key on blur, page hide, visibility loss, or ad pause
- touch input is reserved for the Unity frame rather than feed scrolling
- the next City Cab card stays mounted for off-screen Unity warm-up

## Verification completed on 2026-07-27

- The original source capture was verified with isolated VEU/CDP.
- All four Unity runtime files are present locally and match the hashes in the
  mirror manifest.
- A fresh desktop run at `127.0.0.1:3110` completed Unity initialization,
  hid the loader (`hidden=true`, computed display `none`), had no runtime
  error, and visibly rendered the taxi driving scene both standalone and in
  the Tip Tap feed.
- The observed local page asset inventory contains only
  `http://127.0.0.1:3110` game resources, including the Unity loader,
  framework, WASM, and data payload. The local network lock remains first.
- Real Android touch steering has not been re-run in this repair pass and
  must be tested before final APK submission.
- `npm run typecheck` passed.
- Focused `tests/api.test.ts` passed (7 tests), including the City Cab CSP
  regression test.
- `npm run build` passed.
- `npm run audit:release` was rerun, but is currently blocked by unrelated
  stale provenance in `smash-room/game.css`; do not report a whole-repository
  release audit as passing until that independent issue is repaired.

## Safe retest recipe

1. Use the feature-5 isolated VEU profile below and a fresh local preview.
2. Visit `/?game=city-cab-rush` to test the feed, or
   `/games/city-cab-rush/index.html?embedded=tiptap&autoplay=1&muted=1` to
   test only the game.
3. Check that the browser network panel contains only the deployed Tip Tap
   origin for game assets. `__TIPTAP_BLOCKED_NETWORK__` may list Unity telemetry
   attempts; that means the lock prevented the external request.
4. On a real Android device, first scroll into the feed card and then verify
   steering/accelerating touch controls. Do not remove the local bridge or
   network lock to work around a source-only behavior.

## Isolation rule

Use only the feature-5 VEU resources for live source work:

- VEU server: `http://127.0.0.1:3460`
- Chrome CDP: `9226`
- profile: `C:\Project C\Hackation worktrees\feature-5\.veu-profile`

Never use the shared/default browser profile or create extra source tabs.
