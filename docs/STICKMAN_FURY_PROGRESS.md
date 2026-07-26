# Stickman Fury integration checkpoint

Saved before the computer restart on 2026-07-26.

## Completed

- Captured the real Poki-hosted Stickman Fury package with a dedicated VEU
  session on server port `3472`, CDP port `9232`, and isolated browser profiles.
- Mirrored all 97 observed source assets into
  `public/games/stickman-fury/` (game code, physics/runtime libraries, font,
  music, sounds, images, all 56 levels, tuning, weapons, and animal data).
- Added a SHA-256/byte provenance manifest and reproducible mirror script:
  `scripts/mirror-stickman-fury.mjs`.
- Added a CSP-safe local launcher, network lock, Tip Tap lifecycle bridge,
  autoplay bootstrap, preload manifest, and notice.
- Removed the external advertising/platform dependency. Commercial breaks
  resolve immediately; rewarded breaks resolve `false`; neither calls Poki.
- Added the game to shared TypeScript slugs, React component map, runtime
  warm-cache map, offline catalog, backend seed catalog, theme, caption, and
  API test coverage.
- The iframe mounts during the preparing state, pauses off-card, resumes and
  focuses on activation, follows global mute, and preserves the original
  keyboard, mouse, and touch controls.
- `npm run typecheck` passed.
- `npm test -- --reporter=dot` passed: 23 files and 97 tests.
- The production client/server build completed and game assets were Brotli
  precompressed.
- A direct local request returned HTTP 200 after the refreshed server started.
- The isolated browser processes used for validation were explicitly stopped.

## Resume after reboot

From `C:\Project C\Hackation`:

```powershell
npm run dev
```

Then open:

```text
http://127.0.0.1:3000/?game=stickman-fury
```

If another `PORT` is configured, use the URL printed by the server. The last
pre-restart verification server used port `3110`.

Run:

```powershell
npm run typecheck
npm test -- --reporter=dot
npm run build
```

## Live acceptance completed after reboot

Completed on 2026-07-26 against `http://127.0.0.1:3110/?game=stickman-fury`:

1. The first visible card entered Stage 1 without a play click.
2. Desktop mouse/keyboard input moved the character and advanced the fight.
3. At 390 x 844, the canvas resized to 360 x 592 and the on-screen jump
   control moved the character.
4. Scrolling to the next feed card removed the iframe; returning recreated it
   and resumed autoplay.
5. The captured reload contained zero external HTTP, HTTPS, WebSocket, or
   secure-WebSocket requests and no failed requests. Poki, ad, analytics, and
   other third-party endpoints were absent.
6. A separate clean direct-game reload captured 101 local requests, zero
   external requests, zero failed requests, and zero console warnings/errors.

The reusable CDP verifier is `scripts/verify-stickman-fury-cdp.mjs`. Set
`STICKMAN_CDP_PORT` and `STICKMAN_URL` if the ports differ.

## Known unrelated release-audit debt

Resolved on 2026-07-27. `npm run audit:release` now passes for the complete
copied-game catalog.

## Full review repairs completed on 2026-07-27

- Removed the Tip Tap title overlay from the Stickman Fury playfield so Stage 1
  and the original weapon UI remain unobstructed on desktop and mobile.
- Marked Stickman Fury unranked because the source does not expose a trustworthy
  score/completion callback. The feed no longer opens a false leaderboard,
  creates run tickets, or displays a permanent syncing badge for this game.
- Corrected the visible and local notice attribution to Happylander Ltd and
  recorded the project owner's stated permission status without publishing the
  private agreement.
- Removed `allow-same-origin` from the game iframe. The source now runs in an
  opaque-origin sandbox with narrowly scoped parent-assisted persistence for
  its original `stickmanfuryv4` save key.
- Kept copied-game CSP enabled in development as well as production and added
  the `Origin: null`/CORP response headers required for the sandbox to read its
  public local assets.
- Blocked the source Shift+Backquote physics/debug panel in the early local
  bridge without altering the preserved source `app.js`.
- Added a branded cold-start cover that disappears only after the original game
  reports ready.
- Added `tests/stickman-fury-integration.test.ts` and isolated Vitest discovery
  from other agents' `.claude/worktrees`.

Fresh acceptance after these repairs:

1. Original Stage 1 autoplayed in the feed with no extra title over the canvas.
2. Desktop input changed the live fight; 390 x 844 rendered a 360 x 592 game.
3. Ranks and syncing were absent, creator attribution was correct, and no
   console warnings/errors were observed.
4. The iframe reported `sandbox="allow-scripts allow-pointer-lock"` and its save
   data returned through the parent on reload.
5. `npm run typecheck`, the six-file/27-test root suite,
   `npm run audit:release`, `npm audit --omit=dev`, `git diff --check`, and the
   complete production build passed.

Production intentionally requires both a unique `SESSION_SECRET` and a durable
PostgreSQL `DATABASE_URL`; configure those as Replit Secrets before `npm start`.
