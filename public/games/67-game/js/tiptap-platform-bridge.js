/*
 * Local adaptation of the source 67_webgl.js launcher. It deliberately keeps
 * the SWF's orientation and ExternalInterface lifecycle but replaces Poki SDK
 * calls, ads, telemetry, and remote services with no-op local equivalents.
 */
(function () {
  "use strict";

  var GAME_SOURCE = "tiptap-67-game";
  var PARENT_SOURCE = "tiptap-parent";
  var player = null;
  var playerApi = null;
  var muted = new URLSearchParams(window.location.search).get("muted") !== "0";
  var launched = false;
  window.__TIPTAP_BRIDGE_EVENTS__ = window.__TIPTAP_BRIDGE_EVENTS__ || [];

  function record(type, data) {
    window.__TIPTAP_BRIDGE_EVENTS__.push(Object.assign({ type: type, at: Date.now() }, data || {}));
  }

  function post(type, data) {
    record(type, data);
    if (window.parent !== window) {
      window.parent.postMessage(Object.assign({ source: GAME_SOURCE, type: type }, data || {}), window.location.origin);
    }
  }

  function isVertical() {
    return window.innerHeight > window.innerWidth;
  }

  function applyOrientation() {
    if (!player) return;
    var method = isVertical() ? "ToVertical" : "ToHorisontal";
    if (typeof player[method] === "function") player[method]();
    var preload = document.getElementById("preload-image");
    if (preload) preload.src = isVertical() ? "./preloader_67_ver.jpg" : "./preloader_67_hor.jpg";
  }

  function applyMutedState() {
    if (playerApi) playerApi.volume = muted ? 0 : 1;
  }

  function hidePreloader() {
    var preload = document.getElementById("preload-image");
    var dim = document.getElementById("screen-dim");
    if (preload) preload.style.display = "none";
    if (dim) { dim.style.opacity = "0"; dim.style.display = "none"; }
  }

  // The SWF invokes this through Ruffle ExternalInterface. These exact source
  // signals are why a bare generic Ruffle host cannot reproduce the game.
  window.myJavaScriptFunction = function (signal) {
    record("source-signal", { signal: String(signal) });
    if (signal === "gameLoadingFinished") applyOrientation();
    if (signal === "gameplayStart" || signal === "gameplayStop") post(signal);
    if (signal === "preloadercomplete") {
      var dim = document.getElementById("screen-dim");
      if (dim) dim.style.opacity = "1";
    }
    if (signal === "perekl2frame") hidePreloader();
    // Source ad signals route only to Tip Tap's parent-owned pipeline. It is
    // disabled by default and never loads a third-party SDK.
    if (signal === "comercial" && player) {
      window.TipTapAds.commercial(null, "67-commercial").then(function () {
        if (typeof player.receiveCommercialBreakFinished === "function") {
          player.receiveCommercialBreakFinished();
        }
      });
    }
    if (signal === "rewarded" && player) {
      window.TipTapAds.rewarded(null, "67-rewarded").then(function (granted) {
        if (granted && typeof player.rewardedBreakFinished === "function") player.rewardedBreakFinished();
        else if (typeof player.rewardedBreakAdblocked === "function") player.rewardedBreakAdblocked();
      });
    }
  };

  function start() {
    if (launched || !window.RufflePlayer || !window.RufflePlayer.newest) return;
    launched = true;
    window.RufflePlayer.config = {
      autoplay: "on",
      preferredRenderer: "webgl",
      unmuteOverlay: "hidden",
      splashScreen: false,
      contextMenu: "off",
      backgroundColor: "#000000",
      publicPath: "./ruffle-poki-2023-12-16/"
    };
    // This is the source game's 2023 Ruffle API: unlike the newer runtime,
    // the player object itself owns load() and volume.
    player = window.RufflePlayer.newest().createPlayer();
    player.width = 580;
    player.height = 1031;
    player.style.width = "100%";
    player.style.height = "100%";
    playerApi = player;
    applyMutedState();
    document.getElementById("ruffle").appendChild(player);
    player.addEventListener("loadedmetadata", function () {
      record("runtime-loaded", { runtime: "poki-ruffle-2023-12-16" });
      applyOrientation();
    });
    playerApi.load({ url: "./67.swf", allowScriptAccess: true }).catch(function (error) {
      post("runtime-error", { detail: String(error) });
    });
  }

  window.addEventListener("resize", applyOrientation);
  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin || !event.data || event.data.source !== PARENT_SOURCE) return;
    if (event.data.type === "set-muted") { muted = !!event.data.muted; applyMutedState(); }
    if (event.data.type === "auto-start") start();
  });
  window.addEventListener("DOMContentLoaded", start);
})();
