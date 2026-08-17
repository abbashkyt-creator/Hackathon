if (typeof window.PokiSDK === "undefined") {
        window.PokiSDK = {
          init: () => Promise.resolve(),
          gameLoadingFinished: () => {},
          gameplayStart: () => {},
          gameplayStop: () => {},
          commercialBreak: () => Promise.resolve(),
          rewardedBreak: () => Promise.resolve(true),
          happyTime: () => {},
        };
      }
