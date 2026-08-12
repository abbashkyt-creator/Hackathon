// Local PokiSDK shim for Go Battle 2 (GameMaker HTML5) - fail-closed, ad-free
// Real poki-sdk.js is replaced; all telemetry/ads are no-ops routed to TipTapAds.
(function () {
  "use strict";
  function noop() { return Promise.resolve(); }

  function log() {
    if (window.__POKI_DEBUG__) { try { console.log.apply(console, ["[PokiSDK-shim]"].concat([].slice.call(arguments))); } catch (e) {} }
  }

  var PokiSDK = {
    init: function () { log("init"); window.PokiSDK_loadState = 1; return Promise.resolve(); },
    gameLoadingStart: function () { log("gameLoadingStart"); },
    gameLoadingProgress: function () { log("gameLoadingProgress"); },
    gameLoadingFinished: function () { log("gameLoadingFinished"); },
    gamePlayStart: function () { log("gamePlayStart"); },
    gamePlayStop: function () { log("gamePlayStop"); },
    commercialBreak: function () { log("commercialBreak (no-op)"); return Promise.resolve(); },
    rewardedBreak: function () { log("rewardedBreak (no-op)"); return Promise.resolve({ success: true }); },
    happyTime: function () { log("happyTime"); },
    shareableURL: function () { return Promise.resolve({ url: window.location.href }); },
    getURLParam: function (k) { try { return new URLSearchParams(window.location.search).get(k); } catch (e) { return null; } },
    getStoreLink: function () { return Promise.resolve(""); },
    gameplayError: function () {},
    setDebug: function () {},
    displayAd: function () { return Promise.resolve(); },
    destroyAd: function () { return Promise.resolve(); },
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () {},
    on: function () {},
    off: function () {},
    getPrivacyPolicy: function () { return Promise.resolve({}); },
    getData: function () { return Promise.resolve({}); },
    setData: function () { return Promise.resolve(); },
    loadRewardedAd: function () { return Promise.resolve(true); },
    isRewardedAdLoaded: function () { return true; },
    showRewardedAd: function () { return Promise.resolve({ success: true }); }
  };

  window.PokiSDK = PokiSDK;

  // window-level glue some GameMaker builds check
  window.PokiSDK_OK = false;
  window.PokiSDK_loadState = 0;

  if (typeof window.dispatchEvent === "function") {
    try { window.dispatchEvent(new Event("poki-sdk-ready")); } catch (e) {}
  }
  log("shim installed");
})();
