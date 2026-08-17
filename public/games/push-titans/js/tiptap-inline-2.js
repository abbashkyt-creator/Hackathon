(function () {
			var LOG_PREFIX = "[PushTitans][ad-resume]";
			var pokiHooksInstalled = false;
			var pokiHookChecks = 0;
			var maxPokiHookChecks = 200;

			function getElementState(element) {
				if (!element) {
					return null;
				}

				var computed = window.getComputedStyle ? window.getComputedStyle(element) : null;
				return {
					tagName: element.tagName,
					id: element.id,
					className: element.className,
					width: element.width || null,
					height: element.height || null,
					clientWidth: element.clientWidth,
					clientHeight: element.clientHeight,
					offsetWidth: element.offsetWidth,
					offsetHeight: element.offsetHeight,
					styleDisplay: element.style ? element.style.display : "",
					styleVisibility: element.style ? element.style.visibility : "",
					styleOpacity: element.style ? element.style.opacity : "",
					display: computed ? computed.display : "",
					visibility: computed ? computed.visibility : "",
					opacity: computed ? computed.opacity : ""
				};
			}

			function getCanvasResumeState(reason) {
				var canvas = document.getElementById("canvas");
				var container = document.getElementById("canvas-container");
				var app = document.getElementById("app-container");

				return {
					reason: reason,
					timestamp: new Date().toISOString(),
					visibilityState: document.visibilityState,
					documentHidden: document.hidden,
					documentHasFocus: document.hasFocus ? document.hasFocus() : null,
					activeElementId: document.activeElement ? document.activeElement.id : null,
					canvasHasFocus: document.activeElement === canvas,
					devicePixelRatio: window.devicePixelRatio,
					viewportWidth: window.innerWidth,
					viewportHeight: window.innerHeight,
					canvas: getElementState(canvas),
					container: getElementState(container),
					app: getElementState(app),
					userAgent: window.navigator ? window.navigator.userAgent : ""
				};
			}

			function logCanvasResumeState(reason) {
				if (window.console && typeof window.console.info === "function") {
					window.console.info(LOG_PREFIX, getCanvasResumeState(reason));
				}
			}

			function warn(reason, error) {
				if (window.console && typeof window.console.warn === "function") {
					window.console.warn(LOG_PREFIX, reason, error);
				}
			}

			function ensureVisible(element) {
				if (!element || !window.getComputedStyle) {
					return;
				}

				var computed = window.getComputedStyle(element);
				if (computed.display === "none") {
					element.style.display = element.tagName === "CANVAS" ? "block" : "";
					if (window.getComputedStyle(element).display === "none") {
						element.style.display = "block";
					}
				}
				if (computed.visibility === "hidden" || computed.visibility === "collapse") {
					element.style.visibility = "visible";
				}
				if (computed.opacity === "0") {
					element.style.opacity = "1";
				}
			}

			function resumeMainLoop() {
				if (typeof Module === "undefined" || !Module || typeof Module.resumeMainLoop !== "function") {
					return;
				}

				try {
					Module.resumeMainLoop();
				}
				catch (error) {
					warn("resumeMainLoop failed", error);
				}
			}

			function focusCanvas(canvas) {
				if (!canvas || typeof canvas.focus !== "function") {
					return;
				}

				try {
					canvas.focus({ preventScroll: true });
				}
				catch (error) {
					try {
						canvas.focus();
					}
					catch (fallbackError) {
						warn("canvas focus failed", fallbackError);
					}
				}
			}

			function restoreCanvasAfterAd(reason) {
				var canvas = document.getElementById("canvas");
				var container = document.getElementById("canvas-container");
				var app = document.getElementById("app-container");

				ensureVisible(app);
				ensureVisible(container);
				ensureVisible(canvas);
				resumeMainLoop();
				focusCanvas(canvas);
				logCanvasResumeState(reason + ":immediate");

				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(function () {
						resumeMainLoop();
						focusCanvas(canvas);
						logCanvasResumeState(reason + ":raf");
					});
				}

				window.setTimeout(function () {
					resumeMainLoop();
					focusCanvas(canvas);
					logCanvasResumeState(reason + ":timeout");
				}, 250);
			}

			function wrapPokiAdFunction(pokiSdk, functionName) {
				var original = pokiSdk[functionName];
				if (typeof original !== "function" || original.__pushTitansWrapped) {
					return;
				}

				var wrapped = function () {
					logCanvasResumeState("poki-" + functionName + "-start");

					var result;
					try {
						result = original.apply(this, arguments);
					}
					catch (error) {
						restoreCanvasAfterAd("poki-" + functionName + "-throw");
						throw error;
					}

					if (result && typeof result.then === "function") {
						return result.then(function (value) {
							restoreCanvasAfterAd("poki-" + functionName + "-resolved");
							return value;
						}, function (error) {
							restoreCanvasAfterAd("poki-" + functionName + "-rejected");
							throw error;
						});
					}

					restoreCanvasAfterAd("poki-" + functionName + "-returned");
					return result;
				};

				wrapped.__pushTitansWrapped = true;
				pokiSdk[functionName] = wrapped;
			}

			function installPokiHooks() {
				if (!window.PokiSDK || pokiHooksInstalled) {
					return false;
				}

				wrapPokiAdFunction(window.PokiSDK, "commercialBreak");
				wrapPokiAdFunction(window.PokiSDK, "rewardedBreak");
				pokiHooksInstalled = true;
				logCanvasResumeState("poki-hooks-installed");
				return true;
			}

			function schedulePokiHooks() {
				if (installPokiHooks()) {
					return;
				}

				var timer = window.setInterval(function () {
					pokiHookChecks += 1;
					if (installPokiHooks() || pokiHookChecks >= maxPokiHookChecks) {
						window.clearInterval(timer);
					}
				}, 100);
			}

			document.addEventListener("visibilitychange", function () {
				if (document.hidden) {
					logCanvasResumeState("visibilitychange-hidden");
					return;
				}

				restoreCanvasAfterAd("visibilitychange-visible");
			});

			window.addEventListener("focus", function () {
				restoreCanvasAfterAd("window-focus");
			});

			window.addEventListener("pageshow", function () {
				restoreCanvasAfterAd("pageshow");
			});

			window.PushTitansRestoreCanvasAfterAd = restoreCanvasAfterAd;
			window.PushTitansLogCanvasResumeState = logCanvasResumeState;
			schedulePokiHooks();
		})();
