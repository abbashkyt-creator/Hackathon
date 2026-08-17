window.addEventListener("load", () => {



			PokiSDK.init().then(
				() => {
					// successfully initialized
					onPokiInitComplete(false);
				}
			).catch(
				() => {
					// successfully initialized but the user has adblock
					onPokiInitComplete(true);
				}
			);

			let config;

			
config = {
    "key": "papa_louie2",
    "title": "Papa Louie 2",
    "filename": "papa_louie_2_sdk",
    "splash": "assets/papa_louie2_splashscreen.jpg",
    "progress": {
        "direction": "lr",
        "back": "#fff",
        "line": "#8DFF42",
        "rect": [
            0.018,
            0.85,
            0.8,
            0.025
        ]
    },
    "loading": {
        "image": "assets/flipline_loading.gif",
        "rect": [
            0.823,
            0.833,
            0.17,
            0.06
        ]
    },
    "start": {
        "image": "assets/flipline_continue.gif",
        "rect": [
            0.823,
            0.833,
            0.17,
            0.06
        ]
    },
    "pokiSDK": true,
    "debugPoki": true,
    "showFPS": false,
    "backgroundColor": "#FFFFFF",
    "debug": false,
    "width": 500,
    "height": 374,
    "x": 0,
    "y": 0,
    "w": "100%",
    "h": "100%",
    "stageScaleMode": null,
    "stageAlign": null,
    "progressParserWeigth": 0.5,
    "skipFramesOfScene": null,
    "buttonPokiSDKActions": null,
    "retryButtonIDS": null,
    "retryButtonAction": null,
    "actionOnStop": null,
    "actionWhenRetryButtonEncountered": null,
    "debugpoki": false,
    "filenameNoSdk": "papa_louie_2",
    "binary": [
        {
            "name": "fonts.swf",
            "path": "assets/fonts.swf",
            "size": 30506
        },
        {
            "name": "papa_louie_2_sdk",
            "path": "assets/papa_louie_2_sdk.swf",
            "size": 8966313,
            "resourceType": "GAME"
        }
    ],
    "runtime": "js/PapaSeries.js"
};

			
			PokiSDK.setDebug(config.debugPoki);

			Loader.init(config);

			let onPokiInitComplete = (adBlocked) => {

				PokiSDK.adBlocked = adBlocked;
				PokiSDK.gameLoadingStart();

				Loader.runGame((fill) => {
					PokiSDK.gameLoadingProgress({
						percentageDone: fill,
						kbLoaded: 0,
						kbTotal: 0,
						fileNameLoaded: "",
						filesLoaded: 0,
						filesTotal: 0
					});
				}, (instance) => {
					PokiSDK.gameLoadingFinished();
				})
			}
		})
