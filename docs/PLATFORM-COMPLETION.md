# Tip Tap Platform Completion

Updated: 2026-07-30

This is the current, compact continuation document. `README.md` is the operating
guide and `docs/AI_HANDOFF.md` retains the deeper historical integration notes.

## Product shape

The vertical game feed is still the home screen and primary loop. The header grid
button opens a feed-native Discover sheet; it is not a second home page. Discover
adds the platform features a judge expects around the games:

- search by game, creator, or category;
- Action, Arcade, Puzzle, Runner, and Sports filters;
- honest trending order from unique daily play activity and real save counts;
- a persistent Saved arcade;
- persistent creator Following;
- a global championship derived from real ranked finishes;
- profile statistics for ranked runs, ranked games, saved games, and followed creators.

No sample players, fabricated activity, or seeded championship scores are created.
Empty leaderboards show an explicit first-player state.

## Shared catalogue

`shared/catalog.ts` is the single source for creator identity, creator label, and
category across all 25 games. The database enriches its seeded game rows with that
metadata, while the client uses the same catalogue as a safe fallback.

When adding a game, update this catalogue alongside the existing registration
surfaces described in `docs/LOCAL_GAME_INTEGRATION_PLAYBOOK.md`.

## Persistence

The existing player identity is used for every new relationship:

- `saves(player_id, game_slug, created_at)`
- `creator_follows(player_id, creator_id, created_at)`
- `game_plays(player_id, game_slug, play_day, created_at)`

The `game_plays` primary key allows at most one activity impression per player,
game, and UTC day. A refresh loop cannot inflate trending counts. OAuth guest
claiming transfers all three relationship types before removing the guest.

SQLite remains the local development store. PostgreSQL remains mandatory in
production, so Replit cannot silently write player data to an ephemeral file.

## HTTP contract

- `GET /api/bootstrap`
  returns games, hype, engagement, followed creator IDs, profile stats, and auth.
- `GET /api/discover`
  accepts `q`, `category`, `view=all|saved|following`, and
  `sort=trending|title`.
- `POST /api/games/:slug/save`
  toggles the current player's saved state and returns authoritative counts.
- `POST /api/games/:slug/play`
  records the player's unique daily activity impression.
- `POST /api/creators/:creatorId/follow`
  toggles a known creator relationship.
- `GET /api/leaderboard/global`
  aggregates each player's best score per server-ranked game.

The championship gives 100 points for first place, 99 for second, and so on with
a one-point minimum. Ties share the same per-game rank. Ordering then uses points,
crowns, breadth of ranked games, and handle. Any score row for an unranked game is
ignored defensively.

## UI and accessibility

- Discovery uses a labelled modal, semantic tabs, labelled search, category buttons,
  and `aria-pressed` save/follow controls.
- The global board has explicit loading, empty, player, and current-rank states.
- The profile exposes the new statistics and a championship shortcut.
- Light and dark themes have dedicated surface, border, text, and selected states.
- Mobile uses one-column game results; wider screens use a two-column layout.
- The new brand artwork is used in the product header while keeping text alternatives.

## Dig out of Prison integration

The CrazyGames source build is now a complete, same-origin Unity 6 mirror instead of
an external wrapper:

- all four source payloads are local, Brotli-packaged, checksum-pinned, and served
  through the existing game-specific content policy;
- the exact SDK v3 JavaScript used by the build is packaged locally and runs in its
  documented local environment;
- the portal, ad, analytics, account, cloud-save, and remote leaderboard services are
  absent, while the game's expected callbacks continue locally;
- a build-signature-guarded in-memory compatibility patch applies only to the audited
  Wasm function table, leaving the mirrored payload bytes unchanged on disk;
- the story tap gates auto-complete, the game starts on card activation, and the mobile
  overlay maps WASD, Space, E, X, Q, and the pointer dig action;
- mobile controls are selected from actual touch/coarse-pointer capability rather than
  the narrow iframe width, so they never cover the game in a fine-pointer desktop view;
- the fixed 16:9 Unity frame uses `contain` sizing without distortion. Its feed shell
  expands to at most 960px on a desktop while touch devices keep the vertical feed width.

The runtime was verified in an isolated VEU profile through the real Day 1 gameplay HUD
with no failed game requests and no cross-origin runtime request. VEU/Chrome must be
launched with background throttling disabled for WebGL evidence: an occluded automation
window otherwise pauses the Unity render loop even when the page reports itself visible.
That automation-only pause is not a missing asset or production game failure.

Cold-start honesty matters: this title has roughly 23 MB of compressed Unity payload.
The app prewarms its audited critical path and repeat views use the browser cache, but no
web implementation can make the first transfer literally zero-time. The feed must keep
the current loading shell visible and responsive while the next card warms.

## Release checklist

1. Run `npm run check`.
2. Run a mobile VEU pass at 390×844:
   open Discover, search, change category, save, follow, open both personal views,
   open the championship, and inspect the profile.
3. Run the same critical sheet flow on desktop and in dark theme.
4. Confirm `/api/health` and the production origin after publishing.
5. Confirm production has `DATABASE_URL`, `SESSION_SECRET`, and the exact
   `PUBLIC_BASE_URL`.
6. Push the reviewed commit and republish Replit.
7. Build the TWA only after the signing and Digital Asset Links facts in
   `docs/APK-RELEASE.md` are real.
8. For Dig out of Prison, confirm `MIRROR-MANIFEST.json` checksums, local SDK mode,
   no failed requests, Day 1 gameplay, and the mobile control overlay.

## Honest remaining external work

The current public Replit URL exists, but source edits do not reach it automatically.
The repo cannot prove deployment-secret values, OAuth provider configuration, or a
physical Android installation. Those must be verified after the reviewed tree is
pushed and Replit is republished.
