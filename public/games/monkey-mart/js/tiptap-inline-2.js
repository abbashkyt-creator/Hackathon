ProgressView.updateProgress = function(percentage) {
			Progress.notifyListeners(percentage);
			if(globalLoadingPercentage > percentage){
				percentage = globalLoadingPercentage
			}
			globalLoadingPercentage = percentage; // Update the global variable

			var fg = document.getElementById('progress-bar-fg');
			fg.style.clip="rect(0px,"  + fg.width * percentage/100 + "px,"  + fg.height+"px," + "0px)"

			if(isNaN(percentage)){
				globalLoadingPercentage = 100; // Update the global variable
				var progress_bar_root = document.getElementById('progress-bar-root');
				progress_bar_root.style.visibility = "hidden";
			}
		};

		ProgressView.addProgress = function (){
			var progress_bar_root = document.getElementById('progress-bar-root');
			progress_bar_root.style.visibility = "visible"
		}

		ProgressView.removeProgress = function () {
			var progress_bar_root = document.getElementById('progress-bar-root');
			progress_bar_root.style.visibility = "hidden";
			// Remove any background/splash image that was set in runApp().
			// Workaround for Safari bug DEF-3061.
			Module.canvas.style.background = "";
		}

		EngineLoader.load("canvas", "MonkeyMart");
