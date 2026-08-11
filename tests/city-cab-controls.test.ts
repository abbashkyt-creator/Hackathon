import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const gameRoot = join(root, "public/games/city-cab-rush");

describe("City Cab Rush mobile controls", () => {
  const html = readFileSync(join(gameRoot, "index.html"), "utf8");
  const css = readFileSync(join(gameRoot, "tiptap-shell.css"), "utf8");
  const bootstrap = readFileSync(join(gameRoot, "tiptap-bootstrap.js"), "utf8");

  it("exposes four labelled hold controls", () => {
    for (const control of ["left", "right", "accelerate", "brake"]) {
      expect(html).toContain(`data-control="${control}"`);
    }
    expect(html).toContain('aria-label="Accelerate"');
    expect(html).toContain('aria-label="Brake"');
  });

  it("maps steering and pedals to Unity keyboard axes", () => {
    expect(bootstrap).toContain('left: { key: "ArrowLeft"');
    expect(bootstrap).toContain('right: { key: "ArrowRight"');
    expect(bootstrap).toContain('accelerate: { key: "ArrowUp"');
    expect(bootstrap).toContain('brake: { key: "ArrowDown"');
    expect(bootstrap).toContain('dispatchControl(control, "keydown")');
    expect(bootstrap).toContain('dispatchControl(control, "keyup")');
  });

  it("releases held input on interruptions and uses safe touch sizing", () => {
    expect(bootstrap).toContain('window.addEventListener("blur", releaseAllControls)');
    expect(bootstrap).toContain('window.addEventListener("pagehide", releaseAllControls)');
    expect(bootstrap).toContain('if (event.data.type === "pause") releaseAllControls()');
    expect(css).toContain("touch-action: none");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("width: clamp(58px");
  });
});
