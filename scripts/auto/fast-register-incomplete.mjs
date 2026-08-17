#!/usr/bin/env node
/**
 * fast-register-incomplete.mjs — fast-register games that have folders + index.html
 * but are not fully registered. No Chrome needed.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = 'C:/Project C/Hackation';
const CATALOG = join(ROOT, 'shared/catalog.ts');
const catalog = readFileSync(CATALOG, 'utf8');
const catalogKeys = [...catalog.matchAll(/^\s+['"]?([a-zA-Z][a-zA-Z0-9_-]+)['"]?:\s*[\{(]/gm)].map(m => m[1]);
const slugToFolder = { 'game-2048': '2048-game', 'dino-runner': 'dino-game' };

const folders = readdirSync(join(ROOT, 'public/games'), { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== '_shared')
  .map(d => d.name);

let registered = 0;
for (const folder of folders) {
  const slug = Object.entries(slugToFolder).find(([, f]) => f === folder)?.[0] || folder;
  if (catalogKeys.includes(slug)) continue; // Already registered
  
  const dir = join(ROOT, 'public/games', folder);
  if (!existsSync(join(dir, 'index.html'))) continue; // No game data
  
  // Has folder + index.html but not registered — fast-register
  try {
    console.log(`Fast-registering: ${slug}...`);
    execFileSync(process.execPath, [join(ROOT, 'scripts', 'auto', 'register-existing.mjs', slug)], { cwd: ROOT, stdio: 'pipe' });
    registered++;
  } catch (e) {
    console.log(`  Failed: ${e.message?.slice(0, 80)}`);
  }
}

console.log(`Fast-registered ${registered} games`);
