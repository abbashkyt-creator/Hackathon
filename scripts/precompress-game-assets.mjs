import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { brotliCompressSync, constants } from "node:zlib";

const gamesRoot = resolve(import.meta.dirname, "..", "dist", "games");
const compressibleExtensions = new Set([".css", ".gb", ".html", ".js", ".json", ".svg"]);
const minimumBytes = 1_024;
let sourceBytes = 0;
let compressedBytes = 0;
let sidecars = 0;

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(filePath);
      continue;
    }
    if (
      entry.name.endsWith(".br") ||
      !compressibleExtensions.has(extname(entry.name).toLowerCase()) ||
      statSync(filePath).size < minimumBytes
    ) {
      continue;
    }

    const source = readFileSync(filePath);
    const compressed = brotliCompressSync(source, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 6,
        [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_GENERIC,
      },
    });
    if (compressed.length >= source.length * 0.98) continue;

    writeFileSync(`${filePath}.br`, compressed);
    sourceBytes += source.length;
    compressedBytes += compressed.length;
    sidecars += 1;
  }
}

visit(gamesRoot);

const savedPercent = sourceBytes
  ? Math.round((1 - compressedBytes / sourceBytes) * 1_000) / 10
  : 0;
console.log(
  `Precompressed ${sidecars} game assets with Brotli (${savedPercent}% smaller across eligible files).`,
);
