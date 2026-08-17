#!/usr/bin/env node
/**
 * ingest-all.mjs — resilient mass-ingestion of ALL Poki games.
 * Tracks progress, supports resume, handles Chrome crashes.
 * Usage: node scripts/auto/ingest-all.mjs [--workers 2] [--resume] [--limit N]
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { sweepIngestChromes } from "./lib/cdp.mjs";

const ROOT = "C:/Project C/Hackation";
const PROGRESS_PATH = join(ROOT, "tmp", "ingest-all-progress.json");
const SLUGS_PATH = join(ROOT, "tmp", "all-poki-slugs.txt");

// Parse args
const workersIdx = process.argv.indexOf("--workers");
let workers = workersIdx >= 0 ? Number(process.argv[workersIdx + 1]) : 2;
if (!Number.isFinite(workers) || workers < 1) workers = 2;
if (workers > 2) workers = 2;
const doResume = process.argv.includes("--resume");
const limitIdx = process.argv.indexOf("--limit");
const limit = limitIdx >= 0 ? Number(process.argv[limitIdx + 1]) : Infinity;

// Load slug list
const allSlugs = readFileSync(SLUGS_PATH, "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));

// Load or create progress
let progress = { startedAt: null, games: {}, summary: {} };
if (doResume && existsSync(PROGRESS_PATH)) {
  try { progress = JSON.parse(readFileSync(PROGRESS_PATH, "utf8")); } catch {}
  console.log(`Resuming: ${Object.keys(progress.games).length} already processed`);
}

// Filter to unprocessed slugs
const todo = allSlugs.filter(s => {
  if (limit <= 0) return false;
  const status = progress.games[s];
  if (status && (status.ok || status.error?.includes("UNSUITABLE"))) return false;
  return true;
}).slice(0, limit);

if (!progress.startedAt) progress.startedAt = new Date().toISOString();

const totalDone = allSlugs.length - todo.length;
console.log(`\n=== Poki Mass Ingestion ===`);
console.log(`Total Poki games: ${allSlugs.length}`);
console.log(`Already processed: ${totalDone}`);
console.log(`To ingest: ${todo.length}`);
console.log(`Workers: ${workers}`);
console.log(`Resume: ${doResume}`);
console.log(`========================\n`);

sweepIngestChromes();

function saveProgress() {
  const okCount = Object.values(progress.games).filter(g => g.ok).length;
  const failCount = Object.values(progress.games).filter(g => !g.ok).length;
  progress.summary = { total: allSlugs.length, processed: Object.keys(progress.games).length, ok: okCount, fail: failCount, remaining: allSlugs.length - Object.keys(progress.games).length, finishedAt: new Date().toISOString() };
  writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
}

let done = 0, succeed = 0, failed = 0;
const startTime = Date.now();

function runOne(slug) {
  return new Promise(resolve => {
    const args = [join(ROOT, "scripts", "auto", "ingest-game.mjs"), slug, "--skip-verify"];
    const p = spawn(process.execPath, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    const timeout = setTimeout(() => { try { p.kill("SIGKILL"); } catch {} }, 300_000); // 5 min timeout
    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => out += d);
    p.on("close", code => {
      clearTimeout(timeout);
      let parsed = null;
      try { parsed = JSON.parse(out.slice(out.indexOf("{"))); } catch {}
      const ok = code === 0 && parsed?.ok !== false;
      const error = parsed?.error || (code !== 0 ? `exit ${code}` : null);

      progress.games[slug] = {
        ok,
        error: error || null,
        stages: parsed?.stages?.map(s => s.name + (s.ok ? ":ok" : ":fail")) || [],
        finishedAt: new Date().toISOString()
      };

      done++;
      if (ok) { succeed++; } else { failed++; }

      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const rate = done / (elapsed / 60);
      const eta = Math.round((todo.length - done) / Math.max(rate, 0.1));
      console.log(`[${succeed}/${done}/${failed}] ${slug} ${ok ? "OK" : "FAIL: " + (error || "").slice(0, 100)} (${elapsed}s, ~${eta}m left)`);

      // Save progress every 10 games
      if (done % 10 === 0) saveProgress();
      resolve();
    });
    p.on("error", () => { clearTimeout(timeout); progress.games[slug] = { ok: false, error: "spawn error" }; done++; fail++; resolve(); });
  });
}

async function main() {
  let cursor = 0;
  const promises = new Set();

  while (cursor < todo.length || promises.size > 0) {
    // Launch workers up to limit
    while (promises.size < workers && cursor < todo.length) {
      const slug = todo[cursor++];
      const p = runOne(slug).finally(() => promises.delete(p));
      promises.add(p);
    }
    // Wait for at least one to finish
    if (promises.size > 0) await Promise.race([...promises]);
  }

  sweepIngestChromes();
  saveProgress();

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== COMPLETE ===`);
  console.log(`OK: ${succeed}, Failed: ${failed}, Total: ${done}`);
  console.log(`Time: ${Math.round(elapsed / 60)}m ${elapsed % 60}s`);
  console.log(`Progress saved to: ${PROGRESS_PATH}`);
}

main().catch(e => { console.error("Fatal:", e); saveProgress(); process.exit(1); });
