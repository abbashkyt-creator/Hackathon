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
});
