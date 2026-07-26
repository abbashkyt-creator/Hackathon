const port = Number(process.env.CDP_PORT || 9264);
const x = Number(process.env.INPUT_X || 930);
const y = Number(process.env.INPUT_Y || 900);
const touch = process.env.INPUT_TYPE === "touch";
const dragToX = Number(process.env.DRAG_TO_X);
const dragToY = Number(process.env.DRAG_TO_Y);
const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
const page = pages.find((item) => item.type === "page" && item.url.includes("johnny-trigger-sniper"));
if (!page) throw new Error(`Johnny Trigger page not found on CDP ${port}`);

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
function send(method, params) {
  const commandId = ++id;
  socket.send(JSON.stringify({ id: commandId, method, params }));
  return new Promise((resolve, reject) => {
    const listener = (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== commandId) return;
      socket.removeEventListener("message", listener);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
    socket.addEventListener("message", listener);
  });
}

if (touch) {
  await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (Number.isFinite(dragToX) && Number.isFinite(dragToY)) {
    for (let step = 1; step <= 8; step += 1) {
      const progress = step / 8;
      await send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{
          x: x + (dragToX - x) * progress,
          y: y + (dragToY - y) * progress,
        }],
      });
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
} else {
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await new Promise((resolve) => setTimeout(resolve, 120));
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
}
console.log(JSON.stringify({
  input: touch ? "touch" : "mouse",
  x,
  y,
  dragTo: Number.isFinite(dragToX) && Number.isFinite(dragToY) ? { x: dragToX, y: dragToY } : null,
  target: page.url,
}));
socket.close();
