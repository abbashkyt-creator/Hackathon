/* Local, no-ad compatibility surface for the source Unity Poki bridge. */
(() => {
  "use strict";
  const noop = () => {};
  const resolve = (value) => Promise.resolve(value);
  let initialise;
  let initialised = false;
  const initPromise = new Promise((done) => { initialise = done; });
  const completeInitWhenUnityIsReady = () => {
    if (initialised || !window.pokiBridge || !window.unityGame) return;
    initialised = true;
    window.pokiReady = true;
    initialise();
  };
  const bridgeObserver = window.setInterval(() => {
    completeInitWhenUnityIsReady();
    if (initialised) {
      window.clearInterval(bridgeObserver);
    }
  }, 25);

  window.PokiSDK = Object.freeze({
    // Resolve only after Unity has registered its bridge. The original host
    // does this asynchronously, then the local Unity host sends "ready".
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
    shareableURL: () => resolve(""),
    getUser: () => resolve(null),
    getToken: () => resolve(""),
    login: () => Promise.reject(new Error("Tip Tap does not use source-game accounts.")),
    customEvent: noop,
    logError: noop,
    measure: noop,
    getLanguage: () => "en",
    getURLParam: () => "",
    isAdBlocked: () => true,
  });

  // `tiptap-unity-2020.js` owns initPokiBridge, just like the source host. The
  // observer above resolves the local SDK only after that host has received
  // both the Unity bridge name and the Unity instance.
  window.commercialBreak = () => window.PokiSDK.commercialBreak();
  window.rewardedBreak = (options) => window.PokiSDK.rewardedBreak(options);
  window.shareableURL = () => resolve("");
})();
