(function() {
                function fin(ok) {
                    window.PokiSDK_OK = ok;
                    GameMaker_Init();
                }
                window.addEventListener("load", function(_) {
                    window.PokiSDK_loadState = 0;
                    if (window.PokiSDK) {
                        PokiSDK.init().then(function() {
                        fin(true);
                    }).catch(function() {
                        fin(false);
                    });
                    } else {
                        window.PokiSDK = null;
                        fin(false);
                    }
                    //PokiSDK.setDebug(true); <-- Uncomment this line for debugging
                });
                })();
