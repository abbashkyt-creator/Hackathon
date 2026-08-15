/**
 * lib/register.mjs — register a mirrored game in every product surface.
 * Anchor-based insertions (before the "four-in-a-row" entry in each file).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const ROOT = "C:/Project C/Hackation";
const read = r => readFileSync(join(ROOT,r),"utf8");
const write = (r,c) => writeFileSync(join(ROOT,r),c,"utf8");
const contains = (r,s) => read(r).includes(s);
function insertAfter(r, needle, block) { if (contains(r, block.split("\n")[1]||block)) return false; const t=read(r), i=t.indexOf(needle); if(i<0) throw new Error(`anchor not found in ${r}: ${needle.slice(0,40)}`); write(r, t.slice(0,i+needle.length)+"\n"+block+t.slice(i+needle.length)); return true; }
function insertBefore(r, needle, block) { if (contains(r, (block.split("\n").find(l=>l.trim().length>4)||""))) return false; const t=read(r), i=t.indexOf(needle); if(i<0) throw new Error(`anchor not found in ${r}: ${needle.slice(0,40)}`); write(r, t.slice(0,i)+block+t.slice(i)); return true; }

export function pascal(slug) { return slug.split("-").map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(""); }
export function taglineFor(title) { return title.replace(/[^A-Za-z0-9 ]/g,"").trim().split(/\s+/).slice(0,3).join(" ").toUpperCase().slice(0,24)||"PLAY NOW"; }

export function registerGame({ slug, title, creatorName, creatorId, category }) {
  const P = pascal(slug), comp = P+"Game";
  const wrapper = readFileSync(join(ROOT,"scripts","auto","lib","wrapper-template.txt"),"utf8").split("GAME_SLUG").join(slug).split("GAME_COMPONENT").join(comp).split("GAME_TITLE").join(title);
  const wp = join(ROOT,"src","games",comp+".tsx");
  if (!existsSync(wp)) writeFileSync(wp, wrapper, "utf8");
  const ins = (r,n,b) => { try { return insertAfter(r,n,b); } catch(e) { console.warn(e.message); return false; } };
  const insB = (r,n,b) => { try { return insertBefore(r,n,b); } catch(e) { console.warn(e.message); return false; } };
  ins("src/games/index.ts", "export { FourInARowGame }", `export { ${comp} } from "./${comp}";`);
  ins("src/App.tsx", "FourInARowGame,", `  ${comp},`);
  ins("src/App.tsx", `"four-in-a-row": FourInARowGame,`, `  "${slug}": ${comp},`);
  ins("src/App.tsx", `"four-in-a-row": "CONNECT FOUR",`, `  "${slug}": "${taglineFor(title)}",`);
  insB("shared/catalog.ts", `  "four-in-a-row": {`, `  "${slug}": { creatorId: "${creatorId||"poki-mirror"}", creatorName: "${creatorName||"Poki Mirror"}", creatorLabel: "BY ${(creatorName||"POKI MIRROR").toUpperCase()} · LOCAL SOURCE MIRROR", category: "${category||"Arcade"}" },\n`);
  ins("src/types.ts", `  | "four-in-a-row"`, `  | "${slug}"`);
  insB("src/offline-catalog.ts", `    {\n      slug: "four-in-a-row",`, `    { slug: "${slug}", title: "${title}", rule_text: "Play ${title}.", accent: "#8b5cf6" },\n`);
  insB("src/game-runtime.ts", `  "four-in-a-row": {`, `  "${slug}": { embedded: true, preloadManifest: "/games/${slug}/preload-manifest.json", assetManifest: "/games/${slug}/MIRROR-MANIFEST.json", prepareByMount: true },\n`);
  insB("server/db.ts", `    {\n      slug: "four-in-a-row",`, `  { slug: "${slug}", title: "${title}", rule_text: "Play ${title}.", accent: "#8b5cf6" },\n`);
  ins("server/score-policy.ts", `  "four-in-a-row": { maxScore: 200_000, maxPerSecond: 90, burstAllowance: 120 },`, `  "${slug}": { maxScore: 200_000, maxPerSecond: 90, burstAllowance: 120 },`);
  return [];
}

export async function writeThumb(slug, imageUrl) {
  const target = join(ROOT,"public","thumbs",`${slug}.jpg`);
  if (existsSync(target)) return "cached";
  if (!imageUrl) return null;
  try { const r = await fetch(imageUrl, { headers: { Referer: "https://poki.com/" } }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); mkdirSync(join(ROOT,"public","thumbs"),{recursive:true}); writeFileSync(target,b); return "written"; } catch { return null; }
}