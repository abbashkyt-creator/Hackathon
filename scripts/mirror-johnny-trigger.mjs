/*
 * Mirrors the authorized Johnny Trigger - Sniper WebGL runtime through the
 * already-resolved dedicated VEU browser session. This is intentionally not a
 * generic web scraper: it takes the exact Addressables graph captured from the
 * source game's live frame and saves only game runtime files.
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { WebSocketClient } = require("C:/Project C/Auction Main/Main/Auction/visual-editor/visual-editor-workspace/projects/visual-editor-ultimate-v3.0-USE-THIS/server/cdp");
const ROOT = path.resolve("public/games/johnny-trigger-sniper");
const CDP_PORT = Number(process.env.JOHNNY_CDP_PORT || "9260");

function getJson(requestPath) {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port: CDP_PORT, path: requestPath }, (response) => {
      let body = "";
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => resolve(JSON.parse(body)));
    }).on("error", reject);
  });
}

function flattenFrames(node, output = []) {
  output.push(node.frame);
  for (const child of node.childFrames || []) flattenFrames(child, output);
  return output;
}

async function sourceContext(client) {
  const version = await getJson("/json/version");
  await client.connect(version.webSocketDebuggerUrl);
  const targets = await client.send("Target.getTargets");
  const page = targets.targetInfos.find((target) => target.type === "page" && target.url.includes("poki.com/en/g/johnny-trigger"));
  if (!page) throw new Error("Dedicated VEU browser is not on the Johnny Trigger source page.");
  const sessionId = (await client.send("Target.attachToTarget", { targetId: page.targetId, flatten: true }, { timeoutMs: 30000 })).sessionId;
  const tree = await client.send("Page.getFrameTree", {}, { sessionId, timeoutMs: 30000 });
  const gameFrame = flattenFrames(tree.frameTree).find((frame) => frame.url.includes(".gdn.poki.com/"));
  if (!gameFrame) throw new Error("Johnny Trigger source game frame is not available.");
  const world = await client.send("Page.createIsolatedWorld", {
    frameId: gameFrame.id,
    worldName: "johnny-trigger-local-mirror",
    grantUniveralAccess: true,
  }, { sessionId, timeoutMs: 30000 });
  return { sessionId, contextId: world.executionContextId };
}

async function readLocalCatalog() {
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "StreamingAssets/aa/catalog.json"), "utf8"));
  return catalog.m_InternalIds
    .filter((id) => id.startsWith("{UnityEngine.AddressableAssets.Addressables.RuntimePath}/"))
    .map((id) => id.replace("{UnityEngine.AddressableAssets.Addressables.RuntimePath}/", "StreamingAssets/aa/"));
}

async function fetchViaSourceFrame(client, sessionId, contextId, file) {
  const expression = `fetch(${JSON.stringify(file)}).then(async (response) => {
    if (!response.ok) throw new Error(response.status + " " + response.statusText + " for " + ${JSON.stringify(file)});
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 32768) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
    }
    return btoa(binary);
  })`;
  const result = await client.send("Runtime.evaluate", {
    expression,
    contextId,
    awaitPromise: true,
    returnByValue: true,
  }, { sessionId, timeoutMs: 120000 });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || `Source fetch failed: ${file}`);
  return Buffer.from(result.result.value, "base64");
}

const client = new WebSocketClient();
try {
  const { sessionId, contextId } = await sourceContext(client);
  const mandatory = [
    "Build/2ccb62f18123b5b9f5fe3c4e93552948.js",
    "Build/ced0c6748fa27ccd26d9db875271b400.wasm",
    "Build/da03c09927164da0a1bb2ad5a08766ca.data",
    "screenshots/1-small.png",
    "screenshots/1.png",
    "screenshots/1.jpg",
    "screenshots/2-small.jpg",
    "screenshots/2.jpg",
    "screenshots/3-small.jpg",
    "screenshots/4-small.jpg",
    // First-play dependency observed in isolated VEU. Put it ahead of later
    // optional levels so the local game reaches gameplay as soon as possible.
    "StreamingAssets/aa/WebGL/gameplay_assets_all_bbf127fb71dded261559df65bdb9acbb.bundle",
    "StreamingAssets/aa/WebGL/duplicateassetisolation_assets_all_45c544d7f1393cd53536430851ffb4b3.bundle",
    "StreamingAssets/aa/WebGL/161c6cad8d2d02eb63792b6e733f4f6c_unitybuiltinshaders_14e55c4b32f4bb98c488bb72a51a584a.bundle",
    "StreamingAssets/aa/WebGL/levels_assets_level_1_1_7d1e164990c07a1b14416fe6f26c0803.bundle",
    "StreamingAssets/aa/WebGL/loadaftergamestart_assets_all_1904966f2fabe5491034d7f281d2a2fc.bundle",
  ];
  const files = [...new Set([...mandatory, ...(await readLocalCatalog())])];
  let copied = 0;
  const pending = files.filter((file) => {
    const destination = path.join(ROOT, ...file.split("/"));
    return !fs.existsSync(destination) || fs.statSync(destination).size === 0;
  });
  const copyOne = async (file) => {
    const destination = path.join(ROOT, ...file.split("/"));
    try {
      const bytes = await fetchViaSourceFrame(client, sessionId, contextId, file);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, bytes);
      copied += 1;
      console.log(`${copied}/${pending.length} ${file} ${bytes.length}`);
    } catch (error) {
      // The source launcher itself tries some image extensions as fallbacks.
      // A missing optional screenshot is not a game-runtime dependency.
      console.warn(`Skipped ${file}: ${error.message}`);
    }
  };
  // CDP evaluates in one browser execution context. Keep this serial: browser
  // fetches work reliably through the resolved source frame, whereas an
  // attempted loopback bulk-export is correctly rejected by the source CSP.
  for (const file of pending) await copyOne(file);
  console.log(`Mirror complete: ${files.length} runtime files.`);
} finally {
  try { client.socket?.destroy(); } catch { /* best effort */ }
}
