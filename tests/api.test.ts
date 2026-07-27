import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../server/app";
import { loadConfig, type Config } from "../server/config";
import { Store } from "../server/db";

describe("Tip Tap API", () => {
  let databasePath: string;
  let store: Store;
  let config: Config;

  beforeEach(async () => {
    databasePath = join(tmpdir(), `tip-tap-${randomUUID()}.db`);
    config = loadConfig({
      NODE_ENV: "test",
      SQLITE_PATH: databasePath,
      DATABASE_URL: "",
      SESSION_SECRET: "test-session-secret-that-is-long-enough",
    });
    store = new Store(config);
    await store.init();
  });

  afterEach(async () => {
    await store.close();
    rmSync(databasePath, { force: true });
    rmSync(`${databasePath}-shm`, { force: true });
    rmSync(`${databasePath}-wal`, { force: true });
  });

  it("creates a persistent guest and returns every active game", async () => {
    const agent = request.agent(createApp(config, store));
    const first = await agent.get("/api/bootstrap").expect(200);
    const second = await agent.get("/api/bootstrap").expect(200);

    expect(first.body.games).toHaveLength(23);
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "subway-surfers" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "supercar-legends" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "ping-pong-go" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "ping-pong-bugs" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "dino-runner" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "arithmetica" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "67-game" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "archery-king" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "smash-room" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "temple-run-2-frozen-shadows" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "stickman-fury" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "plonky" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "fruit-ninja" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "city-cab-rush" })]),
    );
    expect(first.body.games).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: "pulse-lock", ranked: true }),
        expect.objectContaining({ slug: "johnny-trigger-sniper", ranked: false }),
        expect.objectContaining({ slug: "stickman-fury", ranked: false }),
      ]),
    );
    expect(first.body.player.isGuest).toBe(true);
    expect(second.body.player.id).toBe(first.body.player.id);
    expect(first.headers["set-cookie"]?.[0]).toContain("HttpOnly");
  });

  it("serves an empty assetlinks.json until the Android APK fingerprint is set", async () => {
    const response = await request(createApp(config, store))
      .get("/.well-known/assetlinks.json")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual([]);
  });

  it("serves a valid TWA assetlinks.json once the APK fingerprint is configured", async () => {
    const twaConfig: Config = {
      ...config,
      ANDROID_PACKAGE_NAME: "games.tiptap.twa",
      ANDROID_CERT_FINGERPRINTS: "AA:BB:CC , DD:EE:FF",
    };
    const response = await request(createApp(twaConfig, store))
      .get("/.well-known/assetlinks.json")
      .expect(200);
    expect(response.body).toEqual([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "games.tiptap.twa",
          sha256_cert_fingerprints: ["AA:BB:CC", "DD:EE:FF"],
        },
      },
    ]);
  });

  it("scopes the legacy Unity CSP exception to the local Unity game assets", async () => {
    const app = createApp(config, store);
    app.get("/games/subway-surfers/csp-probe.js", (_request, response) =>
      response.type("text/javascript").send("void 0;"),
    );
    app.get("/games/city-cab-rush/csp-probe.js", (_request, response) =>
      response.type("text/javascript").send("void 0;"),
    );
    app.get("/games/plonky/csp-probe.js", (_request, response) =>
      response.type("text/javascript").send("void 0;"),
    );
    app.get("/games/theft-city/csp-probe.js", (_request, response) =>
      response.type("text/javascript").send("void 0;"),
    );
    app.get("/games/dino-game/csp-probe.js", (_request, response) =>
      response.type("text/javascript").send("void 0;"),
    );
    app.get("/games/future-copy/csp-probe.js", (_request, response) =>
      response.type("text/javascript").send("void 0;"),
    );
    const regular = await request(app).get("/api/health").expect(200);
    const subwayAsset = await request(app).get("/games/subway-surfers/csp-probe.js").expect(200);
    const cityCabRushAsset = await request(app).get("/games/city-cab-rush/csp-probe.js").expect(200);
    const plonkyAsset = await request(app).get("/games/plonky/csp-probe.js").expect(200);
    const theftCityAsset = await request(app).get("/games/theft-city/csp-probe.js").expect(200);
    const dinoAsset = await request(app).get("/games/dino-game/csp-probe.js").expect(200);
    const futureGameAsset = await request(app).get("/games/future-copy/csp-probe.js").expect(200);
    const regularCsp = regular.headers["content-security-policy"];
    const subwayCsp = subwayAsset.headers["content-security-policy"];
    const cityCabRushCsp = cityCabRushAsset.headers["content-security-policy"];
    const plonkyCsp = plonkyAsset.headers["content-security-policy"];
    const theftCityCsp = theftCityAsset.headers["content-security-policy"];
    const dinoCsp = dinoAsset.headers["content-security-policy"];
    const futureGameCsp = futureGameAsset.headers["content-security-policy"];

    expect(regularCsp).not.toContain("'unsafe-eval'");
    expect(regularCsp).toContain("connect-src 'self'");
    expect(subwayCsp).toContain("script-src 'self' 'unsafe-eval'");
    expect(subwayCsp).toContain("connect-src 'self' data: blob:");
    expect(subwayCsp).toContain("frame-src 'none'");
    expect(cityCabRushCsp).toContain("script-src 'self' 'unsafe-eval'");
    expect(cityCabRushCsp).toContain("connect-src 'self' data: blob:");
    expect(cityCabRushCsp).toContain("frame-src 'none'");
    expect(plonkyCsp).toContain("script-src 'self' 'unsafe-eval'");
    expect(plonkyCsp).toContain("connect-src 'self' data: blob:");
    expect(plonkyCsp).toContain("frame-src 'none'");
    expect(theftCityCsp).toContain("script-src 'self' 'wasm-unsafe-eval'");
    expect(theftCityCsp).not.toContain("'unsafe-eval'");
    expect(theftCityCsp).toContain("connect-src 'self' data: blob:");
    expect(theftCityCsp).toContain("frame-src 'none'");
    expect(dinoCsp).toContain("script-src 'self';");
    expect(dinoCsp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(dinoCsp).not.toContain("'unsafe-eval'");
    expect(futureGameCsp).toContain("script-src 'self'");
    expect(futureGameCsp).not.toContain("'unsafe-eval'");
    expect(futureGameCsp).not.toContain("poki.com");
  });

  it("keeps copied-game CSP active during local development", async () => {
    const developmentConfig: Config = { ...config, NODE_ENV: "development" };
    const app = createApp(developmentConfig, store);
    app.get("/games/stickman-fury/index.html", (_request, response) =>
      response.type("text/html").send("<!doctype html><title>Stickman Fury</title>"),
    );
    const regular = await request(app).get("/api/health").expect(200);
    const game = await request(app).get("/games/stickman-fury/index.html").expect(200);

    expect(regular.headers["content-security-policy"]).toBeUndefined();
    expect(game.headers["content-security-policy"]).toContain("script-src 'self'");
    expect(game.headers["content-security-policy"]).toContain("connect-src 'self' data: blob:");
    expect(game.headers["content-security-policy"]).toContain("frame-src 'none'");
    expect(game.headers["access-control-allow-origin"]).toBe("null");
    expect(game.headers["cross-origin-resource-policy"]).toBe("cross-origin");
  });

  it("accepts one plausible run, rejects replay, and creates a canonical challenge", async () => {
    const agent = request.agent(createApp(config, store));
    await agent.get("/api/bootstrap").expect(200);
    const started = await agent.post("/api/runs/start").send({ gameSlug: "pulse-lock" }).expect(201);

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 300));
    const finished = await agent
      .post("/api/scores")
      .send({ ticket: started.body.ticket, gameSlug: "pulse-lock", score: 100 })
      .expect(201);

    expect(finished.body.yourRank).toBe(1);
    expect(finished.body.runId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    await agent
      .post("/api/scores")
      .send({ ticket: started.body.ticket, gameSlug: "pulse-lock", score: 100 })
      .expect(409);

    const challenge = await agent.get(`/api/challenges/${finished.body.runId}`).expect(200);
    expect(challenge.body).toMatchObject({
      gameSlug: "pulse-lock",
      gameTitle: "Pulse Lock",
      score: 100,
    });
  });

  it("rejects impossible scores before they reach the leaderboard", async () => {
    const agent = request.agent(createApp(config, store));
    await agent.get("/api/bootstrap").expect(200);
    const started = await agent.post("/api/runs/start").send({ gameSlug: "meteor-dodge" }).expect(201);
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 300));
    await agent
      .post("/api/scores")
      .send({ ticket: started.body.ticket, gameSlug: "meteor-dodge", score: 450_000 })
      .expect(422);
    const board = await agent
      .get("/api/leaderboard?game=meteor-dodge&period=all")
      .expect(200);
    expect(board.body.entries).toEqual([]);
  });

  it("toggles hype once per browser identity", async () => {
    const agent = request.agent(createApp(config, store));
    await agent.get("/api/bootstrap").expect(200);
    const liked = await agent.post("/api/games/pulse-lock/like").send({}).expect(200);
    const unliked = await agent.post("/api/games/pulse-lock/like").send({}).expect(200);
    expect(liked.body).toEqual({ liked: true, count: 1 });
    expect(unliked.body).toEqual({ liked: false, count: 0 });
  });

  it("preserves guest scores when the same browser claims an OAuth identity", async () => {
    const guest = await store.getOrCreateGuest(randomUUID());
    await store.saveScore(guest.id, "stack-shift", 1_234, 2_000);
    const claimed = await store.upsertOauthPlayer({
      provider: "discord",
      providerUserId: "discord-test-user",
      handle: "StackPilot",
      avatarUrl: null,
      deviceId: guest.device_id!,
    });
    const board = await store.getLeaderboard("stack-shift", claimed.id);
    expect(claimed.provider).toBe("discord");
    expect(board.yourBest).toBe(1_234);
    expect(board.yourRank).toBe(1);
  });
});
