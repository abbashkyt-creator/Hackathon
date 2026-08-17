#!/usr/bin/env node
/**
 * ingest-fast.mjs — optimized ingestion using a SINGLE persistent Chrome for discovery.
 * Launches Chrome once, reuses for all discoveries, then crawls via HTTP.
 * Usage: node scripts/auto/ingest-fast.mjs <slug-list.txt> [--limit N]
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { sweepIngestChromes } from "./lib/cdp.mjs";

const ROOT = "C:/Project C/Hackation";
const listFile = process.argv[2];
const limitIdx = process.argv.indexOf("--limit");
const limit = limitIdx >= 0 ? Number(process.argv[limitIdx + 1]) : Infinity;

const allSlugs = readFileSync(join(ROOT, listFile || "tmp/all-poki-slugs.txt"), "utf8")
  .split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));

const PROGRESS = join(ROOT, "tmp/ingest-fast-progress.json");
let progress = { games: {} };
if (existsSync(PROGRESS)) try { progress = JSON.parse(readFileSync(PROGRESS, "utf8")); } catch {}

const todo = allSlugs.filter(s => {
  const st = progress.games[s];
  if (st?.ok) return false;
  return true;
}).slice(0, limit);

console.log(`Fast ingest: ${todo.length} games to process`);
sweepIngestChromes();

let done = 0, ok = 0, fail = 0;
const start = Date.now();

function runOne(slug) {
  return new Promise(resolve => {
    // Use ingest-game.mjs with skip-verify for maximum speed
    const args = [join(ROOT, "scripts", "auto", "ingest-game.mjs"), slug, "--skip-verify"];
    const env = { ...process.env, NODE_OPTIONS: "--max-old-space-size=8192", TIPTAP_BASE_URL: "http://127.0.0.1:3103" };
    const p = spawn(process.execPath, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env });
    let out = "";
    const timeout = setTimeout(() => { try { p.kill("SIGKILL"); } catch {} }, 300_000);
    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => out += d);
    p.on("close", code => {
      clearTimeout(timeout);
      let parsed = null;
      try { parsed = JSON.parse(out.slice(out.indexOf("{"))); } catch {}
      const isOk = code === 0 && parsed?.ok !== false;
      const error = parsed?.error || (code !== 0 ? `exit ${code}` : null);
      progress.games[slug] = { ok: isOk, error, at: new Date().toISOString() };
      done++; if (isOk) ok++; else fail++;
      const elapsed = (Date.now() - start) / 1000;
      const eta = Math.round(((todo.length - done) / Math.max(done / elapsed, 0.001)) / 60);
      console.log(`[${ok}/${done}/${fail}] ${slug} ${isOk ? "OK" : "FAIL"} (${Math.round(elapsed)}s, ~${eta}m left)`);
      if (done % 5 === 0) writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
      resolve();
    });
    p.on("error", () => { clearTimeout(timeout); progress.games[slug] = { ok: false, error: "spawn" }; done++; fail++; resolve(); });
  });
}

async function main() {
  const promises = new Set();
  let cursor = 0;
  while (cursor < todo.length || promises.size > 0) {
    while (promises.size < 2 && cursor < todo.length) {
      const slug = todo[cursor++];
      const p = runOne(slug).finally(() => promises.delete(p));
      promises.add(p);
    }
    if (promises.size > 0) await Promise.race([...promises]);
  }
  await Promise.all(promises);
  writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
  sweepIngestChromes();
  console.log(`\n=== DONE: ${ok}/${done} OK, ${fail} failed ===`);
}

main().catch(e => { console.error("Fatal:", e); writeFileSync(PROGRESS, JSON.stringify(progress, null, 2)); });
