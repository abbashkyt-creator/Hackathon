import { createServer as createHttpServer } from "node:http";
import { resolve } from "node:path";
import express from "express";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { Store } from "./db.js";

const config = loadConfig();
const store = new Store(config);
await store.init();
await store.cleanup();

const app = createApp(config, store);
const httpServer = createHttpServer(app);

if (config.NODE_ENV === "production") {
  const clientPath = resolve(process.cwd(), "dist");
  app.use(express.static(clientPath, { maxAge: "1h", index: false }));
  app.get(/.*/, (_req, res) => res.sendFile(resolve(clientPath, "index.html")));
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server: httpServer } },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const server = httpServer.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Tip Tap Games is running on http://0.0.0.0:${config.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}; shutting down.`);
  server.close(async () => {
    await store.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
