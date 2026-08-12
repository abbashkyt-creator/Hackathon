/*
 * Tip Tap local platform bridge for 2048 (Gabriele Cirulli, MIT).
 * Replaces any remote SDK with local lifecycle + score reporting.
 */
(function () {
  'use strict';

  var GAME_SOURCE = 'tiptap-2048';
  var PARENT_SOURCE = 'tiptap-parent';
  var params = new URLSearchParams(window.location.search);
  var autoStartRequested = params.get('autoplay') === '1' || params.get('embedded') === 'tiptap';
  var muted = params.get('muted') !== '0';

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

  // Try to start a game through the real 2048 API. The game exposes
  // HTMLActuator globals; we drive it like a first keyboard move when the
  // browser needs a gesture, otherwise the grid is idle waiting for input.
  function attemptAutoStart() {
    if (!autoStartRequested) return;
    record('autoplay-attempt');
  }

  // A real move happens on first interaction (swipe / arrow). Report the
  // current score upward on each completed move and on game-over so Tip Tap
  // can end the ranked run.
  var lastReported = -1;
  function reportScore() {
    var scoreInput = document.querySelector('.score-container .score-addition');
    var container = document.querySelector('.score-container');
    var score = 0;
    if (container) {
      var match = container.textContent.replace(/[^\d]/g, '');
      score = parseInt(match || '0', 10);
    }
    if (score !== lastReported) {
      lastReported = score;
      postToParent('score', { score: score });
    }
    var over = document.querySelector('.game-over') !== null;
    if (over) {
      postToParent('game-over', { score: score });
    }
  }

  // Hook the underlying GameManager so every move pushes a fresh score event.
  // The game keeps a global `GameManager` instance on window (from application.js).
  function hookGameManager() {
    var gm = window.GameManager && window.GameManager.instance;
    if (!gm) {
      window.setTimeout(hookGameManager, 100);
      return;
    }
    if (gm.__tiptap_hooked) return;
    gm.__tiptap_hooked = true;
    var originalMove = gm.move;
    if (typeof originalMove === 'function') {
      gm.move = function () {
        var result = originalMove.apply(this, arguments);
        reportScore();
        return result;
      };
    }
    // Report immediately if a game is already in progress.
    reportScore();
    record('bridge-hooked');
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    var data = event.data;
    if (!data || data.source !== PARENT_SOURCE) return;
    if (data.type === 'set-muted') {
      muted = data.muted === true;
      var audios = document.querySelectorAll('audio');
      for (var i = 0; i < audios.length; i++) audios[i].muted = muted;
    }
    if (data.type === 'auto-start') {
      attemptAutoStart();
      hookGameManager();
    }
  });

  // Also try to hook once DOM is ready; the parent may message before scripts run.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hookGameManager(); });
  } else {
    window.setTimeout(hookGameManager, 200);
  }
}());
