(function() {

            window.html5_has_antialias = function() { return false; }

            HTMLCanvasElement.prototype.getContext = function (orig) {
                return function(type, attrs) {
                    if (attrs == undefined)
                        attrs = {};
                    if (window.devicePixelRatio != undefined && window.devicePixelRatio < 2) {
                        attrs.antialias = true;
                        window.html5_has_antialias = function() { return true; }
                    }

                    return orig.apply(this, [type, attrs]);
                }
            }(HTMLCanvasElement.prototype.getContext);

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
            });
            })();
