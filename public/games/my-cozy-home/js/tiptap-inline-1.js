let sstart = 0; 
		let counter = 0; 
		let prog = 0;
		let max_prog = 0;
		let start_load = 0;
		let full_load = 0;
		let poki_init = false;
		createFallingObject(-999,-999);
document.addEventListener("click", (event) => {
	if (full_load == 0) {
	    createFallingObject(Math.random() * window.innerWidth, window.innerHeight + 45);
	}
});

function createFallingObject(x, y) {
    const object = new Image();
    object.src = "particle.webp";  
    object.style.position = "absolute";
	let size = Math.random() * 60 + 30 + "px";
	object.style.width  = size;  
	object.style.height = size; 
    object.style.left = `${x - 30}px`;   
    object.style.top = `${y}px`;
    object.style.zIndex = "1000";
	object.style.userSelect = "none";

    // Случайный угол от -15 до 15 градусов
    const randomAngle = Math.random() * 30 - 15; 
    object.style.transform = `rotate(${randomAngle}deg)`;

    // Добавление объекта на страницу
    document.body.appendChild(object);

    // Случайное смещение по X
    const randomOffsetX = Math.random() * 200 - 100;

    // Случайное время жизни и скорость
    const randomDuration = Math.random() * 2 + 2;  // от 2 до 5 секунд
    const randomLifetime = Math.random() * 2000 + randomDuration * 1000; // от 2 до 7 секунд
	const randomY = Math.random() * 1000;  

    // Генерация уникального ключевого кадра
    const animationName = `move${Math.random().toString(36).substr(2, 9)}`;

    // Создание анимации
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes ${animationName} {
            0% {
                top: ${y}px;
                left: ${x - 30}px;
                opacity: 1;
            }
            50% {
                left: ${x - 30 + randomOffsetX / 2}px;
            }
            100% {
                top: ${y - randomY}px;
                left: ${x - 30 + randomOffsetX}px;
                opacity: 0;
            }
        }
    `, styleSheet.cssRules.length);

    // Запуск анимации с случайной скоростью
    object.style.animation = `${animationName} ${randomDuration}s ease-in-out forwards`;

    // Удаление объекта после завершения анимации
    setTimeout(() => {
        object.remove();
    }, randomLifetime); 
}




        window.addEventListener('keydown', ev => {
            if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
                ev.preventDefault();
            }
        });
        window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
		
		
		const intervalId = setInterval(() => {
			if (counter < 6) {
				counter += 1; 
				updateProgress(Math.floor(prog * 100) + start_load + counter);
			} else {
				clearInterval(intervalId); 
		}
	}, 2000); 

        function load_prog(numb) {
            prog = numb;
			if (prog !== 1 || full_load === 1) { 
				updateProgress(Math.floor(prog * 100) + start_load + counter);
			}
			
			if (poki_init && sstart == 0 && numb >= 1) {
			 	sstart = 1
				c3_callFunction("start");
			}
        }

        function updateProgress(percent) {
			if (prog !== 1 || full_load === 1) { 
				if (percent > max_prog) {max_prog = percent}
				const progressBar = document.getElementById('loading-bar');
				const progressText = document.getElementById('progress-text');
				progressText.innerText = max_prog + '%';
				progressBar.style.width = max_prog + '%'; 
			}
        }

	function onGameLoaded() {
			max_prog = 100;
			full_load = 1;
			updateProgress(Math.floor(100));
            var customLoader = document.getElementById('custom-loader');
            customLoader.style.opacity = '0';
			poki_gameLoadingFinished()
            setTimeout(() => {
                customLoader.style.display = 'none';
            }, 500);
     }
	 


		PokiSDK.init().then(() => {
			poki_init = true;
		}).catch(() => {
			poki_init = true;
		});

		function poki_gameLoadingFinished() {
			if (poki_init) {
				PokiSDK.gameLoadingFinished();
			} else {
				const checkInitInterval = setInterval(function() {
					if (poki_init) {
						clearInterval(checkInitInterval);
						PokiSDK.gameLoadingFinished();
					}
				}, 100); 
			}
		}
		
	function poki_gameplayStart() {
		PokiSDK.gameplayStart();
	}

	function poki_gameplayStop() {
		PokiSDK.gameplayStop();
	}
	
	function poki_rewardedBreak(adtype, runtime) {
		c3_callFunction("pokiRewardedBreak", ["start"]);
		PokiSDK.rewardedBreak({
			size: adtype
		}).then((success) => {
			if (success) {
				c3_callFunction("pokiRewardedBreak", ["get"]);
			} else {
				c3_callFunction("pokiRewardedBreak", ["error"]);
			}
			c3_callFunction("pokiRewardedBreak", ["finish"]);
		}).catch((error) => {
			c3_callFunction("pokiRewardedBreak", ["error"]);
		});
	}

	
	function poki_commercialBreak(runtime) {
		
		PokiSDK.commercialBreak(() => {
		  c3_callFunction("pokiCommercialBreak", ["start"]);
		}).then(() => {
		  c3_callFunction("pokiCommercialBreak", ["finish"]);
		});
	}

        async function loadExternalResources() {
            try {
                await Promise.all([
                    fetch('scripts/main.js').then(response => {
                        if (response.ok) {
                            start_load += 3;
                			updateProgress(Math.floor(prog * 100) + start_load + counter);
                        }
                    }),
                    fetch('data.json').then(response => {
                        if (response.ok) {
                            start_load += 2;
                			updateProgress(Math.floor(prog * 100) + start_load + counter);
                        }
                    }),
                    fetch('scripts/c3main.js').then(response => {
                        if (response.ok) {
                            start_load += 4;
                			updateProgress(Math.floor(prog * 100) + start_load + counter);
                        }
                    })
                ]);
            } catch (error) {
                console.error(error);
            }
        }

        loadExternalResources();
