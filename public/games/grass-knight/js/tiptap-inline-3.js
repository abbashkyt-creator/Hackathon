//<![CDATA[

		const GODOT_CONFIG = {"args":[],"canvasResizePolicy":2,"executable":"index","experimentalVK":false,"fileSizes":{"index.pck":1479232,"index.wasm":13788612},"focusCanvas":true,"gdnativeLibs":[]};
		var engine = new Engine(GODOT_CONFIG);

		function startGameLoading() {
			var statusOverlay = document.getElementById('status');
			var customProgressContainer = document.getElementById('custom-progress-container');
			var customProgressFill = document.getElementById('custom-progress-fill');
			var statusNotice = document.getElementById('status-notice');

			var initializing = true;
			var statusMode = 'hidden';

			function setStatusMode(mode) {
				if (statusMode === mode || !initializing)
					return;
				
				if (mode === 'hidden') {
					statusOverlay.remove();
					initializing = false;
					return;
				}
				
				statusOverlay.style.visibility = 'visible';
				customProgressContainer.style.display = mode === 'progress' ? 'block' : 'none';
				statusNotice.style.display = mode === 'notice' ? 'block' : 'none';
				statusMode = mode;
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
				setStatusNotice(msg);
				setStatusMode('notice');
				initializing = false;
			};

			if (!Engine.isWebGLAvailable()) {
				displayFailureNotice('WebGL not available');
			} else {
				setStatusMode('progress');
				PokiSDK.gameLoadingStart();
				engine.startGame({
					'onProgress': function (current, total) {
						if (total > 0) {
							var progress = (current / total) * 100;
							customProgressFill.style.width = progress + '%';
						}
					},
				}).then(() => {
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
