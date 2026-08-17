var globalLoadingPercentage			= 0; 	// Holds the current loading progress
		var globalLerpLoadingPercentage		= 0; 	// Holds the current lerp leading progress

		window.my_game = {
			set_percentage: function(percentage) {
				ProgressView.updateProgress(percentage);
			},
			reset_percentage: function() {
				globalLoadingPercentage			= 0;
				globalLerpLoadingPercentage		= 0;
			}
		};

		var is_iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		var buttonHeight = 0;
		var prevInnerWidth = -1;
		var prevInnerHeight = -1;

		function resize_game_canvas() {
			// Hack for iOS when exit from Fullscreen mode
			if (is_iOS) {
				window.scrollTo(0, 0);
			}

			var app_container = document.getElementById('app-container');
			var game_canvas = document.getElementById('canvas');
			var progress_bar_root = document.getElementById('progress-bar-root');
			var progress_bar_fg = document.getElementById('progress-bar-fg');
			var progress_bar_bg = document.getElementById('progress-bar-bg');
			var innerWidth = window.innerWidth;
			var innerHeight = window.innerHeight - buttonHeight;

			var dpi = 1;
			
			dpi = window.devicePixelRatio || 1;
			

			if (prevInnerWidth == innerWidth && prevInnerHeight == innerHeight)
			{
				return;
			}
			prevInnerWidth = innerWidth;
			prevInnerHeight = innerHeight;
			var width = 960;
			var height = 640;
			var targetRatio = width / height;
			var actualRatio = innerWidth / innerHeight;
		
		
			//Stretch
			width = innerWidth;
			height = innerHeight;
		
		
		
			app_container.style.width = width + "px";
			app_container.style.height = height + buttonHeight + "px";
			game_canvas.width = Math.floor(width * dpi);
			game_canvas.height = Math.floor(height * dpi);

			// progress bar
			var bar_h = width < height ? width:height;
			progress_bar_bg.width = Math.min(Math.ceil(bar_h * 0.06 * 300/24),width * 0.8);

			progress_bar_bg.style.marginLeft = - progress_bar_bg.width/2 + "px";
			progress_bar_fg.width =  Math.ceil(progress_bar_bg.width * 1);

			progress_bar_fg.style.marginTop = (progress_bar_bg.width * 0) * (0)/2 + "px";
			progress_bar_fg.style.marginLeft = -progress_bar_bg.width/2 - progress_bar_fg.width/2 + "px";

			// progress_bar_text.style.fontSize = Math.ceil(bar_h * 0.10) + "px";
			progress_bar_root.style.bottom = Math.ceil(height*0.08 + buttonHeight) + "px";
		}
		resize_game_canvas();
		CUSTOM_PARAMETERS['resize_window_callback'] = resize_game_canvas;
