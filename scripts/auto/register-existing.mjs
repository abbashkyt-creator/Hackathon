#!/usr/bin/env node
/**
 * register-existing.mjs — register already-crawled games using the pipeline's
 * localize + register + manifest steps. Skips discover + crawl.
 * Usage: node scripts/auto/register-existing.mjs <slug>
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildLocalIndex, UNIVERSAL_SHIM, UNIVERSAL_BRIDGE, writeNotice, writePreloadManifest } from "./lib/localize.mjs";
import { registerGame } from "./lib/register.mjs";

const ROOT = "C:/Project C/Hackation";
const slug = process.argv[2];
if (!slug) { console.error("usage: register-existing.mjs <slug>"); process.exit(2); }

const gameDir = join(ROOT, "public", "games", slug);
if (!existsSync(join(gameDir, "index.html"))) { console.error(`No index.html at ${gameDir}`); process.exit(1); }

const sourceIndex = readFileSync(join(gameDir, "index.html"), "utf8");
const titleMatch = /<title>([^<]+?)\s*-\s*Play Online for Free/i.exec(sourceIndex) || /<title>([^<]+)<\/title>/i.exec(sourceIndex);
const title = (titleMatch?.[1] || slug).trim().replace(/\s*-\s*Play Online for Free.*/i, "");
const creatorMatch = /"name"\s*:\s*"([^"]+)"/.exec(sourceIndex) || /by\s+([A-Z][A-Za-z0-9 .&'-]{2,40})/.exec(sourceIndex.replace(/<[^>]+>/g, " "));
const genreMatch = /"genre"\s*:\s*"([^"]+)"/.exec(sourceIndex);
const creatorName = creatorMatch?.[1]?.trim() || "Poki Mirror";
const creatorId = creatorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "poki-mirror";
const category = ["Action", "Arcade", "Puzzle", "Runner", "Sports"].find(c => (genreMatch?.[1] || "").toLowerCase().includes(c.toLowerCase())) || "Arcade";

console.log(`Registering: ${slug} (title="${title}", creator="${creatorName}", cat="${category}")`);

// Step 1: Localize - generate proper index.html with network-lock + bridge
const li = buildLocalIndex({ gameDir, slug, title, sourceIndexText: sourceIndex });
mkdirSync(join(gameDir, "js"), { recursive: true });
writeFileSync(join(gameDir, "index.html"), li, "utf8");
writeFileSync(join(gameDir, "js", "poki-sdk-shim.js"), UNIVERSAL_SHIM.split("GAME_SLUG").join(slug), "utf8");
writeFileSync(join(gameDir, "js", "tiptap-platform-bridge.js"), UNIVERSAL_BRIDGE.split("GAME_SLUG").join(slug), "utf8");
writeNotice({ gameDir, slug, title, sourcePage: `https://poki.com/en/g/${slug}` });
const scripts = [...li.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
writePreloadManifest({ gameDir, slug, sourceScripts: scripts.filter(s => !s.includes("/_shared/")) });
console.log("  localize: done");

// Step 2: Register in all product surfaces
try {
  registerGame({ slug, title, creatorName, creatorId, category });
  console.log("  register: done");
} catch (e) {
  console.warn("  register warning:", e.message);
}

// Step 3: Stamp manifest
try {
  execFileSync(process.execPath, [join(ROOT, "scripts", "refresh-integration-provenance.mjs"), slug], { cwd: ROOT, stdio: "pipe" });
  console.log("  manifest: done");
} catch (e) {
  console.warn("  manifest warning:", e.message);
}

console.log(`  ${slug}: REGISTERED`);
