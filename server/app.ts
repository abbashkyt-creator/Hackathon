import { randomBytes, randomUUID } from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import compression from "compression";
import helmet from "helmet";
import { z } from "zod";
import type { Config } from "./config.js";
import { Store, type Player } from "./db.js";
import {
  authorizationUrl,
  exchangeCode,
  providerAvailable,
  requestBaseUrl,
  safeStateEqual,
  type OAuthProvider,
} from "./oauth.js";
import { isRankedGame, validateScore } from "./score-policy.js";
import { ADS_OVERRIDE_PATH, loadAdsConfig, resetAdsConfigOverride, saveAdsConfigOverride } from "./ads-control.js";

const runStartSchema = z.object({ gameSlug: z.string().min(1).max(50) });
const scoreSchema = z.object({
  ticket: z.string().uuid(),
  gameSlug: z.string().min(1).max(50),
  score: z.number().int().nonnegative(),
});
const leaderboardQuery = z.object({
  game: z.string().min(1).max(50),
  period: z.enum(["all", "daily"]).default("all"),
});
const discoveryQuery = z.object({
  q: z.string().trim().max(80).default(""),
  category: z.enum(["Action", "Arcade", "Puzzle", "Runner", "Sports"]).optional(),
  view: z.enum(["all", "saved", "following"]).default("all"),
  sort: z.enum(["trending", "title"]).default("trending"),
});

interface RequestContext {
  player: Player;
  deviceId: string;
  sessionToken?: string;
}

function parseCookies(header = ""): Record<string, string> {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .flatMap((part) => {
        const index = part.indexOf("=");
        if (index < 1) return [];
        return [[decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))]];
      }),
  );
}

function reqProtocol(req: Request): string {
  return req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
}

function cookieOptions(config: Config, maxAgeMs: number): express.CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: config.NODE_ENV === "production",
    maxAge: maxAgeMs,
    path: "/",
  };
}

function publicPlayer(player: Player) {
  return {
    id: player.id,
    handle: player.handle,
    avatarUrl: player.avatar_url,
    provider: player.provider,
    isGuest: player.provider === "guest",
  };
}

export function createApp(config: Config, store: Store) {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  const securityHeaders = (mode: "app" | "game" | "legacy-game" | "wasm-game" | "legacy-wasm-game" | "defold-game") =>
    helmet({
      contentSecurityPolicy:
        config.NODE_ENV === "development" && mode === "app"
          ? false
          : {
              directives: {
                defaultSrc: ["'self'"],
                connectSrc: mode === "app" ? ["'self'"] : ["'self'", "data:", "blob:"],
                imgSrc:
                  mode === "app"
                    ? [
                        "'self'",
                        "data:",
                        "https://cdn.discordapp.com",
                        "https://lh3.googleusercontent.com",
                      ]
                    : ["'self'", "data:", "blob:"],
                mediaSrc: mode === "app" ? ["'self'"] : ["'self'", "data:", "blob:"],
                fontSrc: ["'self'", "data:"],
                scriptSrc:
                  mode === "defold-game"
                    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'wasm-unsafe-eval'", "blob:"]
                    : mode === "legacy-game"
                      ? ["'self'", "'unsafe-eval'"]
                      : mode === "legacy-wasm-game"
                        ? ["'self'", "'unsafe-eval'", "'wasm-unsafe-eval'", "blob:"]
                      : mode === "wasm-game"
                        ? ["'self'", "'wasm-unsafe-eval'", "blob:"]
                        : ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                workerSrc: mode === "app" ? ["'self'"] : ["'self'", "blob:"],
                frameSrc: mode === "app" ? ["'self'"] : ["'none'"],
                objectSrc: ["'none'"],
              },
            },
      crossOriginEmbedderPolicy: false,
    });
  const appSecurityHeaders = securityHeaders("app");
  const gameSecurityHeaders = securityHeaders("game");
  const subwaySecurityHeaders = securityHeaders("legacy-game");
  // Unity and Construct/Box2D runtimes compile their downloaded modules
  // through an eval-like browser code path. Keep those exceptions narrowly
  // scoped to their local engine mirrors rather than weakening the catalog.
  const cityCabRushSecurityHeaders = securityHeaders("legacy-game");
  const plonkySecurityHeaders = securityHeaders("legacy-game");
  // Kitty Loves Birds 2 is a Construct 3 runtime (Box2D wasm + new Function),
  // same engine family as Plonky, so it needs the unsafe-eval policy too.
  const kittyLovesBirds2SecurityHeaders = securityHeaders("legacy-game");
  const theftCitySecurityHeaders = securityHeaders("wasm-game");
  const supercarLegendsSecurityHeaders = securityHeaders("wasm-game");
  // Count Control Legends and Johnny Trigger use a Unity loader that injects
  // its framework as a blob: <script>, so they need the wasm-game policy
  // (which permits 'wasm-unsafe-eval' and blob: script sources).
  const countControlSecurityHeaders = securityHeaders("wasm-game");
  const johnnyTriggerSecurityHeaders = securityHeaders("wasm-game");
  const digOutOfPrisonSecurityHeaders = securityHeaders("wasm-game");
  // Rocket Soccer Derby's older local UnityLoader uses legacy eval compilation
  // plus WebAssembly. This exception is scoped to its mirror only.
  const rocketSoccerDerbySecurityHeaders = securityHeaders("legacy-wasm-game");
  // Fruit Ninja's enable3d/Ammo physics feature-detects WebAssembly; without
  // 'wasm-unsafe-eval' that probe fails and it falls back to a non-existent
  // asm.js ammo.js (404). Serve it under the wasm policy so it loads ammo.wasm.js.
  const fruitNinjaSecurityHeaders = securityHeaders("wasm-game");
  // Temple Run 2 (Babylon.js) decodes Draco-compressed meshes via a WebAssembly
  // module, so it needs 'wasm-unsafe-eval' (and blob: for its decoder worker).
  const templeRunSecurityHeaders = securityHeaders("wasm-game");
  // 67 Game runs its Flash .swf through Ruffle, which instantiates a WebAssembly
  // core — same wasm policy requirement as the Unity/Babylon titles.
  const sixtySevenSecurityHeaders = securityHeaders("wasm-game");
  // Level Devil is a Defold HTML5 bundle: its loader boots via inline scripts
  // and compiled WebAssembly, so it needs an inline-script + wasm policy scoped
  // to its local mirror only.
  const levelDevilSecurityHeaders = securityHeaders("defold-game");
  app.use((req, res, next) => {
    const headers = req.path.startsWith("/games/subway-surfers/")
      ? subwaySecurityHeaders
      : req.path.startsWith("/games/city-cab-rush/")
        ? cityCabRushSecurityHeaders
      : req.path.startsWith("/games/plonky/")
        ? plonkySecurityHeaders
      : req.path.startsWith("/games/kitty-loves-birds-2/")
        ? kittyLovesBirds2SecurityHeaders
      : req.path.startsWith("/games/theft-city/")
        ? theftCitySecurityHeaders
      : req.path.startsWith("/games/supercar-legends/")
        ? supercarLegendsSecurityHeaders
      : req.path.startsWith("/games/count-control-legends/")
        ? countControlSecurityHeaders
      : req.path.startsWith("/games/johnny-trigger-sniper/")
        ? johnnyTriggerSecurityHeaders
      : req.path.startsWith("/games/dig-out-of-prison/")
        ? digOutOfPrisonSecurityHeaders
      : req.path.startsWith("/games/rocket-soccer-derby/")
        ? rocketSoccerDerbySecurityHeaders
      : req.path.startsWith("/games/fruit-ninja/")
        ? fruitNinjaSecurityHeaders
      : req.path.startsWith("/games/temple-run-2-frozen-shadows/")
        ? templeRunSecurityHeaders
      : req.path.startsWith("/games/67-game/")
        ? sixtySevenSecurityHeaders
      : req.path.startsWith("/games/level-devil/")
        ? levelDevilSecurityHeaders
      : req.path.startsWith("/games/slice-master/")
        ? supercarLegendsSecurityHeaders
      : req.path.startsWith("/games/")
        ? gameSecurityHeaders
        : appSecurityHeaders;
    headers(req, res, () => {
      if (req.path.startsWith("/games/stickman-fury/")) {
        // Stickman Fury runs in an opaque-origin sandbox (without
        // allow-same-origin). Its public local assets must therefore accept
        // read-only requests carrying Origin: null.
        res.setHeader("Access-Control-Allow-Origin", "null");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      }
      next();
    });
  });
  app.use(compression());
  app.use("/games/theft-city/Build", (req, res, next) => {
    if (req.path.endsWith(".data.br")) {
      res.type("application/octet-stream");
      res.setHeader("Content-Encoding", "br");
    } else if (req.path.endsWith(".framework.js.br")) {
      res.type("text/javascript");
      res.setHeader("Content-Encoding", "br");
    } else if (req.path.endsWith(".wasm.br")) {
      res.type("application/wasm");
      res.setHeader("Content-Encoding", "br");
    }
    next();
  });
  app.use("/games/dig-out-of-prison/Build", (req, res, next) => {
    if (req.path.endsWith(".data.br")) {
      res.type("application/octet-stream");
      res.setHeader("Content-Encoding", "br");
    } else if (req.path.endsWith(".framework.js.br")) {
      res.type("text/javascript");
      res.setHeader("Content-Encoding", "br");
    } else if (req.path.endsWith(".wasm.br")) {
      res.type("application/wasm");
      res.setHeader("Content-Encoding", "br");
    }
    next();
  });
  app.use(express.json({ limit: "32kb" }));

  const sseClients = new Map<string, Set<Response>>();
  const scoreRate = new Map<string, { count: number; resetAt: number }>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of scoreRate) {
      if (entry.resetAt <= now) scoreRate.delete(key);
    }
  }, 60_000);

  async function context(req: Request, res: Response): Promise<RequestContext> {
    const cookies = parseCookies(req.headers.cookie);
    const sessionToken = cookies.ttg_session;
    if (sessionToken) {
      const player = await store.getPlayerBySession(sessionToken);
      if (player) {
        const deviceId = player.device_id || cookies.ttg_device || randomUUID();
        if (!cookies.ttg_device) {
          res.cookie("ttg_device", deviceId, cookieOptions(config, 1000 * 60 * 60 * 24 * 365));
        }
        return { player, deviceId, sessionToken };
      }
      res.clearCookie("ttg_session", { path: "/" });
    }

    const deviceId = cookies.ttg_device || randomUUID();
    if (!cookies.ttg_device) {
      res.cookie("ttg_device", deviceId, cookieOptions(config, 1000 * 60 * 60 * 24 * 365));
    }
    const player = await store.getOrCreateGuest(deviceId);
    return { player, deviceId };
  }

  function broadcast(gameSlug: string): void {
    for (const res of sseClients.get(gameSlug) ?? []) {
      res.write(`event: leaderboard\ndata: ${JSON.stringify({ gameSlug, at: Date.now() })}\n\n`);
    }
  }

  function allowScore(key: string): boolean {
    const now = Date.now();
    const current = scoreRate.get(key);
    if (!current || current.resetAt <= now) {
      scoreRate.set(key, { count: 1, resetAt: now + 60_000 });
      return true;
    }
    current.count += 1;
    return current.count <= 30;
  }

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "tip-tap-games", time: new Date().toISOString() });
  });

  // Android TWA verification (installable APK). Served from env so the fingerprint
  // can be added as a Replit Secret after the APK is built — no code change or
  // rebuild. Empty config returns a valid empty list; the app still works.
  app.get("/.well-known/assetlinks.json", (_req, res) => {
    const packageName = config.ANDROID_PACKAGE_NAME?.trim();
    const fingerprints = (config.ANDROID_CERT_FINGERPRINTS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    res.type("application/json");
    if (!packageName || fingerprints.length === 0) {
      res.json([]);
      return;
    }
    res.json([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: packageName,
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ]);
  });

  app.get("/api/bootstrap", async (req, res, next) => {
    try {
      const ctx = await context(req, res);
      const [games, likes, engagement, followedCreatorIds, stats] = await Promise.all([
        store.listGames(),
        store.getLikes(ctx.deviceId),
        store.getEngagement(ctx.player.id),
        store.getFollowedCreators(ctx.player.id),
        store.getPlayerStats(ctx.player.id),
      ]);
      res.json({
        player: publicPlayer(ctx.player),
        games: games.map((game) => ({ ...game, ranked: isRankedGame(game.slug) })),
        likes,
        engagement,
        followedCreatorIds,
        stats,
        auth: {
          google: providerAvailable("google", config),
          discord: providerAvailable("discord", config),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/runs/start", async (req, res, next) => {
    try {
      const body = runStartSchema.parse(req.body);
      const ctx = await context(req, res);
      res.status(201).json(await store.startRun(ctx.player.id, body.gameSlug));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/scores", async (req, res, next) => {
    try {
      const body = scoreSchema.parse(req.body);
      const ctx = await context(req, res);
      if (!allowScore(`${ctx.deviceId}:${req.ip}`)) {
        res.status(429).json({ error: "Too many score submissions. Try again in a minute." });
        return;
      }
      const run = await store.claimRunTicket(body.ticket, ctx.player.id, body.gameSlug);
      if (!run) {
        res.status(409).json({ error: "This run is missing, expired, or already submitted." });
        return;
      }
      const durationMs = Date.now() - Number(run.started_at);
      const verdict = validateScore(body.gameSlug, body.score, durationMs);
      if (!verdict.ok) {
        res.status(422).json({ error: "Score rejected by server validation.", reason: verdict.reason });
        return;
      }
      const runId = await store.saveScore(ctx.player.id, body.gameSlug, body.score, durationMs);
      const leaderboard = await store.getLeaderboard(body.gameSlug, ctx.player.id, "all");
      broadcast(body.gameSlug);
      res.status(201).json({ ...leaderboard, durationMs, runId });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/leaderboard", async (req, res, next) => {
    try {
      const query = leaderboardQuery.parse(req.query);
      const ctx = await context(req, res);
      res.json(await store.getLeaderboard(query.game, ctx.player.id, query.period));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/leaderboard/global", async (req, res, next) => {
    try {
      const ctx = await context(req, res);
      res.json(await store.getGlobalLeaderboard(ctx.player.id));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/discover", async (req, res, next) => {
    try {
      const query = discoveryQuery.parse(req.query);
      const ctx = await context(req, res);
      const [games, engagement, followedCreatorIds] = await Promise.all([
        store.listGames(),
        store.getEngagement(ctx.player.id),
        store.getFollowedCreators(ctx.player.id),
      ]);
      const followed = new Set(followedCreatorIds);
      const needle = query.q.toLocaleLowerCase();
      const result = games
        .filter(
          (game) =>
            (!query.category || game.category === query.category) &&
            (query.view !== "saved" || engagement[game.slug]?.saved) &&
            (query.view !== "following" || followed.has(game.creatorId)) &&
            (!needle ||
              `${game.title} ${game.creatorName} ${game.category}`
                .toLocaleLowerCase()
                .includes(needle)),
        )
        .map((game) => ({
          ...game,
          ranked: isRankedGame(game.slug),
          engagement: engagement[game.slug] ?? { saved: false, saves: 0, plays: 0 },
          followingCreator: followed.has(game.creatorId),
        }))
        .sort((a, b) =>
          query.sort === "title"
            ? a.title.localeCompare(b.title)
            : b.engagement.plays - a.engagement.plays ||
              b.engagement.saves - a.engagement.saves ||
              a.title.localeCompare(b.title),
        );
      res.json({ games: result, total: result.length });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/events", async (req, res, next) => {
    try {
      const gameSlug = z.string().min(1).max(50).parse(req.query.game);
      await context(req, res);
      res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      });
      res.flushHeaders();
      res.write(`event: ready\ndata: ${JSON.stringify({ gameSlug })}\n\n`);
      const clients = sseClients.get(gameSlug) ?? new Set<Response>();
      clients.add(res);
      sseClients.set(gameSlug, clients);
      const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 20_000);
      req.on("close", () => {
        clearInterval(heartbeat);
        clients.delete(res);
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/challenges/:runId", async (req, res, next) => {
    try {
      const runId = z.string().uuid().parse(req.params.runId);
      const challenge = await store.getChallenge(runId);
      if (!challenge) {
        res.status(404).json({ error: "Challenge not found." });
        return;
      }
      res.json(challenge);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/games/:slug/like", async (req, res, next) => {
    try {
      const gameSlug = z.string().min(1).max(50).parse(req.params.slug);
      const ctx = await context(req, res);
      res.json(await store.toggleLike(ctx.deviceId, gameSlug));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/games/:slug/save", async (req, res, next) => {
    try {
      const gameSlug = z.string().min(1).max(50).parse(req.params.slug);
      const ctx = await context(req, res);
      res.json(await store.toggleSave(ctx.player.id, gameSlug));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/games/:slug/play", async (req, res, next) => {
    try {
      const gameSlug = z.string().min(1).max(50).parse(req.params.slug);
      const ctx = await context(req, res);
      res.json(await store.recordPlay(ctx.player.id, gameSlug));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/creators/:creatorId/follow", async (req, res, next) => {
    try {
      const creatorId = z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).parse(req.params.creatorId);
      const ctx = await context(req, res);
      res.json(await store.toggleCreatorFollow(ctx.player.id, creatorId));
    } catch (error) {
      next(error);
    }
  });

  app.get("/auth/:provider", async (req, res, next) => {
    try {
      const provider = z.enum(["google", "discord"]).parse(req.params.provider) as OAuthProvider;
      if (!providerAvailable(provider, config)) {
        res.status(503).send(`${provider} sign-in is not configured on this deployment.`);
        return;
      }
      await context(req, res);
      const state = randomBytes(24).toString("base64url");
      res.cookie("ttg_oauth_state", state, cookieOptions(config, 10 * 60 * 1000));
      const redirectUri = `${requestBaseUrl(req, config)}/auth/${provider}/callback`;
      res.redirect(authorizationUrl(provider, state, redirectUri, config));
    } catch (error) {
      next(error);
    }
  });

  app.get("/auth/:provider/callback", async (req, res, next) => {
    try {
      const provider = z.enum(["google", "discord"]).parse(req.params.provider) as OAuthProvider;
      const code = z.string().min(1).parse(req.query.code);
      const state = z.string().min(1).parse(req.query.state);
      const cookies = parseCookies(req.headers.cookie);
      if (!safeStateEqual(cookies.ttg_oauth_state, state)) {
        res.status(400).send("OAuth state mismatch. Please restart sign-in.");
        return;
      }
      res.clearCookie("ttg_oauth_state", { path: "/" });
      const ctx = await context(req, res);
      const redirectUri = `${requestBaseUrl(req, config)}/auth/${provider}/callback`;
      const profile = await exchangeCode(provider, code, redirectUri, config);
      const player = await store.upsertOauthPlayer({ ...profile, deviceId: ctx.deviceId });
      const session = await store.createSession(player.id);
      res.cookie("ttg_session", session, cookieOptions(config, 1000 * 60 * 60 * 24 * 30));
      res.redirect("/?signedIn=1");
    } catch (error) {
      next(error);
    }
  });

  app.post("/auth/logout", async (req, res, next) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      if (cookies.ttg_session) await store.deleteSession(cookies.ttg_session);
      res.clearCookie("ttg_session", { path: "/" });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

    // ─── Ads channel control + stats ───────────────────────────────────────────
  app.get("/api/ads/config", (_req, res) => {
    const config = loadAdsConfig();
    res.json({ ...config, baseOrigin: config.enabled ? `${reqProtocol(_req)}://${_req.get("host")}` : undefined });
  });

  app.get("/api/ads/stats", async (_req, res, next) => {
    try {
      res.json(await store.getAdStats(14));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ads/events", async (req, res, next) => {
    try {
      const body = z.object({
        campaignId: z.string().min(1).max(80).optional(),
        gameSlug: z.string().min(1).max(80).optional(),
        kind: z.string().min(1).max(40).optional(),
        placement: z.string().max(120).optional(),
        event: z.enum(["impression", "click", "complete", "skipped"]),
      }).parse(req.body);
      if (["impression", "click", "complete"].includes(body.event)) {
        await store.recordAdEvent(
          body.campaignId ?? "unknown",
          body.gameSlug ?? "",
          body.kind ?? "",
          body.placement ?? "",
          body.event,
        );
      }
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/ads/admin/config", async (req, res, next) => {
    try {
      const config = saveAdsConfigOverride(req.body ?? {});
      res.json({ ...config, source: "override", path: ADS_OVERRIDE_PATH() });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/ads/admin/config", async (_req, res, next) => {
    try {
      const config = resetAdsConfigOverride();
      res.json({ ...config, source: "default" });
    } catch (error) {
      next(error);
    }
  });


app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API route not found." });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request.", details: error.issues });
      return;
    }
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    console.error(error);
    res.status(message === "Unknown game." || message === "Unknown creator." ? 404 : 500).json({
      error: config.NODE_ENV === "production" ? "Something went wrong." : message,
    });
  });

  return app;
}
