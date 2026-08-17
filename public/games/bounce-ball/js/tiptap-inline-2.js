var extra_params = {
		archive_location_filter: function( path ) {
			return ("archive" + path + "");
		},
		engine_arguments: ["--verify-graphics-calls=false",],
		custom_heap_size: 134217728,
		full_screen_container: "#canvas-container",
		disable_context_menu: true
	}

	Module['onRuntimeInitialized'] = function() {
		Module.runApp("canvas", extra_params);
	};

	Module["locateFile"] = function(path, scriptDirectory)
	{
		// dmengine*.wasm is hardcoded in the built JS loader for WASM,
		// we need to replace it here with the correct project name.
		if (path == "dmengine.wasm" || path == "dmengine_release.wasm" || path == "dmengine_headless.wasm") {
			path = "BounceBall.wasm";
		}
		return scriptDirectory + path;
	};

	var is_iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	var buttonHeight = 0;


	// Resize on init, screen resize and orientation change
	function resize_game_canvas() {
		// Hack for iOS when exit from Fullscreen mode
		if (is_iOS) {
			window.scrollTo(0, 0);
		}

		var app_container = document.getElementById('app-container');
		var game_canvas = document.getElementById('canvas');
		var innerWidth = window.innerWidth;
		var innerHeight = window.innerHeight - buttonHeight;
		var width = 640;
		var height = 1136;
		var targetRatio = width / height;
		var actualRatio = innerWidth / innerHeight;
	
	
		//Stretch
		width = innerWidth;
		height = innerHeight;
	
	
	
		app_container.style.width = width + "px";
		app_container.style.height = height + buttonHeight + "px";
		game_canvas.width = width;
		game_canvas.height = height;
	}
	resize_game_canvas();
	window.addEventListener('resize', resize_game_canvas, false);
	window.addEventListener('orientationchange', resize_game_canvas, false);
