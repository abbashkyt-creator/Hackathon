import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Stamp a unique build id into the built service worker so its bytes change on
// every deploy. The browser then always detects a new worker, activates it, and
// purges the previous build's caches — the backbone of the app's auto-update.
const swPath = resolve(process.cwd(), "dist", "sw.js");

if (!existsSync(swPath)) {
  console.warn("stamp-sw-build: dist/sw.js not found; skipping.");
  process.exit(0);
}

let build;
try {
  build = execSync("git rev-parse --short HEAD", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
} catch {
  build = "";
}
// Fall back to a timestamp when git is unavailable, and always append a short
// build timestamp so a redeploy of the same commit still refreshes clients.
build = `${build || "nogit"}-${Date.now().toString(36)}`;

const source = readFileSync(swPath, "utf8");
if (!source.includes("__TIPTAP_BUILD__")) {
  console.warn("stamp-sw-build: placeholder already replaced; skipping.");
  process.exit(0);
}
writeFileSync(swPath, source.replaceAll("__TIPTAP_BUILD__", build));
console.log(`stamp-sw-build: service worker build id = ${build}`);
