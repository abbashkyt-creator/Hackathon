#!/usr/bin/env node
/**
 * fix-incomplete.mjs — add shim+bridge+preload to registered games missing them.
 * Usage: node scripts/auto/fix-incomplete.mjs
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { UNIVERSAL_SHIM, UNIVERSAL_BRIDGE, writePreloadManifest } from "./lib/localize.mjs";

const ROOT = "C:/Project C/Hackation";
const gameRoot = join(ROOT, "public", "games");

const dirs = (await import("node:fs")).readdirSync(gameRoot, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== "_shared").map(d => d.name);

const slugMap = { "2048-game": "game-2048", "dino-game": "dino-runner" };
let fixed = 0, skipped = 0;

for (const folder of dirs) {
  const slug = slugMap[folder] || folder;
  const dir = join(gameRoot, folder);
  const shimPath = join(dir, "js", "poki-sdk-shim.js");
  const bridgePath = join(dir, "js", "tiptap-platform-bridge.js");
  const indexExists = existsSync(join(dir, "index.html"));

  if (!indexExists) { console.log(`[${folder}] no index.html, skipping`); skipped++; continue; }

  const needsShim = !existsSync(shimPath);
  const needsBridge = !existsSync(bridgePath);

  if (!needsShim && !needsBridge) { skipped++; continue; }

  mkdirSync(join(dir, "js"), { recursive: true });

  if (needsShim) {
    writeFileSync(shimPath, UNIVERSAL_SHIM.split("GAME_SLUG").join(slug), "utf8");
    console.log(`[${folder}] wrote shim`);
  }
  if (needsBridge) {
    writeFileSync(bridgePath, UNIVERSAL_BRIDGE.split("GAME_SLUG").join(slug), "utf8");
    console.log(`[${folder}] wrote bridge`);
  }

  // Also add preload-manifest if missing
  if (!existsSync(join(dir, "preload-manifest.json"))) {
    const html = readFileSync(join(dir, "index.html"), "utf8");
    const scripts = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m => m[1]);
    const sourceScripts = scripts.filter(s => !s.includes("/_shared/") && !s.includes("poki-sdk") && !s.includes("tiptap-platform-bridge"));
    writePreloadManifest({ gameDir: dir, slug, sourceScripts: sourceScripts.slice(0, 5) });
    console.log(`[${folder}] wrote preload manifest`);
  }

  // Also add NOTICE.txt if missing
  if (!existsSync(join(dir, "NOTICE.txt"))) {
    writeFileSync(join(dir, "NOTICE.txt"), 
      `Source page: https://poki.com/en/g/${slug}\nMirrored with authorization for competition entry.\nPoki SDK, ads, analytics NOT copied. Tip Tap supplies local bridge.`, "utf8");
    console.log(`[${folder}] wrote NOTICE.txt`);
  }

  // Also add MIRROR-MANIFEST.json if missing
  if (!existsSync(join(dir, "MIRROR-MANIFEST.json"))) {
    // Will be handled by create-manifests.mjs
    console.log(`[${folder}] needs manifest (run create-manifests.mjs)`);
  }

  fixed++;
}

console.log(`\nFixed: ${fixed} games, Skipped: ${skipped} games`);
