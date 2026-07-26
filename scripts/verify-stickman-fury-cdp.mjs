const cdpPort = Number(process.env.STICKMAN_CDP_PORT || 9232);
const appUrl = process.env.STICKMAN_URL || "http://127.0.0.1:3110/?game=stickman-fury";
const targets = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((response) => response.json());
const target = targets.find((entry) => entry.type === "page");
if (!target) throw new Error(`No page target on CDP port ${cdpPort}`);

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let sequence = 0;
const pending = new Map();
const requests = [];
const failures = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(String(event.data));
  if (message.id && pending.has(message.id)) {
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
    return;
  }
  if (message.method === "Network.requestWillBeSent") requests.push(message.params.request.url);
  if (message.method === "Network.loadingFailed") failures.push(message.params);
});

function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (!pending.has(id)) return;
      pending.delete(id);
      reject(new Error(`Timed out: ${method}`));
    }, 15_000);
  });
}

await call("Page.enable");
await call("Runtime.enable");
await call("Network.enable");
await call("Page.navigate", { url: appUrl });
await new Promise((resolve) => setTimeout(resolve, 12_000));

const expression = `(() => {
  const frame = document.querySelector('iframe[title="Play Stickman Fury"]');
  const game = frame && frame.contentWindow;
  const canvas = frame && frame.contentDocument && frame.contentDocument.querySelector('#canvas');
  return {
    url: location.href,
    cardActive: document.querySelector('[data-game="stickman-fury"]')?.getAttribute('data-active'),
    framePresent: Boolean(frame),
    frameVisible: Boolean(frame && getComputedStyle(frame).display !== 'none'),
    readyClass: Boolean(frame && frame.classList.contains('is-ready')),
    gameState: game && game.gameState,
    currentLevel: game && game.currentLevelIdx,
    canvasWidth: canvas && canvas.width,
    canvasHeight: canvas && canvas.height,
    hasTouchHandlers: Boolean(game && game.userInput && game.userInput.canvas),
    hasKeyboardRuntime: Boolean(game && game.userInput),
    muted: game && game.muted
  };
})()`;
const runtime = await call("Runtime.evaluate", {
  expression,
  returnByValue: true,
  awaitPromise: true,
});

const nonLocalRequests = requests.filter((url) => {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:", "ws:", "wss:"].includes(parsed.protocol)) return false;
    return !["127.0.0.1", "localhost"].includes(parsed.hostname);
  } catch {
    return true;
  }
});

console.log(
  JSON.stringify(
    {
      runtime: runtime.result.value,
      requestCount: requests.length,
      nonLocalRequests: [...new Set(nonLocalRequests)],
      failedRequests: failures.map((failure) => ({
        errorText: failure.errorText,
        blockedReason: failure.blockedReason,
      })),
    },
    null,
    2,
  ),
);
socket.close();
