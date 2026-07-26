/* Local-only host bridge and ad-free SDK substitute for the authorized Fruit Ninja mirror. */
(function () {
  "use strict";

  var GAME_SOURCE = "tiptap-fruit-ninja";
  var PARENT_SOURCE = "tiptap-parent";
  var muted = new URLSearchParams(location.search).get("muted") !== "0";
  var startRequested = new URLSearchParams(location.search).get("autoplay") === "1";

  function resolved(value) {
    return Promise.resolve(value);
  }

  window.PokiSDK = {
    init: function () { return resolved(); },
    gameLoadingFinished: function () {},
    gameplayStart: function () {},
    gameplayStop: function () {},
    commercialBreak: function () { return resolved(); },
    rewardedBreak: function () { return resolved(false); },
  };

  function setMuted(nextMuted) {
    muted = Boolean(nextMuted);
    document.querySelectorAll("audio,video").forEach(function (media) {
      media.muted = muted;
    });
    try {
      if (window.Howler) window.Howler.mute(muted);
    } catch (_) {}
  }

  window.__TIPTAP_FRUIT_SCORE__ = function (score) {
    var value = Number(score);
    if (!Number.isSafeInteger(value) || value < 0) return;
    window.parent.postMessage(
      { source: GAME_SOURCE, type: "score", score: value },
      window.location.origin,
    );
  };

  window.__TIPTAP_FRUIT_START_REQUESTED__ = function () {
    return startRequested;
  };

  function requestStart() {
    startRequested = true;
    if (typeof window.__TIPTAP_FRUIT_START__ === "function") {
      window.__TIPTAP_FRUIT_START__();
    }
  }

  function reportReady() {
    if (typeof window.__TIPTAP_FRUIT_START__ !== "function") return;
    window.parent.postMessage(
      { source: GAME_SOURCE, type: "ready" },
      window.location.origin,
    );
  }

  window.addEventListener("message", function (event) {
    if (
      event.origin !== window.location.origin ||
      !event.data ||
      event.data.source !== PARENT_SOURCE
    ) return;
    if (event.data.type === "set-muted") setMuted(event.data.muted);
    if (event.data.type === "auto-start") requestStart();
    if (event.data.type === "ready-check") reportReady();
  });

  new MutationObserver(function () { setMuted(muted); }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  setMuted(muted);
})();
