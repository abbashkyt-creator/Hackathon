import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("Tip Tap platform UI contract", () => {
  it("keeps discovery feed-native and exposes every persistent personal view", () => {
    const app = read("src/App.tsx");
    expect(app).toContain('aria-label="Discover games"');
    expect(app).toContain('aria-label="Game library view"');
    expect(app).toContain('placeholder="Search games, creators, or categories"');
    expect(app).toContain('"Saved"');
    expect(app).toContain('"Following"');
    expect(app).toContain("onToggleSave");
    expect(app).toContain("onToggleFollow");
  });

  it("uses accessible state and honest championship states", () => {
    const app = read("src/App.tsx");
    expect(app).toContain("aria-pressed={metrics.saved}");
    expect(app).toContain("aria-pressed={isFollowing}");
    expect(app).toContain('aria-label="Tip Tap global player leaderboard"');
    expect(app).toContain("THE CROWN IS WAITING");
    expect(app).toContain("Complete a ranked game to become the first global champion.");
  });

  it("keeps the completion layer responsive and theme-aware", () => {
    const css = read("src/product.css");
    for (const contract of [
      ".games-grid.discovery-grid",
      ".discovery-card",
      ".global-rank-row",
      'html[data-theme="dark"] .discovery-card',
      "@media (max-width: 520px)",
    ]) {
      expect(css).toContain(contract);
    }
  });

  it("uses the generated brand asset in the product header", () => {
    const app = read("src/App.tsx");
    expect(app).toContain('src="/brand/tip-tap-games-logo.png"');
    expect(app).toContain('alt="Tip Tap Games"');
  });

  it("does not cover the full-frame Dig out of Prison HUD with a feed title", () => {
    const app = read("src/App.tsx");
    expect(app).toContain('game.slug !== "dig-out-of-prison"');
  });

  it("uses the available desktop width for the complete Dig out of Prison landscape view", () => {
    const css = read("src/styles.css");
    expect(css).toContain(".theme-dig-out-of-prison");
    expect(css).toContain("max-width: min(960px, calc(100vw - 48px))");
  });
});
