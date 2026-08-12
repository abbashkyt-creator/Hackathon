/*
 * Fail-closed local PokiSDK shim for the Slice Master build.
 * The game's own scripts call PokiSDK.init / gameLoadingFinished / breaks.
 * This shim resolves init immediately so the scene loads, routes ad breaks to
 * the Tip Tap owned-ads client, and no-ops lifecycle calls. No remote SDK.
 */
(function () {
  'use strict';
  const resolved = Promise.resolve();
  const sdkEvents = [];
  const trace = (event) => {
    sdkEvents.push({ event, at: Date.now() });
    if (sdkEvents.length > 80) sdkEvents.shift();
    window.__TIPTAP_SDK_EVENTS__ = sdkEvents;
  };
  window.PokiSDK = {
    init: () => { trace('init'); return resolved; },
    gameLoadingFinished: () => { trace('gameLoadingFinished'); },
    gameplayStart: () => { trace('gameplayStart'); },
    gameplayStop: () => { trace('gameplayStop'); },
    commercialBreak: (callbacks) => {
      trace('commercialBreak');
      const cb = (typeof callbacks === 'function') ? callbacks : callbacks?.onStart;
      return window.TipTapAds && typeof window.TipTapAds.request === 'function'
        ? window.TipTapAds.request('interstitial', 'slice-master-source-commercial').then((result) => { cb?.(); return result.shown; })
        : (cb?.(), resolved);
    },
    rewardedBreak: (callbacks) => {
      trace('rewardedBreak');
      const cb = (typeof callbacks === 'function') ? callbacks : callbacks?.onStart;
      return window.TipTapAds && typeof window.TipTapAds.request === 'function'
        ? window.TipTapAds.request('rewarded', 'slice-master-source-rewarded').then((result) => { cb?.(); return result.shown; })
        : (cb?.(), resolved);
    },
  };
})();
