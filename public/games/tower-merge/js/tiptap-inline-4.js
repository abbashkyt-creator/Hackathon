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
		Module['onRuntimeInitialized'] = function() {
			PokiSDK.init().then(()=>{
				Module.runApp("canvas");
			}, ()=>{
				Module.runApp("canvas");
			});
		};
