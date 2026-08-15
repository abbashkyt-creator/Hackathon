#!/usr/bin/env node
/**
 * ingest-game.mjs — end-to-end auto-ingest of one Poki game.
 * Usage: node scripts/auto/ingest-game.mjs <slug> [--skip-verify]
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { launch, newPage } from "./lib/cdp.mjs";
import { fetchText } from "./lib/fetch.mjs";
import { crawlGame, localizeGoogleFonts } from "./lib/crawl.mjs";
import { UNIVERSAL_SHIM, UNIVERSAL_BRIDGE, neutralizeSiteLocks, buildLocalIndex, writeNotice, writePreloadManifest } from "./lib/localize.mjs";
import { registerGame, writeThumb } from "./lib/register.mjs";
const ROOT = "C:/Project C/Hackation";
const slug = process.argv[2];
if (!slug) { console.error("usage: ingest-game.mjs <slug> [--skip-verify]"); process.exit(2); }
const skipVerify = process.argv.includes("--skip-verify");
const BASE_URL = process.env.TIPTAP_BASE_URL || "http://127.0.0.1:3000";
const gameDir = join(ROOT,"public","games",slug);
const report = { slug, ok: false, stages: [] };
async function stage(name, fn) { try { const r = await fn(); report.stages.push({ name, ok:true, ...(r||{}) }); return r; } catch(e) { report.stages.push({name,ok:false,error:e.message}); throw e; } }
try {
  const pageUrl = `https://poki.com/en/g/${slug}`;
  const pageHtml = await fetchText(pageUrl, {timeout:25000});
  const titleM = /<title>([^<]+?)\s*-\s*Play Online for Free/i.exec(pageHtml) || /<title>([^<]+)<\/title>/i.exec(pageHtml);
  const ogImage = /<meta property="og:image" content="([^"]+)"/.exec(pageHtml);
  const creatorM = /"name"\s*:\s*"([^"]+)"/.exec(pageHtml) || /by\s+([A-Z][A-Za-z0-9 .&'-]{2,40})/.exec(pageHtml.replace(/<[^>]+>/g," "));
  const genreM = /"genre"\s*:\s*"([^"]+)"/.exec(pageHtml);
  const title = (titleM?.[1]||slug).trim().replace(/\s*-\s*Play Online for Free.*/i,"");
  const creatorName = creatorM?.[1]?.trim()||"Poki Mirror";
  const creatorId = creatorName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"poki-mirror";
  const category = ["Action","Arcade","Puzzle","Runner","Sports"].find(c=>(genreM?.[1]||"").toLowerCase().includes(c.toLowerCase()))||"Arcade";

  await stage("discover", async () => {
    const browser = await launch(); try {
      const page = await newPage(browser); let sb = null;
      page.on("Network.requestWillBeSent", p => { if (sb) return; const u=p.request.url, idx=u.indexOf(".gdn.poki.com/"); if (idx<0) return; const r=u.slice(idx+15), sl=r.indexOf("/"); if (sl<0) return; const v=r.slice(0,sl); if (!/^[a-f0-9-]{20,40}$/.test(v)||!r.slice(sl+1).startsWith("index.html")) return; sb=u.slice(0,idx+15)+v+"/"; });
      for (let round=0; round<2 && !sb; round++) { await page.cmd("Page.navigate",{url:pageUrl}); const dl=Date.now()+60000; while (!sb && Date.now()<dl) await new Promise(r=>setTimeout(r,500)); if (!sb) await page.cmd("Page.reload",{ignoreCache:true}); }
      if (!sb) throw new Error("no gdn request"); return {sourceBase:sb,title,creatorName,category};
    } finally { browser.close(); }
  });
  const { sourceBase } = report.stages.at(-1);

  await stage("crawl", async () => { await stage("crawl", async () => { mkdirSync(gameDir,{recursive:true}); const result = await crawlGame({sourceBase,outputDir:gameDir}); if (!result.files.some(f=>f.assetPath==="index.html")) throw new Error("no index.html"); return {files:result.files.length,missing:result.missing.length}; }); });
  const crawlStage = report.stages.find(s=>s.name==="crawl" && s.files!=null);
  const crawlFiles = crawlStage?.files || [];

  await stage("localize", async () => {
    const src = await fetchText(sourceBase+"index.html");
    const js = crawlStage ? [] : [];
    const localFontCss = await localizeGoogleFonts({outputDir:gameDir,htmlOrCss:src});
    const li = buildLocalIndex({gameDir,slug,title,sourceIndexText:src});
    let html = li;
    if (localFontCss) html = html.replace('        <script src="/games/_shared/network-lock.js">', `        <link rel="stylesheet" href="${localFontCss}">\n        <script src="/games/_shared/network-lock.js">`);
    const {mkdirSync:md}=await import("node:fs");
    md(join(gameDir,"js"),{recursive:true});
    const {writeFileSync:ws}=await import("node:fs");
    ws(join(gameDir,"index.html"),html,"utf8");
    ws(join(gameDir,"js","poki-sdk-shim.js"),UNIVERSAL_SHIM.split("GAME_SLUG").join(slug),"utf8");
    ws(join(gameDir,"js","tiptap-platform-bridge.js"),UNIVERSAL_BRIDGE.split("GAME_SLUG").join(slug),"utf8");
    writeNotice({gameDir,slug,title,sourcePage:pageUrl});
    const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
    writePreloadManifest({gameDir,slug,sourceScripts:scripts.filter(s=>!s.includes("/_shared/"))});
    return {};
  });

  await stage("register", async () => { registerGame({slug,title,creatorName,creatorId,category}); if (ogImage?.[1]) await writeThumb(slug,ogImage[1]); return {}; });

  await stage("manifest", async () => { execFileSync(process.execPath,[join(ROOT,"scripts","refresh-integration-provenance.mjs"),slug],{cwd:ROOT,stdio:"pipe"}); });

  report.ok = true;
  if (!skipVerify) {
    const { verifyGame } = await import("./verify-game.mjs");
    let vr = await stage("verify", async () => verifyGame(slug, { baseUrl: BASE_URL }));
    if (!vr.ok && vr.failedRequests?.length) {
      const rec = await stage("recover", async () => {
        const { fetchBytes, POKI_HEADERS } = await import("./lib/fetch.mjs");
        const { mkdirSync:md, writeFileSync:ws } = await import("node:fs");
        const { dirname:dn } = await import("node:path");
        let f=0; const still=[];
        for (const url of vr.failedRequests) { try { const p=new URL(url).pathname.split("/").slice(3).join("/"); if (!p) continue; const b=await fetchBytes(sourceBase+p,{headers:POKI_HEADERS}); const t=join(gameDir,...p.split("/")); md(dn(t),{recursive:true}); ws(t,b); f++; } catch { still.push(url); } }
        return {fetched:f,stillMissing:still};
      });
      if (rec.fetched>0) execFileSync(process.execPath,[join(ROOT,"scripts","refresh-integration-provenance.mjs"),slug],{cwd:ROOT,stdio:"pipe"});
      vr = await stage("verify2", async () => verifyGame(slug, { baseUrl: BASE_URL, toleratedMissing:rec.stillMissing }));
    }
    report.ok = report.stages.every(s=>s.ok);
  }
  console.log(JSON.stringify(report,null,2));
  process.exit(report.ok?0:1);
} catch(e) { report.ok=false; report.error=e.message; console.log(JSON.stringify(report,null,2)); process.exit(1); }