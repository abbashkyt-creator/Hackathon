/*
 * Tip Tap local platform bridge for Level Devil (Defold build, by Unept).
 * Replaces PokiSDK with local lifecycle + score reporting. The game is a
 * level-based platformer; the bridge reports furthest-progress markers the
 * game itself persists (Defold sav), and falls back to survival seconds so
 * every run ends with a scorable result in the feed. No remote SDK is used.
 */
(function () {
  'use strict';

  var GAME_SOURCE = 'tiptap-level-devil';
  var PARENT_SOURCE = 'tiptap-parent';
  var started = false;
  var scoreSent = false;
  var lastScore = -1;
  var startTime = Date.now();
  var progress = { level: 1, deaths: 0 };
  window.__TIPTAP_BRIDGE_EVENTS__ = window.__TIPTAP_BRIDGE_EVENTS__ || [];

  function record(type, data) {
    window.__TIPTAP_BRIDGE_EVENTS__.push(Object.assign({ type: type, at: Date.now() }, data || {}));
  }
  function postToParent(type, data) {
    record(type, data);
    try {
      window.parent.postMessage(Object.assign({ source: GAME_SOURCE, type: type }, data || {}), window.location.origin);
    } catch (e) {}
  }
  function readProgress() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key) continue;
        var low = key.toLowerCase();
        if (low.indexOf('level') >= 0 || low.indexOf('progress') >= 0 || low.indexOf('devil') >= 0) {
          var value = localStorage.getItem(key);
          var num = parseInt(String(value).replace(/[^\d]/g, ''), 10);
          if (!isNaN(num) && num > 0) {
            progress.level = Math.max(progress.level, num);
            record('progress-read', { key: key, value: num });
          }
        }
      }
    } catch (e) {}
  }
  function sendScore(final) {
    if (scoreSent && !final) return;
    var seconds = Math.floor((Date.now() - startTime) / 1000);
    var score = Math.max(1, progress.level) * 1000 + Math.min(seconds, 599);
    if (score === lastScore && !final) return;
    lastScore = score;
    if (final) {
      postToParent('score', { score: score, final: true });
      scoreSent = true;
    } else {
      postToParent('score', { score: score });
    }
  }
  function bootHooks() {
    readProgress();
    window.setTimeout(function () { if (!scoreSent) sendScore(false); }, 8000);
    window.setTimeout(function () {
      if (!scoreSent) sendScore(true);
    }, 90000);
    record('bridge-booted');
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    var data = event.data;
    if (!data || data.source !== PARENT_SOURCE) return;
    if (data.type === 'auto-start' && !started) {
      started = true;
      bootHooks();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { startTime = Date.now(); });
  }
  window.setTimeout(function () {
    if (!started) {
      started = true;
      bootHooks();
    }
  }, 2500);
}());
