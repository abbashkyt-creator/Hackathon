/*
 * Tip Tap local Poki SDK bridge for ArithmeticA.
 * The game itself has no PokiSDK calls — Poki's loader injects it.
 * This bridge provides stubs so the game runs cleanly when loaded directly.
 */
(function () {
  'use strict';

  var GAME_SOURCE = 'tiptap-arithmetica';
  var PARENT_SOURCE = 'tiptap-parent';

  function postToParent(type, data) {
    try {
      window.parent.postMessage(
        Object.assign({ source: GAME_SOURCE, type: type }, data || {}),
        window.location.origin
      );
    } catch (e) {}
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    var d = event.data;
    if (!d || d.source !== PARENT_SOURCE) return;
    if (d.type === 'set-muted') {
      try { Howler.mute(!!d.muted); } catch (e) {}
    }
    if (d.type === 'auto-start') {
      /* Phaser games auto-start via their own scene lifecycle */
    }
  });

  window.PokiSDK = {
    init: function () { return Promise.resolve(); },
    gameLoadingStart: function () {},
    gameLoadingFinished: function () {},
    gameplayStart: function () { postToParent('gameplay-start'); },
    gameplayStop: function () { postToParent('gameplay-stop'); },
    commercialBreak: function () { return Promise.resolve(); },
    rewardedBreak: function () { return Promise.resolve(false); },
    displayAd: function () {},
    destroyAd: function () {},
    happytime: function () {},
    loadingStart: function () {},
    loadingFinished: function () {}
  };
})();
