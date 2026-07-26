/*
 * Local lifecycle adapter for 67 Game. The licensed source is an SWF, played
 * by the local Ruffle runtime. No Poki code, ad SDK, analytics, or remote
 * request is used at runtime.
 */
(function () {
  'use strict';

  var GAME_SOURCE = 'tiptap-67-game';
  var PARENT_SOURCE = 'tiptap-parent';
  var params = new URLSearchParams(window.location.search);
  var autoStartRequested = params.get('autoplay') === '1' || params.get('embedded') === 'tiptap';
  var muted = params.get('muted') !== '0';
  var player = null;
  var playerApi = null;
  var autoStartTimer = 0;
  var launched = false;

  window.__TIPTAP_BRIDGE_EVENTS__ = window.__TIPTAP_BRIDGE_EVENTS__ || [];

  function record(type, data) {
    window.__TIPTAP_BRIDGE_EVENTS__.push(Object.assign({ type: type, at: Date.now() }, data || {}));
  }

  function postToParent(type, data) {
    record(type, data);
    window.parent.postMessage(Object.assign({ source: GAME_SOURCE, type: type }, data || {}), window.location.origin);
  }

  function applyMutedState() {
    if (playerApi) playerApi.volume = muted ? 0 : 1;
  }

  function autoStart() {
    if (!autoStartRequested || !playerApi || launched) return;
    // Ruffle 0.4.1 reports Loaded as enum value 2; older builds exposed the
    // string. Support both without treating an initial timeline as gameplay.
    if (playerApi.readyState !== 2 && playerApi.readyState !== 'Loaded') {
      autoStartTimer = window.setTimeout(autoStart, 80);
      return;
    }
    launched = true;
    playerApi.resume();
    applyMutedState();
    // The original SWF's own start button requires a browser-trusted user
    // gesture. A JavaScript-generated click cannot satisfy that requirement,
    // so do not pretend to auto-play or consume the player's first puzzle tap.
    record('awaiting-source-start-tap');
  }

  function boot() {
    if (!window.RufflePlayer || !window.RufflePlayer.newest) {
      postToParent('runtime-error', { detail: 'Ruffle did not load.' });
      return;
    }
    window.RufflePlayer.config = Object.assign({}, window.RufflePlayer.config, {
      autoplay: 'on',
      unmuteOverlay: 'hidden',
      splashScreen: false,
      contextMenu: 'off',
      scale: 'showAll',
      publicPath: './ruffle/',
    });

    player = window.RufflePlayer.newest().createPlayer();
    playerApi = player.ruffle();
    applyMutedState();
    player.onFSCommand = function (command, args) {
      // Preserve genuine source signals for future review. This SWF currently
      // emits no documented score signal, so none is converted into a score.
      record('fscommand', { command: String(command || ''), args: String(args || '') });
    };
    player.addEventListener('loadedmetadata', function () {
      record('runtime-loaded');
      autoStart();
    });
    document.getElementById('game').appendChild(player);
    // Ruffle 0.4.1's public load API accepts a URL string. Network-lock runs
    // before this adapter and blocks any attempt by the SWF to leave our origin.
    playerApi.load('./67.swf').catch(function (error) {
      postToParent('runtime-error', { detail: String(error) });
    });
    autoStart();
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin || !event.data || event.data.source !== PARENT_SOURCE) return;
    if (event.data.type === 'set-muted') {
      muted = !!event.data.muted;
      applyMutedState();
    }
    if (event.data.type === 'auto-start') {
      autoStartRequested = true;
      window.clearTimeout(autoStartTimer);
      autoStart();
    }
  });

  window.addEventListener('DOMContentLoaded', boot);
})();
