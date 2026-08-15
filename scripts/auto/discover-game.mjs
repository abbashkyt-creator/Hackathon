#!/usr/bin/env node
/**
 * discover-game.mjs — find a Poki game's source CDN base in a headless browser.
 * Usage: node scripts/auto/discover-game.mjs <slug>
 */
import { launch, newPage } from "./lib/cdp.mjs";

const slug = process.argv[2];
if (!slug) { console.error("usage: discover-game.mjs <slug>"); process.exit(2); }

const browser = await launch();
try {
  const page = await newPage(browser);
  let sourceBase = null;
  page.on("Network.requestWillBeSent", params => {
    const url = params.request.url;
    const idx = url.indexOf(".gdn.poki.com/");
    if (idx < 0 || sourceBase) return;
    const rest = url.slice(idx + ".gdn.poki.com/".length);
    const slash = rest.indexOf("/");
    if (slash < 0) return;
    const version = rest.slice(0, slash);
    if (!/^[a-f0-9-]{20,40}$/.test(version)) return;
    if (!rest.slice(slash + 1).startsWith("index.html")) return;
    sourceBase = url.slice(0, idx + ".gdn.poki.com/".length) + version + "/";
  });
  const target = `https://poki.com/en/g/${slug}`;
  for (let round = 0; round < 2 && !sourceBase; round++) {
    await page.cmd("Page.navigate", { url: target });
    const deadline = Date.now() + 60000;
    while (!sourceBase && Date.now() < deadline) await new Promise(r => setTimeout(r, 500));
    if (!sourceBase) await page.cmd("Page.reload", { ignoreCache: true });
  }
  console.log(sourceBase
    ? JSON.stringify({ slug, ok: true, sourceBase })
    : JSON.stringify({ slug, ok: false, reason: "no gdn request" }));
  process.exit(sourceBase ? 0 : 1);
} finally { browser.close(); }