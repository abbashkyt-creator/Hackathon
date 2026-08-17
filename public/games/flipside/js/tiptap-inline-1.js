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
    "key": "flipside",
    "title": "Flipside",
    "filename": "flipside_sdk",
    "width": 550,
    "height": 400,
    "pokiSDK": true,
    "debugPoki": true,
    "showFPS": false,
    "backgroundColor": "#FFFFFF",
    "debug": false,
    "splash": "assets/todo.jpg",
    "start": null,
    "x": 0,
    "y": 0,
    "w": "100%",
    "h": "100%",
    "stageScaleMode": null,
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
    "filenameNoSdk": "flipside",
    "binary": [
        {
            "name": "fonts.swf",
            "path": "assets/fonts.swf",
            "size": 30506
        },
        {
            "name": "flipside_sdk",
            "path": "assets/flipside_sdk.swf",
            "size": 1062861,
            "resourceType": "GAME"
        }
    ],
    "runtime": "js/Nitrome.js"
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
