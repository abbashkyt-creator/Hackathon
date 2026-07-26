import { writeFile } from "node:fs/promises";

const port = Number(process.env.CDP_PORT || 9261);
const output = process.env.SCREENSHOT_PATH;
const pages = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json());
const page = pages.find((item) => item.type === "page" && item.url.includes("johnny-trigger-sniper"))
  || pages.find((item) => item.type === "page" && item.url.startsWith("http://127.0.0.1:3103/"));
if (!page) throw new Error(`Tip Tap page not found on CDP ${port}`);

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);
  if (message.error) waiter.reject(new Error(message.error.message));
  else waiter.resolve(message.result);
});

function command(method, params = {}, timeout = 60_000) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`${method} timed out`));
    }, timeout);
    pending.set(id, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
  });
}

const expression = `JSON.stringify({
  href: location.href,
  title: document.title,
  readyState: document.readyState,
  canvas: !!document.querySelector("#game"),
  canvasSize: (() => {
    const canvas = document.querySelector("#game");
    return canvas ? { width: canvas.width, height: canvas.height } : null;
  })(),
  johnnyFrame: document.querySelector('iframe[src*="johnny-trigger-sniper"]')?.getAttribute("src") || null,
  gameFrames: Array.from(document.querySelectorAll("iframe.game-arena")).map((frame) => frame.getAttribute("src")),
  unity: !!window.unityGame,
  bridge: window.pokiBridge || null,
  pokiReady: !!window.PokiSDK,
  blocked: window.__TIPTAP_BLOCKED_NETWORK__ || [],
  external: performance.getEntriesByType("resource")
    .map((entry) => entry.name)
    .filter((url) => !url.startsWith(location.origin) && !url.startsWith("data:") && !url.startsWith("blob:"))
})`;

if (output) {
  const screenshot = await command("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  }, 120_000);
  await writeFile(output, Buffer.from(screenshot.data, "base64"));
}

let evaluated;
if (process.env.SKIP_EVAL === "1") {
  console.log(JSON.stringify({ href: page.url, title: page.title, screenshotCaptured: Boolean(output) }));
  ws.close();
  process.exit(0);
}
try {
  evaluated = await command("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: false,
  }, 30_000);
  console.log(evaluated.result?.value || JSON.stringify(evaluated));
} catch (error) {
  console.log(JSON.stringify({
    href: page.url,
    title: page.title,
    screenshotCaptured: Boolean(output),
    evaluationError: error.message,
  }));
}
ws.close();
