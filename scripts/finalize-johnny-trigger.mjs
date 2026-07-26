import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("public/games/johnny-trigger-sniper");
const ignored = new Set(["MIRROR-MANIFEST.json", "preload-manifest.json"]);

function walk(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? walk(path.join(directory, entry.name), relative) : [relative];
  });
}

const allFiles = walk(root).filter((file) => !ignored.has(file)).sort();
const catalog = JSON.parse(readFileSync(path.join(root, "StreamingAssets/aa/catalog.json"), "utf8"));
const catalogFiles = [...new Set(catalog.m_InternalIds
  .filter((id) => id.startsWith("{UnityEngine.AddressableAssets.Addressables.RuntimePath}/"))
  .map((id) => id.replace("{UnityEngine.AddressableAssets.Addressables.RuntimePath}/", "StreamingAssets/aa/")))];
const missing = catalogFiles.filter((file) => !allFiles.includes(file));
if (missing.length) throw new Error(`Missing ${missing.length} catalog files:\n${missing.join("\n")}`);

const localAdaptations = new Set([
  "index.html",
  "tiptap-config.js",
  "tiptap-platform-bridge.js",
  "tiptap-unity-2020.js",
  "Torus-Regular.ttf",
  "NOTICE.txt",
]);

const files = allFiles.map((assetPath) => {
  const absolute = path.join(root, ...assetPath.split("/"));
  const bytes = readFileSync(absolute);
  return {
    assetPath,
    provenance: localAdaptations.has(assetPath) ? "Tip Tap integration" : "Authorized source-game mirror",
    bytes: statSync(absolute).size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
});

const manifest = {
  name: "Johnny Trigger - Sniper Game",
  sourcePage: "https://poki.com/en/g/johnny-trigger-sniper-game",
  sourceRoot: "https://994568e9-1512-4e00-a24d-e431e3eae6b1.gdn.poki.com/1642d4b2-69f2-40ac-b15f-44bbefebb761/",
  gameId: "994568e9-1512-4e00-a24d-e431e3eae6b1",
  gameVersionId: "1642d4b2-69f2-40ac-b15f-44bbefebb761",
  sourceDeveloper: "SayGames",
  capturedWith: "Dedicated Visual Editor Ultimate source session (server 3487 / isolated CDP 9264)",
  verifiedOn: "2026-07-26",
  runtime: "Unity 2022.3.18f1 WebGL with Addressables",
  catalogAudit: {
    catalogRuntimeFiles: catalogFiles.length,
    includedCatalogRuntimeFiles: catalogFiles.length,
    missingCatalogRuntimeFiles: 0,
  },
  excluded: [
    "Poki page shell and host wrapper",
    "Poki SDK",
    "advertising",
    "analytics and tracking",
    "remote identity, sharing, and leaderboards",
  ],
  localAdaptations: [
    "network-lock is the first executable script",
    "Poki SDK calls use an ad-free local lifecycle bridge",
    "rewarded ads resolve false because no reward ad is shown",
    "runtime and every Addressables catalog file are served same-origin",
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
    "/games/johnny-trigger-sniper/index.html",
    "/games/johnny-trigger-sniper/tiptap-platform-bridge.js",
    "/games/johnny-trigger-sniper/tiptap-config.js",
    "/games/johnny-trigger-sniper/tiptap-unity-2020.js",
    "/games/johnny-trigger-sniper/Build/jt-sniper-v2022.3.18f1-store-v1_0_0-build40.loader.js",
    "/games/johnny-trigger-sniper/Build/2ccb62f18123b5b9f5fe3c4e93552948.js",
    "/games/johnny-trigger-sniper/Build/ced0c6748fa27ccd26d9db875271b400.wasm",
    "/games/johnny-trigger-sniper/Build/da03c09927164da0a1bb2ad5a08766ca.data",
    "/games/johnny-trigger-sniper/StreamingAssets/aa/settings.json",
    "/games/johnny-trigger-sniper/StreamingAssets/aa/catalog.json",
    "/games/johnny-trigger-sniper/StreamingAssets/aa/WebGL/gameplay_assets_all_bbf127fb71dded261559df65bdb9acbb.bundle",
    "/games/johnny-trigger-sniper/StreamingAssets/aa/WebGL/duplicateassetisolation_assets_all_45c544d7f1393cd53536430851ffb4b3.bundle",
    "/games/johnny-trigger-sniper/StreamingAssets/aa/WebGL/levels_assets_level_1_1_7d1e164990c07a1b14416fe6f26c0803.bundle",
  ],
};

writeFileSync(path.join(root, "MIRROR-MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(path.join(root, "preload-manifest.json"), `${JSON.stringify(preload, null, 2)}\n`);
console.log(JSON.stringify({
  files: files.length,
  bytes: files.reduce((sum, file) => sum + file.bytes, 0),
  catalogRuntimeFiles: catalogFiles.length,
  missing: missing.length,
}, null, 2));
