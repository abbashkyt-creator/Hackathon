// Disable right click context menu
	document.addEventListener("contextmenu", function(event) {
		event.preventDefault();
	});

	var is_iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	var buttonHeight = 0;
	var prevInnerWidth = -1;
	var prevInnerHeight = -1;


	var app_container = document.getElementById('app-container');
	var game_canvas = document.getElementById('canvas');
	var progress_bar_root = document.getElementById('progress-bar-root');
	var progress_bar_fg = document.getElementById('progress-bar-fg');
	var progress_bar_bg = document.getElementById('progress-bar-bg');
	var progress_bar_text = document.getElementById('progress-bar-text');
	var progress_bar_tooltip = document.getElementById('progress-bar-tooltip');
	

	function resize_game_canvas() {
		// Hack for iOS when exit from Fullscreen mode
		if (is_iOS) {
			window.scrollTo(0, 0);
		}

		
		var innerWidth = window.innerWidth;
		var innerHeight = window.innerHeight - buttonHeight;

		var dpi = 1;
		
		dpi = window.devicePixelRatio || 1;
		

		if (prevInnerWidth == innerWidth && prevInnerHeight == innerHeight){return;}
		prevInnerWidth = innerWidth;
		prevInnerHeight = innerHeight;
		var width = 960;
		var height = 540;
		var targetRatio = width / height;
		var actualRatio = innerWidth / innerHeight;
		width = innerWidth;
		height = innerHeight;
		app_container.style.width = width + "px";
		app_container.style.height = height + buttonHeight + "px";
		app_container.style.marginLeft = 0 + "px";
		app_container.style.marginTop = 0 + "px";
        game_canvas.width = Math.floor(width * dpi);
        game_canvas.height = Math.floor(height * dpi);

        if (window.my_image3D){
			window.my_image3D.resize(width,height);
        }



		var bar_h = width < height ? width:height;
		progress_bar_bg.width = Math.min(Math.ceil(bar_h * 0.10 * 852/53),width * 0.8);
		progress_bar_fg.width =  progress_bar_bg.width;

		progress_bar_bg.style.marginLeft = - progress_bar_bg.width/2 + "px";
		progress_bar_fg.style.marginLeft = -progress_bar_bg.width/2 - progress_bar_fg.width/2 + "px";

		progress_bar_text.style.fontSize = Math.ceil(bar_h * 0.105) + "px";
		progress_bar_root.style.bottom = Math.ceil(height*0.02 + buttonHeight) + "px";

		progress_bar_tooltip.style.fontSize = Math.ceil(bar_h * 0.075) + "px";

	}
	resize_game_canvas();
	CUSTOM_PARAMETERS['resize_window_callback'] = resize_game_canvas;

	// Function to check if WebP is supported
	function isWebPSupported(callback) {
		const img = new Image();
		img.onload = function() {
			callback((img.width > 0) && (img.height > 0));
		};
		img.onerror = function() {
			callback(false);
		};
		img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
	}

	// Function to preload an image
	function preloadImage(src, callback) {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = function() {
			callback(img);
		};
		img.src = src;
	}

	// Usage example
	const canvas = document.getElementById("canvas3d");
	const canvasContainer = document.getElementById("canvas");
	let imageURL = "loading.jpg";
	const depthURL = "loading_depth.png";

    isWebPSupported(function(supported) {
        if (supported) {
            imageURL = "loading.webp";
        }

        // Preload the image
        preloadImage(imageURL, function(img) {
            // Set the background image dynamically
           // canvasContainer.style.backgroundImage = url(imageURL);

            // Initialize Image3D with the preloaded image
            window.my_image3D = new window.Image3D(canvas, imageURL);
            window.my_image3D.resize(window.innerWidth, window.innerHeight);
        });
    });

	let lerp = function(start, end, amt) {
		return (1 - amt) * start + amt * end;
	}
	window.progress_loader = {
		percentage: 0,
		percentage_lerp: 0,
		lerp_speed: 0.15,
		set_percentage: function(percentage) {
			ProgressView.updateProgress(percentage);
		},
		reset_percentage: function() {
			window.progress_loader.percentage = 0;
			window.progress_loader.percentage_lerp = 0;
		},
		updateLoadingAnimation: function() {
			window.progress_loader.percentage_lerp = lerp(window.progress_loader.percentage_lerp, window.progress_loader.percentage_lerp, window.progress_loader.lerp_speed);
			if (Math.abs(window.progress_loader.percentage_lerp - window.progress_loader.percentage_lerp) < 0.01) {
				window.progress_loader.percentage_lerp = window.progress_loader.percentage_lerp;
			}

			progress_bar_text.innerHTML = "<b>" + Math.ceil(window.progress_loader.percentage_lerp) + "%</b>";
			progress_bar_fg.style.clip = "rect(0px," + progress_bar_fg.width * window.progress_loader.percentage_lerp / 100 + "px," + progress_bar_fg.height + "px, 0px)";

			if (progress_bar_root.style.visibility === "visible"){
				requestAnimationFrame(window.progress_loader.updateLoadingAnimation);
			}
		}

	}
// Load phrases generated by the build process`
let loadPhrasesBase = [
	"Sweeping the sand",
    "Counting coconuts",
    "Planting palm trees",
    "Cleaning money buttons",
    "Feeding the island cat",
    "Hiding secret stars",
    "Charging the dance floor",
    "Tuning tropical music",
    "Testing flame cars",
    "Painting rainbow",
    "Training the dinos",
    "Smoothing waves",
    "Warming up cool dances"
];


	/* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    let loadPhrases = []
    window.loadingProgressCount = 0
    let phrase = "";
    var progress_bar_tooltip = document.getElementById('progress-bar-tooltip');

	let loadingPhraseFunction = function(){
        if (window.loadingProgressCount == 0) {
            if (loadPhrases.length == 0){
                loadPhrases = loadPhrasesBase.slice();
                shuffleArray(loadPhrases)
            }
            phrase = loadPhrases.shift()
            progress_bar_tooltip.innerHTML  = "<b>" + phrase + "</b>";
        }else if (window.loadingProgressCount == 1) {
          progress_bar_tooltip.innerHTML  = "<b>&nbsp" + phrase + ".</b>";
        }else if (window.loadingProgressCount == 2) {
          progress_bar_tooltip.innerHTML  = "<b>&nbsp&nbsp" + phrase + "..</b>";
        }else if (window.loadingProgressCount == 3) {
          progress_bar_tooltip.innerHTML  = "<b>&nbsp&nbsp&nbsp" + phrase + "...</b>";
        }else if (window.loadingProgressCount == 4) {
          progress_bar_tooltip.innerHTML  = "<b>" + phrase + "</b>";
        }else if (window.loadingProgressCount == 5) {
          progress_bar_tooltip.innerHTML  = "<b>&nbsp" + phrase + ".</b>";
        }else if (window.loadingProgressCount == 6) {
          progress_bar_tooltip.innerHTML  = "<b>&nbsp&nbsp" + phrase + "..</b>";
        }else if (window.loadingProgressCount == 7) {
          progress_bar_tooltip.innerHTML  = "<b>&nbsp&nbsp&nbsp" + phrase + "...</b>";
        }


        window.loadingProgressCount = (window.loadingProgressCount + 1) % 8
    }
	loadingPhraseFunction();
    window.loadingTooltipIntervalID = setInterval(loadingPhraseFunction, 350);
