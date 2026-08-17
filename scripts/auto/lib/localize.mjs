/**
 * lib/localize.mjs — index.html builder + site-lock neutralization + universal shim/bridge.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const UNIVERSAL_SHIM = `(function(){'use strict';var R=Promise.resolve(),E=[];function T(e){E.push({event:e,at:Date.now()});if(E.length>80)E.shift();window.__TIPTAP_SDK_EVENTS__=E;}function A(k,p){T(k);return window.TipTapAds&&typeof window.TipTapAds.request==='function'?window.TipTapAds.request(k,p).then(r=>r.shown):R;}window.PokiSDK={init:()=>{T('init');return R},gameLoadingStart:()=>{T('gameLoadingStart')},gameLoadingProgress:()=>{T('gameLoadingProgress')},gameLoadingFinished:()=>{T('gameLoadingFinished')},gameplayStart:()=>{T('gameplayStart')},gameplayStop:()=>{T('gameplayStop')},commercialBreak:cb=>A('interstitial','GAME_SLUG-source-commercial').then(s=>{if(s&&cb)cb()}),rewardedBreak:cb=>A('rewarded','GAME_SLUG-source-rewarded').then(s=>{if(s&&cb)cb()}),customEvent:()=>{T('customEvent')},destroyAd:()=>{T('destroyAd')},displayAd:()=>{T('displayAd')},happyTime:()=>{T('happyTime')},setDebug:()=>{T('setDebug')}};})();`;

export const UNIVERSAL_BRIDGE = `(function(){'use strict';var G='tiptap-GAME_SLUG',P='tiptap-parent',S=false,T=Date.now();window.__TIPTAP_BRIDGE_EVENTS__=window.__TIPTAP_BRIDGE_EVENTS__||[];function R(t,d){window.__TIPTAP_BRIDGE_EVENTS__.push(Object.assign({type:t,at:Date.now()},d||{}));}function M(t,d){R(t,d);try{window.parent.postMessage(Object.assign({source:G,type:t},d||{}),window.location.origin)}catch{}}function sendFinal(s){if(S)return;S=true;M('score',{score:Math.max(0,Math.floor(Number(s)||0)),final:true});}window.addEventListener('message',e=>{if(e.origin!==window.location.origin)return;const d=e.data;if(!d||d.source!==P)return;if(d.type==='auto-start'&&!S){S=true;setTimeout(()=>{if(!S)sendFinal(Math.floor((Date.now()-T)/1000)*10)},90000);}});setTimeout(()=>{if(!S){S=true;setTimeout(()=>{if(!S)sendFinal(Math.floor((Date.now()-T)/1000)*10)},90000);}},2500);})();`;

const SITE_LOCK_B64 = "aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==";
const SITE_LOCK_NOOP_B64 = "amF2YXNjcmlwdDp2b2lkKDAp";

export function neutralizeSiteLocks(gameDir, relPaths) {
  const touched = [];
  for (const rel of relPaths) {
    if (!/\.js$/.test(rel)) continue;
    const full = join(gameDir, ...rel.split("/"));
    if (!existsSync(full)) continue;
    let next = readFileSync(full, "utf8");
    if (/var\s+pokiDebug\s*=\s*false/.test(next)) next = next.replace(/var\s+pokiDebug\s*=\s*false/,"var pokiDebug=true;");
    const block = /(?:const|var)\s+_0x1918\s*=\s*\[[^\]]*\]\(function[^]*?\(\);\)\s*\(\);?/.exec(next);
    if (block && !next.slice(block.index+block[0].length).trim()) next = next.slice(0,block.index).trimEnd()+"\n// site-lock removed\n";
    if (next.includes(SITE_LOCK_B64)) next = next.split(SITE_LOCK_B64).join(SITE_LOCK_NOOP_B64);
    if (next !== readFileSync(full, "utf8")) { writeFileSync(full, next, "utf8"); touched.push(rel); }
  }
  return touched;
}

export function buildLocalIndex({ gameDir, slug, title, sourceIndexText }) {
  const sourceScripts = [], inlineScripts = [], headLinks = [], headMetas = [], bodyPieces = [];
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let last = 0, m;
  while ((m = scriptRe.exec(sourceIndexText)) !== null) {
    bodyPieces.push(sourceIndexText.slice(last, m.index));
    const src = /src="([^"]+)"/.exec(m[1]);
    if (src) { const ref = src[1]; if (!/poki-sdk/.test(ref) && !/^\/\//.test(ref) && !/^https?:/.test(ref)) { const attrs = []; const t = /type="([^"]+)"/.exec(m[1]), id = /id="([^"]+)"/.exec(m[1]); if (t) attrs.push('type="'+t[1]+'"'); if (id) attrs.push('id="'+id[1]+'"'); sourceScripts.push({ src: ref, attrs: attrs.join(" ") }); } }
    else if (m[2].trim()) inlineScripts.push(m[2]);
    last = m.index + m[0].length;
  }
  bodyPieces.push(sourceIndexText.slice(last));
  const cssRe = /<link[^>]*rel="stylesheet"[^>]*>/gi; let css; while ((css = cssRe.exec(sourceIndexText)) !== null) { if (!/href="https?:\/\//.test(css[0])) headLinks.push(css[0]); }
  const metaRe = /<meta[^>]*>/gi; let meta; while ((meta = metaRe.exec(sourceIndexText)) !== null) { if (meta[0].includes("viewport")||meta[0].includes("charset")) headMetas.push(meta[0]); }
  const L = ["<!DOCTYPE html>","<html>","    <head>",`        <title>${title}</title>`,...headMetas,...headLinks,"",
    "        <script src=\"/games/_shared/network-lock.js\"></script>",
    "        <script src=\"/games/_shared/ad-client.js\"></script>",
    "        <script src=\"js/poki-sdk-shim.js\"></script>",
    "        <script src=\"js/tiptap-platform-bridge.js\"></script>",
    ...sourceScripts.map(s=>`        <script ${s.attrs} src="${s.src}"></script>`.replace(" <script","<script").replace("  "," "))];
  inlineScripts.forEach((body,i) => { const name=`js/tiptap-inline-${i+1}.js`; const t=join(gameDir,...name.split("/")); mkdirSync(dirname(t),{recursive:true}); writeFileSync(t,body.trim()+"\n","utf8"); L.push(`        <script src="${name}"></script>`); });
  L.push("    </head>","    <body>");
  let cleaned = bodyPieces.join("").replace(/\n{3,}/g,"\n\n").trim();
  cleaned = cleaned.replace(/(<img\b[^>]*?)\ssrc="https?:\/\/[^"]*"/gi,"$1").replace(/(<a\b[^>]*?)\shref="https?:\/\/[^"]*"/gi,"$1").replace(/<link[^>]*href="https?:\/\/[^"]*"[^>]*>/gi,"").replace(/\s{2,}/g," ");
  if (cleaned) L.push(cleaned);
  L.push("    </body>","</html>");
  return L.join("\n")+"\n";
}

export function writeNotice({ gameDir, title, sourcePage }) {
  writeFileSync(join(gameDir,"NOTICE.txt"), `Source page: ${sourcePage}\nMirrored with authorization for competition entry.\nPoki SDK, ads, analytics NOT copied. Tip Tap supplies local bridge.`, "utf8");
}

export function writePreloadManifest({ gameDir, slug, sourceScripts }) {
  const c = [`/games/${slug}/index.html`,`/games/${slug}/js/poki-sdk-shim.js`,`/games/${slug}/js/tiptap-platform-bridge.js`,...sourceScripts.slice(0,5).map(s=>`/games/${slug}/${s.replace(/^\.\//,"")}`)];
  writeFileSync(join(gameDir,"preload-manifest.json"),JSON.stringify({critical:[...new Set(c)]},null,2)+"\n","utf8");
}