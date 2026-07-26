const port = Number(process.env.CDP_PORT || 9264);
const width = Number(process.env.VIEWPORT_WIDTH || 390);
const height = Number(process.env.VIEWPORT_HEIGHT || 844);
const mobile = process.env.MOBILE !== "0";
const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
const page = pages.find((item) => item.type === "page" && item.url.includes("johnny-trigger-sniper"));
if (!page) throw new Error(`Johnny Trigger page not found on CDP ${port}`);

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

const id = 1;
socket.send(JSON.stringify({
  id,
  method: "Emulation.setDeviceMetricsOverride",
  params: { width, height, deviceScaleFactor: 1, mobile },
}));
await new Promise((resolve, reject) => {
  const listener = (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== id) return;
    socket.removeEventListener("message", listener);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  };
  socket.addEventListener("message", listener);
});
console.log(JSON.stringify({ width, height, mobile, target: page.url }));
socket.close();
