import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const gameRoot = join(process.cwd(), "public", "games", "dig-out-of-prison");
const read = (file: string) => readFileSync(join(gameRoot, file), "utf8");
const digest = (file: string) => {
  const bytes = readFileSync(join(gameRoot, file));
  return {
    bytes: statSync(join(gameRoot, file)).size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
};

describe("Dig out of Prison local integration", () => {
  it("ships the complete observed Unity first-boot graph locally", () => {
    const preload = JSON.parse(read("preload-manifest.json"));
    const manifest = JSON.parse(read("MIRROR-MANIFEST.json"));

    expect(preload.critical).toEqual(expect.arrayContaining([
      expect.stringMatching(/\.loader\.js$/),
      expect.stringMatching(/\.framework\.js\.br$/),
      expect.stringMatching(/\.wasm\.br$/),
      expect.stringMatching(/\.data\.br$/),
    ]));
    expect(manifest.files.map((file: { assetPath: string }) => file.assetPath)).toEqual(expect.arrayContaining([
      "Build/6529111a7bc210fd4b0e5e9b7b7de456.loader.js",
      "Build/74316103438b469864841eb099023290.framework.js.br",
      "Build/8f2628f842ab3743cb74934c84aa0c5c.wasm.br",
      "Build/b6a11a5769b57ef475b5d3f311a674fc.data.br",
    ]));
    for (const file of [...manifest.files, ...manifest.integrationFiles]) {
      expect(digest(file.assetPath)).toEqual({
        bytes: file.bytes,
        sha256: file.sha256,
      });
    }
  });

  it("starts locally with no portal SDK or ad path", () => {
    const html = read("index.html");
    const bridge = read("tiptap-platform-bridge.js");
    const networkLock = readFileSync(
      join(process.cwd(), "public", "games", "_shared", "network-lock.js"),
      "utf8",
    );

    expect(html.indexOf('/games/_shared/network-lock.js')).toBeLessThan(html.indexOf('./tiptap-platform-bridge.js'));
    expect(html).toContain("./tiptap-platform-bridge.js?v=local-sdk-12");
    expect(bridge).toContain("./crazygames-sdk-v3.js");
    expect(bridge).toContain('code: "no_ad"');
    expect(bridge).toContain("return resolved(false)");
    expect(bridge).toContain("tiptap-debug:dig-out-of-prison-sdk");
    expect(bridge).toContain('sdk\\.crazygames\\.com');
    expect(bridge).not.toMatch(/https?:\/\/(?!sdk\.crazygames\.com)/);
    expect(bridge).toContain("disableChat: false");
    expect(bridge).toContain("applicationType: \"web\"");
    expect(bridge).toContain("siteLockFreezeCodeIndex = 7192");
    expect(bridge).toContain("unityQuitCodeIndex = 11310");
    expect(bridge).toContain("siteLockWhitelistCodeIndex = 18366");
    expect(bridge).toContain("siteLockValidHostCodeIndex = 32431");
    expect(bridge).toContain("siteLockCheckCodeIndex = 32433");
    expect(bridge).toContain("siteLockRemoteHostCodeIndex = 72875");
    expect(bridge).toContain("siteLockLocalHostCodeIndex = 72876");
    expect(bridge).toContain("siteLockCrashCodeIndex = 72878");
    expect(bridge).toContain("siteLockDidRunCodeIndex = 72881");
    expect(bridge).toContain("siteLockFreezeMoveNextCodeIndex = 73056");
    expect(bridge).toContain("crazySdkAwakeCodeIndex = 73078");
    expect(bridge).toContain("unityQuitWithCodeCodeIndex = 60440");
    expect(bridge).toContain("storyAdvanceWaitCodeIndex = 70159");
    expect(bridge).toContain("[siteLockFreezeCodeIndex, 150]");
    expect(bridge).toContain("bodySize !== 1281");
    expect(bridge).toContain("bodySize !== 70");
    expect(bridge).toContain("siteLockFreezeMoveNextCodeIndex ? 356 : 119");
    expect(bridge).toContain("bodySize !== 204");
    expect(bridge).toContain("bytes.fill(0x01");
    expect(bridge).toContain("patchedFunctions === 13");
    expect(bridge).toContain("pendingLegacyMessages");
    expect(bridge).toContain('window.addEventListener("tiptap-unity-ready", flushLegacyMessages)');
    expect(bridge).toContain('queueLegacy("InitCallback"');
    expect(networkLock).toContain("pokiMirrorFolders.has(gameFolder)");
    expect(networkLock).toContain('"3464"');
    expect(networkLock).not.toMatch(/pokiMirrorFolders[\s\S]*?"dig-out-of-prison"/);
  });

  it("provides every documented command as a safe mobile fallback", () => {
    const bootstrap = read("tiptap-bootstrap.js");

    for (const command of ["KeyW", "KeyA", "KeyS", "KeyD", "Space", "KeyE", "KeyX", "KeyQ"]) {
      expect(bootstrap).toContain(command);
    }
    expect(bootstrap).toContain('data-pointer="dig"');
    expect(bootstrap).toContain('dispatchMouse("mousedown")');
    expect(bootstrap).toContain('reason?.name === "NotAllowedError"');
    expect(bootstrap).toContain('button.addEventListener("click"');
    expect(bootstrap).toContain('emitKey("keydown", button.dataset.key)');
    expect(bootstrap).toContain('window.addEventListener("blur", releaseAll)');
    expect(bootstrap).toContain("window.__TIPTAP_UNITY_LOGS__");
    expect(bootstrap).toContain('window.dispatchEvent(new Event("tiptap-unity-ready"))');
    expect(bootstrap).toContain('matchMedia("(hover: none), (pointer: coarse)")');
    expect(bootstrap).toContain("@media (hover:none),(pointer:coarse)");
    expect(bootstrap).not.toContain("@media (max-width:600px)");
    expect(bootstrap).toContain("height:auto!important");
    expect(bootstrap).toContain("object-fit:contain");
    expect(bootstrap).toContain("padding:0 62px 0 10px");
    expect(bootstrap).toContain("touch-action:none");
  });

  it("keeps the rights-holder attribution consistent across the product catalog", () => {
    const catalog = readFileSync(join(process.cwd(), "shared", "catalog.ts"), "utf8");

    expect(catalog).toContain('"dig-out-of-prison": {');
    expect(catalog).toContain('creatorId: "incredi-games"');
    expect(catalog).toContain('creatorName: "Incredi.Games"');
    expect(catalog).toContain('creatorLabel: "BY INCREDI.GAMES · LOCAL SOURCE MIRROR"');
  });
});
