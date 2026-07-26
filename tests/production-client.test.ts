import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { brotliCompressSync } from "node:zlib";
import express from "express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import compression from "compression";
import { attachProductionClient } from "../server/production-client";

describe("production client delivery", () => {
  let root: string;

  beforeEach(() => {
    root = join(tmpdir(), `tip-tap-static-${randomUUID()}`);
    mkdirSync(join(root, "games", "copy"), { recursive: true });
    mkdirSync(join(root, "assets"), { recursive: true });
    writeFileSync(join(root, "index.html"), "<!doctype html><title>Tip Tap</title>");
    writeFileSync(join(root, "sw.js"), "self.addEventListener('fetch',()=>{});");
    writeFileSync(join(root, "manifest.webmanifest"), "{}");
    writeFileSync(join(root, "assets", "index-ABC123.js"), "export default 1;");
    writeFileSync(join(root, "games", "copy", "data.json"), JSON.stringify({ data: "x".repeat(8_000) }));
    writeFileSync(
      join(root, "games", "copy", "model.gb"),
      Buffer.from("lossless-game-model-".repeat(1_000)),
    );
    writeFileSync(
      join(root, "games", "copy", "model.gb.br"),
      brotliCompressSync(Buffer.from("lossless-game-model-".repeat(1_000))),
    );
  });

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it("compresses copied game text and applies deliberate cache lifetimes", async () => {
    const app = express();
    app.use(compression());
    attachProductionClient(app, root);

    const game = await request(app)
      .get("/games/copy/data.json")
      .set("Accept-Encoding", "gzip")
      .expect(200);
    const worker = await request(app).get("/sw.js").expect(200);
    const hashedAsset = await request(app).get("/assets/index-ABC123.js").expect(200);

    expect(game.headers["content-encoding"]).toBe("gzip");
    expect(game.headers["cache-control"]).toBe(
      "public, max-age=86400, stale-while-revalidate=604800",
    );
    expect(worker.headers["cache-control"]).toBe("no-cache");
    expect(hashedAsset.headers["cache-control"]).toBe("public, max-age=31536000, immutable");
  });

  it("serves build-time Brotli game sidecars without changing the asset type", async () => {
    const app = express();
    app.use(compression());
    attachProductionClient(app, root);

    const game = await request(app)
      .get("/games/copy/model.gb")
      .set("Accept-Encoding", "br")
      .buffer(true)
      .expect(200);

    expect(game.headers["content-encoding"]).toBe("br");
    expect(game.headers.vary).toContain("Accept-Encoding");
    expect(game.headers["content-type"]).toContain("application/octet-stream");
    expect(game.headers["cache-control"]).toBe(
      "public, max-age=86400, stale-while-revalidate=604800",
    );
  });
});
