/*
 * Mirrors the exact Rocket Soccer Derby Unity WebGL runtime that VEU captured
 * from the source frame. The URLs below are the completed, audited game-file
 * graph; this script never contacts the zGames shell, Poki, ads, analytics,
 * or Unity telemetry.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourceRoot = "https://freedomgamingzone.github.io/rocket-soccer-derby/file/";
const root = path.resolve("public/games/rocket-soccer-derby");
const files = [
  "UnityLoader.js",
  "Build/RSD 1.1.0rc4.json",
  "Build/RSD 1.1.0rc4.wasm.code.unityweb",
  "Build/RSD 1.1.0rc4.wasm.framework.unityweb",
  "Build/RSD 1.1.0rc4.data.unityweb",
];

for (const file of files) {
  const response = await fetch(new URL(file, sourceRoot));
  if (!response.ok) throw new Error(`Source download failed: ${response.status} ${response.statusText} for ${file}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const destination = path.join(root, ...file.split("/"));
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, bytes);
  console.log(`${file} ${bytes.length}`);
}
