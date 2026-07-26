/*
 * Tip Tap local platform bridge for ArithmeticA.
 *
 * The original Phaser bundle injects Poki's SDK itself.  In this local copy,
 * we replace that one script insertion with a synthetic, local load event and
 * expose only the game lifecycle methods the bundle calls.  No ad, analytics,
 * identity, or source-site request is made by this bridge.
 */
(function () {
  'use strict';

  var GAME_SOURCE = 'tiptap-arithmetica';
  var PARENT_SOURCE = 'tiptap-parent';
  var SOURCE_SDK_URL = 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js';

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

  // The copied Phaser bundle is intentionally left as the original game
  // bundle. It creates a <script> for Poki's SDK during Phaser start-up.
  // Resolve that exact request locally instead of allowing a remote request.
  var appendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function (node) {
    if (
      node instanceof HTMLScriptElement &&
      node.src === SOURCE_SDK_URL
    ) {
      queueMicrotask(function () {
        node.dispatchEvent(new Event('load'));
      });
      return node;
    }
    return appendChild.call(this, node);
  };
})();
