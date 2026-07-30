# Tip Tap Games

**Doomscroll — except you're the one playing.**

Tip Tap Games is a mobile-first, vertical feed of instant one-thumb mini games. The first game is already live when the page opens. Finish a run and the score is written to a real database, ranked immediately, and ready to share as a server-backed challenge.

## What ships

- Exact one-screen vertical swipe feed with endless shuffled recycling
- 25 different instant games across action, arcade, puzzle, runner, and sports
- Strict active-card lifecycle: inactive games stop their timers and animation frames
- Guest-first play with no registration wall
- PostgreSQL production persistence and local SQLite development persistence
- Per-game all-time and daily leaderboards
- A real cross-game championship that rewards breadth without inventing players or scores
- Searchable discovery with categories, trending activity, saved games, and followed creators
- Player profile statistics for ranked runs, ranked games, saves, and creator follows
- Live leaderboard refresh through Server-Sent Events plus polling fallback
- One-time run tickets, server timing, score ceilings, rate limits, and replay rejection
- Personal best, rank, percentile, and the next ghost-rival score
- Canonical challenge links backed by stored runs
- Per-device hype/like state
- Optional Google and Discord OAuth; guest scores merge when an account is claimed
- Native mobile share with clipboard fallback
- Installable PWA shell with Android-ready PNG and maskable icons
- Cached offline practice after one successful online visit; scoring stays honestly online-only
- Lossless next-game critical-path warming with save-data/slow-network restraint
- Two-layer copied-game network isolation: strict CSP plus an early runtime network lock
- Lossless HTTP compression and repeat-play game caching
- Responsive desktop presentation around the phone-width product

## Architecture

One repository and one server process keep deployment simple:

```text
React + TypeScript + Vite
          |
    same-origin HTTP
          |
Express + OAuth + SSE
          |
  PostgreSQL in production
  SQLite in local development
```

The server serves the production web bundle and the API from the same origin. There is no CORS setup and no second deployment.

## Local development

Requirements: Node.js 22.12 or newer.

```bash
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:3000`.

When `DATABASE_URL` is absent outside production, the app creates `data/tip-tap.db`. Production refuses to boot without `DATABASE_URL`; this prevents Replit's ephemeral filesystem from silently losing leaderboard data.

Run the complete quality gate:

```bash
npm run check
```

## Push to GitHub

The repository includes a GitHub Actions quality gate. After creating an empty GitHub repository:

```bash
git remote add origin https://github.com/YOUR_ACCOUNT/tip-tap-games.git
git branch -M main
git push -u origin main
```

Do not commit `.env` or OAuth secrets.

## Deploy on Replit

1. Import the GitHub repository into Replit.
2. Add Replit's SQL Database to the app. It creates `DATABASE_URL`.
3. In deployment Secrets, add:
   - `SESSION_SECRET`: at least 32 random characters
   - `PUBLIC_BASE_URL`: the final origin, such as `https://tip-tap-games.replit.app`
   - OAuth variables below if login will be enabled
4. Choose **Autoscale**, not Static Deployment. Keep maximum machines at 1 for the judging session because live SSE fan-out is process-local.
5. Build command: `npm run build`
6. Run command: `npm start`
7. Publish, then verify `/api/health` and the complete phone flow.

The included `.replit` already defines the development and deployment commands and exposes local port 3000 as external port 80.

Important: Replit editor secrets and published deployment secrets are configured separately. Add the production values in the Publishing pane as well.

After the final HTTPS Replit hostname is stable, follow [docs/APK-RELEASE.md](docs/APK-RELEASE.md) to package the same PWA as a verified Android Trusted Web Activity. The signing key and Digital Asset Links association are intentionally release-time inputs and must not be faked or committed.

## Enable Discord sign-in

Discord is the fastest login path for a hackathon demo.

1. Create an application in the Discord Developer Portal.
2. Add this exact redirect:

   `https://YOUR_FINAL_DOMAIN/auth/discord/callback`

3. Set:

   ```text
   DISCORD_CLIENT_ID=
   DISCORD_CLIENT_SECRET=
   ```

4. The app requests only the `identify` scope and discards the provider access token after reading the profile.

## Enable Google sign-in

1. Create a Web application OAuth client in Google Cloud.
2. Add this exact redirect:

   `https://YOUR_FINAL_DOMAIN/auth/google/callback`

3. Set:

   ```text
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```

4. Add every judge as a test user if the Google consent screen remains in Testing, or publish the consent configuration before judging.

The app remains fully playable when OAuth is not configured. Login buttons appear only for providers whose complete credentials exist.

## Database and score integrity

Every play session starts with a server-issued, single-use run ticket bound to the player and game. On completion, the server:

1. atomically consumes the ticket,
2. derives duration from its own clock,
3. rejects unknown games, non-integers, negative values, oversized values, instant submissions, impossible score rates, and ticket replay,
4. writes only accepted runs,
5. calculates rank from stored scores.

This is intentionally described as **server-validated**, not cheat-proof. A determined attacker controls their browser. Stronger competition-grade validation would require deterministic input traces and server replay for every mechanic.

## Copied-game integrations

The authorized Subway Surfers web build is stored under `public/games/subway-surfers` and runs in a same-origin sandboxed iframe. Its original SYBO identity and third-party notices are preserved. A small local Tip Tap bridge replaces the Poki platform SDK so the game can report its real final score, follow the global sound control, skip platform ads, and enter gameplay automatically when its card becomes visible—without loading Poki accounts, ads, analytics, tracking, or a press-to-play gate.

The local Dino Runner build is stored under `public/games/dino-game`. Its Chrome UX creator attribution is preserved. Its game code is a CSP-safe local script, and its bridge turns the short intro directly into a live run without a tap, reports every completed run, and replaces platform ad calls locally.

Copied games are fail-closed. Production CSP has no source-site allowlist, and `/games/_shared/network-lock.js` blocks cross-origin fetch, XHR, WebSocket, EventSource, beacon, and popup attempts before game code runs. The feed warms an upcoming copied game from its local critical-path and mirror manifests without creating its iframe. Constrained or data-saver connections warm only the entry page. Production builds also create Brotli sidecars for compressible game files, including legacy `.gb` models, without changing the game bytes seen by the browser.

After one complete online load, the service worker can replay cached games in offline practice mode. The API and score submissions are never cached: reconnect before the next run to receive a ticket and leaderboard rank.

The repository notice records the exact captured build and the permission representation supplied for this project. Keep the written permission grant with the project and verify that it covers GitHub distribution and the final Replit deployment before making either public.

## Demo checklist

- Use a real phone at 390×844 or similar.
- Play Pulse Lock to a visible score and intentionally miss.
- Show the score appearing in the live board without leaving the card.
- Open the daily tab.
- Share the challenge link and open it in a second browser.
- Beat the shown target.
- Sign in with Discord and refresh to prove the personal best survived.
- Open Discover, save a game, follow a creator, and confirm both personal views persist.
- Open the global championship and verify that only real ranked finishes appear.
- Swipe through several different engines and return to confirm there are no zombie timers or audio.

The app never seeds fake players or fake leaderboard scores. Populate the judging board with real team runs before presentation.

## Project map

```text
server/             API, database, OAuth, validation, SSE
shared/catalog.ts   authoritative creator and category metadata shared by client and server
src/games/          25 isolated game integrations and implementations
src/App.tsx         feed, discovery, saved/following, sharing, auth and ranking UI
public/             PWA, icons, social preview and authorized local game assets
tests/              policy, persistence, API and game-integration tests
docs/               architecture, demo and original design references
.github/workflows/  GitHub quality gate
```

For the complete vision, exact continuation prompt, copied-game intake procedure, and release blockers, read [docs/AI_AGENT_HANDOFF.md](docs/AI_AGENT_HANDOFF.md).

## Known external setup

The GitHub remote and public Replit hostname already exist. Current local changes still
need to be pushed and the Replit deployment republished before they are live. These
release inputs cannot be proven from source code alone:

- confirm the published Replit deployment has a durable PostgreSQL `DATABASE_URL`,
- register that hostname with Discord and Google,
- add/verify production deployment secrets,
- republish and perform production plus real-provider OAuth smoke tests,
- provide an Android signing key and certificate fingerprint before building the final TWA APK.
