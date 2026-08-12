import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sourceBase = "https://5dd33196-015f-11ea-ad56-9cb6d0d995f7.gdn.poki.com/0ca48bfa-be18-4697-82ac-b48280d44496/";
const outputRoot = join(process.cwd(), "public", "games", "basketball-stars");
const HEADERS = { Referer: "https://poki.com/", Origin: "https://poki.com" };
const files = [];
const missing = [];

async function grab(rel) {
  const target = join(outputRoot, ...rel.split("/"));
  if (existsSync(target)) {
    files.push({ assetPath: rel, bytes: 0, sha256: "cached" });
    return true;
  }
  const response = await fetch(new URL(rel, sourceBase), { headers: HEADERS });
  if (!response.ok) { missing.push(`${rel}: HTTP ${response.status}`); return false; }
  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
  files.push({ assetPath: rel, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
  process.stdout.write(`mirrored ${rel} (${bytes.length} B)\n`);
  return true;
}

const manifest = JSON.parse((await readFile(join(process.cwd(), "tmp", "bball-manifest.json"))).toString("utf8"));

// 1) core: index, css, libs, main
for (const rel of [
  "index.html",
  "assets/css/app.css",
  "assets/css/AllerDisplay.css", "assets/css/CfCrackBold.css", "assets/css/impact.css",
  "assets/css/impact2.css", "assets/css/impact3.css",
  "assets/lib/nape.min.js", "assets/lib/jquery-3.1.1.min.js", "assets/lib/easeljs-0.8.2.combined.js",
  "assets/lib/phaser.min.js", "assets/lib/phaser-cachebuster.min.js", "assets/lib/phaser-super-storage.min.js",
  "assets/lib/dragonBones.min.js", "assets/lib/pksl.js",
  "basketball_legends_2019.min.js",
]) await grab(rel);

// 2) fonts
for (const rel of [
  "assets/fonts/AllerDisplay/AllerDisplay.woff", "assets/fonts/AllerDisplay/AllerDisplay.woff2",
  "assets/fonts/CfCrackBold/cfcrackandbold.woff", "assets/fonts/CfCrackBold/cfcrackandbold.woff2",
  "assets/fonts/Impact/impact.woff", "assets/fonts/Impact/impact.woff2",
  "assets/fonts/Impact2/impact.woff", "assets/fonts/Impact2/impact.woff2",
  "assets/fonts/Impact3/impact.woff", "assets/fonts/Impact3/impact.woff2",
]) await grab(rel);

// 3) atlases (png + json)
for (const name of manifest.atlases) {
  await grab(`assets/atlases/${name}.png`);
  await grab(`assets/atlases/${name}.json`);
}

// 4) images
for (const name of manifest.images) {
  await grab(`assets/images/${name}.png`);
}

// 5) sounds (ogg + mp3 + m4a)
for (const name of manifest.sounds) {
  await grab(`assets/sound/${name}.ogg`);
  await grab(`assets/sound/${name}.mp3`);
  await grab(`assets/sound/${name}.m4a`);
}

await writeFile(join(outputRoot, "MIRROR-MANIFEST.json"), JSON.stringify({
  name: "Basketball Stars",
  sourcePage: "https://poki.com/en/g/basketball-stars",
  sourceBase,
  engine: "Phaser + Nape physics",
  mirroredAt: new Date().toISOString(),
  files,
  integrationFiles: [
    { assetPath: "index.html", purpose: "Local bridge, network lock and ad client; Poki SDK removed" },
    { assetPath: "js/tiptap-platform-bridge.js", purpose: "Score reporting + lifecycle" },
    { assetPath: "js/poki-sdk-shim.js", purpose: "Fail-closed local PokiSDK replacement" },
    { assetPath: "preload-manifest.json", purpose: "Critical boot asset set" },
  ],
}, null, 2) + "\n");
process.stdout.write(`DONE: ${files.length} files, ${missing.length} missing\n`);
for (const m of missing) process.stdout.write(`  MISSING: ${m}\n`);
