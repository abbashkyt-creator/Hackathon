var ProgressView = {
			progress_id: "defold-progress",
			bar_id: "defold-progress-bar",

			addProgress : function (canvas) {
				/* Insert default progress bar below canvas */
				canvas.insertAdjacentHTML('afterend', '<div id="' + ProgressView.progress_id + '" class="canvas-app-progress"><div id="' + ProgressView.bar_id + '" class="canvas-app-progress-bar" style="transform: scaleX(0.0);"></div></div>');
				ProgressView.bar = document.getElementById(ProgressView.bar_id);
				ProgressView.progress = document.getElementById(ProgressView.progress_id);
			},

			updateProgress: function(percentage) {
				if (ProgressView.bar) {
					ProgressView.bar.style.transform = "scaleX(" + Math.min(percentage, 100) / 100 + ")";
				}
			},

			removeProgress: function () {
				if (ProgressView.progress.parentElement !== null) {
					ProgressView.progress.parentElement.removeChild(ProgressView.progress);

					// Remove any background/splash image that was set in runApp().
					// Workaround for Safari bug DEF-3061.
					Module.canvas.style.background = "";
					document.querySelectorAll('.title-image').forEach(function(element) {
						element.remove();
					});
				}
			}
		};
		// From here you can configure game startup parameters via the CUSTOM_PARAMETERS object,
		// override ProgressView to create your own loader. See dmloader.js for more details.
