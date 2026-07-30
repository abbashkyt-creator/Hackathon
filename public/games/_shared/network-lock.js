(() => {
  "use strict";

  const ALLOWED_PROTOCOLS = new Set(["data:", "blob:"]);
  const blocked = [];

  const resolve = (value) => {
    try {
      return new URL(String(value), window.location.href);
    } catch {
      return null;
    }
  };

  const isLocalInspectionEndpoint = (url) => {
    // VEU injects a localhost telemetry transport while developers inspect a
    // local game. Permit only those loopback ports in a loopback preview; this
    // is never a production/source-game exception and cannot reach Poki or any
    // other public host.
    const previewHost = new Set(["127.0.0.1", "localhost"]);
    // Reserve a small, explicit range so parallel agents can use separate VEU
    // profiles without the development overlay being mistaken for game traffic.
    const inspectionPorts = new Set([
      "3456",
      "3457",
      "3458",
      "3459",
      "3460",
      "3461",
      "3462",
      "3463",
      "3464",
      "3465",
      "3466",
      "3467",
      "3468",
      "3469",
    ]);
    return (
      previewHost.has(window.location.hostname) &&
      previewHost.has(url.hostname) &&
      inspectionPorts.has(url.port)
    );
  };

  const allowed = (value) => {
    const url = resolve(value);
    return Boolean(
      url &&
        (url.origin === window.location.origin ||
          ALLOWED_PROTOCOLS.has(url.protocol) ||
          isLocalInspectionEndpoint(url)),
    );
  };

  const report = (transport, value) => {
    const detail = { transport, url: String(value), at: Date.now() };
    blocked.push(detail);
    window.__TIPTAP_BLOCKED_NETWORK__ = blocked.slice(-100);
    window.dispatchEvent(new CustomEvent("tiptap-network-blocked", { detail }));
  };

  // A few authorized Poki-source mirrors contain an embedder check. Scope its
  // compatibility signal to those folders only. Applying it globally breaks
  // other platforms' legitimate localhost checks (CrazyGames SiteLock v1.9.0,
  // used by Dig out of Prison, intentionally rejects a Poki referrer).
  const pokiMirrorFolders = new Set([
    "67-game",
    "arithmetica",
    "city-cab-rush",
    "count-control-legends",
    "dino-game",
    "fruit-ninja",
    "johnny-trigger-sniper",
    "kitty-loves-birds-2",
    "ping-pong-go",
    "plonky",
    "smash-room",
    "stickman-fury",
    "subway-surfers",
    "supercar-legends",
    "temple-run-2-frozen-shadows",
    "theft-city",
  ]);
  const gameFolder = window.location.pathname.split("/")[2] || "";
  if (pokiMirrorFolders.has(gameFolder)) {
    const POKI_ORIGIN = "https://poki.com";
    try {
      Object.defineProperty(document, "referrer", {
        configurable: true,
        get: () => POKI_ORIGIN + "/",
      });
    } catch {
      // Referrer is read-only in this engine; ancestorOrigins spoof still applies.
    }
    try {
      const ancestors = {
        length: 1,
        0: POKI_ORIGIN,
        item: (i) => (i === 0 ? POKI_ORIGIN : null),
        contains: (value) => String(value).includes("poki"),
        [Symbol.iterator]: function* () {
          yield POKI_ORIGIN;
        },
      };
      Object.defineProperty(window.location, "ancestorOrigins", {
        configurable: true,
        get: () => ancestors,
      });
    } catch {
      // ancestorOrigins is unforgeable here; referrer spoof still applies.
    }
  }

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const value = typeof input === "string" || input instanceof URL ? input : input.url;
    if (allowed(value)) return nativeFetch(input, init);
    report("fetch", value);
    return Promise.reject(new TypeError("Tip Tap blocked a cross-origin game request."));
  };

  const nativeOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (!allowed(url)) {
      report("xhr", url);
      throw new DOMException("Tip Tap blocked a cross-origin game request.", "SecurityError");
    }
    return nativeOpen.call(this, method, url, ...rest);
  };

  const protectConstructor = (name) => {
    const NativeConstructor = window[name];
    if (typeof NativeConstructor !== "function") return;
    window[name] = new Proxy(NativeConstructor, {
      construct(target, args, newTarget) {
        if (!allowed(args[0])) {
          report(name.toLowerCase(), args[0]);
          throw new DOMException("Tip Tap blocked a cross-origin game request.", "SecurityError");
        }
        return Reflect.construct(target, args, newTarget);
      },
    });
  };
  protectConstructor("WebSocket");
  protectConstructor("EventSource");

  if (typeof navigator.sendBeacon === "function") {
    const nativeSendBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, data) => {
      if (allowed(url)) return nativeSendBeacon(url, data);
      report("beacon", url);
      return false;
    };
  }

  const nativeWindowOpen = window.open.bind(window);
  window.open = (url, ...rest) => {
    if (url === undefined || url === "" || allowed(url)) return nativeWindowOpen(url, ...rest);
    report("window-open", url);
    return null;
  };

  // Subway Surfers' bundled sitelock frame-busts by navigating its OWN frame to
  // https://poki.com/sitelock (location.replace / .assign / .href). That kicks
  // the game off its origin to an unreachable Poki gate and leaves a blocked
  // page. Block cross-origin self-navigation so the game stays fully local.
  // (location.href assignment is [Unforgeable] and may not be overridable in
  // every engine; the assign/replace hooks cover the common frame-bust paths.)
  try {
    const loc = window.location;
    ["assign", "replace"].forEach((method) => {
      const native = typeof loc[method] === "function" ? loc[method].bind(loc) : null;
      if (!native) return;
      try {
        Object.defineProperty(loc, method, {
          configurable: true,
          writable: true,
          value(url) {
            if (allowed(url)) return native(url);
            report("location-" + method, url);
          },
        });
      } catch {
        // Non-configurable in this engine; rely on the href hook below.
      }
    });
    const hrefDescriptor =
      Object.getOwnPropertyDescriptor(loc, "href") ||
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(loc) || {}, "href");
    if (hrefDescriptor && typeof hrefDescriptor.set === "function") {
      try {
        Object.defineProperty(loc, "href", {
          configurable: true,
          get() {
            return hrefDescriptor.get ? hrefDescriptor.get.call(loc) : loc.toString();
          },
          set(url) {
            if (allowed(url)) return hrefDescriptor.set.call(loc, url);
            report("location-href", url);
          },
        });
      } catch {
        // [Unforgeable] in this engine; the iframe guard below still applies.
      }
    }
  } catch {
    // Location hardening is best-effort; other transports remain locked.
  }

  // Defense-in-depth: some sitelocks instead point a child <iframe> at
  // https://poki.com/sitelock. Neutralize any cross-origin iframe to about:blank
  // (same-origin / data: / blob: targets are always allowed) so nothing escapes.
  if (typeof HTMLIFrameElement === "function") {
    const proto = HTMLIFrameElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, "src");
    if (descriptor && typeof descriptor.set === "function") {
      Object.defineProperty(proto, "src", {
        configurable: true,
        enumerable: descriptor.enumerable,
        get() {
          return descriptor.get ? descriptor.get.call(this) : this.getAttribute("src");
        },
        set(value) {
          if (value && !allowed(value)) {
            report("iframe-src", value);
            descriptor.set.call(this, "about:blank");
            return;
          }
          descriptor.set.call(this, value);
        },
      });
    }
    const nativeSetAttribute = proto.setAttribute;
    proto.setAttribute = function (name, value) {
      if (typeof name === "string" && name.toLowerCase() === "src" && value && !allowed(value)) {
        report("iframe-setattr", value);
        return nativeSetAttribute.call(this, "src", "about:blank");
      }
      return nativeSetAttribute.call(this, name, value);
    };

    // The property/attribute hooks above miss iframes injected via innerHTML or
    // the HTML parser (how Subway Surfers' sitelock is inserted), so a
    // MutationObserver is the catch-all: any iframe that ends up pointing at a
    // disallowed cross-origin target is neutralized to about:blank and hidden,
    // regardless of how it was created. This keeps the game fully local with no
    // Poki gate overlay left covering it.
    const neutralize = (frame) => {
      let current;
      try {
        current = frame.src || frame.getAttribute("src");
      } catch {
        return;
      }
      if (!current || allowed(current)) return;
      report("iframe-observed", current);
      try {
        nativeSetAttribute.call(frame, "src", "about:blank");
      } catch {}
      frame.style.setProperty("display", "none", "important");
    };
    const scan = (node) => {
      if (!node || node.nodeType !== 1) return;
      if (node.tagName === "IFRAME") neutralize(node);
      if (typeof node.querySelectorAll === "function") {
        node.querySelectorAll("iframe").forEach(neutralize);
      }
    };
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.target.tagName === "IFRAME") {
          neutralize(mutation.target);
        }
        mutation.addedNodes && mutation.addedNodes.forEach(scan);
      }
    });
    const startObserver = () => {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"],
      });
      scan(document.documentElement);
    };
    if (document.documentElement) startObserver();
    else document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  }
})();
