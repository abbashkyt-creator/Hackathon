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
    const inspectionPorts = new Set(["3456", "3457", "3458", "3459", "3460"]);
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
})();
