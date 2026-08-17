/**
 * lib/register.mjs — register a mirrored game in every product surface.
 * Line-based insertions: find anchor LINE, insert adjacent line.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const ROOT = "C:/Project C/Hackation";
const read = r => readFileSync(join(ROOT,r),"utf8");
const write = (r,c) => writeFileSync(join(ROOT,r),c,"utf8");

function insertAfterLine(r, needleSubstring, newLine) {
  const content = read(r);
  const lines = content.split("\n");
  // Check if newLine already exists
  if (lines.some(l => l.includes(newLine.trim()))) return false;
  // Find the LINE containing needleSubstring
  const idx = lines.findIndex(l => l.includes(needleSubstring));
  if (idx < 0) { console.warn(`anchor not found in ${r}: ${needleSubstring.slice(0,40)}`); return false; }
  lines.splice(idx + 1, 0, newLine);
  write(r, lines.join("\n"));
  return true;
}

function insertBeforeLine(r, needleSubstring, newLine) {
  const content = read(r);
  const lines = content.split("\n");
  // Check if newLine already exists
  if (lines.some(l => l.includes(newLine.trim()))) return false;
  // Find the LINE containing needleSubstring
  const idx = lines.findIndex(l => l.includes(needleSubstring));
  if (idx < 0) { console.warn(`anchor not found in ${r}: ${needleSubstring.slice(0,40)}`); return false; }
  lines.splice(idx, 0, newLine);
  write(r, lines.join("\n"));
  return true;
}

function insertAfter(r, needle, block) { return insertAfterLine(r, needle, block); }
function insertBefore(r, needle, block) { return insertBeforeLine(r, needle, block); }

export function pascal(slug) { return (slug.charAt(0) >= '0' && slug.charAt(0) <= '9' ? 'G' : '') + slug.split("-").map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(""); }
export function taglineFor(title) { return title.replace(/[^A-Za-z0-9 ]/g,"").trim().split(/\s+/).slice(0,3).join(" ").toUpperCase().slice(0,24)||"PLAY NOW"; }

export function registerGame({ slug, title, creatorName, creatorId, category }) {
  const P = pascal(slug), comp = P+"Game";
  const wrapper = readFileSync(join(ROOT,"scripts","auto","lib","wrapper-template.txt"),"utf8").split("GAME_SLUG").join(slug).split("GAME_COMPONENT").join(comp).split("GAME_TITLE").join(title);
  const wp = join(ROOT,"src","games",comp+".tsx");
  if (!existsSync(wp)) writeFileSync(wp, wrapper, "utf8");
  const ins = (r,n,b) => { try { return insertAfter(r,n,b); } catch(e) { console.warn(e.message); return false; } };
  const insB = (r,n,b) => { try { return insertBefore(r,n,b); } catch(e) { console.warn(e.message); return false; } };
  ins("src/games/index.ts", "DriftBossGame", `export { ${comp} } from "./${comp}";`);
  ins("src/App.tsx", "DriftBossGame,", `  ${comp},`);
  ins("src/App.tsx", `"drift-boss": DriftBossGame,`, `  "${slug}": ${comp},`);
  ins("src/App.tsx", `"drift-boss": "DRIFT BOSS",`, `  "${slug}": "${taglineFor(title)}",`);
  insB("shared/catalog.ts", `  "drift-boss": {`, `  "${slug}": { creatorId: "${creatorId||"poki-mirror"}", creatorName: "${creatorName||"Poki Mirror"}", creatorLabel: "BY ${(creatorName||"POKI MIRROR").toUpperCase()} · LOCAL SOURCE MIRROR", category: "${category||"Arcade"}" },`);
  ins("src/types.ts", `  | "drift-boss"`, `  | "${slug}"`);
  insB("src/offline-catalog.ts", `slug: "drift-boss",`, `    { slug: "${slug}", title: "${title}", rule_text: "Play ${title}.", accent: "#8b5cf6" },`);
  insB("src/game-runtime.ts", `"drift-boss": {`, `  "${slug}": { embedded: true, preloadManifest: "/games/${slug}/preload-manifest.json", assetManifest: "/games/${slug}/MIRROR-MANIFEST.json", prepareByMount: true },`);
  insB("server/db.ts", `slug: "drift-boss",`, `  { slug: "${slug}", title: "${title}", rule_text: "Play ${title}.", accent: "#8b5cf6" },`);
  ins("server/score-policy.ts", `"drift-boss": { maxScore: 200_000, maxPerSecond: 90, burstAllowance: 120 },`, `  "${slug}": { maxScore: 200_000, maxPerSecond: 90, burstAllowance: 120 },`);
  return [];
}

export async function writeThumb(slug, imageUrl) {
  const target = join(ROOT,"public","thumbs",`${slug}.jpg`);
  if (existsSync(target)) return "cached";
  if (!imageUrl) return null;
  try { const r = await fetch(imageUrl, { headers: { Referer: "https://poki.com/" } }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); mkdirSync(join(ROOT,"public","thumbs"),{recursive:true}); writeFileSync(target,b); return "written"; } catch { return null; }
}
