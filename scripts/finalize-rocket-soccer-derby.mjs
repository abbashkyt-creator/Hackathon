import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("public/games/rocket-soccer-derby");
const ignored = new Set(["MIRROR-MANIFEST.json", "preload-manifest.json"]);

function walk(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? walk(path.join(directory, entry.name), relative) : [relative];
  });
}

const integrationFiles = new Set([
  "index.html",
  "NOTICE.txt",
  "tiptap-config.js",
  "tiptap-platform-bridge.js",
  "tiptap-bootstrap.js",
]);
const files = walk(root).filter((file) => !ignored.has(file)).sort().map((assetPath) => {
  const absolute = path.join(root, ...assetPath.split("/"));
  const content = readFileSync(absolute);
  return {
    assetPath,
    provenance: integrationFiles.has(assetPath) ? "Tip Tap integration" : "Authorized source-game mirror",
    bytes: statSync(absolute).size,
    sha256: createHash("sha256").update(content).digest("hex"),
  };
});

const manifest = {
  name: "Rocket Soccer Derby",
  sourcePage: "https://www.zgames.io/game/rocket-soccer-derby",
  sourceRoot: "https://freedomgamingzone.github.io/rocket-soccer-derby/file/",
  sourceDeveloper: "Destruction Crew",
  capturedWith: "Dedicated Visual Editor Ultimate source session (server 3456 / isolated CDP 9222)",
  verifiedOn: new Date().toISOString().slice(0, 10),
  runtime: "Unity WebGL (legacy UnityLoader)",
  excluded: [
    "zGames page shell and advertising",
    "Poki SDK and Poki network probes",
    "analytics, tracking, and external identity",
    "Unity cloud analytics and remote telemetry",
  ],
  localAdaptations: [
    "network-lock is the first executable script",
    "Poki lifecycle calls resolve through a local no-ad bridge",
    "source Unity telemetry is answered by an inert local data response",
    "the original Unity loader and all required build payloads are served same-origin",
  ],
  limitations: [
    "No verified source score callback is forwarded; the game remains unranked.",
    "Public GitHub and Replit redistribution remains subject to the rights holder permission represented by the project owner.",
  ],
  files,
};

const preload = {
  critical: [
    "/games/_shared/network-lock.js",
    "/games/rocket-soccer-derby/index.html",
    "/games/rocket-soccer-derby/tiptap-platform-bridge.js",
    "/games/rocket-soccer-derby/tiptap-config.js",
    "/games/rocket-soccer-derby/tiptap-bootstrap.js",
    "/games/rocket-soccer-derby/UnityLoader.js",
    "/games/rocket-soccer-derby/Build/RSD 1.1.0rc4.json",
    "/games/rocket-soccer-derby/Build/RSD 1.1.0rc4.wasm.framework.unityweb",
    "/games/rocket-soccer-derby/Build/RSD 1.1.0rc4.wasm.code.unityweb",
    "/games/rocket-soccer-derby/Build/RSD 1.1.0rc4.data.unityweb",
  ],
};

writeFileSync(path.join(root, "MIRROR-MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(path.join(root, "preload-manifest.json"), `${JSON.stringify(preload, null, 2)}\n`);
console.log(JSON.stringify({ files: files.length, bytes: files.reduce((sum, file) => sum + file.bytes, 0) }, null, 2));
