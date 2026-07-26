/*
 * Source launcher adaptation. The original game remains the owner of physics,
 * levels, rendering, touch controls, and score. This file only connects its
 * documented jQuery events to the same-origin Tip Tap host and starts solo
 * level one after the source preloader finishes.
 */
(function () {
  "use strict";

  var GAME_SOURCE = "tiptap-archery-king";
  var started = false;
  var initialMuted = new URLSearchParams(window.location.search).get("muted") === "1";

  function post(type, data) {
    try {
      window.parent.postMessage(Object.assign({ source: GAME_SOURCE, type: type }, data || {}), window.location.origin);
    } catch (_) {}
  }

  function startSoloLevel() {
    if (started || !window.s_oMenu || !window.s_oMain) return false;
    started = true;
    window.s_oMenu.unload();
    window.s_oMain.gotoGame(0);
    // Level one shows the source's touch tutorial. Let that intro appear, then
    // dismiss its own panel so the feed reaches live play without a separate
    // Play/Next tap.
    window.setTimeout(function () {
      var help = window.s_oGame && window.s_oGame._oHelpPanel;
      if (help && typeof help._hide === "function") help._hide();
    }, 900);
    post("gameplay-start");
    return true;
  }

  function scheduleAutoStart() {
    if (started) return;
    if (startSoloLevel()) return;
    window.setTimeout(scheduleAutoStart, 80);
  }

  window.__TIPTAP_ARCHERY_AUTOSTART__ = scheduleAutoStart;

  jQuery(function () {
    var main = new CMain({ fullscreen: true, audio_enable_on_startup: !initialMuted });
    window.__TIPTAP_ARCHERY_MAIN__ = main;
    if (initialMuted && typeof window.__TIPTAP_ARCHERY_SET_MUTED__ === "function") {
      window.__TIPTAP_ARCHERY_SET_MUTED__(true);
    }

    jQuery(main).on("start_session", function () {
      post("gameplay-start");
    });
    jQuery(main).on("end_session", function () {
      post("gameplay-stop");
    });
    jQuery(main).on("save_score", function (_event, value) {
      var score = Number(value);
      if (Number.isSafeInteger(score) && score >= 0) post("score", { score: score });
    });
    jQuery(main).on("show_interlevel_ad", function (_event, askRematch) {
      window.s_bAskRematch = Boolean(askRematch);
      if (window.s_bAskRematch && window.s_oGame && typeof window.s_oGame.askRematch === "function") {
        window.s_oGame.askRematch();
        window.s_bAskRematch = false;
      }
    });

    if (typeof window.isIOS === "function" && window.isIOS()) {
      window.setTimeout(window.sizeHandler, 200);
    } else if (typeof window.sizeHandler === "function") {
      window.sizeHandler();
    }
    scheduleAutoStart();
  });
})();
