var sdk 		= PokiSDK;
		var pokiDebug 	= false;
		
        var canvas      = document.getElementById("canvas");
		var body 		= document.getElementById("body");
		var bar 		= document.getElementById("bar");
		var decor 		= document.getElementById("decor");		

		fill.classList.remove("pulsating");
		
		function poki_log(t) {
			console.log(t);
		}
            
        function poki_debug() {
            return pokiDebug;
        }
		
		function poki_loading(progress) {
			fakeCentTarget = Math.max(fakeCentTarget, (progress * 0.8) * 100);
			sdk.gameLoadingProgress({percentageDone: progress * 0.9});
			
			if (progress == 1) {
				fakeCentTarget = 100;
				fakeCent = 100;
				bar_update(100);					
				decor.style.display = "none";				
				proc.style.display = "none";				
				
				setTimeout(function () {
					canvas.style.display = "block";
                    clearInterval(fakeLoading);					
				}, 200);
			}
			bodyLoad = true;
		}
		

		

		
		
		function gamemaker_start() {
			try {
			  GameMaker_Init();
			} catch(err) {
				fails++;			
				setTimeout(gamemaker_start, 2000);
				if (fails == 1) throw(err);						
			}
		}

		//var bgScale = window.innerHeight / 1024;
		//body.style.backgroundSize = (512 * bgScale) + "px " + (1024 * bgScale) + "px";
		
		window.onload = function() {
			sdk.init().then(() => {
                setTimeout(gamemaker_start, 5);
                sdk.setDebug(pokiDebug);   
				sdk.gameLoadingStart();		
			}).catch(() => {
                gamemaker_start();
			});
        
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.addEventListener('click', function(){
                window.focus();
            });           
		}
		
		window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
		window.addEventListener('keydown', ev => {
			if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
				ev.preventDefault();
			}
		});
