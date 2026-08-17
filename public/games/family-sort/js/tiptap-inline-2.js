(function() {
		if (typeof window === 'undefined' || window.__unicoWebAudioUnlockInstalled) {
			return;
		}

		window.__unicoWebAudioUnlockInstalled = true;

		function resumeWebAudioFromGesture() {
			var candidates = [];

			if (typeof WEBAudio !== 'undefined' && WEBAudio && WEBAudio.audioContext) {
				candidates.push(WEBAudio.audioContext);
			}

			if (typeof Module !== 'undefined' && Module) {
				if (Module.SDL2 && Module.SDL2.audioContext) {
					candidates.push(Module.SDL2.audioContext);
				}

				if (Module.JS_Sound && Module.JS_Sound.ctx) {
					candidates.push(Module.JS_Sound.ctx);
				}
			}

			var resumedContext = false;

			for (var i = 0; i < candidates.length; i++) {
				var context = candidates[i];
				if (!context || typeof context.resume !== 'function') {
					continue;
				}

				try {
					var resumeResult = context.resume();
					if (resumeResult && typeof resumeResult.catch === 'function') {
						resumeResult.catch(function() {});
					}
					resumedContext = true;
				} catch (error) {
					console.warn('[UnicoWebAudio] gesture resume failed', error);
				}
			}

			if (resumedContext) {
				window.removeEventListener('pointerdown', resumeWebAudioFromGesture, true);
				window.removeEventListener('touchstart', resumeWebAudioFromGesture, true);
				window.removeEventListener('mousedown', resumeWebAudioFromGesture, true);
				window.removeEventListener('keydown', resumeWebAudioFromGesture, true);
			}
		}

		window.addEventListener('pointerdown', resumeWebAudioFromGesture, true);
		window.addEventListener('touchstart', resumeWebAudioFromGesture, true);
		window.addEventListener('mousedown', resumeWebAudioFromGesture, true);
		window.addEventListener('keydown', resumeWebAudioFromGesture, true);
	})();
