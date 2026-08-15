var isWasmLoaded = false;
		var isPokiSDKInited = false;
		var runFunc = function() {
			if (isPokiSDKInited && isWasmLoaded) {
				Module.runApp("canvas");
			}
		}
		Module['onRuntimeInitialized'] = function() {
			isWasmLoaded = true;
			runFunc();
		};
		function poki_sdk_loaded() {
			var data = {};
			var isLoadFinished = false;
			Progress.addListener(function(percentage){
				data.percentageDone = percentage / 100;
				if (!isLoadFinished)
					PokiSDK.gameLoadingProgress(data);
				if (percentage == 100 && !isLoadFinished) {
					PokiSDK.gameLoadingFinished();
					isLoadFinished = true;
				}
			});
			PokiSDK.init().then(()=>{
					isPokiSDKInited = true;
					runFunc();
				}, ()=>{
					isPokiSDKInited = true;
					runFunc();
				});
		}