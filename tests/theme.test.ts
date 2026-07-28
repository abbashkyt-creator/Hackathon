import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("Tip Tap color theme", () => {
  it("selects a stored or system theme before the app renders", () => {
    const html = read("index.html");
    expect(html).toContain('localStorage.getItem("ttg_theme")');
    expect(html).toContain('matchMedia("(prefers-color-scheme: dark)")');
    expect(html.indexOf("document.documentElement.dataset.theme")).toBeLessThan(
      html.indexOf('<script type="module" src="/src/main.tsx">'),
    );
  });

  it("provides an accessible persistent daylight and darklight toggle", () => {
    const app = read("src/App.tsx");
    expect(app).toContain('type ColorTheme = "light" | "dark"');
    expect(app).toContain("Switch to daylight mode");
    expect(app).toContain("Switch to darklight mode");
    expect(app).toContain("aria-pressed={colorTheme === \"dark\"}");
    expect(app).toContain("window.localStorage.setItem(THEME_STORAGE_KEY, colorTheme)");
    expect(app).toContain("document.documentElement.dataset.theme = colorTheme");
  });

  it("covers the feed, header, captions, sheets, results, and boot state", () => {
    const css = read("src/styles.css");
    for (const selector of [
      'html[data-theme="dark"] .app-header',
      'html[data-theme="dark"] .feed-card',
      'html[data-theme="dark"] .game-caption',
      'html[data-theme="dark"] .bottom-sheet',
      'html[data-theme="dark"] .game-chip',
      'html[data-theme="dark"] .result-overlay',
      'html[data-theme="dark"] .boot-screen',
    ]) {
      expect(css).toContain(selector);
    }
  });
});
