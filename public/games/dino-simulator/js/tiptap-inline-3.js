let doLog = false;//true;
const bootTime = performance.now();
function bootLog(msg) {
	if (!doLog) return;
	const t = ((performance.now() - bootTime) / 1000).toFixed(2);
	console.error(`[BOOT ${t}s] ${msg}`);
}

bootLog("HTML loaded");
let stillInitializing = true;
setTimeout(() => { if (stillInitializing) { bootLog("Still loading after 10 seconds"); } }, 10000);
setTimeout(() => { if (stillInitializing) { bootLog("Still loading after 30 seconds"); } }, 30000);
setTimeout(() => { if (stillInitializing) { bootLog("Still loading after 60 seconds"); } }, 60000);

const GODOT_CONFIG = {"args":[],"canvasResizePolicy":2,"emscriptenPoolSize":8,"ensureCrossOriginIsolationHeaders":true,"executable":"index","experimentalVK":false,"fileSizes":{"index.pck":18668680,"index.wasm":37685705},"focusCanvas":true,"gdextensionLibs":[],"godotPoolSize":4};
const GODOT_THREADS_ENABLED = false;
const engine = new Engine(GODOT_CONFIG);

bootLog("Engine created");

const statusOverlay = document.getElementById('status');
const statusProgress = document.getElementById('status-progress');
const statusFill = document.getElementById('status-progress-fill');
const statusNotice = document.getElementById('status-notice');

let prevPercentage = 0;
function setProgressBar(percent) {
	percent = Math.max(0, Math.min(100, percent))
	if (percent <= prevPercentage) return;
	prevPercentage = percent;
	statusFill.style.transform = `scaleX(${percent/100})`;
}
setProgressBar(0);

let statusMode = '';
function setStatusMode(mode) {
	if (statusMode === mode || !stillInitializing) {
		return;
	}
	if (mode === 'hidden') {
		statusOverlay.remove();
		stillInitializing = false;
		return;
	}
	statusOverlay.style.visibility = 'visible';
	statusProgress.style.display = mode === 'progress' ? 'block' : 'none';
	statusNotice.style.display = mode === 'notice' ? 'block' : 'none';
	statusMode = mode;
}

function setStatusNotice(text) {
	while (statusNotice.lastChild) {
		statusNotice.removeChild(statusNotice.lastChild);
	}
	const lines = text.split('\n');
	lines.forEach((line) => {
		statusNotice.appendChild(document.createTextNode(line));
		statusNotice.appendChild(document.createElement('br'));
	});
}

async function getStatusNotice(err) {
	const test = await checkCompatibility();
	if (!test.ok) {
		return test.message + `<br><a href='${test.updateUrl}'>Update</a>`;
	} else if (err instanceof Error) {
		return err.message;
	} else if (typeof err === 'string') {
		return err;
	}
	return 'An unknown error occured: ' + (err || "null").toString();
}

async function displayFailureNotice(err) {
	console.error(err);
	bootLog("displayFailureNotice: " + err);
	setStatusNotice(await getStatusNotice(err));
	setStatusMode('notice');
	// Godot has truly stopped loading, so...
	stillInitializing = false;
}

async function startGameLoading() {
	bootLog("startGameLoading()");
	
	if (!checkBrowserFeatures()) return;

	setStatusMode('progress');
	bootLog("Calling engine.startGame()");

	const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
	await nextFrame();
	
	let lastProgressLog = 0;
	engine.startGame({
		'onProgress': function (current, total) {
			if (performance.now() - lastProgressLog > 1000) {
				lastProgressLog = performance.now();
				bootLog(`Loading WASM ${current}/${total} (${(100*current/total).toFixed(2)}%)`);
			}
			
			let frac = total <= 0 ? 0 : (current / total);
			setProgressBar(0 + frac * 50);
			if (frac >= 1) {
				//window.animateToEngineReady();
				statusFill.style.transition = "transform 2000ms linear";
				setProgressBar(60);
			}
		},
	    onAbort: function(reason) {
			console.error("WASM aborted:", reason);
			if (reason.includes("heap memory")) {
				setStatusNotice(`
					<div class="oom">
						<h2>Out of memory</h2>
						<p>Your device couldn't allocate enough memory.</p>
						<button onclick="location.reload()">Reload</button>
					</div>
				`);
				setStatusMode('notice');
			}
		}
	}).then(() => {
		bootLog("engine.startGame() completed");
		//window.animateToEngineReady();
		setProgressBar(60);
	}, displayFailureNotice);
}

let preEngineTween = null;
let engineProgressLocked = false;
let preEngineTweenCancelled = false;
window.animateToEngineReady = function() {
	const start = performance.now();
	const from = 50;
	const to = 60;
	const duration = 3000; // tweak feel

	function frame(t) {
		if (engineProgressLocked) return;
		const p = Math.min(1, (t - start) / duration);
		const eased = p * (2 - p); // smoothstep-ish
		const value = from + (to - from) * eased;
		setProgressBar(value);
		preEngineTween = requestAnimationFrame(frame);
	}
	if (preEngineTween) {
		cancelAnimationFrame(preEngineTween);
	}
	preEngineTween = requestAnimationFrame(frame);
}

let firstPercentage = -1;
window.setLoadingProgress = function(percent) {
	if (firstPercentage < 0) {
		firstPercentage = percent;
		engineProgressLocked = true;
	}

	if (preEngineTween) {
		cancelAnimationFrame(preEngineTween);
		preEngineTween = null;
	}

	percent = (percent - firstPercentage) / (100 - firstPercentage);
	
	statusFill.style.transition = "none";
	statusFill.getBoundingClientRect();
	const basePercentage = 60;
	setProgressBar(basePercentage + percent * (100 - basePercentage));
}

let gameLoadingFinishedCalled = false;
window.finishLoading = function() {
	bootLog("Loading GAME complete.");
	setProgressBar(100);
	setStatusMode('hidden');
	stillInitializing = false;
	if (!gameLoadingFinishedCalled) {
		gameLoadingFinishedCalled = true;
		PokiSDK.gameLoadingFinished();
	}
	bootLog("Loading GAME complete (end).");
}

// Poki SDK Init.
bootLog("PokiSDK.init() starting");
PokiSDK.init().then(()=>{
	bootLog("PokiSDK.init() SUCCESS");
}).catch((err)=>{
	bootLog("PokiSDK.init() FAILED");
	console.error(err);
})

let hn = window.location.hostname
if (hn == "localhost" || hn == "127.0.0.1" || hn == "dinosim.storygiantgames.com"){
	PokiSDK.setDebug(true)
}

function checkBrowserFeatures() {
	bootLog("Checking browser features");
	const missing = Engine.getMissingFeatures({
		threads: GODOT_THREADS_ENABLED,
	});
	bootLog(`Missing features: ${missing.join(", ") || "none"}`);
	if (missing.length == 0) return true;

	if (GODOT_CONFIG['serviceWorker'] && GODOT_CONFIG['ensureCrossOriginIsolationHeaders'] && 'serviceWorker' in navigator) {
		// There's a chance that installing the service worker would fix the issue
		Promise.race([
			navigator.serviceWorker.getRegistration().then((registration) => {
				if (registration != null) {
					return Promise.reject(new Error('Service worker already exists.'));
				}
				return registration;
			}).then(() => engine.installServiceWorker()),
			// For some reason, `getRegistration()` can stall
			new Promise((resolve) => {
				setTimeout(() => resolve(), 2000);
			}),
		]).then(() => {
			// Reload if there was no error.
			window.location.reload();
		}).catch((err) => {
			console.error('Error while registering service worker:', err);
			displayFailureNotice('Failed to enable required browser features. Please reload the page.');
		});
	} else {
		// Display the message as usual
		const missingMsg = 'Error\nThe following features required to run Godot projects on the Web are missing:\n';
		displayFailureNotice(missingMsg + missing.join('\n'));
	}
	return false;
}

async function checkCompatibility() {
	// 1. Direct Inline WASM SIMD Feature Detection
	// Compiles a tiny, 1-instruction WASM binary containing 'i32x4.splat'
	const hasSimdSupport = await (async () => {
		try {
			const bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 0, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 26, 11]);
			const module = await WebAssembly.compile(bytes);
			return module instanceof WebAssembly.Module;
		} catch (e) { return false; }
	})();

	// 2. Scan User Agent for Browser, Version, and Operating System
	const ua = navigator.userAgent;
	let browserName = "Unknown Browser";
	let browserVersion = 0;
	let osName = "PC"; // Default fallback
	let updateUrl = "https://google.com/chrome"; // Default fallback

	// Detect Operating System & Map Official Support Guides
	if (/Android/i.test(ua)) { osName = "Android"; }
	else if (/iPhone|iPad|iPod/i.test(ua)) { osName = "iOS"; updateUrl = "https://apple.com"; }
	else if (/Macintosh|Mac OS X/i.test(ua)) { osName = "Mac"; updateUrl = "https://apple.com"; }
	else if (/CrOS/i.test(ua)) { osName = "Chromebook"; }
	else if (/Windows/i.test(ua)) { osName = "Windows PC"; }

	if (/Brave/i.test(navigator.brave?.isBrave?.name || "")) {
		browserName = "Brave";
	} else if (/OPR\/|Opera/i.test(ua)) {
		browserName = "Opera";
		browserVersion = parseInt(ua.match(/OPR\/(\d+)/)?.[1] || "0", 10);
		updateUrl = "https://opera.com";
	} else if (/Edg/i.test(ua)) {
		browserName = "Microsoft Edge";
		browserVersion = parseInt(ua.match(/Edg\/(\d+)/)?.[1] || "0", 10);
		updateUrl = "https://microsoft.com/edge";
	} else if (/Chrome|CriOS/i.test(ua)) {
		browserName = "Google Chrome";
		browserVersion = parseInt(ua.match(/(?:Chrome|CriOS)\/(\d+)/)?.[1] || "0", 10);
		updateUrl = "https://google.com/chrome";
	} else if (/Firefox|FxiOS/i.test(ua)) {
		browserName = "Mozilla Firefox";
		browserVersion = parseInt(ua.match(/(?:Firefox|FxiOS)\/(\d+)/)?.[1] || "0", 10);
		updateUrl = "https://firefox.com";
	} else if (/Safari/i.test(ua)) {
		browserName = "Safari";
		browserVersion = parseInt(ua.match(/Version\/(\d+)/)?.[1] || "0", 10);
		updateUrl = "https://apple.com";
	}
	
	// Add this check inside your existing function, right after parsing the User Agent
	const canvas = document.createElement('canvas');
	const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	let isSoftwareRenderer = false;

	if (gl) {
		const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
		if (debugInfo) {
			const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
			// Detect the exact driver from your error log
			if (renderer.includes("Microsoft Basic Render Driver") || renderer.includes("SwiftShader")) {
				isSoftwareRenderer = true;
			}
		}
	}

	let message = "Everything looks good! Your browser supports hardware-accelerated Wasm SIMD.";

	// Override the player message if we catch this specific driver issue
	if (isSoftwareRenderer) {
		message = `⚠️ HARDWARE ACCELERATION REQUIRED\n\n` +
		   `Your browser is using a backup software renderer instead of your graphics card.\n\n` +
		   `👉 How to Fix:\n` +
		   `1. Open ${browserName} Settings (click the 3 dots in the top-right corner).\n` +
		   `2. Search for "Hardware Acceleration" in the settings search bar.\n` +
		   `3. Turn ON "Use graphics acceleration when available" and relaunch ${browserName}.\n\n` +
		   `If it's already on, your PC might be missing its graphics card (GPU) drivers.`;
	}
	else if (!hasSimdSupport) {
		// Evaluate Engine-Level SIMD Capabilities
		if (browserName === "Brave") {
			message = "Your Brave Browser has SIMD disabled. Go to 'brave://settings/shields' and switch Fingerprinting Protection from 'Strict' to 'Standard' to allow the game to compile.";
			updateUrl = ""; // No update required, just config
		} else if (browserName === "Google Chrome" && browserVersion < 91) {
			message = `Your Chrome version (${browserVersion}) is too old. Godot requires WebAssembly SIMD, introduced in Chrome 91.`;
		} else if (browserName === "Mozilla Firefox" && browserVersion < 89) {
			message = `Your Firefox version (${browserVersion}) is too old. Godot requires WebAssembly SIMD, introduced in Firefox 89.`;
		} else if (browserName === "Safari" && browserVersion < 16) {
			message = `Your Safari version (${browserVersion}) is too old. Godot requires WebAssembly SIMD, introduced in Safari 16.1 / macOS Ventura.`;
		} else {
			message = `Your current browser on ${osName} does not support WebAssembly SIMD optimizations. Updating or changing your browser will resolve this issue instantly.`;
		}
	}

	return {
		ok: hasSimdSupport && !isSoftwareRenderer,
		updateUrl: updateUrl,
		message: message,
	};
}

// DO IT!!
startGameLoading();
