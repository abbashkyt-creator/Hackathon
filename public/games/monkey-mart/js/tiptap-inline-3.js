function poki_showBanner(vBanner) {
			PokiSDK.displayAd(document.getElementById(vBanner), '320x50');
		}

		function poki_showBigBanner(vBanner) {
			PokiSDK.displayAd(document.getElementById(vBanner), '728x90');
		}

		function poki_hideBanner(vBanner) {
			PokiSDK.destroyAd(document.getElementById(vBanner));
		}
