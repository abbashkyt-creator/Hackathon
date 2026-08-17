#!/usr/bin/env node
/**
 * discover-quick.mjs — fast CDN discovery WITHOUT Chrome.
 * Fetches Poki page HTML and extracts the game CDN base from embedded data.
 * Falls back to Chrome if HTML extraction fails.
 * Usage: node scripts/auto/discover-quick.mjs <slug>
 */
const slug = process.argv[2];
if (!slug) { console.error("usage: discover-quick.mjs <slug>"); process.exit(2); }

const pageUrl = `https://poki.com/en/g/${slug}`;
const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" };

try {
  const res = await fetch(pageUrl, { headers, signal: AbortSignal.timeout(15000) });
  const html = await res.text();
  
  // Extract metadata
  const titleMatch = /<title>([^<]+?)\s*-\s*Play Online for Free/i.exec(html) || /<title>([^<]+)<\/title>/i.exec(html);
  const ogImage = /<meta property="og:image" content="([^"]+)"/.exec(html);
  const creatorMatch = /"name"\s*:\s*"([^"]+)"/.exec(html) || /by\s+([A-Z][A-Za-z0-9 .&'-]{2,40})/.exec(html.replace(/<[^>]+>/g, " "));
  const genreMatch = /"genre"\s*:\s*"([^"]+)"/.exec(html);
  
  const title = (titleMatch?.[1] || slug).trim().replace(/\s*-\s*Play Online for Free.*/i, "");
  const creatorName = creatorMatch?.[1]?.trim() || "Poki Mirror";
  const creatorId = creatorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "poki-mirror";
  const category = ["Action", "Arcade", "Puzzle", "Runner", "Sports"].find(c => (genreMatch?.[1] || "").toLowerCase().includes(c.toLowerCase())) || "Arcade";
  
  // Try to find CDN base from JSON data embedded in page
  // Poki embeds game data in a __NEXT_DATA__ script or similar
  const jsonMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const gameData = JSON.stringify(data).match(/([a-f0-9-]{20,40})\.gdn\.poki\.com/);
      if (gameData) {
        const cdnBase = `https://${gameData[1]}.gdn.poki.com/${gameData[0].split("/")[1]}/`;
        console.log(JSON.stringify({ sourceBase: cdnBase, title, creatorName, creatorId, category, ogImage: ogImage?.[1] }));
        process.exit(0);
      }
    } catch {}
  }
  
  // Try to find CDN URL from inline scripts
  const cdnMatch = html.match(/([a-f0-9-]{20,40})\.gdn\.poki\.com\/([a-f0-9-]{20,40})\//);
  if (cdnMatch) {
    const cdnBase = `https://${cdnMatch[1]}.gdn.poki.com/${cdnMatch[2]}/`;
    console.log(JSON.stringify({ sourceBase: cdnBase, title, creatorName, creatorId, category, ogImage: ogImage?.[1] }));
    process.exit(0);
  }
  
  // Try games.poki.com API
  const apiRes = await fetch(`https://games.poki.com/g/${slug}`, { headers, signal: AbortSignal.timeout(10000) }).catch(() => null);
  if (apiRes?.ok) {
    const apiText = await apiRes.text();
    const apiCdn = apiText.match(/([a-f0-9-]{20,40})\.gdn\.poki\.com\/([a-f0-9-]{20,40})\//);
    if (apiCdn) {
      const cdnBase = `https://${apiCdn[1]}.gdn.poki.com/${apiCdn[2]}/`;
      console.log(JSON.stringify({ sourceBase: cdnBase, title, creatorName, creatorId, category, ogImage: ogImage?.[1] }));
      process.exit(0);
    }
  }
  
  // HTML extraction didn't find CDN — need Chrome
  console.error(`NO_CDN_IN_HTML: ${slug} needs Chrome discovery`);
  process.exit(1);
} catch (e) {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
}
