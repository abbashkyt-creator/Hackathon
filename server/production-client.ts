import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import express, { type Express } from "express";

const GAME_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

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

    res.type(sourcePath);
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
  app.get(/.*/, (_req, res) => res.sendFile(resolve(clientPath, "index.html")));
}
