/* Local, no-ad compatibility surface for the original Unity Poki bridge. */
(() => {
  "use strict";
  const noop = () => {};
  const resolved = (value) => Promise.resolve(value);
  let bridgeName = "";
  let unityReady = false;
  const localTelemetryResponse = "data:application/json,%7B%7D";
  const sourceTelemetryHosts = new Set([
    "config.uca.cloud.unity3d.com",
    "cdp.cloud.unity3d.com",
  ]);

  // The copied build starts Unity's remote configuration/analytics client even
  // though the game itself is fully bundled. Route only those known telemetry
  // hosts to an inert local data response *before* the shared lock sees them.
  // No cross-origin request is made, no remote configuration is trusted, and
  // every other external URL is still rejected by network-lock.js.
  const lockedOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    let target;
    try { target = new URL(String(url), window.location.href); } catch {}
    if (target && sourceTelemetryHosts.has(target.hostname)) {
      return lockedOpen.call(this, method, localTelemetryResponse, ...rest);
    }
    return lockedOpen.call(this, method, url, ...rest);
  };

  const notifyBridge = (method, value) => {
    if (!unityReady || !bridgeName || !window.unityGame?.SendMessage) return;
    try {
      if (value === undefined) window.unityGame.SendMessage(bridgeName, method);
      else window.unityGame.SendMessage(bridgeName, method, String(value));
    } catch {
      // Game-specific callbacks are best effort and must never escape locally.
    }
  };

  window.PokiSDK = Object.freeze({
    init: () => resolved(),
    gameLoadingStart: noop,
    gameLoadingFinished: noop,
    gameLoadingProgress: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    setDebug: noop,
    commercialBreak: (options) => window.TipTapAds.commercial(options, "rocket-soccer-commercial"),
    rewardedBreak: (options) => window.TipTapAds.rewarded(options, "rocket-soccer-rewarded"),
    displayAd: (options) => window.TipTapAds.display(options, "rocket-soccer-display"),
    destroyAd: noop,
    shareableURL: () => resolved(""),
    getSharableURL: () => resolved(""),
    getUser: () => resolved(null),
    getToken: () => resolved(""),
    login: () => Promise.reject(new Error("Tip Tap does not use source-game accounts.")),
    customEvent: noop,
    logError: noop,
    measure: noop,
    getLanguage: () => "en",
    getURLParam: () => "",
    isAdBlocked: () => true,
  });

  window.initPokiBridge = (name) => {
    bridgeName = String(name || "");
    if (unityReady) notifyBridge("ready");
  };
  window.commercialBreak = () => window.PokiSDK.commercialBreak().then(() => notifyBridge("commercialBreakCompleted"));
  window.rewardedBreak = () => window.PokiSDK.rewardedBreak().then((granted) => notifyBridge("rewardedBreakCompleted", granted));
  window.__TIPTAP_ROCKET_SOCCER_READY__ = () => {
    unityReady = true;
    notifyBridge("ready");
  };
})();
