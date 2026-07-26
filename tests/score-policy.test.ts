import { describe, expect, it } from "vitest";
import { validateScore } from "../server/score-policy";

describe("score validation", () => {
  it("accepts a plausible integer score", () => {
    expect(validateScore("pulse-lock", 2_500, 1_000)).toEqual({ ok: true });
  });

  it("rejects unknown games and malformed scores", () => {
    expect(validateScore("not-a-game", 100, 1_000)).toEqual({
      ok: false,
      reason: "unknown_game",
    });
    expect(validateScore("pulse-lock", Number.NaN, 1_000)).toEqual({
      ok: false,
      reason: "invalid_score",
    });
    expect(validateScore("pulse-lock", 1.5, 1_000)).toEqual({
      ok: false,
      reason: "invalid_score",
    });
  });

  it("rejects instant and physically implausible submissions", () => {
    expect(validateScore("color-clash", 100, 100)).toEqual({
      ok: false,
      reason: "run_too_short",
    });
    expect(validateScore("meteor-dodge", 80_000, 1_000)).toEqual({
      ok: false,
      reason: "impossible_score",
    });
  });

  it("accepts plausible Subway Surfers scores and rejects forged bursts", () => {
    expect(validateScore("subway-surfers", 45_000, 2_000)).toEqual({ ok: true });
    expect(validateScore("subway-surfers", 500_000, 2_000)).toEqual({
      ok: false,
      reason: "impossible_score",
    });
    expect(validateScore("subway-surfers", 2_147_483_648, 60_000)).toEqual({
      ok: false,
      reason: "invalid_score",
    });
  });

  it("accepts plausible Dino Runner scores and rejects impossible bursts", () => {
    expect(validateScore("dino-runner", 1_500, 1_000)).toEqual({ ok: true });
    expect(validateScore("dino-runner", 20_000, 1_000)).toEqual({
      ok: false,
      reason: "impossible_score",
    });
    expect(validateScore("dino-runner", 1_000_000, 60_000)).toEqual({
      ok: false,
      reason: "invalid_score",
    });
  });

  it("accepts plausible ArithmeticA scores and rejects impossible bursts", () => {
    expect(validateScore("arithmetica", 3_000, 1_000)).toEqual({ ok: true });
    expect(validateScore("arithmetica", 50_000, 1_000)).toEqual({
      ok: false,
      reason: "impossible_score",
    });
    expect(validateScore("arithmetica", 200_000, 60_000)).toEqual({
      ok: false,
      reason: "invalid_score",
    });
  });

  it("accepts a plausible native 67 Game score and rejects a forged burst", () => {
    expect(validateScore("67-game", 50_000, 20_000)).toEqual({ ok: true });
    expect(validateScore("67-game", 100_000, 5_000)).toEqual({
      ok: false,
      reason: "impossible_score",
    });
  });

});
