import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sourceBase = "https://0e9dcadf-1c75-4c53-a211-b93f4423212a.gdn.poki.com/2f05f3fa-ed09-41a0-b971-b57ffa82cef9/";
const outputRoot = join(process.cwd(), "public", "games", "slice-master");
const HEADERS = { Referer: "https://poki.com/", Origin: "https://poki.com" };
const files = [];

async function grab(rel) {
  const target = join(outputRoot, ...rel.split("/"));
  if (existsSync(target)) {
    files.push({ assetPath: rel, bytes: 0, sha256: "cached" });
    return;
  }
  const response = await fetch(new URL(rel, sourceBase), { headers: HEADERS });
  if (!response.ok) throw new Error(`${rel}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
  files.push({ assetPath: rel, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
  process.stdout.write(`mirrored ${rel} (${bytes.length} B)\n`);
}

// all asset urls from config.json
const config = JSON.parse((await readFile(join(outputRoot, "config.json"))).toString("utf8"));
const urls = new Set();
for (const asset of Object.values(config.assets ?? {})) {
  if (asset?.file?.url) urls.add(asset.file.url.replace(/^\//, ""));
}
for (const rel of [...urls].sort()) {
  if (rel.startsWith("files/") || rel === "__game-scripts.js") await grab(rel);
}

const integrationFiles = [];
for (const rel of ["index.html", "js/tiptap-platform-bridge.js", "preload-manifest.json", "NOTICE.txt"]) {
  const bytes = await readFile(join(outputRoot, ...rel.split("/")));
  integrationFiles.push({ assetPath: rel, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
}

await writeFile(join(outputRoot, "MIRROR-MANIFEST.json"), JSON.stringify({
  name: "Slice Master",
  sourcePage: "https://poki.com/en/g/slice-master",
  sourceBase,
  engine: "PlayCanvas",
  mirroredAt: new Date().toISOString(),
  files,
  integrationFiles,
}, null, 2) + "\n");
process.stdout.write(`DONE: ${files.length} files\n`);
