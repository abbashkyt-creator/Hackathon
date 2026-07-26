/* Restore the two large GLB bodies VEU recorded but could not include in the
 * HAR export. They were already received by the isolated Chrome profile and
 * are Brotli-compressed in Chromium's cache. */
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const [cacheDir, outputDir] = process.argv.slice(2);
if (!cacheDir || !outputDir) {
  throw new Error("Usage: node scripts/recover-temple-run-cache-assets.cjs <cache-dir> <output-dir>");
}

const recovered = [
  { cacheFile: "f_00001f", assetPath: "assets/tracks/Arctic/Base/base_pack_1.glb", compressedBytes: 980591 },
  { cacheFile: "f_000031", assetPath: "assets/tracks/Arctic/Base/base_pack_2.glb", compressedBytes: 3386897 },
];

for (const item of recovered) {
  const compressed = fs.readFileSync(path.join(cacheDir, item.cacheFile));
  if (compressed.length !== item.compressedBytes) throw new Error(`Unexpected cache entry size for ${item.cacheFile}`);
  const bytes = zlib.brotliDecompressSync(compressed);
  if (bytes.subarray(0, 4).toString("ascii") !== "glTF") throw new Error(`Cache entry ${item.cacheFile} is not a GLB`);
  const destination = path.join(outputDir, item.assetPath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
  item.bytes = bytes.length;
}

console.log(JSON.stringify({ recovered }));
