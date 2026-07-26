import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { brotliCompressSync, brotliDecompressSync, constants } from "node:zlib";

const buildRoot = "public/games/theft-city/Build";
const files = [
  "8bc556d41883b6be8f80213b91efe600.data",
  "979af833673a60ff35395c80a3587e2f.framework.js",
  "2350b7d1bb3972d0e9fb9dd7afee2404.wasm",
];

for (const name of files) {
  const sourcePath = `${buildRoot}/${name}`;
  const outputPath = `${sourcePath}.br`;
  const source = readFileSync(sourcePath);
  const compressed = brotliCompressSync(source, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 7,
      [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_GENERIC,
    },
  });
  const restored = brotliDecompressSync(compressed);
  if (!source.equals(restored)) throw new Error(`Lossless verification failed for ${name}`);
  writeFileSync(outputPath, compressed);
  console.log(`${basename(sourcePath)} ${source.length} -> ${compressed.length}`);
}
