// Local PokiSDK shim for Retro Bowl (GameMaker:Studio) - fail-closed, ad-free
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

  // GameMaker Poki extension raw bindings (fail-closed no-ops).
  // The game's extension glue calls these directly; without them the boot
  // throws "poki_*_raw is not defined" and never renders.
  function noopRaw() {}
  function boolRaw() { return 1; }
  window.poki_init_raw = function () { log("init_raw"); return true; };
  window.poki_commercial_break_raw = function (cb) { log("commercial_break_raw"); if (typeof cb === "function") { try { cb(); } catch (e) {} } return true; };
  window.poki_rewarded_break_raw = function (cb) { log("rewarded_break_raw"); if (typeof cb === "function") { try { cb(); } catch (e) {} } return true; };
  window.poki_script_closure_raw = function (fn) { log("script_closure_raw"); return fn; };
  window.poki_get_team_raw = function (cb) { log("get_team_raw"); if (typeof cb === "function") { try { cb(0); } catch (e) {} } return true; };
  window.poki_set_team_raw = function (t) { log("set_team_raw", t); return true; };
  window.poki_gameplay_start = noopRaw;
  window.poki_gameplay_stop = noopRaw;
  window.poki_happy_time = noopRaw;
  window.poki_pause = noopRaw;
  window.poki_loadbar = function (p) { log("loadbar", p); };

  try { window.dispatchEvent(new Event("poki-sdk-ready")); } catch (e) {}
  log("shim installed");
})();
