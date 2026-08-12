// The build id is stamped in at build time (scripts/stamp-sw-build.mjs). It
// changes on every deploy, so this file's bytes change every deploy: the browser
// always sees a new service worker, activates it immediately (skipWaiting), and
// its activate step purges every previous build's caches. Combined with the
// client-side auto-reload in main.tsx, every deploy reaches returning users with
// no manual cache clearing.
const BUILD = "__TIPTAP_BUILD__";
const SHELL_CACHE = `tiptap-shell-${BUILD}`;
const GAME_CACHE = `tiptap-games-${BUILD}`;
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

// Fetch bypassing the browser HTTP cache so a fresh build never serves a file
// the HTTP layer is still holding onto. `no-cache` revalidates (cheap 304 when
// unchanged, full body when changed); falls back to a plain fetch if rejected.
async function freshFetch(request) {
  try {
    return await fetch(request, { cache: "no-cache" });
  } catch {
    return fetch(request);
  }
}

// The Cache API replays stored headers verbatim. Production pre-compresses/gzips
// assets, so a fetched Response arrives already-decoded by the browser but still
// carrying Content-Encoding. If we cache it as-is, a later cache hit re-applies
// that header and the browser decodes the body a SECOND time -> corrupt wasm/data
// (black-screen games). Rebuild the response from the decoded body without the
// encoding/length headers so replay serves it untouched.
async function cacheableResponse(response) {
  if (!response.headers.has("content-encoding")) return response;
  const body = await response.blob();
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function fetchAndCacheGame(request, cache) {
  const key = gameCacheKey(request);
  let pending = inflightGameFetches.get(key);
  if (!pending) {
    pending = freshFetch(request)
      .then(async (response) => {
        if (response.ok && response.type === "basic") {
          await cache.put(key, await cacheableResponse(response.clone()));
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
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Purge only our own previous caches (both the new `tiptap-` build-versioned
      // names and the legacy `tip-tap-*-vN` names, so the transition to this
      // system clears the old poisoned caches too). Leave foreign caches — e.g.
      // Unity's own runtime cache — intact so a deploy doesn't force every engine
      // to re-download its runtime.
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => /^tip-?tap-/.test(key) && !CURRENT_CACHES.has(key))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (event.data?.type !== "WARM_GAME" || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls
    .filter((value) => typeof value === "string")
    .map((value) => new URL(value, self.location.origin))
    .filter((url) => url.origin === self.location.origin && url.pathname.startsWith("/games/"));
  event.waitUntil(
    caches.open(GAME_CACHE).then(async (cache) => {
      for (let index = 0; index < urls.length; index += 3) {
        await Promise.allSettled(
          urls.slice(index, index + 3).map(async (url) => {
            const cached = await cache.match(gameCacheKey(url));
            if (cached) return;
            await fetchAndCacheGame(new Request(url, { credentials: "same-origin" }), cache);
          }),
        );
      }
    }),
  );
});

// Navigation: always try the network first so the freshest index.html (and thus
// the newest hashed asset references) load; fall back to cache when offline.
async function networkFirstNavigation(request) {
  try {
    const response = await freshFetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put("/", await cacheableResponse(response.clone()));
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match("/")) || Response.error();
  }
}

// Build-versioned cache-first: within a build the cache only ever holds this
// build's assets (activate purged the rest), so a hit is known-fresh — serve it
// straight from cache (fast, no revalidation). A miss means the first load of a
// new build: fetch fresh (bypassing the HTTP cache), store, serve. Every deploy
// therefore serves fresh without re-downloading unchanged assets within a build.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  if (cacheName === GAME_CACHE) {
    const key = gameCacheKey(request);
    const cached = await cache.match(key);
    if (cached) return cached;
    return fetchAndCacheGame(request, cache).catch(async () => {
      return (await cache.match(key)) || Response.error();
    });
  }
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await freshFetch(request).catch(() => null);
  if (response && response.ok && response.type === "basic") {
    await cache.put(request, await cacheableResponse(response.clone()));
  }
  return response || (await cache.match(request)) || Response.error();
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
    cacheFirst(event.request, url.pathname.startsWith("/games/") ? GAME_CACHE : SHELL_CACHE),
  );
});
