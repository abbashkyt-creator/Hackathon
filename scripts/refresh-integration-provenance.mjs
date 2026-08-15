#!/usr/bin/env node
/**
 * refresh-integration-provenance.mjs
 * Re-stamps integrationFiles in MIRROR-MANIFEST.json for every game (or named games).
 * Usage: node scripts/refresh-integration-provenance.mjs [gameSlug ...]
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const gamesRoot = join(root, "public", "games");

function sha256(p) { return createHash("sha256").update(readFileSync(p)).digest("hex"); }
function walk(dir, base = dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    e.isDirectory() ? walk(full, base, out) : out.push(relative(base, full).split(sep).join("/"));
  }
  return out;
}
function ensureRecord(entry, gameRoot) {
  const dp = normalize(join(gameRoot, entry.assetPath));
  if (!dp.startsWith(`${normalize(gameRoot)}${sep}`) || !existsSync(dp) || !statSync(dp).isFile()) return null;
  return { assetPath: entry.assetPath, bytes: statSync(dp).size, sha256: sha256(dp), ...(entry.purpose ? { purpose: entry.purpose } : {}) };
}

const games = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(gamesRoot).filter(n => !n.startsWith("_") && statSync(join(gamesRoot, n)).isDirectory());
let ok = 0;
for (const name of games) {
  const gameRoot = join(gamesRoot, name);
  const manifestPath = join(gameRoot, "MIRROR-MANIFEST.json");
  if (!existsSync(manifestPath)) continue;
  let manifest;
  try { manifest = JSON.parse(readFileSync(manifestPath, "utf8")); } catch { continue; }
  const captured = new Set((manifest.files ?? []).map(f => f.assetPath));
  const integrationFiles = (manifest.integrationFiles ?? []).map(e => ensureRecord(e, gameRoot)).filter(Boolean);
  const next = { ...manifest, integrationFiles, files: manifest.files ?? [] };
  writeFileSync(manifestPath, JSON.stringify(next, null, 2) + "\n");
  console.log(`[${name}] integrationFiles=${integrationFiles.length} files=${next.files.length}`);
  ok++;
}
console.log(`Stamped ${ok} game manifest(s).`);
