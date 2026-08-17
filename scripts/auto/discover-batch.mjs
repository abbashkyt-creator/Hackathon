#!/usr/bin/env node
/**
 * discover-batch.mjs — discover CDN URLs for multiple games using a SINGLE Chrome instance.
 * Much faster than launching Chrome per game.
 * Usage: node scripts/auto/discover-batch.mjs slug1 slug2 ... [--out file.json]
 */
import { launch, newPage, sweepIngestChromes } from "./lib/cdp.mjs";

const slugs = process.argv.filter(a => !a.startsWith("--"));
const outIdx = process.argv.indexOf("--out");
const outFile = outIdx >= 0 ? process.argv[outIdx + 1] : null;
const { writeFileSync } = await import("node:fs");

sweepIngestChromes();
const browser = await launch();
console.log(`Launched Chrome. Discovering ${slugs.length} games...`);

const results = {};
for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const pageUrl = `https://poki.com/en/g/${slug}`;
  try {
    const page = await newPage(browser);
    let sourceBase = null;
    
    page.on("Network.requestWillBeSent", p => {
      if (sourceBase) return;
      const u = p.request.url;
      const idx = u.indexOf(".gdn.poki.com/");
      if (idx < 0) return;
      const r = u.slice(idx + 15);
      const sl = r.indexOf("/");
      if (sl < 0) return;
      const v = r.slice(0, sl);
      if (/^[a-f0-9-]{20,40}$/.test(v) && r.slice(sl + 1).startsWith("index.html")) {
        sourceBase = u.slice(0, idx + 15) + v + "/";
      }
    });

    // Navigate and wait for CDN request (max 30s)
    await page.cmd("Page.navigate", { url: pageUrl });
    const deadline = Date.now() + 30000;
    while (!sourceBase && Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 500));
    }
    if (!sourceBase) {
      await page.cmd("Page.reload", { ignoreCache: true });
      const deadline2 = Date.now() + 20000;
      while (!sourceBase && Date.now() < deadline2) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    // Extract metadata from page
    const title = await page.cmd("Runtime.evaluate", { expression: "document.title.replace(/\\s*-\\s*Play Online for Free.*/i,'').trim()", returnByValue: true }).then(r => r.result?.value || slug);
    
    page.close().catch(() => {});
    
    if (sourceBase) {
      results[slug] = { sourceBase, title, ok: true };
      console.log(`[${i+1}/${slugs.length}] ${slug}: OK (${sourceBase.slice(0, 60)}...)`);
    } else {
      results[slug] = { ok: false, error: "no CDN found" };
      console.log(`[${i+1}/${slugs.length}] ${slug}: FAIL (no CDN)`);
    }
  } catch (e) {
    results[slug] = { ok: false, error: e.message };
    console.log(`[${i+1}/${slugs.length}] ${slug}: ERROR ${e.message.slice(0, 80)}`);
  }
}

browser.close();
if (outFile) writeFileSync(outFile, JSON.stringify(results, null, 2));
console.log(`\nDone: ${Object.values(results).filter(r => r.ok).length}/${slugs.length} discovered`);
