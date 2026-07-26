import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, normalize, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const gamesRoot = join(root, "public", "games");
const errors = [];

function fail(message) {
  errors.push(message);
}

function requireFile(path, label = path) {
  if (!existsSync(path) || !statSync(path).isFile()) fail(`Missing ${label}`);
}

function pngSize(path) {
  const data = readFileSync(path);
  if (data.length < 24 || data.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

for (const name of readdirSync(gamesRoot)) {
  const gameRoot = join(gamesRoot, name);
  if (name.startsWith("_") || !statSync(gameRoot).isDirectory()) continue;

  const indexPath = join(gameRoot, "index.html");
  const noticePath = join(gameRoot, "NOTICE.txt");
  const mirrorPath = join(gameRoot, "MIRROR-MANIFEST.json");
  const preloadPath = join(gameRoot, "preload-manifest.json");
  requireFile(indexPath, `${name}/index.html`);
  requireFile(noticePath, `${name}/NOTICE.txt`);
  requireFile(mirrorPath, `${name}/MIRROR-MANIFEST.json`);
  requireFile(preloadPath, `${name}/preload-manifest.json`);
  if (!existsSync(indexPath) || !existsSync(preloadPath)) continue;

  const html = readFileSync(indexPath, "utf8");
  const lockPosition = html.indexOf('src="/games/_shared/network-lock.js"');
  const firstScriptPosition = html.search(/<script\b[^>]*\bsrc=/i);
  if (lockPosition < 0 || lockPosition !== firstScriptPosition + '<script '.length) {
    fail(`${name}/index.html must load /games/_shared/network-lock.js before every other script`);
  }
  if (/\b(?:src|href|action)\s*=\s*["']https?:\/\//i.test(html)) {
    fail(`${name}/index.html contains an external resource URL`);
  }
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=/i.test(script[1]) && script[2].trim()) {
      fail(`${name}/index.html contains executable inline script blocked by production CSP`);
    }
  }

  try {
    const mirror = JSON.parse(readFileSync(mirrorPath, "utf8"));
    for (const entry of mirror.integrationFiles ?? []) {
      if (
        typeof entry.assetPath !== "string" ||
        entry.assetPath.includes("..") ||
        typeof entry.bytes !== "number" ||
        typeof entry.sha256 !== "string"
      ) {
        fail(`${name}/MIRROR-MANIFEST.json has an invalid integration file record`);
        continue;
      }
      const integrationPath = normalize(join(gameRoot, entry.assetPath));
      if (!integrationPath.startsWith(`${normalize(gameRoot)}${sep}`)) {
        fail(`${name} integration file escapes its game directory: ${entry.assetPath}`);
        continue;
      }
      requireFile(integrationPath, `${name} integration file ${entry.assetPath}`);
      if (!existsSync(integrationPath)) continue;
      const bytes = readFileSync(integrationPath);
      const sha256 = createHash("sha256").update(bytes).digest("hex");
      if (bytes.length !== entry.bytes || sha256 !== entry.sha256) {
        fail(`${name} integration file provenance is stale: ${entry.assetPath}`);
      }
    }
  } catch {
    fail(`${name}/MIRROR-MANIFEST.json is not valid JSON`);
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(preloadPath, "utf8"));
  } catch {
    fail(`${name}/preload-manifest.json is not valid JSON`);
    continue;
  }
  if (!Array.isArray(manifest.critical) || manifest.critical.length === 0) {
    fail(`${name}/preload-manifest.json needs at least one critical asset`);
    continue;
  }
  for (const url of manifest.critical) {
    if (typeof url !== "string" || !url.startsWith("/games/") || url.includes("..")) {
      fail(`${name} has an unsafe preload entry: ${String(url)}`);
      continue;
    }
    const diskPath = normalize(join(root, "public", url));
    const allowedRoot = `${normalize(gamesRoot)}${sep}`;
    if (!diskPath.startsWith(allowedRoot)) {
      fail(`${name} preload escapes public/games: ${url}`);
    } else {
      requireFile(diskPath, `${name} preload ${url}`);
    }
  }
}

const manifestPath = join(root, "public", "manifest.webmanifest");
requireFile(manifestPath);
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const icon of manifest.icons ?? []) {
    const iconPath = join(root, "public", icon.src.replace(/^\//, ""));
    requireFile(iconPath, `PWA icon ${icon.src}`);
    if (existsSync(iconPath) && icon.type === "image/png") {
      const size = pngSize(iconPath);
      const expected = /^(\d+)x(\d+)$/.exec(icon.sizes ?? "");
      if (!size || !expected || size.width !== Number(expected[1]) || size.height !== Number(expected[2])) {
        fail(`PWA icon dimensions do not match manifest: ${icon.src}`);
      }
    }
  }
}

const serviceWorkerPath = join(root, "public", "sw.js");
requireFile(serviceWorkerPath);
if (existsSync(serviceWorkerPath)) {
  const serviceWorker = readFileSync(serviceWorkerPath, "utf8");
  if (!serviceWorker.includes("gameCacheKey") || !serviceWorker.includes("inflightGameFetches")) {
    fail("Service worker must normalize copied-game cache keys and deduplicate warm-up requests");
  }
}

const replitPath = join(root, ".replit");
requireFile(replitPath);
if (existsSync(replitPath)) {
  const replit = readFileSync(replitPath, "utf8");
  if (!replit.includes('build = "npm run build"')) fail(".replit deployment build command is wrong");
  if (!replit.includes('run = "npm start"')) fail(".replit deployment run command is wrong");
}

const packagePath = join(root, "package.json");
requireFile(packagePath);
requireFile(join(root, "scripts", "precompress-game-assets.mjs"));
if (existsSync(packagePath)) {
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  if (!packageJson.scripts?.build?.includes("precompress-game-assets.mjs")) {
    fail("Production build must generate Brotli game sidecars");
  }
}

if (errors.length) {
  console.error(`Release audit failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log("Release audit passed: copied-game isolation contract, preload assets, PWA icons, and Replit commands.");
