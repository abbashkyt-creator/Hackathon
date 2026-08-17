//<![CDATA[

		const GODOT_CONFIG = {"args":[],"canvasResizePolicy":2,"executable":"index","experimentalVK":false,"fileSizes":{"index.pck":6256416,"index.wasm":13793958},"focusCanvas":true,"gdnativeLibs":[]};
		var engine = new Engine(GODOT_CONFIG);

		function startGameLoading() {
			var statusProgress = document.getElementById('status-progress');
			var statusProgressInner = document.getElementById('status-progress-inner');
			var statusIndeterminate = document.getElementById('status-indeterminate');
			var statusNotice = document.getElementById('status-notice');
			var loadingScreen = document.getElementById('loading-screen');
			var statusPercent = document.getElementById('status-percent');

			var initializing = true;
			var statusMode = 'hidden';

			function setStatusMode(mode) {

				if (statusMode === mode || !initializing)
					return;
				[statusProgress, statusIndeterminate, statusNotice].forEach(elem => {
					elem.style.display = 'none';
				});
				switch (mode) {
					case 'progress':
						statusProgress.style.display = 'block';
						break;
					case 'indeterminate':
						statusIndeterminate.style.display = 'block';
						break;
					case 'notice':
						statusNotice.style.display = 'block';
						break;
					case 'hidden':
						if (loadingScreen) {
							loadingScreen.classList.add('loading-hidden');
							loadingScreen.style.pointerEvents = 'none';
							setTimeout(() => {
								if (loadingScreen.parentNode) {
									loadingScreen.parentNode.removeChild(loadingScreen);
								}
							}, 500);
						}
						break;
					default:
						throw new Error('Invalid status mode');
				}
				statusMode = mode;
			}

			function setStatusPercent(value) {
				if (statusPercent)
					statusPercent.textContent = value;
			}

			function setStatusNotice(text) {
				while (statusNotice.lastChild) {
					statusNotice.removeChild(statusNotice.lastChild);
				}
				var lines = text.split('\n');
				lines.forEach((line) => {
					statusNotice.appendChild(document.createTextNode(line));
					statusNotice.appendChild(document.createElement('br'));
				});
			};

			function displayFailureNotice(err) {
				var msg = err.message || err;
				console.error(msg);
				setStatusPercent('');
				setStatusNotice(msg);
				setStatusMode('notice');
				initializing = false;
			};

			if (!Engine.isWebGLAvailable()) {
				displayFailureNotice('WebGL not available');
			} else {
				setStatusMode('indeterminate');
				PokiSDK.gameLoadingStart();
				engine.startGame({
					'onProgress': function (current, total) {
						if (total > 0) {
							var percent = Math.max(0, Math.min(100, Math.round(current / total * 100)));
							statusProgressInner.style.width = percent + '%';
							setStatusPercent(percent + '%');
							setStatusMode('progress');
							if (current === total) {
								// wait for progress bar animation
								setTimeout(() => {
									setStatusPercent('100%');
									setStatusMode('indeterminate');
								}, 500);
							}
						} else {
							setStatusPercent('');
							setStatusMode('indeterminate');
						}
					},
				}).then(() => {
					setStatusPercent('100%');
					setStatusMode('hidden');
					initializing = false;
					PokiSDK.gameLoadingFinished();
				}, displayFailureNotice);
			}
		}

		//Poki SDK Init.
		PokiSDK.init().then(()=>{
			startGameLoading()
		}).catch(()=>{
			startGameLoading()
		})

		let hn = window.location.hostname
		if(hn == "localhost" || hn == "127.0.0.1"){
			PokiSDK.setDebug(true)
		}
//]]>
