import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sourceBase = "https://5dd31a47-015f-11ea-ad56-9cb6d0d995f7.gdn.poki.com/c2887dba-49c6-43bc-9f8b-d25fe0c42b67/";
const outputRoot = join(process.cwd(), "public", "games", "master-chess");
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

// 1) index + css + js modules (38 refs)
const index = (await readFile(join(process.cwd(), "tmp", "masterchess", "index.html"))).toString("utf8");
const refs = [...new Set([...index.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]))]
  .filter(r => !r.startsWith("//") && !r.startsWith("http") && !r.includes("poki-sdk"));
for (const rel of refs) await grab(rel);

// 2) sprites (46)
const manifest = JSON.parse((await readFile(join(process.cwd(), "tmp", "masterchess", "manifest.json"))).toString("utf8"));
for (const rel of manifest.sprites) await grab(rel);

// 3) sounds (mp3 + ogg)
for (const name of manifest.sounds) {
  await grab(`sounds/${name}.mp3`);
  await grab(`sounds/${name}.ogg`);
}

await writeFile(join(outputRoot, "MIRROR-MANIFEST.json"), JSON.stringify({
  name: "Master Chess",
  sourcePage: "https://poki.com/en/g/master-chess",
  sourceBase,
  engine: "CreateJS",
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
