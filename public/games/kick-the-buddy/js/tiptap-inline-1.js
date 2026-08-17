// -- BRIDGE STATE --
  let pokiBridgeObjectName = null; 
  let pokiInitStatus = "pending";

  // -- STEAL THE UNITY INSTANCE AND TRACK LOADING --
  const originalAppendChild = document.body.appendChild;
  document.body.appendChild = function(element) {
      if (element.tagName === 'SCRIPT' && element.onload) {
          const originalOnLoad = element.onload;
          element.onload = function(event) {
              if (window.createUnityInstance && !window._unityWrapperApplied) {
                  window._unityWrapperApplied = true; // Prevent double-wrapping
                  const originalCreate = window.createUnityInstance;
                  
                  window.createUnityInstance = function(canvas, config, originalProgress) {
                      
                      PokiSDK.gameLoadingStart();
                      PokiSDK.measure("game", "unity-download", "start");

                      const wrappedProgress = function(progress) {
                          PokiSDK.gameLoadingProgress({ percentageDone: progress });
                          if (originalProgress) {
                              originalProgress.apply(this, arguments); 
                          }
                      };

                      return originalCreate(canvas, config, wrappedProgress).then((instance) => {
                          
                          PokiSDK.gameLoadingFinished();
                          PokiSDK.measure("game", "unity-download", "complete");
                          PokiSDK.measure("game", "ingame-load", "start");
                          if (typeof window.onSplashHidden === "function") {
                            window.onSplashHidden(function() {
                                PokiSDK.measure("game", "ingame-load", "complete");
                            })
                          }

                          window.unityGame = instance;
                          
                          if (pokiBridgeObjectName && pokiInitStatus !== "pending") {
                              window.unityGame.SendMessage(pokiBridgeObjectName, pokiInitStatus);
                          }
                          return instance;
                      });
                  };
              }
              originalOnLoad.call(this, event);
          };
      }
      return originalAppendChild.call(this, element);
  };

  // -- INITIALIZE POKI SDK --
  PokiSDK.init().then(() => {
      console.log("Poki SDK initialized successfully");
      pokiInitStatus = "ready";
      if (window.unityGame && pokiBridgeObjectName) {
          window.unityGame.SendMessage(pokiBridgeObjectName, pokiInitStatus);
      }
  }).catch(() => {
      console.log("Poki SDK init caught (Adblocker active). Loading game anyway.");
      pokiInitStatus = "adblock";
      if (window.unityGame && pokiBridgeObjectName) {
          window.unityGame.SendMessage(pokiBridgeObjectName, pokiInitStatus);
      }
  });

  // -- IMPLEMENT JSLIB BRIDGE FUNCTIONS --
  window.initPokiBridge = function(objectName) {
      pokiBridgeObjectName = objectName;
      if (pokiInitStatus !== "pending" && window.unityGame) {
          window.unityGame.SendMessage(pokiBridgeObjectName, pokiInitStatus);
      }
  };

  window.commercialBreak = function() {
      PokiSDK.commercialBreak().then(() => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "commercialBreakCompleted");
          }
      }).catch(() => {
          // Always release the ad state on Unity's side, otherwise IsFullScreenAdShowing
          // stays true forever and blocks every future interstitial/rewarded/banner.
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "commercialBreakCompleted");
          }
      });
  };

  window.rewardedBreak = function(options) {
      PokiSDK.rewardedBreak(options).then((success) => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "rewardedBreakCompleted", success ? "true" : "false");
          }
      }).catch(() => {
          // Same reasoning as commercialBreak: never leave the reward flow hanging.
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "rewardedBreakCompleted", "false");
          }
      });
  };

  window.shareableURL = function(jsonOptions) {
      PokiSDK.shareableURL(jsonOptions).then((url) => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "shareableURLResolved", url);
          }
      }).catch(() => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "shareableURLRejected");
          }
      });
  };

  window.getUser = function() {
      PokiSDK.getUser().then((user) => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "getUserResolved", JSON.stringify(user || {}));
          }
      }).catch(() => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "getUserRejected");
          }
      });
  };

  window.getToken = function() {
      PokiSDK.getToken().then((token) => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "getTokenResolved", token || "");
          }
      }).catch(() => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "getTokenRejected");
          }
      });
  };

  window.login = function() {
      PokiSDK.login().then(() => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "loginResolved");
          }
      }).catch(() => {
          if (window.unityGame && pokiBridgeObjectName) {
              window.unityGame.SendMessage(pokiBridgeObjectName, "loginRejected");
          }
      });
  };
