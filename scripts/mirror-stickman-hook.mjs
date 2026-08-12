import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sourceBase = "https://5dd30ab4-015f-11ea-ad56-9cb6d0d995f7.gdn.poki.com/a9b6d9fd-0b47-4682-9649-0e95c2d95625/";
const outputRoot = join(process.cwd(), "public", "games", "stickman-hook");
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

// 1) core
for (const rel of ["index.html", "bundle.js"]) await grab(rel);

// 2) every asset referenced by the bundle (1126 files)
const refs = JSON.parse((await readFile(join(process.cwd(), "tmp", "stickmanhook-refs.json"))).toString("utf8"));
process.stdout.write(`enumerated ${refs.length} bundle refs\n`);
for (const rel of refs) await grab(rel);

// 3) the parent-relative backgroundPopupFlipped (../../assets/images/png/ -> assets/images/png/)
await grab("assets/images/png/backgroundPopupFlipped.png");

await writeFile(join(outputRoot, "MIRROR-MANIFEST.json"), JSON.stringify({
  name: "Stickman Hook",
  sourcePage: "https://poki.com/en/g/stickman-hook",
  sourceBase,
  engine: "HTML5 canvas (custom)",
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
