// Local PokiSDK shim for Stickman Battle (Cocos Creator 2.x) - fail-closed, ad-free
(function () {
  "use strict";
  function log() {
    if (window.__POKI_DEBUG__) { try { console.log.apply(console, ["[PokiSDK-shim]"].concat([].slice.call(arguments))); } catch (e) {} }
  }
  var PokiSDK = {
    init: function () { log("init"); window.PokiSDK_loadState = 1; return Promise.resolve(); },
    gameLoadingStart: function () { log("gameLoadingStart"); },
    gameLoadingFinished: function () { log("gameLoadingFinished"); },
    gameLoadingProgress: function () { log("gameLoadingProgress"); },
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
    on: function () {},
    off: function () {},
    getData: function () { return Promise.resolve({}); },
    setData: function () { return Promise.resolve(); }
  };
  window.PokiSDK = PokiSDK;
  window.PokiSDK_loadState = 0;
  window.PokiSDK_OK = false;
  try { window.dispatchEvent(new Event("poki-sdk-ready")); } catch (e) {}
  log("shim installed");
})();
