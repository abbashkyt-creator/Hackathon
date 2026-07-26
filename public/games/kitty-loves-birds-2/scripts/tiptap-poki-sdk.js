(() => {
  "use strict";

  // Local compatibility surface for the source's optional Poki integration.
  // It deliberately contains no advertising, telemetry, leaderboard, or
  // network methods. The original Construct gameplay is otherwise unchanged.
  const resolve = () => Promise.resolve();
  window.PokiSDK = {
    init: resolve,
    setDebug() {},
    gameLoadingStart() {},
    gameLoadingFinished() {},
    gameLoadingProgress() {},
    gameplayStart() {},
    gameplayStop() {},
    commercialBreak: resolve,
    rewardedBreak(options = {}) {
      options.onStart?.();
      options.onEnd?.(false);
      return Promise.resolve(false);
    },
    measure() {},
  };
})();
