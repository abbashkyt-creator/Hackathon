// Tip Tap local bridge replaces the remote Poki SDK: the game boots as
		// soon as the engine is ready, and the bridge reports scores upward.
		var isWasmLoaded = false;
		var runFunc = function () {
			if (isWasmLoaded) {
				Module && Module.runApp("canvas");
			}
		};
		Module['onRuntimeInitialized'] = function () {
			isWasmLoaded = true;
			runFunc();
		};
		Progress.addListener && Progress.addListener(function (percentage) {
			if (percentage === 100) runFunc();
		});