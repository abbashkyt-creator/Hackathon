import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sourceBase = "https://5dd28e51-015f-11ea-ad56-9cb6d0d995f7.gdn.poki.com/47a81ce0-7223-495d-be4a-41778fafb74f/";
const outputRoot = join(process.cwd(), "public", "games", "penalty-shooters-2");
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

// 1) scripts + core (from index.html + network capture)
for (const rel of [
  "index.html", "style.css", "select.css", "appmanifest.json",
  "data.json", "box2d.wasm", "box2d.wasm.js",
  "scripts/modernjscheck.js", "scripts/supportcheck.js", "scripts/offlineclient.js",
  "scripts/main.js", "scripts/c3runtime.js", "scripts/register-sw.js", "scripts/c3main.js",
  "scripts/objRefTable.js", "scripts/project/javaScriptInEvents.js",
  "scripts/plugins/skymen_pokiSDK/c3runtime/main.js",
  "scripts/plugins/skymen_pokiSDK/instance.js",
  "scripts/plugins/skymen_pokiSDK/plugin.js",
  "scripts/plugins/skymen_pokiSDK/type.js",
  "scripts/plugins/skymen_pokiSDK/c3runtime/domSide.js",
]) await grab(rel);

// 2) images (38)
const manifest = JSON.parse((await readFile(join(process.cwd(), "tmp", "penalty2", "asset-manifest.json"))).toString("utf8"));
for (const rel of manifest.images) await grab(rel);

// 3) audio (7)
for (const rel of manifest.audios) await grab(rel);

await writeFile(join(outputRoot, "MIRROR-MANIFEST.json"), JSON.stringify({
  name: "Penalty Shooters 2",
  sourcePage: "https://poki.com/en/g/penalty-shooters-2",
  sourceBase,
  engine: "Construct 3 (box2d wasm)",
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
