#!/usr/bin/env node
/**
 * create-manifests.mjs — create initial MIRROR-MANIFEST.json for games that don't have one.
 * Scans all files in each game dir, hashes them, creates the manifest structure.
 * Usage: node scripts/auto/create-manifests.mjs [slug ...]
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = "C:/Project C/Hackation";
const GAMES_ROOT = join(ROOT, "public", "games");

function sha256(p) { return createHash("sha256").update(readFileSync(p)).digest("hex"); }
function walk(dir, base = dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.name === "MIRROR-MANIFEST.json" || e.name === "NOTICE.txt") continue;
    e.isDirectory() ? walk(full, base, out) : out.push(relative(base, full).split(sep).join("/"));
  }
  return out;
}

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(GAMES_ROOT).filter(n => !n.startsWith("_") && statSync(join(GAMES_ROOT, n)).isDirectory());

for (const slug of slugs) {
  const gameRoot = join(GAMES_ROOT, slug);
  const manifestPath = join(gameRoot, "MIRROR-MANIFEST.json");
  if (existsSync(manifestPath)) {
    try { JSON.parse(readFileSync(manifestPath, "utf8")); console.log(`[${slug}] already has valid manifest, skipping`); continue; } catch {}
  }
  if (!existsSync(join(gameRoot, "index.html"))) { console.log(`[${slug}] no index.html, skipping`); continue; }

  const files = walk(gameRoot, gameRoot).map(f => {
    const fp = join(gameRoot, f);
    return { assetPath: f, bytes: statSync(fp).size, sha256: sha256(fp) };
  });

  // Determine integration files
  const integrationFiles = [];
  for (const name of ["index.html", "NOTICE.txt", "js/poki-sdk-shim.js", "js/tiptap-platform-bridge.js", "preload-manifest.json"]) {
    const fp = join(gameRoot, name);
    if (existsSync(fp)) {
      integrationFiles.push({ assetPath: name, bytes: statSync(fp).size, sha256: sha256(fp), purpose: name === "index.html" ? "Localized entry" : name === "NOTICE.txt" ? "Notice" : name.includes("shim") ? "SDK shim" : name.includes("bridge") ? "Bridge" : "Preload manifest" });
    }
  }

  const manifest = {
    name: slug,
    sourcePage: `https://poki.com/en/g/${slug}`,
    sourceRoot: "",
    gameId: "",
    gameVersionId: "",
    capturedWith: "auto-ingest-pipeline",
    captureHashNote: "Auto-generated manifest",
    integrationFiles,
    files,
    skipped: [],
    errors: []
  };

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[${slug}] created manifest with ${files.length} files, ${integrationFiles.length} integration files`);
}
