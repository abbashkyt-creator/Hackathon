#!/usr/bin/env node
/**
 * ingest-batch.mjs — parallel batch runner.
 * Usage: node scripts/auto/ingest-batch.mjs slugs.txt [--workers 4] [--verify]
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sweepIngestChromes } from "./lib/cdp.mjs";
const ROOT = "C:/Project C/Hackation";
const listFile = process.argv[2];
if (!listFile) { console.error("usage: ingest-batch.mjs slugs.txt [--workers N] [--verify]"); process.exit(2); }
const workersIdx = process.argv.indexOf("--workers");
let workers = workersIdx >= 0 ? Number(process.argv[workersIdx + 1]) : 4;
if (!Number.isFinite(workers) || workers < 1) workers = 4;
if (workers > 2) { console.warn(`[ingest-batch] clamping workers ${workers} -> 2 (this machine OOMs with 4+ headless Chromes)`); workers = 2; }
const doVerify = process.argv.includes("--verify");
const catalog = readFileSync(join(ROOT,"shared","catalog.ts"),"utf8");
const slugs = readFileSync(listFile,"utf8").split(/\r?\n/).map(l=>l.trim()).filter(l=>l && !l.startsWith("#"));
const todo = slugs.filter(s=>!catalog.includes(`"${s}": {`));
console.log(`batch: ${slugs.length} listed, ${slugs.length-todo.length} already registered, ${todo.length} to ingest`);
sweepIngestChromes();
const report = { startedAt: new Date().toISOString(), games: [] };
let cursor = 0;
function runOne(slug) {
  return new Promise(resolve => {
    const args = [join(ROOT,"scripts","auto","ingest-game.mjs"),slug,...(doVerify?[]:["--skip-verify"])];
    const p = spawn(process.execPath, args, { cwd: ROOT, stdio: ["ignore","pipe","pipe"] });
    let out = ""; p.stdout.on("data",d=>out+=d); p.stderr.on("data",d=>out+=d);
    p.on("close",code => {
      let parsed=null; try { parsed=JSON.parse(out.slice(out.indexOf("{"))); } catch {}
      const entry = { slug, ok:code===0, exit:code, stages:parsed?.stages?.map(s=>({name:s.name,ok:s.ok}))||null, error:parsed?.error||code?out.slice(-200):null };
      report.games.push(entry);
      console.log(`[${entry.ok?"OK ":"FAIL"}] ${slug}${entry.error?" — "+entry.error.slice(0,120):""}`);
      resolve(entry);
    });
  });
}
async function main() {
  const running = [];
  while (cursor < todo.length) { while (running.length<workers && cursor<todo.length) { running.push(runOne(todo[cursor++])); } await Promise.race(running.map(p=>p.then(()=>running.splice(running.indexOf(p),1)))); }
  await Promise.all(running);
  report.finishedAt = new Date().toISOString();
  report.summary = { ingested:report.games.filter(g=>g.ok).length, failed:report.games.filter(g=>!g.ok).length, skipped:slugs.length-todo.length };
  sweepIngestChromes();
  const outPath = join(ROOT,"tmp","ingest-report.json");
  writeFileSync(outPath, JSON.stringify(report,null,2));
  console.log(`report: ${outPath}`);
  console.log(`summary: ${report.summary.ingested} ok, ${report.summary.failed} failed, ${report.summary.skipped} skipped`);
}
main();