var extra_params = {
		archive_location_filter: function( path ) {
			return ("archive" + path + "");
		},
		engine_arguments: ["--verify-graphics-calls=false",],
		custom_heap_size: 134217728,
		full_screen_container: "#canvas-container",
		disable_context_menu: true
	}

	Module['INITIAL_MEMORY'] = extra_params.custom_heap_size;

	Module['onRuntimeInitialized'] = function() {
		Module.runApp("canvas", extra_params);
	};

	Module["locateFile"] = function(path, scriptDirectory)
	{
		// dmengine*.wasm is hardcoded in the built JS loader for WASM,
		// we need to replace it here with the correct project name.
		if (path == "dmengine.wasm" || path == "dmengine_release.wasm" || path == "dmengine_headless.wasm") {
			path = "plus_one.wasm";
		}
		return scriptDirectory + path;
	};

	var is_iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	var buttonHeight = 0;
	var prevInnerWidth = -1;
	var prevInnerHeight = -1;
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
        
		if (prevInnerWidth == innerWidth && prevInnerHeight == innerHeight)
		{
			return;
		}
		prevInnerWidth = innerWidth;
		prevInnerHeight = innerHeight;
		var width = 1067;
		var height = 600;
		var targetRatio = width / height;
		var actualRatio = innerWidth / innerHeight;
	
	
		//Stretch
		width = innerWidth;
		height = innerHeight;
	
	
	
		app_container.style.width = width + "px";
		app_container.style.height = height + buttonHeight + "px";
		game_canvas.width = width;
		game_canvas.height = height;


      
        var progress_bar_root = document.getElementById('progress-bar-root');
		var progress_bar_fg = document.getElementById('progress-bar-fg');
		var progress_bar_bg = document.getElementById('progress-bar-bg');
        var progress_bar_text = document.getElementById('progress-bar-text');
      var progress_bar_loader = document.getElementById('progress-loader');
        var bar_h = width < height ? width:height;
        var bar_scale = 1
		progress_bar_bg.width = Math.min(Math.ceil(bar_h * 0.08 * 274/24),width * 0.9);
		progress_bar_bg.style.marginLeft = - progress_bar_bg.width/2 + "px";
		progress_bar_fg.width =  Math.ceil(progress_bar_bg.width * 0.925);
        bar_scale = progress_bar_fg.width / 478
		progress_bar_fg.style.marginTop = Math.ceil(bar_scale * 9) + "px";
		progress_bar_fg.style.marginLeft = -progress_bar_bg.width/2 - progress_bar_fg.width/2 + "px";
		progress_bar_text.style.fontSize = Math.ceil(bar_h * 0.07) + "px";
		progress_bar_root.style.bottom = Math.ceil(height*0.1 + buttonHeight) + "px";
        progress_bar_text.innerHTML  = "0";
      
//        var percentage = 38
//        progress_bar_text.innerHTML  = "<b>" +  Math.ceil(percentage) + "%</b>";
//        progress_bar_fg.style.clip="rect(0px,"  + progress_bar_fg.width * percentage/100 + "px,"  + progress_bar_fg.height+"px," + "0px)"
      
         Module.isGameLoaded = false;
         Progress.addListener(function (percentage, text) {
            if (!isNaN(percentage))
            { 
                var data = {};
                data.percentageDone = percentage / 100;
                var fg = document.getElementById('progress-bar-fg');
                var progress_bar_text = document.getElementById('progress-bar-text');
                fg.style.clip="rect(0px,"  + fg.width * percentage/100 + "px,"  + fg.height+"px," + "0px)"               
                progress_bar_text.innerHTML  = percentage.toFixed(2) + "";
            }
             
              if (percentage == 100 && !Module.isGameLoaded) {
               Module.isGameLoaded = true;
               //document.getElementsByClassName("progress")[0].remove();
                  
				var progress_bar_root = document.getElementById('progress-bar-root');
                var progress_bar_fg = document.getElementById('progress-bar-fg');
		        var progress_bar_bg = document.getElementById('progress-bar-bg');
                var progress_bar_text = document.getElementById('progress-bar-text');
                  var progress_bar_loader = document.getElementById('progress-loader');
                  
				progress_bar_root.style.visibility = "hidden";    
                progress_bar_fg.style.visibility = "hidden";
                progress_bar_bg.style.visibility = "hidden";
                progress_bar_text.style.visibility = "hidden";
                progress_bar_loader.style.visibility = "hidden";  
              }
             
			 if(isNaN(percentage)){
				var progress_bar_root = document.getElementById('progress-bar-root');
				progress_bar_root.style.visibility = "hidden";
			 }             
         });

	}
	resize_game_canvas();
	window.addEventListener('resize', resize_game_canvas, false);
	window.addEventListener('orientationchange', resize_game_canvas, false);
	window.addEventListener('focus', resize_game_canvas, false);
