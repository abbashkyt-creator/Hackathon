(() => {
  "use strict";
  const resolved = (value) => Promise.resolve(value);
  const noop = () => {};
  const send = (method, value) => {
    if (!window.pokiBridge || !window.unityGame) return;
    if (value === undefined) window.unityGame.SendMessage(window.pokiBridge, method);
    else window.unityGame.SendMessage(window.pokiBridge, method, String(value));
  };
  window.PokiSDK = Object.freeze({
    init: () => {
      window.pokiReady = true;
      return resolved();
    },
    gameLoadingStart: noop,
    gameLoadingFinished: noop,
    gameLoadingProgress: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    setDebug: noop,
    commercialBreak: () => resolved(),
    rewardedBreak: () => resolved(false),
    displayAd: noop,
    destroyAd: noop,
    shareableURL: () => resolved(location.href),
    getUser: () => resolved(null),
    getToken: () => resolved(""),
    login: () => Promise.reject(new Error("Source accounts are disabled in Tip Tap.")),
    customEvent: noop,
    logError: noop,
    measure: noop,
    getLanguage: () => "en",
    getURLParam: () => "",
    isAdBlocked: () => true,
  });
  window.initPokiBridge = (target) => {
    window.pokiBridge = target;
    if (window.unityGame) window.unityGame.SendMessage(target, "ready");
  };
  window.commercialBreak = () =>
    window.PokiSDK.commercialBreak().then(() => send("commercialBreakCompleted"));
  window.rewardedBreak = (...args) =>
    window.PokiSDK.rewardedBreak(...args).then((granted) => {
      send("rewardedBreakCompleted", Boolean(granted));
      return granted;
    });
  window.shareableURL = (state) =>
    window.PokiSDK.shareableURL(state).then((url) => {
      send("shareableURLResolved", url);
      return url;
    });
  window.getUser = () =>
    window.PokiSDK.getUser().then((user) => {
      send("getUserResolved", JSON.stringify(user || {}));
      return user;
    });
  window.getToken = () =>
    window.PokiSDK.getToken().then((token) => {
      send("getTokenResolved", token || "");
      return token;
    });
  window.login = () =>
    window.PokiSDK.login().then(
      () => send("loginResolved"),
      (reason) => {
        send("loginRejected");
        throw reason;
      },
    );
})();
