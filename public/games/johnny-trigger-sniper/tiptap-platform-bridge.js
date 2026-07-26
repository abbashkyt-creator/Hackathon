/* Local no-ad compatibility surface for the copied Unity Poki integration. */
(() => {
  "use strict";
  const noop = () => {};
  const resolve = (value) => Promise.resolve(value);
  const contexts = new Set();
  const NativeAudioContext = window.AudioContext || window.webkitAudioContext;
  let muted = new URLSearchParams(window.location.search).get("muted") !== "0";
  let completeInit;
  let initialised = false;
  const initPromise = new Promise((done) => { completeInit = done; });

  if (NativeAudioContext) {
    class TipTapAudioContext extends NativeAudioContext {
      constructor(...args) {
        super(...args);
        contexts.add(this);
        if (muted) void this.suspend().catch(noop);
      }
    }
    window.AudioContext = TipTapAudioContext;
    if (window.webkitAudioContext) window.webkitAudioContext = TipTapAudioContext;
  }

  const applyMuted = (nextMuted) => {
    muted = Boolean(nextMuted);
    window.__TIPTAP_MUTED__ = muted;
    document.querySelectorAll("audio, video").forEach((media) => {
      media.muted = muted;
    });
    contexts.forEach((context) => {
      const action = muted ? context.suspend() : context.resume();
      if (action?.catch) action.catch(noop);
    });
  };

  const completeWhenUnityReady = () => {
    if (initialised || !window.pokiBridge || !window.unityGame) return;
    initialised = true;
    window.pokiReady = true;
    completeInit();
  };
  const observer = window.setInterval(() => {
    completeWhenUnityReady();
    if (initialised) window.clearInterval(observer);
  }, 25);
  const observerTimeout = window.setTimeout(() => window.clearInterval(observer), 120_000);

  window.addEventListener("message", (event) => {
    if (
      event.origin !== window.location.origin ||
      event.source !== window.parent ||
      event.data?.source !== "tiptap-parent" ||
      event.data?.type !== "set-state"
    ) return;
    applyMuted(event.data.muted || event.data.active === false);
  });
  window.addEventListener("pagehide", () => {
    window.clearInterval(observer);
    window.clearTimeout(observerTimeout);
    applyMuted(true);
  }, { once: true });
  applyMuted(muted);

  window.PokiSDK = Object.freeze({
    init: () => initPromise,
    gameLoadingStart: noop,
    gameLoadingFinished: noop,
    gameLoadingProgress: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    setDebug: noop,
    commercialBreak: () => resolve(),
    rewardedBreak: () => resolve(false),
    displayAd: noop,
    destroyAd: noop,
    customEvent: noop,
    logError: noop,
    measure: noop,
    shareableURL: () => resolve(""),
    getUser: () => resolve(null),
    getToken: () => resolve(""),
    login: () => Promise.reject(new Error("Tip Tap does not use source-game accounts.")),
    getLanguage: () => "en",
    getURLParam: () => "",
    isAdBlocked: () => true,
  });
})();
