import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { OFFLINE_BOOTSTRAP } from "../src/offline-catalog";

const root = process.cwd();
const gameRoot = join(root, "public", "games", "stickman-fury");
const readGame = (path: string) => readFileSync(join(gameRoot, path), "utf8");

describe("Stickman Fury local integration", () => {
  it("keeps the copied game unranked until it exposes a trustworthy score", () => {
    const game = OFFLINE_BOOTSTRAP.games.find((entry) => entry.slug === "stickman-fury");
    expect(game).toMatchObject({ ranked: false });
  });

  it("uses an opaque-origin iframe and a narrowly scoped persistence bridge", () => {
    const component = readFileSync(join(root, "src", "games", "StickmanFuryGame.tsx"), "utf8");
    const bridge = readGame("js/tiptap-platform-bridge.js");

    expect(component).toContain('sandbox="allow-scripts allow-pointer-lock"');
    expect(component).not.toContain("allow-same-origin");
    expect(component).toContain('event.data.type === "storage-set"');
    expect(bridge).toContain('key === "stickmanfuryv4"');
    expect(bridge).toContain("event.source !== window.parent");
  });

  it("removes ads, blocks the source debug shortcut, and records attribution", () => {
    const bridge = readGame("js/tiptap-platform-bridge.js");
    const notice = readGame("NOTICE.txt");

    expect(bridge).toContain("commercialBreak: function (onStart) { return finishBreak(onStart, false); }");
    expect(bridge).toContain("rewardedBreak: function (onStart) { return finishBreak(onStart, false); }");
    expect(bridge).toContain('event.code === "Backquote"');
    expect(notice).toContain("Original developer: Happylander Ltd");
  });

  it("keeps every integration manifest record synchronized", () => {
    const manifest = JSON.parse(readGame("MIRROR-MANIFEST.json"));
    for (const entry of manifest.integrationFiles) {
      const bytes = readFileSync(join(gameRoot, entry.assetPath));
      expect(bytes.length, entry.assetPath).toBe(entry.bytes);
      expect(createHash("sha256").update(bytes).digest("hex"), entry.assetPath).toBe(entry.sha256);
    }
  });
});
