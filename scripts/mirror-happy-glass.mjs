import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sourceBase = "https://5cac4523-71ea-476e-8acc-a6cb9c25cc06.gdn.poki.com/d30b371c-de2c-47b1-bb2f-4324f6395542/";
const outputRoot = join(process.cwd(), "public", "games", "happy-glass");
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

// 1) Unity core files
for (const rel of [
  "Build/2034c3a3f31fb182d5dab076c578d580.framework.js.br",
  "Build/95d6764c749dfc845fdc8176ba7206d7.data.br",
  "Build/a4ab965b7735e46ca3f22b32204cb8c5.wasm.br",
  "Build/e40682cd4a2e8826aa72fb3216daf773.loader.js",
  "StreamingAssets/AdAdaptersData.json",
  "StreamingAssets/aa/catalog.json",
  "StreamingAssets/aa/settings.json",
]) {
  await grab(rel);
}

// 2) ALL 80 Addressables bundles listed in the catalog (levels, fonts, cosmetics...)
const catalog = JSON.parse((await readFile(join(outputRoot, "StreamingAssets/aa/catalog.json"))).toString("utf8"));
const ids = catalog.m_InternalIds ?? [];
const bundles = [...new Set(
  ids
    .filter((i) => i.includes("{UnityEngine.AddressableAssets.Addressables.RuntimePath}/WebGL/"))
    .map((i) => "StreamingAssets/aa/WebGL/" + i.split("/WebGL/")[1])
)];
process.stdout.write(`enumerated ${bundles.length} addressable bundles\n`);
for (const rel of bundles.sort()) {
  await grab(rel);
}

await writeFile(join(outputRoot, "MIRROR-MANIFEST.json"), JSON.stringify({
  name: "Happy Glass",
  sourcePage: "https://poki.com/en/g/happy-glass",
  sourceBase,
  engine: "Unity WebGL (Addressables)",
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
