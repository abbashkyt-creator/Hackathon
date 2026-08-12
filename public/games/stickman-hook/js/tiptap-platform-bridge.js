/*
 * Tip Tap local platform bridge for Stickman Hook (custom HTML5 canvas).
 * Replaces PokiSDK with local lifecycle + score reporting. No remote SDK.
 */
(function () {
  'use strict';
  var GAME_SOURCE = 'tiptap-stickman-hook';
  var PARENT_SOURCE = 'tiptap-parent';
  var started = false;
  var scoreSent = false;
  var lastScore = -1;
  var startTime = Date.now();
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
  function sendScore(final) {
    if (scoreSent && !final) return;
    var seconds = Math.floor((Date.now() - startTime) / 1000);
    var score = Math.max(0, Math.floor(seconds * 10));
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
    window.setTimeout(function () { if (!scoreSent) sendScore(false); }, 8000);
    window.setTimeout(function () { if (!scoreSent) sendScore(true); }, 90000);
    record('bridge-booted');
  }
  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    var data = event.data;
    if (!data || data.source !== PARENT_SOURCE) return;
    if (data.type === 'auto-start' && !started) { started = true; bootHooks(); }
  });
  window.setTimeout(function () { if (!started) { started = true; bootHooks(); } }, 2500);
}());
