#!/usr/bin/env node
/**
 * fetch-all-slugs.mjs — fetch ALL Poki game slugs from the sitemap.
 * Saves to tmp/all-poki-slugs.txt (one per line).
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = "C:/Project C/Hackation";
const outPath = join(ROOT, "tmp", "all-poki-slugs.txt");

console.log("Fetching Poki sitemap...");
const res = await fetch("https://poki.com/en/sitemaps/games.xml", {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
});
const xml = await res.text();
const slugs = [...new Set([...xml.matchAll(/<loc>https:\/\/poki\.com\/en\/g\/([^<]+)<\/loc>/g)].map(m => m[1]))];

console.log(`Found ${slugs.length} unique slugs from sitemap`);

// Load existing registered games
const catalog = readFileSync(join(ROOT, "shared/catalog.ts"), "utf8");
const registered = new Set([...catalog.matchAll(/^\s+['"]?([a-zA-Z][a-zA-Z0-9_-]+)['"]?:\s*[\{(]/gm)].map(m => m[1]));

// Also check game folders
const { readdirSync } = await import("node:fs");
const gameFolders = new Set(readdirSync(join(ROOT, "public", "games"), { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== "_shared").map(d => d.name));

// slug -> folder mapping
const slugToFolder = { "game-2048": "2048-game", "dino-runner": "dino-game" };

const alreadyHave = [];
const needIngest = [];
for (const slug of slugs) {
  const folder = Object.entries(slugToFolder).find(([s]) => s === slug)?.[1] || slug;
  if (registered.has(slug) || gameFolders.has(folder)) {
    alreadyHave.push(slug);
  } else {
    needIngest.push(slug);
  }
}

console.log(`Already have: ${alreadyHave.length}`);
console.log(`Need to ingest: ${needIngest.length}`);

writeFileSync(outPath, needIngest.join("\n") + "\n", "utf8");
console.log(`Saved to ${outPath}`);
