let issdkinit = false;
            let isgetData = false;
            let isBannerShow = true;
            let isBannerLoaded = false;
            let isBannerRequestLoaded = false;
            let lastBannerTime = 0;
            let BannerWidth = 0;
            let BannerHeight = 0;
            let BANNER_COOLDOWN = 30000; // 30 seconds
            let BANNER_REFRESHDOWN = 60000; // 30 seconds

            async function initSDK() {
                console.log("initSDK called");

                try {
                    PokiSDK.init().then(() => {
                        console.log("Poki SDK successfully initialized");
                        issdkinit = true;
                        console.log("init sdk");

                        // fire your function to continue to game
                    }).catch(() => {
                        console.log("Initialized, something went wrong, load you game anyway");
                        // fire your function to continue to game
                    });                   
                } catch (e) {}
            }
            // Run after SDK file loads
            window.addEventListener("load", () => {
                initSDK();
            });
            window.addEventListener('keydown', ev => {
                if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
                    ev.preventDefault();
                }
            });
            window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });


            function requestFullAds() {
                if (!issdkinit) return;
                console.log("requestAds");
                try {
                    cc.game.emit("CONSTANT_COMMONGAMEPAUSE");
                    // pause your game here if it isn't already
                    PokiSDK.commercialBreak(() => {
                    // you can pause any background music or other audio here
                    }).then(() => {
                    console.log("Commercial break finished, proceeding to game");
                    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
                    // continue your game here
                    cc.game.emit("CONSTANT_COMMONGAMERESUME");
                    
                    });


                } catch (e) {}
            }
            function requestRewardAds() {
                if (!issdkinit) return;
                console.log("requestRewardAds");
                try {
                    // pause your game here if it isn't already
                    PokiSDK.rewardedBreak(() => {
                    // you can pause any background music or other audio here
                    cc.game.emit("CONSTANT_COMMONGAMEPAUSE");
                    }).then((success) => {
                        if(success) {
                            // video was displayed, give reward
                            cc.game.emit("CONSTANT_COMMONADREWARDCALLBACK");
                        } else {
                            // video not displayed, should not give reward
                        }
                        // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
                        console.log("Rewarded break finished, proceeding to game");
                        // continue your game here
                        cc.game.emit("CONSTANT_COMMONGAMERESUME");
                    });
                } catch (e) {}
            }

            async function LoadBanner(_width, _height) {
               
            }
            function clearBanner() {}
            function isBannerAdLoaded() {
                
            }
            async function showBanner() {
               
            }
            function hideBanner() {
            
            }
            
            function gameplayStart() {
                if (!issdkinit) return;
                try {
                    PokiSDK.gameplayStart();
                } catch (e) {}
            }
            function gameplayStop() {
                if (!issdkinit) return;
                try {
                    PokiSDK.gameplayStop();
                } catch (e) {}
            }
            function loadingStart() {
            }
            function loadingStop() {
                if (!issdkinit) return;
                try {
                    PokiSDK.gameLoadingFinished();
                } catch (e) {}
            }
            function happytime() {
            }
            function setStorage(key, value) {
            }
            function getStorage(key) {
            }
            function removeStorage(key) {
            }
