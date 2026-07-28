import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldPrepareByMount, warmAheadDelayMs } from "../src/game-runtime";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("game warm-ahead scheduling", () => {
  it("waits until the active game has owned the fast-connection startup window", () => {
    vi.stubGlobal("navigator", { connection: { effectiveType: "4g" } });
    expect(warmAheadDelayMs()).toBe(3_500);
  });

  it("delays speculative work further on 3G", () => {
    vi.stubGlobal("navigator", { connection: { effectiveType: "3g" } });
    expect(warmAheadDelayMs()).toBe(7_000);
  });

  it("disables speculative downloads for data saver and 2G", () => {
    vi.stubGlobal("navigator", { connection: { saveData: true, effectiveType: "4g" } });
    expect(warmAheadDelayMs()).toBeNull();

    vi.stubGlobal("navigator", { connection: { effectiveType: "2g" } });
    expect(warmAheadDelayMs()).toBeNull();
  });

  it("pre-mounts only integrations that explicitly support a prepared iframe", () => {
    expect(shouldPrepareByMount("fruit-ninja")).toBe(true);
    expect(shouldPrepareByMount("city-cab-rush")).toBe(true);
    expect(shouldPrepareByMount("67-game")).toBe(false);
  });
});
