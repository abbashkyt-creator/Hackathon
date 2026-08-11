/*
 * Tip Tap local platform bridge for Ping Pong Go! (Happylander Ltd, via Poki).
 *
 * Replaces the remote Poki SDK (game-cdn.poki.com/scripts/v2/poki-sdk.js) with a
 * local, no-ad, no-analytics implementation and drives one of the game's OWN
 * single-player modes automatically, selected by the ?mode= query parameter:
 *
 *   mode=arcade  (default) -> the headline table-tennis match vs the CPU. The
 *                bridge sets the game's arcade variation and calls its own
 *                initGame(); score = total rally points the player wins.
 *   mode=bughunt          -> the Bug Hunt mini-mode. The bridge calls the game's
 *                own bugGameFromStart handler; score = the game's own integer
 *                curTargetScore at its own round-end.
 *
 * Nothing here fakes gameplay or a score. Auto-start invokes the game's own start
 * path, which fires the game's own PokiSDK.gameplayStart(); the reported score is
 * always the game's own authoritative integer.
 */
(function () {
  'use strict';

  var GAME_SOURCE = 'tiptap-ping-pong-go';
  var PARENT_SOURCE = 'tiptap-parent';
  var params = new URLSearchParams(window.location.search);
  var mode = params.get('mode') === 'bughunt' ? 'bughunt' : 'arcade';
  var autoStartRequested = params.get('autoplay') === '1' || params.get('embedded') === 'tiptap';
  var muted = params.get('muted') !== '0';

  var autoStartComplete = false;
  var autoStartTimer = 0;
  var scoreReported = false;

  // Arcade point tracking (userScore resets each set, so we sum deltas).
  var pointsWon = 0;
  var lastUserScore = 0;
  // Bug Hunt end-function wrap installed flag.
  var scoreHooked = false;
  var pollTimer = 0;

  window.__TIPTAP_BRIDGE_EVENTS__ = window.__TIPTAP_BRIDGE_EVENTS__ || [];

  function record(type, data) {
    window.__TIPTAP_BRIDGE_EVENTS__.push(Object.assign({ type: type, at: Date.now() }, data || {}));
  }

  function postToParent(type, data) {
    record(type, data);
    try {
      window.parent.postMessage(
        Object.assign({ source: GAME_SOURCE, type: type }, data || {}),
        window.location.origin,
      );
    } catch (e) {}
  }

  function applyMutedState() {
    try {
      window.muted = muted;
    } catch (e) {}
    if (window.Howler && typeof window.Howler.mute === 'function') {
      try {
        window.Howler.mute(muted);
      } catch (e) {}
    }
  }

  function reportScore(rawScore) {
    if (scoreReported) return;
    var score = Math.round(Number(rawScore));
    if (!Number.isFinite(score) || score < 0) score = 0;
    scoreReported = true;
    postToParent('score', { score: score });
  }

  // Bug Hunt: wrap the game's own round-end functions so we forward its own
  // integer score (curTargetScore) exactly once, without touching app.js.
  function hookBugHuntScore() {
    if (scoreHooked) return;
    var wrapped = false;
    ['initBugGameEnd', 'initTargetGameEnd'].forEach(function (name) {
      var original = window[name];
      if (typeof original !== 'function' || original.__tiptapWrapped) return;
      var patched = function () {
        var result = original.apply(this, arguments);
        reportScore(window.curTargetScore);
        return result;
      };
      patched.__tiptapWrapped = true;
      window[name] = patched;
      wrapped = true;
    });
    if (wrapped) {
      scoreHooked = true;
      record('score-hook-installed');
    }
  }

  // Poll the game's own state. In arcade mode, accumulate every rally point the
  // player wins and report the total once the match reaches its own end screen
  // (gameplayState 2 = won, 3 = level complete, 10 = end/reward). In bughunt mode,
  // just make sure the end-function score wrap is installed.
  function pollGame() {
    if (mode === 'bughunt') {
      hookBugHuntScore();
    } else {
      var gs = window.gameplayState;
      var gv = window.gameVariation;
      if (gv === 0 && gs === 1) {
        var cur = Number(window.userScore);
        if (Number.isFinite(cur)) {
          if (cur > lastUserScore) pointsWon += cur - lastUserScore;
          lastUserScore = cur;
        }
      }
      if (!scoreReported && gv === 0 && (gs === 2 || gs === 3 || gs === 10)) {
        record('match-ended', { pointsWon: pointsWon });
        reportScore(pointsWon);
      }
    }
    pollTimer = window.setTimeout(pollGame, 150);
  }

  // Auto-start the requested mode using the game's own start path once the main
  // menu is ready (gameState "game" while idle at gameplayState 0, panel + mode
  // tray built). initGame()/bugGameFromStart fire the game's own gameplayStart.
  function attemptAutoStart() {
    if (!autoStartRequested || autoStartComplete) return;

    var ready =
      typeof window.initGame === 'function' &&
      typeof window.butEventHandler === 'function' &&
      window.gameState === 'game' &&
      window.gameplayState === 0 &&
      window.panel &&
      window.modesTray &&
      !window.isRotated;

    if (!ready) {
      autoStartTimer = window.setTimeout(attemptAutoStart, 60);
      return;
    }

    applyMutedState();
    try {
      if (mode === 'bughunt') {
        window.butEventHandler('bugGameFromStart');
      } else {
        window.gameVariation = 0;
        lastUserScore = Number(window.userScore) || 0;
        window.initGame();
      }
      autoStartComplete = true;
      record('autoplay-' + mode + '-start');
    } catch (e) {
      record('autoplay-error', { message: String(e && e.message) });
      autoStartTimer = window.setTimeout(attemptAutoStart, 120);
    }
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    var data = event.data;
    if (!data || data.source !== PARENT_SOURCE) return;
    if (data.type === 'set-muted') {
      muted = !!data.muted;
      applyMutedState();
    }
    if (data.type === 'auto-start') {
      autoStartRequested = true;
      window.clearTimeout(autoStartTimer);
      attemptAutoStart();
    }
  });

  window.addEventListener('DOMContentLoaded', function () {
    applyMutedState();
    attemptAutoStart();
  });
  window.addEventListener('load', attemptAutoStart);
  pollGame();

  var noop = function () {};

  // Minimal local stand-in for the Poki SDK. Ads resolve as "no ad", rewarded
  // resolves as "no reward", analytics/measure are dropped, and lifecycle events
  // are forwarded to the Tip Tap parent. No request leaves this origin.
  window.PokiSDK = {
    init: function () {
      record('sdk-ready');
      return Promise.resolve();
    },
    setDebug: noop,
    gameLoadingStart: function () {
      record('loading-start');
    },
    gameLoadingProgress: noop,
    gameLoadingFinished: function () {
      record('loading-finished');
      attemptAutoStart();
    },
    gameplayStart: function () {
      postToParent('gameplay-start');
    },
    gameplayStop: function () {
      postToParent('gameplay-stop');
    },
    commercialBreak: function (options) {
      record('commercial-break-requested');
      return window.TipTapAds.commercial(options, 'ping-pong-commercial');
    },
    rewardedBreak: function (options) {
      record('rewarded-break-requested');
      return window.TipTapAds.rewarded(options, 'ping-pong-rewarded');
    },
    happytime: noop,
    displayAd: function (options) { return window.TipTapAds.display(options, 'ping-pong-display'); },
    destroyAd: noop,
    getURLParam: function (key) {
      return params.get(key);
    },
    measure: noop,
    shareableURL: function () {
      return Promise.resolve(window.location.href);
    },
    getFullscreenAPI: function () {
      return null;
    },
    isAdBlocked: function () {
      return Promise.resolve(false);
    }
  };
})();
