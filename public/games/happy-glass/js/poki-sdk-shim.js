/*
 * Fail-closed local PokiSDK shim for the Happy Glass (Unity) build.
 * Covers every _JS_PokiSDK_* glue surface the framework touches:
 * window-level functions (commercialBreak, rewardedBreak, initPokiBridge,
 * shareableURL, properUnityStringify) and the PokiSDK object methods.
 * No remote SDK or analytics — ad breaks route to the Tip Tap owned-ads client.
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

  const requestAd = (kind, placement) => {
    trace(kind);
    return window.TipTapAds && typeof window.TipTapAds.request === 'function'
      ? window.TipTapAds.request(kind, placement).then((result) => result.shown)
      : resolved;
  };

  // The Unity glue calls these as bare window functions.
  window.properUnityStringify = window.properUnityStringify || JSON.stringify;
  window.unityStringify = window.unityStringify || JSON.stringify;
  window.commercialBreak = function () { trace('commercialBreak'); requestAd('interstitial', 'happy-glass-source-commercial'); };
  window.rewardedBreak = function () { trace('rewardedBreak'); requestAd('rewarded', 'happy-glass-source-rewarded'); };
  window.initPokiBridge = function () { trace('initPokiBridge'); return resolved; };
  window.shareableURL = function () { trace('shareableURL'); return Promise.resolve(''); };

  const sdk = {
    init: () => { trace('init'); return resolved; },
    gameLoadingStart: () => { trace('gameLoadingStart'); },
    gameLoadingFinished: () => { trace('gameLoadingFinished'); },
    gameplayStart: () => { trace('gameplayStart'); },
    gameplayStop: () => { trace('gameplayStop'); },
    commercialBreak: (cb) => requestAd('interstitial', 'happy-glass-source-commercial').then((shown) => { if (shown) cb?.(); }),
    rewardedBreak: (cb) => requestAd('rewarded', 'happy-glass-source-rewarded').then((shown) => { if (shown) cb?.(); }),
    customEvent: () => { trace('customEvent'); },
    destroyAd: () => { trace('destroyAd'); },
    displayAd: () => { trace('displayAd'); },
    isAdBlocked: () => { trace('isAdBlocked'); return Promise.resolve(false); },
    getLanguage: () => 'en',
    getURLParam: () => null,
    logError: () => { trace('logError'); },
    shareableURL: () => Promise.resolve(''),
    initPokiBridge: () => resolved,
  };
  window.PokiSDK = window.PokiSDK || sdk;
  for (const key of Object.keys(sdk)) {
    if (typeof window.PokiSDK[key] !== 'function') window.PokiSDK[key] = sdk[key];
  }
})();
