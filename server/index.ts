import { createServer as createHttpServer } from "node:http";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { Store } from "./db.js";
import { attachProductionClient } from "./production-client.js";

const config = loadConfig();
const store = new Store(config);
await store.init();
await store.cleanup();

const app = createApp(config, store);
const httpServer = createHttpServer(app);

// Let isolated acceptance runs exercise the built client with the real local
// API/SQLite stack, without weakening production's PostgreSQL requirement or
// paying Vite/HMR overhead while large WebGL assets stream.
if (config.NODE_ENV === "production" || config.PREVIEW_PRODUCTION_CLIENT) {
  attachProductionClient(app);
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

setInterval(() => {
  void store.cleanup().catch((error) => {
    console.error("Cleanup failed:", error);
  });
}, 60 * 60 * 1000);

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
