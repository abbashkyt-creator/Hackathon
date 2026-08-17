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

	const logo = document.querySelector('.overlay-image.logo-image');
	const cow = document.querySelector('.overlay-image.second-image');

	const container = document.getElementById('canvas-container');

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

		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		// Assuming you know the aspect ratio of the background image
		const bgAspectRatio = 16 / 9; // Adjust this to match your background image's aspect ratio

		let scaleWidth = containerWidth;
		let scaleHeight = scaleWidth / bgAspectRatio;
		if (scaleHeight < containerHeight) {
			scaleHeight = containerHeight;
			scaleWidth = scaleHeight * bgAspectRatio;
		}

		// cow size - adjust if needed
		let cowWidth = scaleWidth * 0.25; // cow's width relative to the scaled background
		if (width/height<1){
			cowWidth = (width < height ? innerWidth:innerHeight) * 0.5
		}
		const cowHeight = cowWidth * 385/428; // Keeping the cow aspect
		// Set cow size
		cow.style.width = `${cowWidth}px`;
		cow.style.height = `${cowHeight}px`;

	// Calculate cow position
		const basePosX = scaleWidth * 0.5 + (containerWidth - scaleWidth) / 2;
		let  basePosY = scaleHeight * 0.6 + (containerHeight - scaleHeight) / 2;

		// Adjust the cow position to grow from bottom
		// The bottom position remains constant as it grows
		const cowLeft = basePosX - cowWidth / 2;
		const cowTop = basePosY -cowHeight; // Adjust this line


		// Adjust the cow position
		cow.style.left = `${cowLeft}px`;
		cow.style.top = `${cowTop}px`;




	
		//progress_bar_root.style.bottom = Math.ceil(height*0.08 + buttonHeight) + "px";


		let logoWidth = (width < height ? innerWidth:innerHeight) * 0.5; // cow's width relative to the scaled background
		const logoHeight = logoWidth*120/684; // Keeping the cow square
		logo.style.width = `${logoWidth}px`;
		logo.style.height = `${logoHeight}px`;

		progress_bar_bg.width = logoWidth;
		progress_bar_fg.width =  progress_bar_bg.width;

		progress_bar_bg.style.marginLeft = - progress_bar_bg.width/2 + "px";
		progress_bar_fg.style.marginLeft = -progress_bar_bg.width/2 - progress_bar_fg.width/2 + "px";

		progress_bar_text.style.fontSize = Math.ceil(progress_bar_bg.width * 0.095) + "px";

		let progress_bar_height = progress_bar_bg.width * 69/683;
		const logoPosX = innerWidth/2-logoWidth/2;
		const logoPosY = innerHeight*0.7 - logoHeight/2;
		// Adjust the cow position
		logo.style.left = `${logoPosX}px`;
		logo.style.top = `${logoPosY}px`;
		if (width/height<1){
			var  total_title_size = logoHeight + 25 + progress_bar_height;
			progress_bar_root.style.top = (logoPosY + logoHeight + 25) + "px";
		}else{
			var  total_title_size = logoHeight + 25 + progress_bar_height;
			progress_bar_root.style.top = (logoPosY + logoHeight + 25) + "px";
		}
	}
	resize_game_canvas();
	CUSTOM_PARAMETERS['resize_window_callback'] = resize_game_canvas;


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
