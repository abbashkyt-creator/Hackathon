/*
 * Tip Tap local platform bridge for Dinosaur Game.
 * Replaces the remote Poki SDK with local lifecycle and score reporting.
 */
(function () {
  'use strict';

  var GAME_SOURCE = 'tiptap-dino-game';
  var PARENT_SOURCE = 'tiptap-parent';
  var params = new URLSearchParams(window.location.search);
  var autoStartRequested = params.get('autoplay') === '1' || params.get('embedded') === 'tiptap';
  var muted = params.get('muted') !== '0';
  var autoStartTimer = 0;
  var autoStartComplete = false;

  window.__TIPTAP_BRIDGE_EVENTS__ = window.__TIPTAP_BRIDGE_EVENTS__ || [];

  function record(type, data) {
    window.__TIPTAP_BRIDGE_EVENTS__.push(
      Object.assign({ type: type, at: Date.now() }, data || {})
    );
  }

  function postToParent(type, data) {
    record(type, data);
    try {
      window.parent.postMessage(
        Object.assign({ source: GAME_SOURCE, type: type }, data || {}),
        window.location.origin
      );
    } catch (e) {}
  }

  function applyMutedState() {
    var audios = document.querySelectorAll('audio');
    for (var i = 0; i < audios.length; i++) audios[i].muted = muted;
  }

  function completeIntroIfNeeded(runner) {
    window.setTimeout(function () {
      if (runner.playingIntro && typeof runner.startGame === 'function') {
        runner.startGame();
        record('autoplay-intro-fallback');
      }
    }, 700);
  }

  function attemptAutoStart() {
    if (!autoStartRequested || autoStartComplete) return;
    var RunnerConstructor = window.Runner;
    var runner = RunnerConstructor && RunnerConstructor.instance_;
    if (!runner || !runner.tRex || !runner.containerEl) {
      autoStartTimer = window.setTimeout(attemptAutoStart, 50);
      return;
    }

    applyMutedState();
    if (runner.crashed) {
      runner.restart();
      autoStartComplete = true;
      record('autoplay-restart');
      return;
    }
    if (!runner.started) {
      if (typeof runner.loadSounds === 'function') runner.loadSounds();
      runner.playIntro();
      completeIntroIfNeeded(runner);
      autoStartComplete = true;
      record('autoplay-intro-start');
      return;
    }
    if (runner.paused && typeof runner.play === 'function') runner.play();
    autoStartComplete = true;
    record('autoplay-resume');
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
  attemptAutoStart();

  window.PokiSDK = {
    init: function (config) {
      if (config && typeof config.submitScore === 'function') {
        config.submitScore(function (key, value) {
          if (key === 'distance' && typeof value === 'number') {
            postToParent('score', { score: Math.round(value) });
          }
        });
      }
      record('sdk-ready');
      return Promise.resolve();
    },
    gameLoadingStart: function () {
      record('loading-start');
    },
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
      return window.TipTapAds.commercial(options, 'dino-commercial');
    },
    rewardedBreak: function (options) {
      record('rewarded-break-requested');
      return window.TipTapAds.rewarded(options, 'dino-rewarded');
    },
    displayAd: function (options) { return window.TipTapAds.display(options, 'dino-display'); },
    destroyAd: function () {},
    happytime: function () {},
    loadingStart: function () {},
    loadingFinished: function () {}
  };
})();
