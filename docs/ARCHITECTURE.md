# Tip Tap Games — Engineering Plan

## Product contract

The feed is the product. There is no landing page, library, prompt, tutorial, or login wall. Each card owns exactly one mechanic that can be understood from the one-line rule. A player—not a countdown—decides when to leave.

## Client lifecycle

The feed uses full-height CSS scroll snapping. An `IntersectionObserver` elects one card as active. Only that card receives `active=true`. Every game:

- resets from a `runKey`,
- starts native mechanics after a server ticket exists,
- may load an embedded game in parallel with its ticket so network latency does not delay its first frame,
- cancels `requestAnimationFrame` and timers when inactive,
- emits one final integer score,
- owns no persistence or leaderboard logic.

Subway Surfers follows the same contract through a same-origin sandboxed iframe. The local platform bridge receives the build's registered final-score callback and emits one integer score to the parent. In embedded autoplay mode it waits for the real canvas, dispatches the verified local start interaction, and stops retrying when the original SDK emits `gameplay-start`.

Dino Runner uses the same iframe boundary with a smaller local runtime. Its bridge waits for the real runner instance, starts the original intro automatically, guarantees the intro transitions into gameplay, and reports every completed run. The original game runtime is an external local script so production's strict no-inline-script CSP remains effective. Deactivating either copied-game card removes its iframe, terminating rendering, timers, and audio with the game document.

The feed appends another shuffled batch near the end, so it has no bottom.

## Server lifecycle

1. `/api/bootstrap` creates or restores a guest player through an HttpOnly device cookie.
2. `/api/runs/start` creates a one-time ticket with a server timestamp.
3. The visible game begins.
4. `/api/scores` atomically consumes the ticket, validates the score against game policy and server elapsed time, and writes the run.
5. The leaderboard response includes best, rank, percentile, rival and canonical run ID.
6. SSE clients for that game are notified; open boards refetch the authoritative snapshot.
7. The global championship derives points from each player's best score per ranked game:
   first place earns 100, second 99, down to a minimum of one point. Unranked games are
   excluded even if a legacy row exists.

## Data model

- `players`: guest or OAuth identity, handle, avatar and stable device association
- `sessions`: hashed login session tokens
- `games`: active feed metadata
- `run_tickets`: one-time start records
- `scores`: immutable accepted runs
- `likes`: one hype per device and game
- `saves`: one saved-game relationship per player
- `creator_follows`: one followed-creator relationship per player
- `game_plays`: one play impression per player/game/day for honest trending activity

Best scores and ranks are derived from immutable run history, avoiding a second table that can drift during the sprint.
Creator and category metadata lives in `shared/catalog.ts` so the server bootstrap,
discovery API, offline client, and UI cannot silently invent different identities.

## Security boundaries

- Same-origin server and client
- HttpOnly, Secure-in-production, SameSite=Lax cookies
- OAuth authorization-code flow and timing-safe state comparison
- Provider tokens discarded after identity lookup
- 32 KB JSON limit
- Helmet security headers and production CSP
- A route-scoped legacy-game CSP exception permits `unsafe-eval` and data fetches only under `/games/subway-surfers/`; the Tip Tap app keeps the strict policy
- Every `/games/*` response blocks cross-origin networks; only the Subway build receives the narrowly scoped `unsafe-eval` exception
- A first-script network lock independently blocks cross-origin fetch, XHR, WebSocket, EventSource, beacon and popup attempts
- One-time tickets and atomic replay rejection
- Server clock and per-game plausibility policies
- Score submission rate limits by browser identity and IP
- No seeded/fake leaderboard records
- No production SQLite fallback

Remaining honest limit: score plausibility is not deterministic server replay. The UI and documentation never claim cheat-proof scoring.

## Performance

- Five original mechanics use lightweight DOM, CSS, and canvas primitives; Pulse Lock is the default instant-play lead card
- Subway Surfers, Dino Runner, ArithmeticA, and the original 67 Game are local cacheable bundles; inactive cards never instantiate their iframes. 67 Game runs from a self-hosted SWF plus local Ruffle, with no outside runtime request. Its source start screen needs one genuine tap and it is deliberately unranked because no verified score callback exists. ArithmeticA has an unresolved remote-SDK runtime failure and must not be claimed as demo-ready.
- Pulse Lock is the default first card and begins animating immediately; a direct game/challenge link still chooses its target first
- The next copied game warms only a declared critical path, three requests at a time; save-data and 2G clients warm only its entry document
- Production JS is code-split/minified by Vite
- Express applies lossless response compression to compressible text assets
- Native SSE rather than a WebSocket framework
- 25 isolated mechanics with animation and iframe lifecycle cleanup
- Service worker separates shell and game caches, uses stale-while-revalidate for repeat asset loads, never caches API responses, and never substitutes app HTML for a missing game asset
- If bootstrap is unreachable, a public built-in catalogue opens offline practice; scores remain unsaved until the authoritative API reconnects
- PostgreSQL pool capped at eight connections

For isolated production-asset acceptance, set `NODE_ENV=development` and
`PREVIEW_PRODUCTION_CLIENT=1`. This serves the built `dist/` client through the
real API and local SQLite development store, avoiding Vite/HMR overhead while
large WebGL games stream. It does not relax production's PostgreSQL or session
secret requirements.

## Accessibility

- Visible focus rings
- Semantic buttons and dialog labels
- Reduced-motion media query
- High contrast
- Game instructions are always visible
- Sound is optional
- Haptics are enhancement-only
- Discovery is a labelled modal with keyboard focus management, semantic tabs, search,
  pressed-state save/follow controls, and honest empty/loading states

The mechanics are inherently visual and reaction-based. A future accessibility track should provide alternative non-timing modes rather than pretending all games are screen-reader equivalent.
