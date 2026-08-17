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
    "title": "Graveyard Shift",
    "filename": "graveyardshift_sdk",
    "stageScaleMode": "showAll",
    "pokiSDK": true,
    "debugPoki": true,
    "showFPS": false,
    "backgroundColor": "#FFFFFF",
    "debug": false,
    "splash": "assets/todo.jpg",
    "start": null,
    "width": 720,
    "height": 480,
    "x": 0,
    "y": 0,
    "w": "100%",
    "h": "100%",
    "stageAlign": null,
    "progressParserWeigth": 1,
    "progress": {
        "direction": "lr",
        "back": "#35809e",
        "line": "#070bff",
        "rect": [
            0.25,
            0.65,
            0.5,
            0.01
        ]
    },
    "skipFramesOfScene": null,
    "buttonPokiSDKActions": null,
    "retryButtonIDS": null,
    "retryButtonAction": null,
    "actionOnStop": null,
    "actionWhenRetryButtonEncountered": null,
    "debugpoki": false,
    "filenameNoSdk": "graveyardshift",
    "binary": [
        {
            "name": "fonts.swf",
            "path": "assets/fonts.swf",
            "size": 30506
        },
        {
            "name": "graveyardshift_sdk",
            "path": "assets/graveyardshift_sdk.swf",
            "size": 2285429,
            "resourceType": "GAME"
        }
    ],
    "runtime": "js/NitromeBatch7.js"
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
