/**
 * update-progress.mjs — mark all already-registered games as OK in progress file.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'C:/Project C/Hackation';
const PROGRESS = join(ROOT, 'tmp/ingest-all-progress.json');
const SLUGS = join(ROOT, 'tmp/all-poki-slugs.txt');
const CATALOG = join(ROOT, 'shared/catalog.ts');

const allSlugs = readFileSync(SLUGS, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
const catalog = readFileSync(CATALOG, 'utf8');
// Match both quoted and unquoted keys, including digit-starting slugs
const catalogKeys = [...catalog.matchAll(/^\s+['"]?([a-zA-Z0-9][a-zA-Z0-9_-]+)['"]?:\s*[\{(]/gm)].map(m => m[1]);
const slugToFolder = { 'game-2048': '2048-game', 'dino-runner': 'dino-game' };

let progress = { games: {} };
if (existsSync(PROGRESS)) try { progress = JSON.parse(readFileSync(PROGRESS, 'utf8')); } catch {}

let updated = 0;
for (const slug of allSlugs) {
  if (progress.games[slug]?.ok) continue;
  const folder = slugToFolder[slug] || slug;
  const folderPath = join(ROOT, 'public/games', folder);
  const hasIndex = existsSync(join(folderPath, 'index.html'));
  const hasShim = existsSync(join(folderPath, 'js/poki-sdk-shim.js'));
  const hasBridge = existsSync(join(folderPath, 'js/tiptap-platform-bridge.js'));
  const hasManifest = existsSync(join(folderPath, 'MIRROR-MANIFEST.json'));
  const hasPreload = existsSync(join(folderPath, 'preload-manifest.json'));
  const isRegistered = catalogKeys.includes(slug);
  
  if (isRegistered || (hasIndex && hasShim && hasBridge && hasManifest && hasPreload)) {
    progress.games[slug] = { ok: true, at: new Date().toISOString() };
    updated++;
  }
}

writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
const entries = Object.entries(progress.games);
const ok = entries.filter(([, v]) => v.ok).length;
const todo = allSlugs.filter(s => !progress.games[s]?.ok);
console.log(`Updated ${updated}. Total: ${entries.length} processed, ${ok} OK, ${todo.length} remaining`);
