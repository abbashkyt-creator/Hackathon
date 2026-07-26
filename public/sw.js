const SHELL_CACHE = "tip-tap-shell-v2";
const GAME_CACHE = "tip-tap-games-v5";
const CURRENT_CACHES = new Set([SHELL_CACHE, GAME_CACHE]);
const SHELL = ["/", "/manifest.webmanifest", "/icon.svg"];
const inflightGameFetches = new Map();

function gameCacheKey(requestOrUrl) {
  const url = new URL(
    typeof requestOrUrl === "string" ? requestOrUrl : requestOrUrl.url,
    self.location.origin,
  );
  url.search = "";
  url.hash = "";
  return url.href;
}

async function fetchAndCacheGame(request, cache) {
  const key = gameCacheKey(request);
  let pending = inflightGameFetches.get(key);
  if (!pending) {
    pending = fetch(request)
      .then(async (response) => {
        if (response.ok && response.type === "basic") {
          await cache.put(key, response.clone());
        }
        return response;
      })
      .finally(() => inflightGameFetches.delete(key));
    inflightGameFetches.set(key, pending);
  }
  const response = await pending;
  return response.clone();
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !CURRENT_CACHES.has(key)).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "WARM_GAME" || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls
    .filter((value) => typeof value === "string")
    .map((value) => new URL(value, self.location.origin))
    .filter(
      (url) => url.origin === self.location.origin && url.pathname.startsWith("/games/"),
    );
  event.waitUntil(
    caches.open(GAME_CACHE).then(async (cache) => {
      for (let index = 0; index < urls.length; index += 3) {
        await Promise.allSettled(
          urls.slice(index, index + 3).map(async (url) => {
            const cached = await cache.match(gameCacheKey(url));
            if (cached) return;
            await fetchAndCacheGame(
              new Request(url, { credentials: "same-origin" }),
              cache,
            );
          }),
        );
      }
    }),
  );
});

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put("/", response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match("/"));
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cacheKey = cacheName === GAME_CACHE ? gameCacheKey(request) : request;
  const cached = await cache.match(cacheKey);
  const update =
    cacheName === GAME_CACHE
      ? fetchAndCacheGame(request, cache).catch(() => null)
      : fetch(request)
          .then(async (response) => {
            if (response.ok && response.type === "basic") {
              await cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => null);
  return cached || (await update) || Response.error();
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(event.request));
    return;
  }
  event.respondWith(
    staleWhileRevalidate(
      event.request,
      url.pathname.startsWith("/games/") ? GAME_CACHE : SHELL_CACHE,
    ),
  );
});
