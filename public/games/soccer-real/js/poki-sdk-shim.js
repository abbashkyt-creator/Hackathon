/*
 * Fail-closed local PokiSDK shim for the Soccer REAL build (Three.js).
 * Resolves init immediately; routes ad breaks to the Tip Tap owned-ads
 * client; no-ops lifecycle. No remote SDK or analytics.
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
  const adBreak = (kind, placement) => {
    trace(kind);
    return window.TipTapAds && typeof window.TipTapAds.request === 'function'
      ? window.TipTapAds.request(kind, placement).then((result) => result.shown)
      : resolved;
  };
  window.PokiSDK = {
    init: () => { trace('init'); return resolved; },
    gameLoadingStart: () => { trace('gameLoadingStart'); },
    gameLoadingProgress: () => { trace('gameLoadingProgress'); },
    gameLoadingFinished: () => { trace('gameLoadingFinished'); },
    gameplayStart: () => { trace('gameplayStart'); },
    gameplayStop: () => { trace('gameplayStop'); },
    commercialBreak: (cb) => adBreak('interstitial', 'soccer-real-source-commercial').then((shown) => { if (shown) cb?.(); }),
    rewardedBreak: (cb) => adBreak('rewarded', 'soccer-real-source-rewarded').then((shown) => { if (shown) cb?.(); }),
    customEvent: () => { trace('customEvent'); },
    destroyAd: () => { trace('destroyAd'); },
    displayAd: () => { trace('displayAd'); },
    happyTime: () => { trace('happyTime'); },
    setDebug: () => { trace('setDebug'); },
  };
})();
