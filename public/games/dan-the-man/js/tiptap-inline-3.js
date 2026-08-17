// Fallback to make sure globalThis is available when running in an old
		// browser (available from Chome 71)
		// https://github.com/defold/defold/issues/10503
		if (typeof globalThis === 'undefined') {
			window.globalThis = window;
		}

		// Prevent page scroll when pressing space, arrow keys, or other game keys
		window.addEventListener("keydown", function(e) {
			var keys = [32, 37, 38, 39, 40]; // space, left, up, right, down
			if (keys.indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);

		// Focus the canvas on load and on click to ensure keyboard input works
		window.addEventListener("load", function() {
			var canvas = document.getElementById("canvas");
			if (canvas) {
				canvas.focus();
				canvas.addEventListener("click", function() {
					canvas.focus();
				});
			}
		});
