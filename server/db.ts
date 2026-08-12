import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync, type StatementResultingChanges } from "node:sqlite";
import pg from "pg";
import type { Config } from "./config.js";
import {
  CREATOR_IDS,
  getGameCatalogMetadata,
  type GameCatalogMetadata,
} from "../shared/catalog.js";
import { isRankedGame } from "./score-policy.js";

const { Pool } = pg;

export interface Player {
  id: string;
  handle: string;
  avatar_url: string | null;
  provider: "guest" | "google" | "discord";
  provider_user_id: string | null;
  device_id: string | null;
  created_at: number;
}

interface StoredGameRecord {
  slug: string;
  title: string;
  rule_text: string;
  accent: string;
}

export interface GameRecord extends StoredGameRecord, GameCatalogMetadata {}

export interface GameEngagementRecord {
  saved: boolean;
  saves: number;
  plays: number;
}

export interface GlobalLeaderboardEntry {
  playerId: string;
  handle: string;
  avatarUrl: string | null;
  points: number;
  crowns: number;
  rankedGames: number;
  rank: number;
  isYou: boolean;
}

export interface GlobalLeaderboardResult {
  entries: GlobalLeaderboardEntry[];
  yourRank: number | null;
  yourPoints: number;
  totalPlayers: number;
}

export interface LeaderboardEntry {
  playerId: string;
  handle: string;
  avatarUrl: string | null;
  score: number;
  rank: number;
  isYou: boolean;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  yourRank: number | null;
  yourBest: number;
  percentile: number | null;
  ghostScore: number | null;
  totalPlayers: number;
}

type SqlParams = Array<string | number | null>;

const GAME_SEED: StoredGameRecord[] = [
  { slug: "pulse-lock", title: "Pulse Lock", rule_text: "Tap when the pulse hits the live zone.", accent: "#38b6ff" },
  { slug: "color-clash", title: "Color Clash", rule_text: "Tap the color named, not the color shown.", accent: "#b06cff" },
  { slug: "stack-shift", title: "Stack Shift", rule_text: "Tap to lock each moving block in place.", accent: "#21d4fd" },
  { slug: "memory-grid", title: "Memory Grid", rule_text: "Watch the signal. Repeat the growing pattern.", accent: "#ff4fd8" },
  { slug: "meteor-dodge", title: "Meteor Dodge", rule_text: "Drag sideways. Stay clear of every meteor.", accent: "#ff9f1c" },
  {
    slug: "subway-surfers",
    title: "Subway Surfers",
    rule_text: "Swipe to dodge trains, jump barriers, and chase the highest score.",
    accent: "#ffd32a",
  },
  {
    slug: "dino-runner",
    title: "Dino Runner",
    rule_text: "Tap to jump. Survive the endless desert.",
    accent: "#4ade80",
  },
  {
    slug: "arithmetica",
    title: "ArithmeticA",
    rule_text: "Solve the math. Beat the clock.",
    accent: "#f59e0b",
  },
  {
    slug: "67-game",
    title: "67 Game",
    rule_text: "Solve rapid-fire puzzle levels before the clock runs out.",
    accent: "#fe930e",
  },
  {
    slug: "archery-king",
    title: "Archery King",
    rule_text: "Draw, aim with the wind, and hit the target in 24 solo levels.",
    accent: "#ef4444",
  },
  {
    slug: "smash-room",
    title: "Smash Room",
    rule_text: "Choose a tool and smash every voxel object in sight.",
    accent: "#fb923c",
  },
  {
    slug: "temple-run-2-frozen-shadows",
    title: "Temple Run 2: Frozen Shadows",
    rule_text: "Run the frozen path. Swipe to turn, jump, and slide past every trap.",
    accent: "#b7e6ff",
  },
  {
    slug: "stickman-fury",
    title: "Stickman Fury",
    rule_text: "Move, jump, fight, and survive every physics-driven arena.",
    accent: "#ef4444",
  },
  {
    slug: "plonky",
    title: "Plonky",
    rule_text: "Run, jump, and outsmart the traps.",
    accent: "#1dd7d7",
  },
  {
    slug: "fruit-ninja",
    title: "Fruit Ninja",
    rule_text: "Swipe to slice fruit for points. Avoid the bombs.",
    accent: "#84cc16",
  },
  {
    slug: "count-control-legends",
    title: "Count Control Legends",
    rule_text: "Move left and right, grow your crew through the best number gates, and conquer the course.",
    accent: "#38bdf8",
  },
  {
    slug: "johnny-trigger-sniper",
    title: "Johnny Trigger - Sniper Game",
    rule_text: "Aim carefully, eliminate the targets, and protect civilians.",
    accent: "#00c565",
  },
  {
    slug: "rocket-soccer-derby",
    title: "Rocket Soccer Derby",
    rule_text: "Drive, boost, hit the ball, and score more goals than your opponent.",
    accent: "#ff7a47",
  },
  {
    slug: "dig-out-of-prison",
    title: "Dig out of Prison",
    rule_text: "Dig, gather resources, and escape the prison compound.",
    accent: "#7bcf63",
  },
  {
    slug: "kitty-loves-birds-2",
    title: "Kitty Loves Birds 2",
    rule_text: "Run, leap onto birds, collect coins, and climb through the colorful world.",
    accent: "#f59e0b",
  },
  {
    slug: "theft-city",
    title: "Theft City",
    rule_text: "Explore the city, collect loot, escape danger, and build your criminal empire.",
    accent: "#facc15",
  },
  {
    slug: "city-cab-rush",
    title: "City Cab Rush",
    rule_text: "Drive through traffic, pick up fares, and race to the destination.",
    accent: "#fbbf24",
  },
  {
    slug: "supercar-legends",
    title: "Supercar Legends",
    rule_text: "Swipe left/right through math gates. Grow your run.",
    accent: "#ff3b6b",
  },
  {
    slug: "ping-pong-go",
    title: "Ping Pong Go",
    rule_text: "Swipe to serve and rally. Win every point against the CPU.",
    accent: "#06b6d4",
  },
  {
    slug: "happy-glass",
    title: "Happy Glass",
    rule_text: "Draw the line. Fill the glass.",
    accent: "#38bdf8",
  },
  {
    slug: "drive-mad",
    title: "Drive Mad",
    rule_text: "Race the road. Flip the finish.",
    accent: "#22c55e",
  },
  {
    slug: "slice-master",
    title: "Slice Master",
    rule_text: "Slice every object. Miss nothing.",
    accent: "#ff8a00",
  },
  {
    slug: "level-devil",
    title: "Level Devil",
    rule_text: "Climb the tower. Every floor is out to get you.",
    accent: "#ef4444",
  },
  {
    slug: "game-2048",
    title: "2048",
    rule_text: "Swipe to merge tiles and reach 2048.",
    accent: "#edc22e",
  },
  {
    slug: "ping-pong-bugs",
    title: "Ping Pong Bugs",
    rule_text: "Smash every wave of bugs off the table before they land.",
    accent: "#d946ef",
  },
];

function pgPlaceholders(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function normalizeRows<T>(rows: T[]): T[] {
  return rows.map((row) => {
    if (!row || typeof row !== "object") return row;
    return Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        typeof value === "bigint" ? Number(value) : value,
      ]),
    ) as T;
  });
}

export class Store {
  private readonly sqlite: DatabaseSync | null;
  private readonly pool: pg.Pool | null;

  constructor(private readonly config: Config) {
    if (config.DATABASE_URL) {
      this.pool = new Pool({
        connectionString: config.DATABASE_URL,
        max: 8,
      });
      this.sqlite = null;
    } else {
      const path = resolve(config.SQLITE_PATH);
      mkdirSync(dirname(path), { recursive: true });
      this.sqlite = new DatabaseSync(path);
      this.sqlite.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
      this.pool = null;
    }
  }

  async init(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        handle TEXT NOT NULL,
        avatar_url TEXT,
        provider TEXT NOT NULL,
        provider_user_id TEXT,
        device_id TEXT,
        created_at BIGINT NOT NULL
      );
      CREATE UNIQUE INDEX IF NOT EXISTS players_provider_identity
        ON players(provider, provider_user_id);
      CREATE UNIQUE INDEX IF NOT EXISTS players_device
        ON players(device_id);

      CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        expires_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS games (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        rule_text TEXT NOT NULL,
        accent TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS run_tickets (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        game_slug TEXT NOT NULL REFERENCES games(slug),
        started_at BIGINT NOT NULL,
        used_at BIGINT
      );

      CREATE TABLE IF NOT EXISTS scores (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        game_slug TEXT NOT NULL REFERENCES games(slug),
        score INTEGER NOT NULL CHECK(score >= 0),
        duration_ms INTEGER NOT NULL CHECK(duration_ms >= 0),
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS scores_game_score
        ON scores(game_slug, score DESC);
      CREATE INDEX IF NOT EXISTS scores_player_game
        ON scores(player_id, game_slug, score DESC);

      CREATE TABLE IF NOT EXISTS likes (
        device_key TEXT NOT NULL,
        game_slug TEXT NOT NULL REFERENCES games(slug),
        created_at BIGINT NOT NULL,
        PRIMARY KEY(device_key, game_slug)
      );


      CREATE TABLE IF NOT EXISTS ad_events (
        id TEXT PRIMARY KEY,
        game_slug TEXT,
        campaign_id TEXT,
        kind TEXT,
        placement TEXT,
        event TEXT,
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ad_events_campaign_event
        ON ad_events(campaign_id, event, created_at);

      CREATE TABLE IF NOT EXISTS saves (
        player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        game_slug TEXT NOT NULL REFERENCES games(slug),
        created_at BIGINT NOT NULL,
        PRIMARY KEY(player_id, game_slug)
      );

      CREATE TABLE IF NOT EXISTS creator_follows (
        player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        creator_id TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        PRIMARY KEY(player_id, creator_id)
      );

      CREATE TABLE IF NOT EXISTS game_plays (
        player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        game_slug TEXT NOT NULL REFERENCES games(slug),
        played_on TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        PRIMARY KEY(player_id, game_slug, played_on)
      );
      CREATE INDEX IF NOT EXISTS game_plays_slug_created
        ON game_plays(game_slug, created_at DESC);
    `;

    if (this.pool) {
      await this.pool.query(schema);
    } else {
      this.sqlite!.exec(schema);
    }

    for (const game of GAME_SEED) {
      await this.run(
        `INSERT INTO games (slug, title, rule_text, accent, is_active)
         VALUES (?, ?, ?, ?, 1)
         ON CONFLICT (slug) DO UPDATE SET
           title = excluded.title,
           rule_text = excluded.rule_text,
           accent = excluded.accent,
           is_active = 1`,
        [game.slug, game.title, game.rule_text, game.accent],
      );
    }
  }

  private async all<T>(sql: string, params: SqlParams = []): Promise<T[]> {
    if (this.pool) {
      const result = await this.pool.query(pgPlaceholders(sql), params);
      return normalizeRows(result.rows as T[]);
    }
    return normalizeRows(this.sqlite!.prepare(sql).all(...params) as T[]);
  }

  private async get<T>(sql: string, params: SqlParams = []): Promise<T | undefined> {
    return (await this.all<T>(sql, params))[0];
  }

  private async run(sql: string, params: SqlParams = []): Promise<number> {
    if (this.pool) {
      const result = await this.pool.query(pgPlaceholders(sql), params);
      return result.rowCount ?? 0;
    }
    const result = this.sqlite!.prepare(sql).run(...params) as StatementResultingChanges;
    return Number(result.changes);
  }

  async listGames(): Promise<GameRecord[]> {
    const games = await this.all<StoredGameRecord>(
      "SELECT slug, title, rule_text, accent FROM games WHERE is_active = 1 ORDER BY rowid",
    ).catch(async () =>
      this.all<StoredGameRecord>(
        "SELECT slug, title, rule_text, accent FROM games WHERE is_active = 1 ORDER BY slug",
      ),
    );
    return games.map((game) => ({ ...game, ...getGameCatalogMetadata(game.slug) }));
  }

  async getOrCreateGuest(deviceId: string): Promise<Player> {
    const found = await this.get<Player>("SELECT * FROM players WHERE device_id = ?", [deviceId]);
    if (found) return found;

    const id = randomUUID();
    const handle = `Player_${deviceId.replaceAll("-", "").slice(0, 5).toUpperCase()}`;
    const createdAt = Date.now();
    try {
      await this.run(
        `INSERT INTO players
          (id, handle, avatar_url, provider, provider_user_id, device_id, created_at)
         VALUES (?, ?, NULL, 'guest', NULL, ?, ?)`,
        [id, handle, deviceId, createdAt],
      );
    } catch {
      const raced = await this.get<Player>("SELECT * FROM players WHERE device_id = ?", [deviceId]);
      if (raced) return raced;
      throw new Error("Could not create guest player.");
    }
    return (await this.get<Player>("SELECT * FROM players WHERE id = ?", [id]))!;
  }

  async getPlayerBySession(rawToken: string): Promise<Player | undefined> {
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    return this.get<Player>(
      `SELECT p.* FROM sessions s
       JOIN players p ON p.id = s.player_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
      [tokenHash, Date.now()],
    );
  }

  async upsertOauthPlayer(input: {
    provider: "google" | "discord";
    providerUserId: string;
    handle: string;
    avatarUrl: string | null;
    deviceId: string;
  }): Promise<Player> {
    const existing = await this.get<Player>(
      "SELECT * FROM players WHERE provider = ? AND provider_user_id = ?",
      [input.provider, input.providerUserId],
    );
    const guest = await this.get<Player>("SELECT * FROM players WHERE device_id = ?", [input.deviceId]);

    if (existing) {
      if (guest && guest.id !== existing.id) {
        const guestSaves = await this.all<{ game_slug: string; created_at: number }>(
          "SELECT game_slug, created_at FROM saves WHERE player_id = ?",
          [guest.id],
        );
        for (const save of guestSaves) {
          await this.run(
            `INSERT INTO saves (player_id, game_slug, created_at)
             VALUES (?, ?, ?) ON CONFLICT (player_id, game_slug) DO NOTHING`,
            [existing.id, save.game_slug, save.created_at],
          );
        }
        const guestFollows = await this.all<{ creator_id: string; created_at: number }>(
          "SELECT creator_id, created_at FROM creator_follows WHERE player_id = ?",
          [guest.id],
        );
        for (const follow of guestFollows) {
          await this.run(
            `INSERT INTO creator_follows (player_id, creator_id, created_at)
             VALUES (?, ?, ?) ON CONFLICT (player_id, creator_id) DO NOTHING`,
            [existing.id, follow.creator_id, follow.created_at],
          );
        }
        const guestPlays = await this.all<{
          game_slug: string;
          played_on: string;
          created_at: number;
        }>(
          "SELECT game_slug, played_on, created_at FROM game_plays WHERE player_id = ?",
          [guest.id],
        );
        for (const play of guestPlays) {
          await this.run(
            `INSERT INTO game_plays (player_id, game_slug, played_on, created_at)
             VALUES (?, ?, ?, ?)
             ON CONFLICT (player_id, game_slug, played_on) DO NOTHING`,
            [existing.id, play.game_slug, play.played_on, play.created_at],
          );
        }
        await this.run("UPDATE scores SET player_id = ? WHERE player_id = ?", [existing.id, guest.id]);
        await this.run("UPDATE run_tickets SET player_id = ? WHERE player_id = ?", [existing.id, guest.id]);
        await this.run("DELETE FROM players WHERE id = ?", [guest.id]);
      }
      await this.run(
        "UPDATE players SET handle = ?, avatar_url = ?, device_id = ? WHERE id = ?",
        [input.handle, input.avatarUrl, input.deviceId, existing.id],
      );
      return (await this.get<Player>("SELECT * FROM players WHERE id = ?", [existing.id]))!;
    }

    if (guest) {
      await this.run(
        `UPDATE players
         SET handle = ?, avatar_url = ?, provider = ?, provider_user_id = ?
         WHERE id = ?`,
        [input.handle, input.avatarUrl, input.provider, input.providerUserId, guest.id],
      );
      return (await this.get<Player>("SELECT * FROM players WHERE id = ?", [guest.id]))!;
    }

    const id = randomUUID();
    await this.run(
      `INSERT INTO players
        (id, handle, avatar_url, provider, provider_user_id, device_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.handle, input.avatarUrl, input.provider, input.providerUserId, input.deviceId, Date.now()],
    );
    return (await this.get<Player>("SELECT * FROM players WHERE id = ?", [id]))!;
  }

  async createSession(playerId: string): Promise<string> {
    const raw = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(raw).digest("hex");
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
    await this.run("INSERT INTO sessions (token_hash, player_id, expires_at) VALUES (?, ?, ?)", [
      tokenHash,
      playerId,
      expiresAt,
    ]);
    return raw;
  }

  async deleteSession(rawToken: string): Promise<void> {
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    await this.run("DELETE FROM sessions WHERE token_hash = ?", [tokenHash]);
  }

  async startRun(playerId: string, gameSlug: string): Promise<{ ticket: string; startedAt: number }> {
    const game = await this.get<{ slug: string }>(
      "SELECT slug FROM games WHERE slug = ? AND is_active = 1",
      [gameSlug],
    );
    if (!game) throw new Error("Unknown game.");
    const ticket = randomUUID();
    const startedAt = Date.now();
    await this.run(
      "INSERT INTO run_tickets (id, player_id, game_slug, started_at, used_at) VALUES (?, ?, ?, ?, NULL)",
      [ticket, playerId, gameSlug, startedAt],
    );
    return { ticket, startedAt };
  }

  async claimRunTicket(
    ticket: string,
    playerId: string,
    gameSlug: string,
  ): Promise<{ started_at: number } | undefined> {
    const row = await this.get<{ started_at: number }>(
      `SELECT started_at FROM run_tickets
       WHERE id = ? AND player_id = ? AND game_slug = ? AND used_at IS NULL`,
      [ticket, playerId, gameSlug],
    );
    if (!row) return undefined;
    const claimed = await this.run(
      "UPDATE run_tickets SET used_at = ? WHERE id = ? AND used_at IS NULL",
      [Date.now(), ticket],
    );
    return claimed === 1 ? row : undefined;
  }

  async saveScore(
    playerId: string,
    gameSlug: string,
    score: number,
    durationMs: number,
  ): Promise<string> {
    const id = randomUUID();
    await this.run(
      `INSERT INTO scores (id, player_id, game_slug, score, duration_ms, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, playerId, gameSlug, score, durationMs, Date.now()],
    );
    return id;
  }

  async getChallenge(runId: string): Promise<{
    runId: string;
    gameSlug: string;
    gameTitle: string;
    handle: string;
    score: number;
  } | undefined> {
    const row = await this.get<{
      run_id: string;
      game_slug: string;
      game_title: string;
      handle: string;
      score: number;
    }>(
      `SELECT s.id AS run_id, s.game_slug, g.title AS game_title, p.handle, s.score
       FROM scores s
       JOIN games g ON g.slug = s.game_slug
       JOIN players p ON p.id = s.player_id
       WHERE s.id = ?`,
      [runId],
    );
    return row
      ? {
          runId: row.run_id,
          gameSlug: row.game_slug,
          gameTitle: row.game_title,
          handle: row.handle,
          score: Number(row.score),
        }
      : undefined;
  }

  async getLeaderboard(
    gameSlug: string,
    playerId: string,
    period: "all" | "daily" = "all",
  ): Promise<LeaderboardResult> {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const params: SqlParams = [gameSlug];
    const periodSql = period === "daily" ? " AND s.created_at >= ?" : "";
    if (period === "daily") params.push(dayStart.getTime());

    const rows = await this.all<{
      id: string;
      handle: string;
      avatar_url: string | null;
      score: number;
    }>(
      `SELECT p.id, p.handle, p.avatar_url, MAX(s.score) AS score
       FROM scores s
       JOIN players p ON p.id = s.player_id
       WHERE s.game_slug = ?${periodSql}
       GROUP BY p.id, p.handle, p.avatar_url
       ORDER BY score DESC
       LIMIT 500`,
      params,
    );

    const ranked = rows.map((row, index) => ({
      playerId: row.id,
      handle: row.handle,
      avatarUrl: row.avatar_url,
      score: Number(row.score),
      rank: index + 1,
      isYou: row.id === playerId,
    }));
    const yours = ranked.find((row) => row.isYou);
    const totalPlayers = ranked.length;
    const percentile =
      yours && totalPlayers > 1
        ? Math.round(((totalPlayers - yours.rank) / (totalPlayers - 1)) * 100)
        : yours
          ? 100
          : null;
    const ghostScore = yours && yours.rank > 1 ? ranked[yours.rank - 2]?.score ?? null : null;

    const entries = ranked.slice(0, 10);
    if (yours && !entries.some((row) => row.isYou)) entries.push(yours);

    return {
      entries,
      yourRank: yours?.rank ?? null,
      yourBest: yours?.score ?? 0,
      percentile,
      ghostScore,
      totalPlayers,
    };
  }

  async toggleLike(deviceKey: string, gameSlug: string): Promise<{ liked: boolean; count: number }> {
    const existing = await this.get<{ device_key: string }>(
      "SELECT device_key FROM likes WHERE device_key = ? AND game_slug = ?",
      [deviceKey, gameSlug],
    );
    if (existing) {
      await this.run("DELETE FROM likes WHERE device_key = ? AND game_slug = ?", [deviceKey, gameSlug]);
    } else {
      await this.run(
        "INSERT INTO likes (device_key, game_slug, created_at) VALUES (?, ?, ?)",
        [deviceKey, gameSlug, Date.now()],
      );
    }
    const countRow = await this.get<{ count: number }>(
      "SELECT COUNT(*) AS count FROM likes WHERE game_slug = ?",
      [gameSlug],
    );
    return { liked: !existing, count: Number(countRow?.count ?? 0) };
  }

  async getLikes(deviceKey: string): Promise<Record<string, { liked: boolean; count: number }>> {
    const counts = await this.all<{ game_slug: string; count: number }>(
      "SELECT game_slug, COUNT(*) AS count FROM likes GROUP BY game_slug",
    );
    const mine = await this.all<{ game_slug: string }>(
      "SELECT game_slug FROM likes WHERE device_key = ?",
      [deviceKey],
    );
    const mineSet = new Set(mine.map((row) => row.game_slug));
    return Object.fromEntries(
      GAME_SEED.map((game) => {
        const count = counts.find((row) => row.game_slug === game.slug)?.count ?? 0;
        return [game.slug, { liked: mineSet.has(game.slug), count: Number(count) }];
      }),
    );
  }

  async toggleSave(
    playerId: string,
    gameSlug: string,
  ): Promise<GameEngagementRecord> {
    const game = await this.get<{ slug: string }>(
      "SELECT slug FROM games WHERE slug = ? AND is_active = 1",
      [gameSlug],
    );
    if (!game) throw new Error("Unknown game.");
    const existing = await this.get<{ player_id: string }>(
      "SELECT player_id FROM saves WHERE player_id = ? AND game_slug = ?",
      [playerId, gameSlug],
    );
    if (existing) {
      await this.run("DELETE FROM saves WHERE player_id = ? AND game_slug = ?", [
        playerId,
        gameSlug,
      ]);
    } else {
      await this.run(
        "INSERT INTO saves (player_id, game_slug, created_at) VALUES (?, ?, ?)",
        [playerId, gameSlug, Date.now()],
      );
    }
    const [saveCount, playCount] = await Promise.all([
      this.get<{ count: number }>("SELECT COUNT(*) AS count FROM saves WHERE game_slug = ?", [
        gameSlug,
      ]),
      this.get<{ count: number }>(
        "SELECT COUNT(*) AS count FROM game_plays WHERE game_slug = ?",
        [gameSlug],
      ),
    ]);
    return {
      saved: !existing,
      saves: Number(saveCount?.count ?? 0),
      plays: Number(playCount?.count ?? 0),
    };
  }

  async recordPlay(playerId: string, gameSlug: string): Promise<{ plays: number }> {
    const game = await this.get<{ slug: string }>(
      "SELECT slug FROM games WHERE slug = ? AND is_active = 1",
      [gameSlug],
    );
    if (!game) throw new Error("Unknown game.");
    const playedOn = new Date().toISOString().slice(0, 10);
    await this.run(
      `INSERT INTO game_plays (player_id, game_slug, played_on, created_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (player_id, game_slug, played_on) DO NOTHING`,
      [playerId, gameSlug, playedOn, Date.now()],
    );
    const count = await this.get<{ count: number }>(
      "SELECT COUNT(*) AS count FROM game_plays WHERE game_slug = ?",
      [gameSlug],
    );
    return { plays: Number(count?.count ?? 0) };
  }

  async getEngagement(playerId: string): Promise<Record<string, GameEngagementRecord>> {
    const [saveCounts, playCounts, mine] = await Promise.all([
      this.all<{ game_slug: string; count: number }>(
        "SELECT game_slug, COUNT(*) AS count FROM saves GROUP BY game_slug",
      ),
      this.all<{ game_slug: string; count: number }>(
        "SELECT game_slug, COUNT(*) AS count FROM game_plays GROUP BY game_slug",
      ),
      this.all<{ game_slug: string }>("SELECT game_slug FROM saves WHERE player_id = ?", [
        playerId,
      ]),
    ]);
    const saved = new Set(mine.map((row) => row.game_slug));
    const savesBySlug = new Map(
      saveCounts.map((row) => [row.game_slug, Number(row.count)]),
    );
    const playsBySlug = new Map(
      playCounts.map((row) => [row.game_slug, Number(row.count)]),
    );
    return Object.fromEntries(
      GAME_SEED.map((game) => [
        game.slug,
        {
          saved: saved.has(game.slug),
          saves: savesBySlug.get(game.slug) ?? 0,
          plays: playsBySlug.get(game.slug) ?? 0,
        },
      ]),
    );
  }

  async toggleCreatorFollow(
    playerId: string,
    creatorId: string,
  ): Promise<{ following: boolean; followers: number }> {
    if (!CREATOR_IDS.has(creatorId)) throw new Error("Unknown creator.");
    const existing = await this.get<{ player_id: string }>(
      "SELECT player_id FROM creator_follows WHERE player_id = ? AND creator_id = ?",
      [playerId, creatorId],
    );
    if (existing) {
      await this.run(
        "DELETE FROM creator_follows WHERE player_id = ? AND creator_id = ?",
        [playerId, creatorId],
      );
    } else {
      await this.run(
        "INSERT INTO creator_follows (player_id, creator_id, created_at) VALUES (?, ?, ?)",
        [playerId, creatorId, Date.now()],
      );
    }
    const count = await this.get<{ count: number }>(
      "SELECT COUNT(*) AS count FROM creator_follows WHERE creator_id = ?",
      [creatorId],
    );
    return { following: !existing, followers: Number(count?.count ?? 0) };
  }

  async getFollowedCreators(playerId: string): Promise<string[]> {
    const rows = await this.all<{ creator_id: string }>(
      "SELECT creator_id FROM creator_follows WHERE player_id = ? ORDER BY created_at DESC",
      [playerId],
    );
    return rows.map((row) => row.creator_id);
  }

  async getPlayerStats(playerId: string): Promise<{
    rankedRuns: number;
    rankedGames: number;
    savedGames: number;
    followingCreators: number;
  }> {
    const [scores, saves, follows] = await Promise.all([
      this.get<{ runs: number; games: number }>(
        `SELECT COUNT(*) AS runs, COUNT(DISTINCT game_slug) AS games
         FROM scores WHERE player_id = ?`,
        [playerId],
      ),
      this.get<{ count: number }>("SELECT COUNT(*) AS count FROM saves WHERE player_id = ?", [
        playerId,
      ]),
      this.get<{ count: number }>(
        "SELECT COUNT(*) AS count FROM creator_follows WHERE player_id = ?",
        [playerId],
      ),
    ]);
    return {
      rankedRuns: Number(scores?.runs ?? 0),
      rankedGames: Number(scores?.games ?? 0),
      savedGames: Number(saves?.count ?? 0),
      followingCreators: Number(follows?.count ?? 0),
    };
  }

  async getGlobalLeaderboard(playerId: string): Promise<GlobalLeaderboardResult> {
    const rows = await this.all<{
      player_id: string;
      handle: string;
      avatar_url: string | null;
      game_slug: string;
      score: number;
    }>(
      `SELECT p.id AS player_id, p.handle, p.avatar_url, s.game_slug,
              MAX(s.score) AS score
       FROM scores s
       JOIN players p ON p.id = s.player_id
       GROUP BY p.id, p.handle, p.avatar_url, s.game_slug`,
    );

    const totals = new Map<
      string,
      Omit<GlobalLeaderboardEntry, "rank" | "isYou">
    >();
    const byGame = new Map<string, typeof rows>();
    for (const row of rows) {
      // The global championship must only aggregate games whose scores pass a
      // server-side policy. This also keeps legacy/direct database rows from
      // accidentally turning an unverified embedded game into a ranked title.
      if (!isRankedGame(row.game_slug)) continue;
      const gameRows = byGame.get(row.game_slug) ?? [];
      gameRows.push(row);
      byGame.set(row.game_slug, gameRows);
    }
    for (const gameRows of byGame.values()) {
      gameRows.sort((a, b) => Number(b.score) - Number(a.score));
      let lastScore: number | null = null;
      let rank = 0;
      gameRows.forEach((row, index) => {
        const score = Number(row.score);
        if (lastScore === null || score < lastScore) rank = index + 1;
        lastScore = score;
        const current = totals.get(row.player_id) ?? {
          playerId: row.player_id,
          handle: row.handle,
          avatarUrl: row.avatar_url,
          points: 0,
          crowns: 0,
          rankedGames: 0,
        };
        current.points += Math.max(1, 101 - rank);
        current.crowns += rank === 1 ? 1 : 0;
        current.rankedGames += 1;
        totals.set(row.player_id, current);
      });
    }

    const ranked = [...totals.values()]
      .sort(
        (a, b) =>
          b.points - a.points ||
          b.crowns - a.crowns ||
          b.rankedGames - a.rankedGames ||
          a.handle.localeCompare(b.handle),
      )
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isYou: entry.playerId === playerId,
      }));
    const yours = ranked.find((entry) => entry.isYou);
    const entries = ranked.slice(0, 20);
    if (yours && !entries.some((entry) => entry.isYou)) entries.push(yours);
    return {
      entries,
      yourRank: yours?.rank ?? null,
      yourPoints: yours?.points ?? 0,
      totalPlayers: ranked.length,
    };
  }


  async recordAdEvent(campaignId: string, gameSlug: string, kind: string, placement: string, event: string): Promise<void> {
    await this.run(
      `INSERT INTO ad_events (id, game_slug, campaign_id, kind, placement, event, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), gameSlug, campaignId, kind, placement, event, Date.now()],
    );
  }

  async getAdStats(days = 14): Promise<
    { campaignId: string; kind: string; impressions: number; completions: number; clicks: number; lastAt: number }[]
  > {
    const since = Date.now() - 1000 * 60 * 60 * 24 * days;
    const rows = await this.all<{
      campaign_id: string;
      kind: string;
      impressions: number;
      completions: number;
      clicks: number;
      last_at: number;
    }>(
      `SELECT campaign_id, kind,
              SUM(CASE WHEN event = 'impression' THEN 1 ELSE 0 END) AS impressions,
              SUM(CASE WHEN event IN ('complete','click') THEN 1 ELSE 0 END) AS completions,
              SUM(CASE WHEN event = 'click' THEN 1 ELSE 0 END) AS clicks,
              MAX(created_at) AS last_at
       FROM ad_events
       WHERE created_at >= ?
       GROUP BY campaign_id, kind
       ORDER BY last_at DESC`,
      [since],
    );
    return rows.map((row) => ({
      campaignId: row.campaign_id,
      kind: row.kind,
      impressions: Number(row.impressions ?? 0),
      completions: Number(row.completions ?? 0),
      clicks: Number(row.clicks ?? 0),
      lastAt: Number(row.last_at ?? 0),
    }));
  }

  async cleanup(): Promise<void> {
    const cutoff = Date.now() - 1000 * 60 * 60 * 24;
    await this.run("DELETE FROM run_tickets WHERE started_at < ?", [cutoff]);
    await this.run("DELETE FROM sessions WHERE expires_at < ?", [Date.now()]);
  }

  async close(): Promise<void> {
    if (this.pool) await this.pool.end();
    this.sqlite?.close();
  }
}
