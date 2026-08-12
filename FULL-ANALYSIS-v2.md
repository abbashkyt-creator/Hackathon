# Tip Tap Games — Complete Analysis (v2) — 2026-08-12

Author: Hermes agent (full-stack audit). Source of truth: `C:\Project C\Hackation` (main branch).

## 1. THE TWO-REPO SITUATION (root cause of confusion)

| | DRIFT (wrong) | REAL (correct) |
|---|---|---|
| Path | `C:\Project C\Hackation worktrees\feature-1` | `C:\Project C\Hackation` |
| Frontend | App.tsx 853L, styles.css 2459L, basic feed | App.tsx 1899L, styles.css 3980L + product.css 804L, full platform |
| Games | 20 REBUILT React clones (2048, Snake, Flappy...) | 20 REAL downloaded games in public/games/ (Unity WASM, Ruffle Flash, HTML5 mirrors) |
| Ads | none | OwnedAdPipeline.tsx + ad-pipeline.ts + /ads/config.json |
| Runtime | none | game-runtime.ts (warm-ahead, preload manifests) |
| Offline | none | offline-catalog.ts + OFFLINE_BOOTSTRAP |
| Extra | none | global leaderboard, discover sheet, save/follow creators, theme toggle, donate |
| Matches live replit | NO | YES (network capture confirmed real binaries at /games/...) |

The feature-1 worktree is exactly the "bad AI agent rebuild" the user warned about.
Work proceeds ONLY on `C:\Project C\Hackation`.

## 2. REAL REPO STATE VERIFICATION (100%)

- Typecheck: PASS (tsc --noEmit)
- Tests: 62/62 PASS (13 files: api, score-policy, ad-pipeline, game-runtime, city-cab-controls,
  platform-ui, production-client, theme, config, dig-out, johnny-trigger, rocket-soccer, stickman-fury)
- Build: dist/ present (Aug 3), dist-server/index.js present
- 25 game slugs: 5 originals + 20 real embedded games
- 17 API routes (health, bootstrap, runs/start, scores, leaderboard[global], discover, events,
  challenges, like, save, play, creators follow, auth google/discord, logout)
- All 20 real games have index.html; city-cab-rush has tiptap-platform-bridge.js
- Ad pipeline: /ads/config.json (enabled:false, 1 house campaign), OwnedAdPipeline component
  renders interstitial/rewarded dialog, frequency-capped, proc-mutex via cross-frame messages
- Pulse Lock pinned as instant-play lead card (autoplay) — confirmed by design comment
- Mobile: touch/gamepad allow attrs, responsive 700px breakpoint, safe-area handling

## 3. GAPS / RECOMMENDATIONS (from analysis)

### High priority
1. AD PIPELINE unification: config exists but `enabled:false` and only 1 campaign.
   Build the complete "replace reference ads with our own" channel: admin UI + runtime toggle,
   per-placement slots, serve from /ads/, kill any third-party ad/tracker requests in game
   mirrors (network-lock), stats collection endpoint.
2. AUTOPLAY first visit: Pulse Lock is pinned first and autoplays. Verify every embedded game
   auto-starts (autoplay=1 in URL) and no game requires a manual start button.
3. MOBILE CONTROLS AUDIT: go game-by-game; some Unity mirrors (city-cab touch already added)
   need explicit touch mapping. Add desktop keyboard mapping + on-screen touch controls where
   the source lacks them.
4. FEED integration: every embedded game must keep working inside the scroll-snapped feed with
   the active-card lifecycle (already handled; verify live).

### Medium priority
5. Global leaderboard / discover sheet are server-driven; ensure backend seeding + endpoints solid.
6. Offline catalog boots instantly; confirm games degrade gracefully offline.

### Expansion (user request: poki ALL games, start from best)
7. Catalog currently 25 games. Add more REAL games from poki/crazygames top list by mirroring
   their actual bundles (obey license: only freely-mirrorable / demo / open HTML5 games).
   Next candidates: Level Devil, Slice Master, Dino (have), Fruit Ninja (have), Subway (have),
   Drive Mad, Happy Glass, Stumble Guys, Basketball Stars, Stickman Hook, Blumgi Bounce,
   Penalty Shooters 2, Brain Test, Pop It Master, Hindi/other top tiles.

## 4. DECISION
- Build on: `C:\Project C\Hackation` (main). Never touch feature-1 worktree for product work.
- Use isolated VEU (127.0.0.1:3458 / cdp 9224) for all live verification with vision per page.
