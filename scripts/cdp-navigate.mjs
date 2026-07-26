const port = Number(process.env.CDP_PORT || 9264);
const targetUrl = process.env.NAVIGATE_URL;
if (!targetUrl) throw new Error("NAVIGATE_URL is required");
const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
const page = pages.find((item) => item.type === "page" && item.url.includes("johnny-trigger-sniper"))
  || pages.find((item) => item.type === "page" && item.url.startsWith("http://127.0.0.1:3103/"));
if (!page) throw new Error(`Tip Tap page not found on CDP ${port}`);

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
socket.send(JSON.stringify({ id: 1, method: "Page.navigate", params: { url: targetUrl } }));
await new Promise((resolve, reject) => {
  const listener = (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== 1) return;
    socket.removeEventListener("message", listener);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  };
  socket.addEventListener("message", listener);
});
console.log(JSON.stringify({ navigated: true, targetUrl }));
socket.close();
