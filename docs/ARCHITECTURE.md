# Tip Tap Games — Engineering Plan

## Product contract

The feed is the product. There is no landing page, library, prompt, tutorial, or login wall. Each card owns exactly one mechanic that can be understood from the one-line rule. A player—not a countdown—decides when to leave.

## Client lifecycle

The feed uses full-height CSS scroll snapping. An `IntersectionObserver` elects one card as active. Only that card receives `active=true`. Every game:

- resets from a `runKey`,
- starts only after a server ticket exists,
- cancels `requestAnimationFrame` and timers when inactive,
- emits one final integer score,
- owns no persistence or leaderboard logic.

The feed appends another shuffled batch near the end, so it has no bottom.

## Server lifecycle

1. `/api/bootstrap` creates or restores a guest player through an HttpOnly device cookie.
2. `/api/runs/start` creates a one-time ticket with a server timestamp.
3. The visible game begins.
4. `/api/scores` atomically consumes the ticket, validates the score against game policy and server elapsed time, and writes the run.
5. The leaderboard response includes best, rank, percentile, rival and canonical run ID.
6. SSE clients for that game are notified; open boards refetch the authoritative snapshot.

## Data model

- `players`: guest or OAuth identity, handle, avatar and stable device association
- `sessions`: hashed login session tokens
- `games`: active feed metadata
- `run_tickets`: one-time start records
- `scores`: immutable accepted runs
- `likes`: one hype per device and game

Best scores and ranks are derived from immutable run history, avoiding a second table that can drift during the sprint.

## Security boundaries

- Same-origin server and client
- HttpOnly, Secure-in-production, SameSite=Lax cookies
- OAuth authorization-code flow and timing-safe state comparison
- Provider tokens discarded after identity lookup
- 32 KB JSON limit
- Helmet security headers and production CSP
- One-time tickets and atomic replay rejection
- Server clock and per-game plausibility policies
- Score submission rate limits by browser identity and IP
- No seeded/fake leaderboard records
- No production SQLite fallback

Remaining honest limit: score plausibility is not deterministic server replay. The UI and documentation never claim cheat-proof scoring.

## Performance

- No game artwork download; gameplay uses DOM/CSS primitives
- Production JS is code-split/minified by Vite
- Native SSE rather than a WebSocket framework
- Five lightweight mechanics with animation cleanup
- Service worker caches only application shell resources and never API responses
- PostgreSQL pool capped at eight connections

## Accessibility

- Visible focus rings
- Semantic buttons and dialog labels
- Reduced-motion media query
- High contrast
- Game instructions are always visible
- Sound is optional
- Haptics are enhancement-only

The mechanics are inherently visual and reaction-based. A future accessibility track should provide alternative non-timing modes rather than pretending all games are screen-reader equivalent.
