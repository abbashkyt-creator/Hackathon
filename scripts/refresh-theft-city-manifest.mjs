import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = "public/games/theft-city";
const source = {
  title: "Theft City",
  developer: "Kwalee",
  sourcePage: "https://poki.com/en/g/theft-city",
  sourceGameId: "629eee0a-0c5c-469a-b388-7eb076f7054f",
  sourceVersionId: "1e5722e5-0d6a-43d7-8fbf-ecff22f44fe5",
};
const integrationNames = new Set([
  "index.html",
  "tiptap-shell.css",
  "tiptap-platform-bridge.js",
  "tiptap-bootstrap.js",
]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(root)
  .filter(
    (path) =>
      !path.endsWith("MIRROR-MANIFEST.json") &&
      !path.endsWith("preload-manifest.json") &&
      !path.endsWith(".partial"),
  )
  .map((path) => ({
    assetPath: relative(root, path).replaceAll("\\", "/"),
    bytes: statSync(path).size,
  }));

const integrationFiles = files
  .filter((entry) => integrationNames.has(entry.assetPath))
  .map((entry) => ({
    ...entry,
    sha256: createHash("sha256")
      .update(readFileSync(join(root, entry.assetPath)))
      .digest("hex"),
  }));

writeFileSync(
  join(root, "MIRROR-MANIFEST.json"),
  `${JSON.stringify({ source, files, integrationFiles }, null, 2)}\n`,
);

const critical = [
  "/games/_shared/network-lock.js",
  "/games/theft-city/index.html",
  "/games/theft-city/tiptap-shell.css",
  "/games/theft-city/tiptap-platform-bridge.js",
  "/games/theft-city/tiptap-bootstrap.js",
  "/games/theft-city/Build/c625c615e3bc7427873de64777c82fba.loader.js",
  "/games/theft-city/Build/979af833673a60ff35395c80a3587e2f.framework.js.br",
  "/games/theft-city/Build/2350b7d1bb3972d0e9fb9dd7afee2404.wasm.br",
  "/games/theft-city/Build/8bc556d41883b6be8f80213b91efe600.data.br",
  "/games/theft-city/StreamingAssets/aa/settings.json",
  "/games/theft-city/StreamingAssets/aa/catalog.bin",
];

writeFileSync(
  join(root, "preload-manifest.json"),
  `${JSON.stringify({ critical }, null, 2)}\n`,
);

console.log(
  `Refreshed Theft City manifest: ${files.length} files, ${files.reduce(
    (total, entry) => total + entry.bytes,
    0,
  )} bytes.`,
);
