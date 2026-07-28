import { existsSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import express, { type Express } from "express";

// Game binaries are large and rarely change, so cache them a day — but keep the
// stale-serve window short so a deploy that DID change a game file (or a client
// whose service worker was removed) can't be stuck on week-old bytes. The
// service worker revalidates these on every new build regardless.
const GAME_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=600";

export function attachProductionClient(app: Express, clientPath = resolve(process.cwd(), "dist")) {
  const gamesPath = resolve(clientPath, "games");
  const gamesPrefix = `${gamesPath}${sep}`;

  app.use("/games", (req, res, next) => {
    if (!["GET", "HEAD"].includes(req.method) || !/\bbr\b/.test(req.get("Accept-Encoding") ?? "")) {
      next();
      return;
    }

    let sourcePath: string;
    try {
      sourcePath = resolve(gamesPath, `.${decodeURIComponent(req.path)}`);
    } catch {
      next();
      return;
    }
    if (sourcePath !== gamesPath && !sourcePath.startsWith(gamesPrefix)) {
      next();
      return;
    }

    const brotliPath = `${sourcePath}.br`;
    if (!existsSync(sourcePath) || !existsSync(brotliPath)) {
      next();
      return;
    }

    // Derive the MIME from the extension only. Passing the full filesystem path
    // to res.type() makes Express treat the "/"-containing string as a literal
    // Content-Type, so brotli-precompressed scripts were served with a file-path
    // Content-Type and (under nosniff) refused execution — black-screening games.
    res.type(extname(sourcePath) || "application/octet-stream");
    res.setHeader("Content-Encoding", "br");
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Cache-Control", GAME_CACHE_CONTROL);
    res.sendFile(brotliPath);
  });

  app.use(
    "/games",
    express.static(gamesPath, {
      index: false,
      maxAge: "1d",
      setHeaders: (res) => {
        res.setHeader("Cache-Control", GAME_CACHE_CONTROL);
      },
    }),
  );
  app.use(
    express.static(clientPath, {
      maxAge: "1h",
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("sw.js") || filePath.endsWith("manifest.webmanifest")) {
          res.setHeader("Cache-Control", "no-cache");
        } else if (filePath.startsWith(resolve(clientPath, "assets"))) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );
  // The app shell must always revalidate so a deploy's new hashed asset
  // references are picked up immediately (the assets themselves are immutable).
  app.get(/.*/, (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(resolve(clientPath, "index.html"));
  });
}
