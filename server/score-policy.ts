export const GAME_SCORE_POLICIES = {
  "pulse-lock": { maxScore: 150_000, maxPerSecond: 7_000, burstAllowance: 3_000 },
  "color-clash": { maxScore: 200_000, maxPerSecond: 8_000, burstAllowance: 3_000 },
  "stack-shift": { maxScore: 250_000, maxPerSecond: 5_000, burstAllowance: 2_500 },
  "memory-grid": { maxScore: 300_000, maxPerSecond: 3_500, burstAllowance: 2_000 },
  "meteor-dodge": { maxScore: 500_000, maxPerSecond: 1_200, burstAllowance: 1_000 },
  "subway-surfers": {
    maxScore: 2_147_483_647,
    maxPerSecond: 100_000,
    burstAllowance: 25_000,
  },
  "dino-runner": { maxScore: 999_999, maxPerSecond: 2_000, burstAllowance: 1_500 },
  "arithmetica": { maxScore: 100_000, maxPerSecond: 5_000, burstAllowance: 2_000 },
  "67-game": { maxScore: 130_000, maxPerSecond: 4_000, burstAllowance: 2_000 },
  "archery-king": { maxScore: 100_000, maxPerSecond: 2_000, burstAllowance: 1_000 },
  "fruit-ninja": { maxScore: 10_000_000, maxPerSecond: 10_000, burstAllowance: 2_000 },
  "ping-pong-go": { maxScore: 100_000, maxPerSecond: 25, burstAllowance: 200 },
  "ping-pong-bugs": { maxScore: 200_000, maxPerSecond: 2_000, burstAllowance: 2_000 },
  "game-2048": { maxScore: 2_097_152, maxPerSecond: 30_000, burstAllowance: 10_000 },
  "level-devil": { maxScore: 200_000, maxPerSecond: 90, burstAllowance: 120 },
  "slice-master": { maxScore: 200_000, maxPerSecond: 90, burstAllowance: 120 },
  "drive-mad": { maxScore: 200_000, maxPerSecond: 90, burstAllowance: 120 },




} as const;

export type GameSlug = keyof typeof GAME_SCORE_POLICIES;

export function isRankedGame(gameSlug: string): gameSlug is GameSlug {
  return gameSlug in GAME_SCORE_POLICIES;
}

export type ScoreValidation =
  | { ok: true }
  | { ok: false; reason: "unknown_game" | "invalid_score" | "run_too_short" | "impossible_score" };

export function validateScore(gameSlug: string, score: number, elapsedMs: number): ScoreValidation {
  const policy = GAME_SCORE_POLICIES[gameSlug as GameSlug];
  if (!policy) return { ok: false, reason: "unknown_game" };
  if (!Number.isSafeInteger(score) || score < 0 || score > policy.maxScore) {
    return { ok: false, reason: "invalid_score" };
  }
  if (!Number.isFinite(elapsedMs) || elapsedMs < 250) {
    return { ok: false, reason: "run_too_short" };
  }

  const possible = Math.floor((elapsedMs / 1000) * policy.maxPerSecond + policy.burstAllowance);
  if (score > possible) return { ok: false, reason: "impossible_score" };
  return { ok: true };
}

