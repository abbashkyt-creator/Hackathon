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
  "dig-out-of-prison": {
    embedded: true,
    preloadManifest: "/games/dig-out-of-prison/preload-manifest.json",
    assetManifest: "/games/dig-out-of-prison/MIRROR-MANIFEST.json",
    prepareByMount: true,
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
  "tic-tac-toe": {
    embedded: true,
    preloadManifest: "/games/tic-tac-toe/preload-manifest.json",
    assetManifest: "/games/tic-tac-toe/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "go-battle-2": {
    embedded: true,
    preloadManifest: "/games/go-battle-2/preload-manifest.json",
    assetManifest: "/games/go-battle-2/MANIFEST.json",
    prepareByMount: true,
  },
  "stickman-battle": {
    embedded: true,
    preloadManifest: "/games/stickman-battle/preload-manifest.json",
    assetManifest: "/games/stickman-battle/MANIFEST.json",
    prepareByMount: true,
  },
  "retro-bowl": {
    embedded: true,
    preloadManifest: "/games/retro-bowl/preload-manifest.json",
    assetManifest: "/games/retro-bowl/MANIFEST.json",
    prepareByMount: true,
  },
  "domino": { embedded: true, preloadManifest: "/games/domino/preload-manifest.json", assetManifest: "/games/domino/MIRROR-MANIFEST.json", prepareByMount: true },
  "foosball": { embedded: true, preloadManifest: "/games/foosball/preload-manifest.json", assetManifest: "/games/foosball/MIRROR-MANIFEST.json", prepareByMount: true },
  "ludo-hero": { embedded: true, preloadManifest: "/games/ludo-hero/preload-manifest.json", assetManifest: "/games/ludo-hero/MIRROR-MANIFEST.json", prepareByMount: true },
  "moto-x3m": { embedded: true, preloadManifest: "/games/moto-x3m/preload-manifest.json", assetManifest: "/games/moto-x3m/MIRROR-MANIFEST.json", prepareByMount: true },
  "bubble-storm": { embedded: true, preloadManifest: "/games/bubble-storm/preload-manifest.json", assetManifest: "/games/bubble-storm/MIRROR-MANIFEST.json", prepareByMount: true },
  "spider-solitaire": { embedded: true, preloadManifest: "/games/spider-solitaire/preload-manifest.json", assetManifest: "/games/spider-solitaire/MIRROR-MANIFEST.json", prepareByMount: true },
  "master-checkers": { embedded: true, preloadManifest: "/games/master-checkers/preload-manifest.json", assetManifest: "/games/master-checkers/MIRROR-MANIFEST.json", prepareByMount: true },
  "four-in-a-row": { embedded: true, preloadManifest: "/games/four-in-a-row/preload-manifest.json", assetManifest: "/games/four-in-a-row/MIRROR-MANIFEST.json", prepareByMount: true },
  "monkey-mart": { embedded: true, preloadManifest: "/games/monkey-mart/preload-manifest.json", assetManifest: "/games/monkey-mart/MIRROR-MANIFEST.json", prepareByMount: true },
  "eggy-car": { embedded: true, preloadManifest: "/games/eggy-car/preload-manifest.json", assetManifest: "/games/eggy-car/MIRROR-MANIFEST.json", prepareByMount: true },
  "tiny-fishing": { embedded: true, preloadManifest: "/games/tiny-fishing/preload-manifest.json", assetManifest: "/games/tiny-fishing/MIRROR-MANIFEST.json", prepareByMount: true },
  "beauty-salon": { embedded: true, preloadManifest: "/games/beauty-salon/preload-manifest.json", assetManifest: "/games/beauty-salon/MIRROR-MANIFEST.json", prepareByMount: true },
  "fashion-fix-studio": { embedded: true, preloadManifest: "/games/fashion-fix-studio/preload-manifest.json", assetManifest: "/games/fashion-fix-studio/MIRROR-MANIFEST.json", prepareByMount: true },
  "phone-case-diy": { embedded: true, preloadManifest: "/games/phone-case-diy/preload-manifest.json", assetManifest: "/games/phone-case-diy/MIRROR-MANIFEST.json", prepareByMount: true },
  "clean-house": { embedded: true, preloadManifest: "/games/clean-house/preload-manifest.json", assetManifest: "/games/clean-house/MIRROR-MANIFEST.json", prepareByMount: true },
  "stunt-bike-extreme": { embedded: true, preloadManifest: "/games/stunt-bike-extreme/preload-manifest.json", assetManifest: "/games/stunt-bike-extreme/MIRROR-MANIFEST.json", prepareByMount: true },
  "idle-lumber-inc": { embedded: true, preloadManifest: "/games/idle-lumber-inc/preload-manifest.json", assetManifest: "/games/idle-lumber-inc/MIRROR-MANIFEST.json", prepareByMount: true },
  "my-perfect-hotel": { embedded: true, preloadManifest: "/games/my-perfect-hotel/preload-manifest.json", assetManifest: "/games/my-perfect-hotel/MIRROR-MANIFEST.json", prepareByMount: true },
  "snapstyle-dress-up": { embedded: true, preloadManifest: "/games/snapstyle-dress-up/preload-manifest.json", assetManifest: "/games/snapstyle-dress-up/MIRROR-MANIFEST.json", prepareByMount: true },
  "brain-test-tricky-puzzles": { embedded: true, preloadManifest: "/games/brain-test-tricky-puzzles/preload-manifest.json", assetManifest: "/games/brain-test-tricky-puzzles/MIRROR-MANIFEST.json", prepareByMount: true },
  "little-farm-world": { embedded: true, preloadManifest: "/games/little-farm-world/preload-manifest.json", assetManifest: "/games/little-farm-world/MIRROR-MANIFEST.json", prepareByMount: true },
  "moms-diary-cooking-games": { embedded: true, preloadManifest: "/games/moms-diary-cooking-games/preload-manifest.json", assetManifest: "/games/moms-diary-cooking-games/MIRROR-MANIFEST.json", prepareByMount: true },
  "scary-teacher-hide-seek-games": { embedded: true, preloadManifest: "/games/scary-teacher-hide-seek-games/preload-manifest.json", assetManifest: "/games/scary-teacher-hide-seek-games/MIRROR-MANIFEST.json", prepareByMount: true },
  "demolition-simulator": { embedded: true, preloadManifest: "/games/demolition-simulator/preload-manifest.json", assetManifest: "/games/demolition-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "family-sort": { embedded: true, preloadManifest: "/games/family-sort/preload-manifest.json", assetManifest: "/games/family-sort/MIRROR-MANIFEST.json", prepareByMount: true },
  "kick-the-buddy": { embedded: true, preloadManifest: "/games/kick-the-buddy/preload-manifest.json", assetManifest: "/games/kick-the-buddy/MIRROR-MANIFEST.json", prepareByMount: true },
  "slime-keyboard-escape": { embedded: true, preloadManifest: "/games/slime-keyboard-escape/preload-manifest.json", assetManifest: "/games/slime-keyboard-escape/MIRROR-MANIFEST.json", prepareByMount: true },
  "dragon-the-dragon": { embedded: true, preloadManifest: "/games/dragon-the-dragon/preload-manifest.json", assetManifest: "/games/dragon-the-dragon/MIRROR-MANIFEST.json", prepareByMount: true },
  "pet-mahjong-3d": { embedded: true, preloadManifest: "/games/pet-mahjong-3d/preload-manifest.json", assetManifest: "/games/pet-mahjong-3d/MIRROR-MANIFEST.json", prepareByMount: true },
  "petnest-io": { embedded: true, preloadManifest: "/games/petnest-io/preload-manifest.json", assetManifest: "/games/petnest-io/MIRROR-MANIFEST.json", prepareByMount: true },
  "travel-merge": { embedded: true, preloadManifest: "/games/travel-merge/preload-manifest.json", assetManifest: "/games/travel-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "build-your-island": { embedded: true, preloadManifest: "/games/build-your-island/preload-manifest.json", assetManifest: "/games/build-your-island/MIRROR-MANIFEST.json", prepareByMount: true },
  "sandbox-of-elements": { embedded: true, preloadManifest: "/games/sandbox-of-elements/preload-manifest.json", assetManifest: "/games/sandbox-of-elements/MIRROR-MANIFEST.json", prepareByMount: true },
  "crowd-rush": { embedded: true, preloadManifest: "/games/crowd-rush/preload-manifest.json", assetManifest: "/games/crowd-rush/MIRROR-MANIFEST.json", prepareByMount: true },
  "harvest-loop": { embedded: true, preloadManifest: "/games/harvest-loop/preload-manifest.json", assetManifest: "/games/harvest-loop/MIRROR-MANIFEST.json", prepareByMount: true },
  "tiny-game-shop-tycoon": { embedded: true, preloadManifest: "/games/tiny-game-shop-tycoon/preload-manifest.json", assetManifest: "/games/tiny-game-shop-tycoon/MIRROR-MANIFEST.json", prepareByMount: true },
  "undead-slayer": { embedded: true, preloadManifest: "/games/undead-slayer/preload-manifest.json", assetManifest: "/games/undead-slayer/MIRROR-MANIFEST.json", prepareByMount: true },
  "knife-merge": { embedded: true, preloadManifest: "/games/knife-merge/preload-manifest.json", assetManifest: "/games/knife-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "family-life-simulator": { embedded: true, preloadManifest: "/games/family-life-simulator/preload-manifest.json", assetManifest: "/games/family-life-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "dummies-fight": { embedded: true, preloadManifest: "/games/dummies-fight/preload-manifest.json", assetManifest: "/games/dummies-fight/MIRROR-MANIFEST.json", prepareByMount: true },
  "perfect-shape": { embedded: true, preloadManifest: "/games/perfect-shape/preload-manifest.json", assetManifest: "/games/perfect-shape/MIRROR-MANIFEST.json", prepareByMount: true },
  "flip-pounce": { embedded: true, preloadManifest: "/games/flip-pounce/preload-manifest.json", assetManifest: "/games/flip-pounce/MIRROR-MANIFEST.json", prepareByMount: true },
  "goalheads-io": { embedded: true, preloadManifest: "/games/goalheads-io/preload-manifest.json", assetManifest: "/games/goalheads-io/MIRROR-MANIFEST.json", prepareByMount: true },
  "goods-master": { embedded: true, preloadManifest: "/games/goods-master/preload-manifest.json", assetManifest: "/games/goods-master/MIRROR-MANIFEST.json", prepareByMount: true },
  "20f8": { embedded: true, preloadManifest: "/games/20f8/preload-manifest.json", assetManifest: "/games/20f8/MIRROR-MANIFEST.json", prepareByMount: true },
  "fashion-dress-up-star": { embedded: true, preloadManifest: "/games/fashion-dress-up-star/preload-manifest.json", assetManifest: "/games/fashion-dress-up-star/MIRROR-MANIFEST.json", prepareByMount: true },
  "dino-simulator": { embedded: true, preloadManifest: "/games/dino-simulator/preload-manifest.json", assetManifest: "/games/dino-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "bubbleshooter-x-basketball-3d": { embedded: true, preloadManifest: "/games/bubbleshooter-x-basketball-3d/preload-manifest.json", assetManifest: "/games/bubbleshooter-x-basketball-3d/MIRROR-MANIFEST.json", prepareByMount: true },
  "boomy-world": { embedded: true, preloadManifest: "/games/boomy-world/preload-manifest.json", assetManifest: "/games/boomy-world/MIRROR-MANIFEST.json", prepareByMount: true },
  "chick-flix": { embedded: true, preloadManifest: "/games/chick-flix/preload-manifest.json", assetManifest: "/games/chick-flix/MIRROR-MANIFEST.json", prepareByMount: true },
  "ball-guys": { embedded: true, preloadManifest: "/games/ball-guys/preload-manifest.json", assetManifest: "/games/ball-guys/MIRROR-MANIFEST.json", prepareByMount: true },
  "color-shapes": { embedded: true, preloadManifest: "/games/color-shapes/preload-manifest.json", assetManifest: "/games/color-shapes/MIRROR-MANIFEST.json", prepareByMount: true },
  "paperio-2": { embedded: true, preloadManifest: "/games/paperio-2/preload-manifest.json", assetManifest: "/games/paperio-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "snow-yeet": { embedded: true, preloadManifest: "/games/snow-yeet/preload-manifest.json", assetManifest: "/games/snow-yeet/MIRROR-MANIFEST.json", prepareByMount: true },
  "robo-cleaner-simulator": { embedded: true, preloadManifest: "/games/robo-cleaner-simulator/preload-manifest.json", assetManifest: "/games/robo-cleaner-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "noob-archer-2": { embedded: true, preloadManifest: "/games/noob-archer-2/preload-manifest.json", assetManifest: "/games/noob-archer-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "carnado-boat-racing": { embedded: true, preloadManifest: "/games/carnado-boat-racing/preload-manifest.json", assetManifest: "/games/carnado-boat-racing/MIRROR-MANIFEST.json", prepareByMount: true },
  "super-dress": { embedded: true, preloadManifest: "/games/super-dress/preload-manifest.json", assetManifest: "/games/super-dress/MIRROR-MANIFEST.json", prepareByMount: true },
  "block-for-blood": { embedded: true, preloadManifest: "/games/block-for-blood/preload-manifest.json", assetManifest: "/games/block-for-blood/MIRROR-MANIFEST.json", prepareByMount: true },
  "dress-up-party": { embedded: true, preloadManifest: "/games/dress-up-party/preload-manifest.json", assetManifest: "/games/dress-up-party/MIRROR-MANIFEST.json", prepareByMount: true },
  "cuboy-adventure": { embedded: true, preloadManifest: "/games/cuboy-adventure/preload-manifest.json", assetManifest: "/games/cuboy-adventure/MIRROR-MANIFEST.json", prepareByMount: true },
  "ragdoll-chaos": { embedded: true, preloadManifest: "/games/ragdoll-chaos/preload-manifest.json", assetManifest: "/games/ragdoll-chaos/MIRROR-MANIFEST.json", prepareByMount: true },
  "critter-chaos": { embedded: true, preloadManifest: "/games/critter-chaos/preload-manifest.json", assetManifest: "/games/critter-chaos/MIRROR-MANIFEST.json", prepareByMount: true },
  "happy-tidy-time": { embedded: true, preloadManifest: "/games/happy-tidy-time/preload-manifest.json", assetManifest: "/games/happy-tidy-time/MIRROR-MANIFEST.json", prepareByMount: true },
  "soccer-league": { embedded: true, preloadManifest: "/games/soccer-league/preload-manifest.json", assetManifest: "/games/soccer-league/MIRROR-MANIFEST.json", prepareByMount: true },
  "moto-trap": { embedded: true, preloadManifest: "/games/moto-trap/preload-manifest.json", assetManifest: "/games/moto-trap/MIRROR-MANIFEST.json", prepareByMount: true },
  "drift-boss": { embedded: true, preloadManifest: "/games/drift-boss/preload-manifest.json", assetManifest: "/games/drift-boss/MIRROR-MANIFEST.json", prepareByMount: true },
  "penalty-shooters-2": {
    embedded: true,
    preloadManifest: "/games/penalty-shooters-2/preload-manifest.json",
    assetManifest: "/games/penalty-shooters-2/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "soccer-real": {
    embedded: true,
    preloadManifest: "/games/soccer-real/preload-manifest.json",
    assetManifest: "/games/soccer-real/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "master-chess": {
    embedded: true,
    preloadManifest: "/games/master-chess/preload-manifest.json",
    assetManifest: "/games/master-chess/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "basketball-stars": {
    embedded: true,
    preloadManifest: "/games/basketball-stars/preload-manifest.json",
    assetManifest: "/games/basketball-stars/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "stickman-hook": {
    embedded: true,
    preloadManifest: "/games/stickman-hook/preload-manifest.json",
    assetManifest: "/games/stickman-hook/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "happy-glass": {
    embedded: true,
    preloadManifest: "/games/happy-glass/preload-manifest.json",
    assetManifest: "/games/happy-glass/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "drive-mad": {
    embedded: true,
    preloadManifest: "/games/drive-mad/preload-manifest.json",
    assetManifest: "/games/drive-mad/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "slice-master": {
    embedded: true,
    preloadManifest: "/games/slice-master/preload-manifest.json",
    assetManifest: "/games/slice-master/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "level-devil": {
    embedded: true,
    preloadManifest: "/games/level-devil/preload-manifest.json",
    assetManifest: "/games/level-devil/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "game-2048": {
    embedded: true,
    preloadManifest: "/games/2048-game/preload-manifest.json",
    assetManifest: "/games/2048-game/MIRROR-MANIFEST.json",
    warmFullMirror: true,
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
