import { randomBytes, randomUUID } from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
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
import { validateScore } from "./score-policy.js";

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
  app.use(
    helmet({
      contentSecurityPolicy:
        config.NODE_ENV === "development"
          ? false
          : {
              directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https://cdn.discordapp.com", "https://lh3.googleusercontent.com"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                workerSrc: ["'self'"],
              },
            },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(express.json({ limit: "32kb" }));

  const sseClients = new Map<string, Set<Response>>();
  const scoreRate = new Map<string, { count: number; resetAt: number }>();

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

  app.get("/api/bootstrap", async (req, res, next) => {
    try {
      const ctx = await context(req, res);
      const [games, likes] = await Promise.all([store.listGames(), store.getLikes(ctx.deviceId)]);
      res.json({
        player: publicPlayer(ctx.player),
        games,
        likes,
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
    res.status(message === "Unknown game." ? 404 : 500).json({
      error: config.NODE_ENV === "production" ? "Something went wrong." : message,
    });
  });

  return app;
}
