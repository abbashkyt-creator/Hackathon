#!/usr/bin/env node
/**
 * verify-game.mjs — headless boot+isolation+content check for a mirrored game.
 * Usage: node scripts/auto/verify-game.mjs <slug> [baseUrl]
 * Also importable: verifyGame(slug, { baseUrl, knownMissing, toleratedMissing })
 */
import { launch, newPage } from "./lib/cdp.mjs";

export async function verifyGame(slug, { baseUrl = "http://127.0.0.1:3000", knownMissing = [], toleratedMissing = [] } = {}) {
  const browser = await launch();
  const R = { slug, ok: false, canvas: false, canvasSized: false, canvasBytes: 0, externalRequests: 0, externalHosts: [], navigatedAway: false, consoleErrors: [], failedRequests: [], httpFailures: [], networkLockRan: false, bridgeRan: false, reason: null };
  const failedUrls = new Map(), httpFail = [], masked404 = [];
  const isTol = url => { try { const p = new URL(url).pathname, b = p.split("/").pop(); return toleratedMissing.some(q => b === q.split("/").pop() && q.split("/").pop().length > 4 || p.endsWith("/"+q) || p.endsWith(q)); } catch { return false; } };
  try {
    const page = await newPage(browser);
    page.on("Network.requestWillBeSent", p => { if (/^https?:\/\//.test(p.request.url) && !/^https?:\/\/(127\.0\.0\.1|localhost)/.test(p.request.url)) { R.externalRequests++; try { const h = new URL(p.request.url).host; if (!R.externalHosts.includes(h)) R.externalHosts.push(h); } catch {} } });
    page.on("Network.loadingFailed", p => { const r = failedUrls.get(p.requestId); if (r) failedUrls.set(p.requestId, { ...r, error: p.errorText||"failed" }); });
    page.on("Network.responseReceived", p => { if (/^http:\/\/(127\.0\.0\.1|localhost)/.test(p.response.url)) { if (p.response.status >= 400) httpFail.push({ url: p.response.url, status: p.response.status }); const ct = (p.response.headers?.["content-type"]||"").toLowerCase(); if (!/\.html/.test(p.response.url) && ct.includes("text/html")) masked404.push(p.response.url); } });
    page.on("Network.requestWillBeSent", p => failedUrls.set(p.requestId, { url: p.request.url }));
    page.on("Runtime.consoleAPICalled", p => { if (p.type==="error") R.consoleErrors.push((p.args.map(a=>a.value??a.description??"").join(" ")).slice(0,200)); });
    page.on("Runtime.exceptionThrown", p => R.consoleErrors.push((p.exceptionDetails?.exception?.description||p.exceptionDetails?.text||"").slice(0,200)));
    page.on("Page.frameNavigated", p => { if (p.frame?.url && !/^about:|^http:\/\/(127\.0\.0\.1|localhost)/.test(p.frame.url)) R.navigatedAway = true; });
    await page.cmd("Page.navigate", { url: `${baseUrl}/games/${slug}/index.html?embedded=tiptap&autoplay=1&run=1` });
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      try {
        const st = await page.cmd("Runtime.evaluate", { expression: `JSON.stringify({ canvas:!!document.querySelector("canvas"), W:document.querySelector("canvas")?.width||0, H:document.querySelector("canvas")?.height||0, D:(()=>{try{const c=document.querySelector("canvas");if(!c)return 0;return c.toDataURL("image/png").length}catch{return -1}})(), lock:!!window.__TIPTAP_BLOCKED_NETWORK__, lockF:!!window.__TIPTAP_NETWORK_LOCK__, bridge:!!window.__TIPTAP_BRIDGE_EVENTS__, ready:document.readyState, url:location.href })`, returnByValue: true }, 10000);
        const d = JSON.parse(st.result.value);
        R.canvas = d.canvas; R.canvasBytes = Math.max(R.canvasBytes, Number(d.D)||0);
        if ((d.W||0)>300 && (d.H||0)>300) R.canvasSized = true;
        R.networkLockRan = !!d.lock||!!d.lockF; R.bridgeRan = !!d.bridge;
        if (d.url && !d.url.startsWith(baseUrl)) R.navigatedAway = true;
        if ((R.canvasSized||R.canvasBytes>6000) && R.networkLockRan && R.bridgeRan) R._ready = true;
      } catch {} await new Promise(r => setTimeout(r, 500));
    }
    const rawFail = [...failedUrls.values()].filter(r=>r.error).map(r=>r.url.slice(0,200));
    R.failedRequests = [...new Set([...rawFail,...masked404])].filter(u=>!isTol(u));
    R.httpFailures = httpFail.filter(f=>!isTol(f.url)).map(f=>`${f.status} ${f.url.slice(0,140)}`);
    const fatal = R.consoleErrors.filter(e => e.trim() && e.trim()!=="Event" && !/^Uncaught.*module/i.test(e) && !/^\[Construct\] Failed to load audio/i.test(e) && !/Unable to decode audio/i.test(e) && !/^Failed to process file/i.test(e) && !/^File failed/i.test(e));
    R.ok = R.canvas && !(!R.canvasSized && R.canvasBytes<=6000) && !R.navigatedAway && R.externalRequests===0 && R.networkLockRan && R.bridgeRan && fatal.length===0 && R.failedRequests.length===0;
    if (!R.ok) R.reason = [!R.canvas&&"no canvas",(!R.canvasSized&&R.canvasBytes<=6000)&&"canvas blank",R.navigatedAway&&"navigated",R.externalRequests&&`${R.externalRequests} external`,!R.networkLockRan&&"lock missing",!R.bridgeRan&&"bridge missing",fatal.length&&"console errors",R.failedRequests.length&&"missing assets"].filter(Boolean).join("; ");
  } finally { browser.close(); }
  return R;
}

if (process.argv[1]?.endsWith("verify-game.mjs")) {
  if (!process.argv[2]) { console.error("usage: verify-game.mjs <slug>"); process.exit(2); }
  const r = await verifyGame(process.argv[2]); console.log(JSON.stringify(r,null,2)); process.exit(r.ok?0:1);
}