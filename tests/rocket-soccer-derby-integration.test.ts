import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const gameRoot = join(process.cwd(), "public", "games", "rocket-soccer-derby");
const read = (file: string) => readFileSync(join(gameRoot, file), "utf8");

describe("Rocket Soccer Derby local integration", () => {
  it("ships the complete audited Unity build locally", () => {
    const config = JSON.parse(read("Build/RSD 1.1.0rc4.json"));
    const preload = JSON.parse(read("preload-manifest.json"));
    const manifest = JSON.parse(read("MIRROR-MANIFEST.json"));

    expect(config).toMatchObject({ companyName: "Destruction Crew", productName: "Rocket Soccer" });
    expect(preload.critical).toEqual(expect.arrayContaining([
      expect.stringMatching(/\.wasm\.code\.unityweb$/),
      expect.stringMatching(/\.wasm\.framework\.unityweb$/),
      expect.stringMatching(/\.data\.unityweb$/),
    ]));
    expect(manifest.files.map((file: { assetPath: string }) => file.assetPath)).toEqual(expect.arrayContaining([
      "UnityLoader.js",
      "Build/RSD 1.1.0rc4.json",
      "Build/RSD 1.1.0rc4.wasm.code.unityweb",
      "Build/RSD 1.1.0rc4.wasm.framework.unityweb",
      "Build/RSD 1.1.0rc4.data.unityweb",
    ]));
  });

  it("contains a same-origin owned-ad compatibility bridge", () => {
    const html = read("index.html");
    const bridge = read("tiptap-platform-bridge.js");
    expect(html.indexOf('/games/_shared/network-lock.js')).toBeLessThan(html.indexOf('./tiptap-platform-bridge.js'));
    expect(bridge).toContain('TipTapAds.rewarded(options, "rocket-soccer-rewarded")');
    expect(bridge).toContain('TipTapAds.commercial(options, "rocket-soccer-commercial")');
    expect(bridge).not.toMatch(/https?:\/\//);
  });

  it("provides multi-touch mobile driving controls with stuck-key protection", () => {
    const bootstrap = read("tiptap-bootstrap.js");
    expect(bootstrap).toContain('id="touch-controls"');
    expect(bootstrap).toContain('data-control="forward"');
    expect(bootstrap).toContain('data-control="nitro"');
    expect(bootstrap).toContain('data-control="jump"');
    expect(bootstrap).toContain("activePointers = new Map()");
    expect(bootstrap).toContain('dispatchKey("keydown"');
    expect(bootstrap).toContain('dispatchKey("keyup"');
    expect(bootstrap).toContain('window.addEventListener("blur", releaseAllControls)');
    expect(bootstrap).toContain("touch-action:none");
  });
});
