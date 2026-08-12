/*
 * Fail-closed local PokiSDK shim for the Drive Mad (Fancade) build.
 * Resolves init immediately so the engine boots; routes ad breaks to the
 * Tip Tap owned-ads client; no-ops lifecycle/leaderboard/custom events.
 * No remote SDK or analytics.
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
    const done = typeof arguments[0] === 'function' ? arguments[0] : undefined;
    return window.TipTapAds && typeof window.TipTapAds.request === 'function'
      ? window.TipTapAds.request(kind, placement).then((result) => { done?.(); return result.shown; })
      : (done?.(), resolved);
  };
  window.PokiSDK = {
    init: () => { trace('init'); return resolved; },
    gameLoadingStart: () => { trace('gameLoadingStart'); },
    gameLoadingFinished: () => { trace('gameLoadingFinished'); },
    gameplayStart: () => { trace('gameplayStart'); },
    gameplayStop: () => { trace('gameplayStop'); },
    commercialBreak: (cb) => adBreak('interstitial', 'drive-mad-source-commercial', cb),
    rewardedBreak: (cb) => adBreak('rewarded', 'drive-mad-source-rewarded', cb),
    showLeaderboard: () => { trace('showLeaderboard'); return resolved; },
    customEvent: () => { trace('customEvent'); return resolved; },
    measure: () => { trace('measure'); return resolved; },
  };
})();
