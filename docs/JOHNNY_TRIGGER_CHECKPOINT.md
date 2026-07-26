# Johnny Trigger completion record — 2026-07-27

The user intentionally paused work to restart Windows. Do not restart discovery or overwrite the completed mirror.

## Completed and preserved

- Licensed source selected by the user: `https://poki.com/en/g/johnny-trigger-sniper-game`
- Source developer: SayGames
- Source game ID: `994568e9-1512-4e00-a24d-e431e3eae6b1`
- Source version: `1642d4b2-69f2-40ac-b15f-44bbefebb761`
- Runtime: Unity 2022.3.18f1 WebGL with Addressables
- Full local package: `public/games/johnny-trigger-sniper`
- Integrity result: 276 files, 75,472,239 bytes, 263/263 catalog runtime files present, 0 missing
- `MIRROR-MANIFEST.json` and `preload-manifest.json` generated
- Local no-ad Poki lifecycle bridge present; network lock loads first
- App/feed wiring is present in types, runtime manifests, wrapper, catalog, DB seed, App map, and CSS
- Live server bootstrap at port 3103 contained `johnny-trigger-sniper` among 20 games and marked it `ranked: false`
- `npm run typecheck` passed

## Files added for repeatable completion

- `scripts/mirror-johnny-trigger.mjs` — resumes the exact authorized source capture and skips existing files
- `scripts/finalize-johnny-trigger.mjs` — audits the Addressables catalog and regenerates hashes/manifests
- `scripts/cdp-game-check.mjs` — captures and inspects the exact local game target on a dedicated CDP port

## Post-restart verification completed

- Isolated Tip Tap server: port 3103 with `.codex-runtime/johnny/tip-tap.db`
- Isolated VEU/CDP: 3487/9264 with a unique Chrome profile
- Direct desktop and 390x844 runs reached Mission 1 without a Play button
- Trusted 390x844 touch input advanced the original game to Mission 2
- No product external requests and no network-lock reports
- Feed card mounted the genuine Unity game and switching to Dino Runner removed its iframe
- Warming was corrected to startup/first-play assets only instead of all later levels

## Final hardening review

- Feed sound toggling no longer reloads the Unity iframe. The parent posts
  active/muted state to the local bridge, which controls media and Web Audio
  contexts in place.
- Only the active copied game and one next copied game are mounted. The live
  Johnny feed contained exactly two game iframes.
- The unranked game no longer creates a server run ticket or shows a Ranks
  button.
- The single available screenshot is declared truthfully (`numScreenshots: 1`).
- The local bridge's readiness poll has a 120-second bound and page-hide
  cleanup.
- The production build now Brotli-compresses Unity WASM/data/bundles. Johnny's
  main WASM is 6,074,820 bytes over Brotli instead of 19,177,397; its data file
  is 1,926,127 instead of 6,144,797.
- Release audit, TypeScript, 28 test files / 119 tests, and the production build
  all passed.
- Live desktop autoplay reached genuine Mission 1. A 390x844 check showed no
  horizontal overflow, the iframe fit at 360x592, live mute/unmute preserved
  the Unity instance, and the game frame reported zero external requests.

## Important truth boundary

The local game and feed integration are verified. The source tutorial waits for
the player's aiming gesture at Mission 1, which is gameplay input rather than a
Play gate. A never-cached 75 MB Unity package still has a substantial cold
startup; do not describe it as literally instant.

## Processes stopped before restart

The dedicated Johnny test VEU/CDP listeners on ports 3486 and 9263 were stopped. Earlier source capture on 3484/9260 had already completed. No other agent browser was intentionally touched.
