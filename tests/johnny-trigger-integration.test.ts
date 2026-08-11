import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const gameRoot = join(process.cwd(), "public", "games", "johnny-trigger-sniper");
const read = (path: string) => readFileSync(join(gameRoot, path), "utf8");

describe("Johnny Trigger Sniper local integration", () => {
  it("keeps the captured catalog complete and points every dependency at local files", () => {
    const catalog = JSON.parse(read("StreamingAssets/aa/catalog.json"));
    const manifest = JSON.parse(read("MIRROR-MANIFEST.json"));

    expect(catalog.m_InternalIds.length).toBeGreaterThanOrEqual(263);
    expect(manifest.catalogAudit).toEqual({
      catalogRuntimeFiles: 263,
      includedCatalogRuntimeFiles: 263,
      missingCatalogRuntimeFiles: 0,
    });
    expect(manifest.files).toHaveLength(276);
  });

  it("provides a parent-controlled audio and owned-ad bridge", () => {
    const bridge = read("tiptap-platform-bridge.js");

    expect(bridge).toContain('event.data?.type !== "set-state"');
    expect(bridge).toContain("window.__TIPTAP_MUTED__ = muted");
    expect(bridge).toContain('TipTapAds.rewarded(options, "johnny-rewarded")');
    expect(bridge).toContain('TipTapAds.commercial(options, "johnny-commercial")');
    expect(bridge).not.toMatch(/https?:\/\//);
  });

  it("ships a truthful screenshot count and critical first-play preload set", () => {
    const config = read("tiptap-config.js");
    const preload = JSON.parse(read("preload-manifest.json"));

    expect(config).toContain("numScreenshots: 1");
    expect(preload.critical).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/\.wasm$/),
        expect.stringMatching(/\.data$/),
        expect.stringMatching(/levels_assets_level_1_1_.*\.bundle$/),
      ]),
    );
  });
});
