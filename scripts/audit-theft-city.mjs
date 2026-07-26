import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "public/games/theft-city";
const mirror = JSON.parse(readFileSync(join(root, "MIRROR-MANIFEST.json"), "utf8"));
const preload = JSON.parse(readFileSync(join(root, "preload-manifest.json"), "utf8"));
const errors = [];

for (const entry of mirror.files) {
  const file = join(root, entry.assetPath);
  if (!existsSync(file) || statSync(file).size !== entry.bytes) {
    errors.push(`file:${entry.assetPath}`);
  }
}

for (const entry of mirror.integrationFiles) {
  const bytes = readFileSync(join(root, entry.assetPath));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== entry.bytes || hash !== entry.sha256) {
    errors.push(`hash:${entry.assetPath}`);
  }
}

for (const url of preload.critical) {
  if (!existsSync(join("public", url))) errors.push(`preload:${url}`);
}

const html = readFileSync(join(root, "index.html"), "utf8");
const lockAt = html.indexOf("/games/_shared/network-lock.js");
const bridgeAt = html.indexOf("tiptap-platform-bridge.js");
if (lockAt < 0 || bridgeAt < 0 || lockAt > bridgeAt) errors.push("network-lock-order");

for (const name of [
  "index.html",
  "tiptap-bootstrap.js",
  "tiptap-platform-bridge.js",
  "tiptap-shell.css",
]) {
  const source = readFileSync(join(root, name), "utf8");
  if (
    /(?:src|href)\s*=\s*["']https?:/i.test(source) ||
    /fetch\s*\(\s*["']https?:/i.test(source) ||
    /new WebSocket\s*\(\s*["']wss?:/i.test(source)
  ) {
    errors.push(`external-runtime:${name}`);
  }
}

console.log(
  JSON.stringify(
    {
      files: mirror.files.length,
      bytes: mirror.files.reduce((total, entry) => total + entry.bytes, 0),
      critical: preload.critical.length,
      errors,
    },
    null,
    2,
  ),
);

if (errors.length) process.exitCode = 1;
