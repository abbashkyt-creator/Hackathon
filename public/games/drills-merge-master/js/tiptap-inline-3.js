ProgressView.updateProgress = function(percentage) {
		//console.log("percentage:" + percentage);
		if(window.progress_loader.percentage<percentage){
			window.progress_loader.percentage = percentage
		}
		//window.progress_loader.percentage_lerp = percentage; // Update the global variable

		if(isNaN(percentage)){
			window.progress_loader.percentage = 100; // Update the global variable
		}
	};
	ProgressView.addProgress = function (){
	//	console.log("addProgress");
		var progress_bar_root = document.getElementById('progress-bar-root');
		progress_bar_root.style.visibility = "visible"
		window.progress_loader.updateLoadingAnimation();
	}
	ProgressView.removeProgress = function () {
	//	console.log("removeProgress");
		var progress_bar_root = document.getElementById('progress-bar-root');
		//it will be hide when game or liveupdate if needed is loaded
		//progress_bar_root.style.visibility = "hidden";
		// Remove any background/splash image that was set in runApp().
		// Workaround for Safari bug DEF-3061.
		Module.canvas.style.background = "";
	}
	EngineLoader.load("canvas", "DrillsMergeMaster");
