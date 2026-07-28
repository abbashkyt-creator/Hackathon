import type { GameSlug } from "./types";

interface GameRuntime {
  embedded: boolean;
  preloadManifest?: string;
  assetManifest?: string;
  warmFullMirror?: boolean;
  prepareByMount?: boolean;
}

const RUNTIMES: Partial<Record<GameSlug, GameRuntime>> = {
  "subway-surfers": {
    embedded: true,
    preloadManifest: "/games/subway-surfers/preload-manifest.json",
    assetManifest: "/games/subway-surfers/MIRROR-MANIFEST.json",
  },
  "dino-runner": {
    embedded: true,
    preloadManifest: "/games/dino-game/preload-manifest.json",
    assetManifest: "/games/dino-game/MIRROR-MANIFEST.json",
  },
  "arithmetica": {
    embedded: true,
    preloadManifest: "/games/arithmetica/preload-manifest.json",
    assetManifest: "/games/arithmetica/MIRROR-MANIFEST.json",
  },
  "67-game": {
    embedded: true,
    preloadManifest: "/games/67-game/preload-manifest.json",
    assetManifest: "/games/67-game/MIRROR-MANIFEST.json",
  },
  "archery-king": {
    embedded: true,
    preloadManifest: "/games/archery-king/preload-manifest.json",
    assetManifest: "/games/archery-king/MIRROR-MANIFEST.json",
  },
  "smash-room": {
    embedded: true,
    preloadManifest: "/games/smash-room/preload-manifest.json",
    assetManifest: "/games/smash-room/MIRROR-MANIFEST.json",
  },
  "temple-run-2-frozen-shadows": {
    embedded: true,
    preloadManifest: "/games/temple-run-2-frozen-shadows/preload-manifest.json",
    assetManifest: "/games/temple-run-2-frozen-shadows/MIRROR-MANIFEST.json",
  },
  "stickman-fury": {
    embedded: true,
    preloadManifest: "/games/stickman-fury/preload-manifest.json",
    assetManifest: "/games/stickman-fury/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "plonky": {
    embedded: true,
    preloadManifest: "/games/plonky/preload-manifest.json",
    assetManifest: "/games/plonky/MIRROR-MANIFEST.json",
  },
  "fruit-ninja": {
    embedded: true,
    preloadManifest: "/games/fruit-ninja/preload-manifest.json",
    assetManifest: "/games/fruit-ninja/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "count-control-legends": {
    embedded: true,
    preloadManifest: "/games/count-control-legends/preload-manifest.json",
    assetManifest: "/games/count-control-legends/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "johnny-trigger-sniper": {
    embedded: true,
    preloadManifest: "/games/johnny-trigger-sniper/preload-manifest.json",
    assetManifest: "/games/johnny-trigger-sniper/MIRROR-MANIFEST.json",
    prepareByMount: true,
    // This Unity catalog contains hundreds of later-level Addressables.
    // Downloading all of them while the visible card boots delays Mission 1.
    warmFullMirror: false,
  },
  "rocket-soccer-derby": {
    embedded: true,
    preloadManifest: "/games/rocket-soccer-derby/preload-manifest.json",
    assetManifest: "/games/rocket-soccer-derby/MIRROR-MANIFEST.json",
    prepareByMount: true,
    // A complete Unity match build is ~55 MB. The active card gets first use
    // of the connection; only the immediately upcoming game can boot early.
    warmFullMirror: false,
  },
  "kitty-loves-birds-2": { embedded: true },
  "theft-city": {
    embedded: true,
    preloadManifest: "/games/theft-city/preload-manifest.json",
    assetManifest: "/games/theft-city/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "city-cab-rush": {
    embedded: true,
    preloadManifest: "/games/city-cab-rush/preload-manifest.json",
    assetManifest: "/games/city-cab-rush/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "supercar-legends": {
    embedded: true,
    preloadManifest: "/games/supercar-legends/preload-manifest.json",
    assetManifest: "/games/supercar-legends/MIRROR-MANIFEST.json",
  },
  "ping-pong-go": {
    embedded: true,
    preloadManifest: "/games/ping-pong-go/preload-manifest.json",
    assetManifest: "/games/ping-pong-go/MIRROR-MANIFEST.json",
  },
  "ping-pong-bugs": {
    embedded: true,
    preloadManifest: "/games/ping-pong-go/preload-manifest.json",
    assetManifest: "/games/ping-pong-go/MIRROR-MANIFEST.json",
  },
};

const warmTasks = new Map<GameSlug, Promise<void>>();

export function isEmbeddedGame(slug: GameSlug): boolean {
  return RUNTIMES[slug]?.embedded === true;
}

interface BrowserConnection {
  saveData?: boolean;
  effectiveType?: string;
}

function browserConnection(): BrowserConnection | undefined {
  return (
    navigator as Navigator & {
      connection?: BrowserConnection;
    }
  ).connection;
}

function connectionIsConstrained(): boolean {
  const connection = browserConnection();
  return Boolean(
    connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g",
  );
}

/**
 * Give the visible game uncontested bandwidth first. Returning null disables
 * speculative work on data-saver/2G connections; the next game will still
 * mount normally as soon as the player scrolls to it.
 */
export function warmAheadDelayMs(): number | null {
  const connection = browserConnection();
  if (
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return null;
  }
  return connection?.effectiveType === "3g" ? 7_000 : 3_500;
}

export function shouldPrepareByMount(slug: GameSlug): boolean {
  return RUNTIMES[slug]?.prepareByMount === true;
}

async function fetchForWarmCache(url: string): Promise<void> {
  const target = new URL(url, window.location.origin);
  if (target.origin !== window.location.origin || !target.pathname.startsWith("/games/")) return;
  try {
    await fetch(target, { cache: "force-cache", credentials: "same-origin" });
  } catch {
    // Warming is opportunistic; the active game still owns its normal error UI.
  }
}

function localAssetUrl(manifestUrl: string, assetPath: string): string | null {
  if (!assetPath || assetPath.includes("..") || /^[a-z]+:/i.test(assetPath)) return null;
  const base = new URL("./", new URL(manifestUrl, window.location.origin));
  const target = new URL(assetPath.replace(/^\/+/, ""), base);
  if (target.origin !== window.location.origin || !target.pathname.startsWith("/games/")) {
    return null;
  }
  return target.pathname;
}

async function collectWarmUrls(slug: GameSlug): Promise<string[]> {
  const runtime = RUNTIMES[slug];
  const manifestUrl = runtime?.preloadManifest;
  if (!manifestUrl) return [];

  const response = await fetch(manifestUrl, {
    cache: "force-cache",
    credentials: "same-origin",
  });
  if (!response.ok) return [];
  const manifest = (await response.json()) as { critical?: unknown };
  const critical = Array.isArray(manifest.critical)
    ? manifest.critical.filter((url): url is string => typeof url === "string")
    : [];

  if (connectionIsConstrained()) return critical.slice(0, 1);
  // Critical manifests are the intentionally bounded first-play set. Mirroring
  // every captured file is opt-in only: several catalogs contain later levels
  // and tens of megabytes that should never compete with the visible game.
  if (!runtime.assetManifest || runtime.warmFullMirror !== true) return critical;

  const assetResponse = await fetch(runtime.assetManifest, {
    cache: "force-cache",
    credentials: "same-origin",
  });
  if (!assetResponse.ok) return critical;
  const assetManifest = (await assetResponse.json()) as {
    files?: Array<{ assetPath?: unknown }>;
    integrationFiles?: Array<{ assetPath?: unknown }>;
  };
  const mirrored = [...(assetManifest.files ?? []), ...(assetManifest.integrationFiles ?? [])]
    .map((entry) =>
      typeof entry.assetPath === "string"
        ? localAssetUrl(runtime.assetManifest!, entry.assetPath)
        : null,
    )
    .filter((url): url is string => Boolean(url));

  return [...new Set([...critical, ...mirrored])];
}

async function warmGameOnce(slug: GameSlug): Promise<void> {
  try {
    const urls = await collectWarmUrls(slug);
    if (!urls.length) return;

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "WARM_GAME", urls });
      return;
    }

    for (let index = 0; index < urls.length; index += 3) {
      await Promise.all(urls.slice(index, index + 3).map(fetchForWarmCache));
    }
  } catch {
    // A failed warm-up must never prevent the feed itself from loading.
  }
}

export function warmGame(slug: GameSlug): Promise<void> {
  const existing = warmTasks.get(slug);
  if (existing) return existing;
  const task = warmGameOnce(slug);
  warmTasks.set(slug, task);
  return task;
}
