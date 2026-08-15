/**
 * lib/crawl.mjs — complete asset crawler for Poki game packages.
 * BFS over html/css/js/json refs, C3 data.json graphs, MA1 atlases, fonts.
 * Dir-relative resolution for subdirectory files (atlases, data.json).
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fetchBytes } from "./fetch.mjs";

const ASSET_EXT = new Set(["png","jpg","jpeg","webp","svg","gif","bmp","ico","mp3","ogg","wav","m4a","mp4","webm","woff2","woff","ttf","otf","eot","json","wasm","js","css","txt","dat","bin","html","htm","cconb"]);
const JS_ASSET_RE = /(?<![A-Za-z0-9_.])["'`](?:\.\/)?([A-Za-z0-9_][A-Za-z0-9_\-./]{2,}\.([A-Za-z0-9]{2,5}))["'`]/g;
const HTML_REF_RE = /(?:src|href|poster|data-src)="([^"]+)"/g;
const CSS_URL_RE = /url\(\s*["']?([^"')]+)["']?\s*\)/g;

function isExternal(ref, base) {
  if (!ref || ref.startsWith("#") || ref.startsWith("data:") || ref.startsWith("blob:")) return true;
  if (ref.startsWith("//") || /^[a-z]+:\/\//i.test(ref)) { try { return new URL(ref.startsWith("//") ? "https:"+ref : ref).origin !== new URL(base).origin; } catch { return true; } }
  return false;
}
function resolveRef(ref, base) { try { return new URL(ref.replace(/^\.\//, ""), base).href.split("#")[0]; } catch { return null; } }

function scanRefs(bytes, rel, depth, add) {
  const text = bytes.toString("utf8"), lower = rel.toLowerCase();
  const dir = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : null;
  const add2 = r => { add(r, depth + 1); if (dir && !r.startsWith("/") && !/^[a-z]+:/i.test(r)) add(dir + "/" + r, depth + 1); };
  if (lower.endsWith(".html")) { for (const m of text.matchAll(HTML_REF_RE)) add2(m[1]); }
  else if (lower.endsWith(".css")) { for (const m of text.matchAll(CSS_URL_RE)) add2(m[1]); }
  else if (lower.endsWith(".json")) {
    let isAtlas = false;
    try { const j = JSON.parse(text); if (j && typeof j === "object" && Array.isArray(j.textures)) isAtlas = true;
      (function walk(n) { if (typeof n === "string") { const ext = n.split(".").pop()?.toLowerCase(), stem = n.split("/").pop()?.slice(0, -(ext?.length||0)-1)||""; if (ASSET_EXT.has(ext) && !n.includes("://") && stem.length >= 2 && !n.startsWith(".")) add2(n); } else if (Array.isArray(n)) n.forEach(walk); else if (n && typeof n === "object") Object.values(n).forEach(walk); })(j);
    } catch {}
    if (isAtlas) { const b = rel.split("/").pop()||rel, d = dir?dir+"/":""; add2(d+"MA1_"+b); const s = b.replace(/\.json$/i,""); add2(d+"MA1_"+s+".png"); }
  } else if (lower.endsWith(".js") || lower.endsWith(".mjs")) { for (const m of text.matchAll(JS_ASSET_RE)) if (ASSET_EXT.has(m[2].toLowerCase())) add2(m[1]); }
}

const PROBES = ["data.json","appmanifest.json","manifest.json","scripts/c3runtime.js","scripts/c3runtime_worker.js","scripts/workermain.js","scripts/dispatchworker.js","scripts/jobworker.js","previewworker.js"];

export async function crawlGame({ sourceBase, outputDir, maxFiles = 4000, maxDepth = 6 }) {
  mkdirSync(outputDir, { recursive: true });
  const basePath = new URL(sourceBase).pathname.replace(/\/$/,"");
  const seen = new Set(), files = [], missing = [], queue = [];
  const add = (ref, depth) => { const url = resolveRef(ref, sourceBase); if (!url || isExternal(ref, sourceBase) || seen.has(url)) return; seen.add(url); queue.push({ url, depth }); };
  for (const p of PROBES) add(p, 1);
  add(resolveRef("index.html", sourceBase), 0);
  while (queue.length && files.length < maxFiles) {
    const { url, depth } = queue.shift();
    if (depth > maxDepth) continue;
    const cleanUrl = url.split("?")[0];
    const rawRel = decodeURIComponent(new URL(cleanUrl).pathname).replace(/^\//,"");
    const rel = basePath && rawRel.startsWith(basePath.slice(1)+"/") ? rawRel.slice(basePath.length) : rawRel;
    if (!rel) continue;
    const target = join(outputDir, ...rel.split("/"));
    if (existsSync(target)) { files.push({ assetPath: rel, bytes: 0, sha256: "cached" }); if (depth < maxDepth) scanRefs(readFileSync(target), rel, depth, add); continue; }
    let bytes;
    try { bytes = await fetchBytes(url); } catch (e) { missing.push({ assetPath: rel, error: e.message, nonFatal: PROBES.includes(rel) }); continue; }
    try { mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, bytes); } catch { missing.push({ assetPath: rel, error: "write failed", nonFatal: false }); continue; }
    files.push({ assetPath: rel, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
    if (depth < maxDepth) scanRefs(bytes, rel, depth, add);
  }
  return { files, missing };
}

export async function localizeGoogleFonts({ outputDir, htmlOrCss, onFile }) {
  const urls = [...new Set([...htmlOrCss.matchAll(/https:\/\/fonts\.googleapis\.com\/css2?\?[^"')]+/g)].map(m => m[0]))];
  if (!urls.length) return null;
  mkdirSync(join(outputDir,"fonts"), { recursive: true });
  let localCss = null, idx = 0;
  for (const cssUrl of urls) {
    let css; try { css = (await fetchBytes(cssUrl, { headers: { "User-Agent": "Mozilla/5.0" } })).toString("utf8"); } catch { continue; }
    css = css.replace(/https:\/\/fonts\.gstatic\.com\/[^)]+/g, fu => { idx++; const ext = /\.(woff2|woff|ttf)/.exec(fu)?.[1]||"woff2"; const n = `fonts/local-${idx}.${ext}`; fetchBytes(fu,{headers:{"User-Agent":"Mozilla/5.0"}}).then(b=>{ writeFileSync(join(outputDir,...n.split("/")),b); if(onFile)onFile(n,b.length); }).catch(()=>{}); return n; });
    const localName = `fonts/google-fonts-${idx||1}.css`;
    writeFileSync(join(outputDir,...localName.split("/")), css);
    if (onFile) onFile(localName, css.length);
    localCss = localName;
  }
  return localCss;
}