(function () {
			"use strict";
			function log() {
				if (window.__POKI_DEBUG__) {
					try { console.log.apply(console, ["[PokiSDK-local]"].concat([].slice.call(arguments))); } catch (e) {}
				}
			}
			var PokiSDK = {
				init: function () {
					log("init");
					window.PokiSDK_loadState = 1;
					return Promise.resolve();
				},
				gameLoadingStart: function () { log("gameLoadingStart"); },
				gameLoadingProgress: function () { log("gameLoadingProgress"); },
				gameLoadingFinished: function () { log("gameLoadingFinished"); },
				gameplayStart: function () { log("gameplayStart"); },
				gameplayStop: function () { log("gameplayStop"); },
				commercialBreak: function () { log("commercialBreak (no-op)"); return Promise.resolve(); },
				rewardedBreak: function () { log("rewardedBreak (no-op)"); return Promise.resolve({ success: true }); },
				happyTime: function () { log("happyTime"); },
				setDebug: function () { log("setDebug"); }
			};
			window.PokiSDK = PokiSDK;
			window.PokiSDK_OK = true;
			window.PokiSDK_loadState = 1;
			log("shim installed");
		})();
