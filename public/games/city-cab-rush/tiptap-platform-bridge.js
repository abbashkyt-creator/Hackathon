/* Local, no-ad compatibility surface for City Cab Rush's Unity Poki bridge. */
(() => {
  "use strict";

  const noop = () => {};
  const resolve = (value) => Promise.resolve(value);
  let bridgeName = "";

  const send = (method, value) => {
    if (!bridgeName || !window.unityGame) return false;
    if (value === undefined) window.unityGame.SendMessage(bridgeName, method);
    else window.unityGame.SendMessage(bridgeName, method, String(value));
    return true;
  };

  // Match the source Unity bridge's ordering: the SDK is ready before the
  // game creates its C# callback target; the final `ready` message is sent
  // only once both that target and the Unity instance exist.
  window.initPokiBridge = (name) => {
    bridgeName = name;
    if (!window.unityGame) {
      window.setTimeout(() => window.initPokiBridge(name), 100);
      return;
    }
    if (window.pokiReady) send("ready");
    else window.pokiBridge = name;
  };

  window.PokiSDK = Object.freeze({
    init: () => resolve(),
    preInit: () => resolve(),
    gameLoadingStart: noop,
    gameLoadingFinished: noop,
    gameLoadingProgress: noop,
    gameplayStart: () => {
      window.__TIPTAP_GAMEPLAY_STARTED__ = true;
    },
    gameplayStop: () => {
      window.__TIPTAP_GAMEPLAY_STARTED__ = false;
    },
    setDebug: noop,
    commercialBreak: () => resolve(),
    rewardedBreak: () => resolve(false),
    displayAd: noop,
    destroyAd: noop,
    redirect: noop,
    shareableURL: () => resolve(""),
    getUser: () => resolve(null),
    getToken: () => resolve(""),
    login: () => Promise.reject(new Error("Tip Tap does not use source-game accounts.")),
    customEvent: noop,
    logError: noop,
    measure: noop,
    getLanguage: () => "en",
    getURLParam: () => "",
    isAdBlocked: () => false,
  });

  // These globals are the exact completion callbacks expected by the C# Unity
  // bridge. They resolve immediately and never invoke an advertisement,
  // source-host account, leaderboard, or network service.
  window.commercialBreak = () =>
    window.PokiSDK.commercialBreak().then(() => send("commercialBreakCompleted"));
  window.rewardedBreak = (...args) =>
    window.PokiSDK.rewardedBreak(...args).then((rewarded) => send("rewardedBreakCompleted", rewarded));
  window.shareableURL = (...args) =>
    window.PokiSDK.shareableURL(...args)
      .then((url) => send("shareableURLResolved", url))
      .catch(() => send("shareableURLRejected"));
  window.getUser = () =>
    window.PokiSDK.getUser()
      .then((user) => send("getUserResolved", JSON.stringify(user || {})))
      .catch(() => send("getUserRejected"));
  window.getToken = () =>
    window.PokiSDK.getToken()
      .then((token) => send("getTokenResolved", token || ""))
      .catch(() => send("getTokenRejected"));
  window.login = () =>
    window.PokiSDK.login()
      .then(() => send("loginResolved"))
      .catch(() => send("loginRejected"));
})();
