var gameScreens = {};
		const SCREENs = {
		    ROTATE : "rotate"
		}
		var ORIENTATIONs = {
			PORTRAIT : 0,
			LANDSCAPE : 1,
			BOTH : 2
		}
		const RESCALE_MODEs = {
			WIDTH : 0,
			HEIGHT : 1,
			MIN : 2,
			MAX : 3,
			VALUE : 4
		}
		var UI_SCALE = 0.75;
		var CANVAS_WIDTH = 1920;
		var CANVAS_HEIGHT = 1188;
		var rescaleMode = RESCALE_MODEs.MAX;
		var screenOrientation = ORIENTATIONs.LANDSCAPE;
		var CANVAS_AspectRatio = CANVAS_WIDTH/CANVAS_HEIGHT;
		var aspectRatio = 0;
		var screenWidth = 0;
		var screenHeight = 0;
		function Resize()
		{
			screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			screenHeight= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			aspectRatio = screenWidth/screenHeight;
			console.log(screenWidth +"<>"+ screenHeight);
			switch(rescaleMode)
			{
				case RESCALE_MODEs.WIDTH:
				UI_SCALE = screenWidth/CANVAS_WIDTH;
				break;
				case RESCALE_MODEs.HEIGHT:
				UI_SCALE = screenHeight/CANVAS_HEIGHT;
				break;
				case RESCALE_MODEs.MIN:
				UI_SCALE = Math.min(screenWidth/CANVAS_WIDTH,screenHeight/CANVAS_HEIGHT)
				break;
				case RESCALE_MODEs.MAX:
				UI_SCALE = Math.max(screenWidth/CANVAS_WIDTH,screenHeight/CANVAS_HEIGHT)
				break;
			}
			UI_SCALE = UI_SCALE.toFixed(2);
			var itemsToRescale = document.querySelectorAll("[data-resize]");
			itemsToRescale.forEach(function (item) {
				switch(item.dataset.resize)
				{
					case "scale":
					item.style.transform = 'scale('+UI_SCALE+','+UI_SCALE+')';
					break;

					case "scale_h":
					item.style.transform = 'scaleY('+UI_SCALE+')';
					break;

					case "scale_w":
					item.style.transform = 'scaleX('+UI_SCALE+')';
					break;
				}
			});
			if(isOnMobile)
			{
				if(!gameScreens[SCREENs.ROTATE])
					return;
				switch(screenOrientation)
				{

					case ORIENTATIONs.PORTRAIT:
					if(screenWidth > screenHeight)
						gameScreens[SCREENs.ROTATE].style.display = "block";	
					else
						gameScreens[SCREENs.ROTATE].style.display = "none";
					
					break;

					case ORIENTATIONs.LANDSCAPE:
					if(screenHeight > screenWidth)
						gameScreens[SCREENs.ROTATE].style.display = "block";	
					else
						gameScreens[SCREENs.ROTATE].style.display = "none";
					break;
				}
			}
		}
		window.addEventListener('resize', function(event){
		  Resize();
		});
