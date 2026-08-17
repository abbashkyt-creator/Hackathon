/**
 * update-progress.mjs — mark all already-completed games as OK.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'C:/Project C/Hackation';
const PROGRESS = join(ROOT, 'tmp/ingest-all-progress.json');
const SLUGS = join(ROOT, 'tmp/all-poki-slugs.txt');
const CATALOG = join(ROOT, 'shared/catalog.ts');
const slugToFolder = { 'game-2048': '2048-game', 'dino-runner': 'dino-game' };
const folderToSlug = Object.fromEntries(Object.entries(slugToFolder).map(([k,v])=>[v,k]));

const allSlugs = readFileSync(SLUGS, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

// More robust catalog key extraction: find all keys in the GAME_CATALOG_METADATA object
const catalog = readFileSync(CATALOG, 'utf8');
const catalogSection = catalog.slice(catalog.indexOf('GAME_CATALOG_METADATA'));
const catalogKeys = new Set([...catalogSection.matchAll(/["']([a-zA-Z0-9][a-zA-Z0-9_-]+)["']\s*:\s*\{/g)].map(m => m[1]));
// Also check for unquoted keys like `foo: {`
catalogSection.split('\n').forEach(line => {
  const m = line.match(/^\s+([a-zA-Z0-9][a-zA-Z0-9_-]+)\s*:\s*\{/);
  if (m) catalogKeys.add(m[1]);
});

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
  const isRegistered = catalogKeys.has(slug);
  const reverseSlug = folderToSlug[folder];
  const isRegisteredReverse = reverseSlug ? catalogKeys.has(reverseSlug) : false;
  
  if (isRegistered || isRegisteredReverse || (hasIndex && hasShim && hasBridge && hasManifest && hasPreload)) {
    progress.games[slug] = { ok: true, at: new Date().toISOString() };
    updated++;
  }
}

writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
const entries = Object.entries(progress.games);
const ok = entries.filter(([, v]) => v.ok).length;
const todo = allSlugs.filter(s => !progress.games[s]?.ok);
console.log(`Updated ${updated}. Total: ${entries.length} processed, ${ok} OK, ${todo.length} remaining`);
console.log(`Catalog keys found: ${catalogKeys.size}`);
