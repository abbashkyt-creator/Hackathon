/* Extract first-party Temple Run 2 runtime bodies from a VEU HAR capture.
 * This is intentionally offline: it never requests Poki or any external host. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const [harPath, outputDir] = process.argv.slice(2);
if (!harPath || !outputDir) {
  throw new Error("Usage: node scripts/extract-temple-run-from-har.cjs <capture.har> <output-dir>");
}

const gameHost = "43a9c68e-4e5a-4916-8fdd-d4a23bc94d04.gdn.poki.com";
const versionPrefix = "/a43bfe6b-00c1-42e0-bb51-c2bd5a1c0395/";
const har = JSON.parse(fs.readFileSync(harPath, "utf8"));
const files = [];

for (const entry of har.log.entries) {
  const sourceUrl = entry.request?.url;
  const response = entry.response;
  if (!sourceUrl || !response || response.status !== 200) continue;
  const url = new URL(sourceUrl);
  if (url.hostname !== gameHost || url.protocol === "blob:") continue;
  if (!url.pathname.startsWith(versionPrefix)) continue;
  const content = response.content;
  if (!content?.text) continue;

  const relativePath = decodeURIComponent(url.pathname.slice(versionPrefix.length));
  if (!relativePath || relativePath.includes("..")) continue;
  const destination = path.join(outputDir, relativePath);
  // VEU serializes binary HAR response bodies as base64 text but the exported
  // HAR may omit the optional `encoding` field. Use MIME type as the durable
  // signal so GLB, images, audio, and fonts retain their original bytes.
  const mimeType = content.mimeType || "";
  const isText = /^text\//i.test(mimeType) || /(?:javascript|json|xml)/i.test(mimeType);
  const bytes = content.encoding === "base64" || !isText
    ? Buffer.from(content.text, "base64")
    : Buffer.from(content.text, "utf8");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
  files.push({
    assetPath: relativePath.replaceAll("\\", "/"),
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    source: sourceUrl,
  });
}

files.sort((a, b) => a.assetPath.localeCompare(b.assetPath));
fs.writeFileSync(path.join(outputDir, "MIRROR-MANIFEST.json"), JSON.stringify({
  game: "temple-run-2-frozen-shadows",
  title: "Temple Run 2: Frozen Shadows",
  source: {
    publisher: "Imangi Studios",
    page: "https://poki.com/en/g/temple-run-2-frozen-shadows",
    package: `https://${gameHost}${versionPrefix}`,
  },
  runtimePolicy: {
    externalRequests: false,
    ads: false,
    analytics: false,
    pokiSdk: "local-no-network-compatibility-shim",
    leaderboard: "unranked-no-verified-source-callback",
  },
  capture: path.basename(harPath),
  capturedAt: new Date().toISOString(),
  files,
}, null, 2) + "\n");
console.log(JSON.stringify({ extracted: files.length, outputDir, totalBytes: files.reduce((sum, file) => sum + file.bytes, 0) }));
