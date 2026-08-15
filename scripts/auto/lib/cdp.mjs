#!/usr/bin/env node
/**
 * lib/cdp.mjs — minimal CDP driver for the Tip Tap auto-ingest pipeline.
 * Dedicated headless Chrome per task with random ports and sweep-on-launch/close.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const usedPorts = new Set();

export async function pickPort() {
  for (let i = 0; i < 50; i++) {
    const port = 10000 + Math.floor(Math.random() * 30000);
    if (usedPorts.has(port)) continue;
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1500) }); if (r.ok) continue; } catch {}
    usedPorts.add(port);
    return port;
  }
  throw new Error("no free CDP port");
}

export function sweepIngestChromes() {
  try {
    execFileSync("powershell", ["-NoProfile", "-Command",
      "Get-CimInstance Win32_Process|Where-Object{$_.Name -eq 'chrome.exe'-and $_.CommandLine -like '*tiptap-ingest*'}|ForEach-Object{Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue}"
    ], { stdio: "ignore", timeout: 20000 });
  } catch {}
}

export async function launch({ userDataDir } = {}) {
  sweepIngestChromes();
  const port = await pickPort();
  const profileDir = userDataDir || join(tmpdir(), `tiptap-ingest-${port}-${Date.now()}`);
  mkdirSync(profileDir, { recursive: true });
  const args = [`--remote-debugging-port=${port}`, `--user-data-dir=${profileDir}`,
    "--headless=new", "--no-first-run", "--no-default-browser-check", "--disable-sync",
    "--disable-extensions", "--disable-background-networking", "--disable-component-update",
    "--disable-client-side-phishing-detection", "--disable-breakpad", "--disable-default-apps",
    "--no-service-autorun", "--no-pings", "--metrics-recording-only", "--mute-audio",
    "--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessChecks,PrivateNetworkAccessSendPreflights,PrivateNetworkAccessRespectPreflightResults",
    "about:blank"];
  const proc = spawn(CHROME, args, { stdio: "ignore", detached: false });
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  const version = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
  if (!version.webSocketDebuggerUrl) throw new Error("CDP failed");
  return {
    port, pid: proc.pid, profileDir, wsUrl: version.webSocketDebuggerUrl,
    close() {
      try { execFileSync("taskkill", ["/PID", String(proc.pid), "/T", "/F"], { stdio: "ignore" }); } catch {}
      try { proc.kill(); } catch {}
      try {
        const ps = `Get-CimInstance Win32_Process|Where-Object{$_.Name -eq 'chrome.exe'-and $_.CommandLine -like '*${profileDir}*'}|ForEach-Object{Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue}`;
        execFileSync("powershell", ["-NoProfile", "-Command", ps], { stdio: "ignore", timeout: 20000 });
      } catch {}
    },
  };
}

export class CdpPage {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.nid = 1; this.pending = new Map(); this.ev = new Map(); }
  async open() {
    await new Promise((ok, fail) => { this.ws.addEventListener("open", ok, { once: true }); this.ws.addEventListener("error", fail, { once: true }); });
    this.ws.addEventListener("message", ev => { const m = JSON.parse(ev.data); const p = this.pending.get(m.id); if (p) { this.pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } else { (this.ev.get(m.method) || []).forEach(h => h(m.params)); } });
  }
  cmd(method, params = {}, timeout = 60000) {
    const id = this.nid++; this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok, fail) => { const t = setTimeout(() => { this.pending.delete(id); fail(new Error(`${method} timeout ${timeout}ms`)); }, timeout); this.pending.set(id, { resolve: v => { clearTimeout(t); ok(v); }, reject: e => { clearTimeout(t); fail(e); } }); });
  }
  on(method, handler) { (this.ev.get(method) ?? this.ev.set(method, [])).get(method).push(handler); }
  close() { try { this.ws.close(); } catch {} }
}

export async function newPage(browser) {
  const target = await fetch(`http://127.0.0.1:${browser.port}/json/new?about:blank`, { method: "PUT" }).then(r => r.json());
  const page = new CdpPage(target.webSocketDebuggerUrl);
  await page.open();
  await page.cmd("Page.enable");
  await page.cmd("Network.enable");
  await page.cmd("Runtime.enable");
  return page;
}