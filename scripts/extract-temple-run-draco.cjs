/* Pull the already-captured Babylon Draco decoder from the VEU HAR. */
const fs = require("node:fs");
const path = require("node:path");

const [harPath, outputPath] = process.argv.slice(2);
if (!harPath || !outputPath) throw new Error("Usage: node scripts/extract-temple-run-draco.cjs <capture.har> <output.wasm>");

const har = JSON.parse(fs.readFileSync(harPath, "utf8"));
const entry = har.log.entries.find((item) => item.request?.url === "https://cdn.babylonjs.com/draco_decoder_gltf.wasm");
if (!entry?.response?.content?.text) throw new Error("Captured Draco decoder was not found");
const bytes = Buffer.from(entry.response.content.text, "base64");
if (bytes.subarray(0, 4).toString("ascii") !== "\0asm") throw new Error("Captured decoder is not valid WASM");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, bytes);
console.log(JSON.stringify({ outputPath, bytes: bytes.length }));
