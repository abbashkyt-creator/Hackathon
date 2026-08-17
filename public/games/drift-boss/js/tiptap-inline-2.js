(function () {
			"use strict";
			function postToParent(type, data) {
				try { window.parent.postMessage({ source: "tiptap-drift-boss", type: type, data: data || {} }, "*"); } catch (e) {}
			}
			function sendScore(final) {
				var score = 0;
				try {
					var c = document.getElementById("canvas");
					if (c && c.__tiptapScore != null) score = c.__tiptapScore;
				} catch (e) {}
				postToParent("score", { score: score, final: !!final });
			}
			window.__tiptapBridge = {
				setScore: function (s) { try { document.getElementById("canvas").__tiptapScore = s; } catch (e) {} }
			};
			postToParent("ready", {});
			window.setTimeout(function () { postToParent("ready", {}); }, 2500);
			// auto-start: the game shows a tap-to-play cover; dismiss it once loaded
			function autoStart() {
				var p = document.getElementById("play");
				if (p) {
					p.classList.add("playing");
					p.style.display = "none";
				}
			}
			window.setTimeout(autoStart, 4000);
			window.setTimeout(autoStart, 8000);
			window.setTimeout(function () { sendScore(false); }, 9000);
			window.setTimeout(function () { sendScore(true); }, 180000);
		})();
