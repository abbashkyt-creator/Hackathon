pauseGame  = function(){};
		resumeGame = function(){};
		isAdsBlock = false;

		PokiSDK.init().then(
			() => {
				lime.embed ("tiny_baker_ocean_jelly_cake", "openfl-content", 0, 0, { parameters: {} });				
				console.log("PokiSDK initialized");
			}   
		).catch(
			() => {
				lime.embed ("tiny_baker_ocean_jelly_cake", "openfl-content", 0, 0, { parameters: {} });
				isAdsBlock = true;
				console.log("Adblock enabled");
			}   
		);
		//PokiSDK.setDebug(true); //live disable
