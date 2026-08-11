(() => {
    "use strict";

    const SOURCE = "tiptap-subway-surfers";
    let debug = false;
    let submitScoreRegistration = null;
    let gameplayActive = false;
    const query = new URLSearchParams(window.location.search);
    const autoStartEnabled =
        query.get("autoplay") === "1" || query.get("embedded") === "tiptap";
    let muted = query.get("muted") === "1";
    const audioContexts = new Set();
    const autoStartTimers = new Set();
    let autoStartAttempt = 0;
    const nativeFetch = window.fetch.bind(window);
    const nativeSendBeacon =
        typeof navigator.sendBeacon === "function" ? navigator.sendBeacon.bind(navigator) : null;
    const gpuBenchmarkUrl =
        "https://unpkg.com/detect-gpu@3.1.30/dist/benchmarks/d-intel.json";
    const nativeGetContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = function (type, options) {
        if (type === "2d") {
            return nativeGetContext.call(this, type, { ...options, willReadFrequently: true });
        }
        return nativeGetContext.call(this, type, options);
    };

    const persistMuted = (value) => {
        muted = Boolean(value);
        try {
            const settings = JSON.parse(localStorage.getItem("GameSettings") || "{}");
            settings.muted = muted;
            localStorage.setItem("GameSettings", JSON.stringify(settings));
        } catch {
            // The game can recreate malformed settings; audio suspension still applies.
        }
        for (const context of audioContexts) {
            const action = muted ? context.suspend() : context.resume();
            Promise.resolve(action).catch(() => {});
        }
    };

    const NativeAudioContext = window.AudioContext || window.webkitAudioContext;
    if (NativeAudioContext) {
        class TipTapAudioContext extends NativeAudioContext {
            constructor(...args) {
                super(...args);
                audioContexts.add(this);
                if (muted) void this.suspend();
            }
        }
        window.AudioContext = TipTapAudioContext;
        window.webkitAudioContext = TipTapAudioContext;
    }
    persistMuted(muted);

    window.fetch = (input, init) => {
        const requested = new URL(
            typeof input === "string" || input instanceof URL ? input : input.url,
            window.location.href,
        );
        if (requested.href === gpuBenchmarkUrl) {
            return nativeFetch("assets/vendor/detect-gpu/d-intel.json", init);
        }
        if (requested.hostname === "leveldata.poki.io") {
            return Promise.resolve(new Response(null, { status: 204 }));
        }
        return nativeFetch(input, init);
    };

    if (nativeSendBeacon) {
        navigator.sendBeacon = (url, data) => {
            const requested = new URL(String(url), window.location.href);
            if (requested.hostname === "leveldata.poki.io") return true;
            return nativeSendBeacon(url, data);
        };
    }

    const post = (type, detail = {}) => {
        const event = { source: SOURCE, type, ...detail };
        window.__TIPTAP_BRIDGE_EVENTS__ = [
            ...(window.__TIPTAP_BRIDGE_EVENTS__ || []),
            event,
        ].slice(-100);
        window.dispatchEvent(new CustomEvent("tiptap-bridge-event", { detail: event }));
        if (window.parent !== window) {
            window.parent.postMessage(event, window.location.origin);
        }
    };

    const clearAutoStartTimers = () => {
        for (const timer of autoStartTimers) window.clearTimeout(timer);
        autoStartTimers.clear();
    };

    const attemptAutoStart = (attempt) => {
        if (!autoStartEnabled || gameplayActive) {
            clearAutoStartTimers();
            return false;
        }
        const canvas = document.querySelector("canvas");
        if (!canvas) return false;
        const bounds = canvas.getBoundingClientRect();
        const eventInit = {
            bubbles: true,
            cancelable: true,
            clientX: bounds.left + bounds.width / 2,
            clientY: bounds.top + bounds.height * 0.72,
            pointerId: 1,
            pointerType: "touch",
            isPrimary: true,
        };
        post("autoplay-attempt", { attempt });
        if (typeof window.PointerEvent === "function") {
            canvas.dispatchEvent(new PointerEvent("pointerdown", eventInit));
            canvas.dispatchEvent(new PointerEvent("pointerup", eventInit));
        }
        canvas.click();
        return true;
    };

    const scheduleAutoStart = () => {
        if (!autoStartEnabled || gameplayActive) return;
        clearAutoStartTimers();
        autoStartAttempt = 0;
        const queue = (delay) => {
            const timer = window.setTimeout(() => {
                autoStartTimers.delete(timer);
                run();
            }, delay);
            autoStartTimers.add(timer);
        };
        const run = () => {
            if (gameplayActive) {
                clearAutoStartTimers();
                return;
            }
            const attempted = attemptAutoStart(autoStartAttempt + 1);
            if (attempted) autoStartAttempt += 1;
            if (gameplayActive) return;
            if (autoStartAttempt >= 5) {
                clearAutoStartTimers();
                post("autoplay-failed", { attempts: autoStartAttempt });
                return;
            }
            queue(attempted ? 1_200 : 250);
        };
        queue(200);
    };

    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin || event.data?.source !== "tiptap-parent") {
            return;
        }
        if (event.data.type === "set-muted") {
            persistMuted(Boolean(event.data.muted));
            post("muted", { muted });
        }
        if (event.data.type === "auto-start") scheduleAutoStart();
    });

    const normalizeScore = (value) => {
        const candidate =
            typeof value === "object" && value !== null
                ? value.score ?? value.value ?? value.highScore
                : value;
        const score = Number(candidate);
        return Number.isSafeInteger(score) && score >= 0 ? score : null;
    };

    const reportScore = (value, reason) => {
        const score = normalizeScore(value);
        if (score === null) return;
        post("score", { score, reason });
    };

    const installSubmissionCallback = () => {
        if (typeof submitScoreRegistration !== "function") return;
        try {
            submitScoreRegistration((value) => reportScore(value, "registered-submit"));
        } catch (error) {
            if (debug) console.warn("[Tip Tap bridge] Score registration failed", error);
        }
    };

    const sdk = {
        adBlockerOn: false,
        setDebug(value) {
            debug = Boolean(value);
        },
        init(options = {}) {
            submitScoreRegistration =
                typeof options.submitScore === "function" ? options.submitScore : null;
            installSubmissionCallback();
            post("sdk-ready");
            return Promise.resolve();
        },
        gameLoadingStart() {
            post("loading-start");
        },
        gameLoadingProgress(progress) {
            const value = Number(progress);
            if (Number.isFinite(value)) post("loading-progress", { progress: value });
        },
        gameLoadingFinished() {
            installSubmissionCallback();
            post("loading-finished");
            scheduleAutoStart();
        },
        gameInteractive() {
            post("interactive");
        },
        gameplayStart(meta = {}) {
            gameplayActive = true;
            clearAutoStartTimers();
            post("gameplay-start", { meta });
        },
        gameplayStop(meta = {}) {
            gameplayActive = false;
            post("gameplay-stop", { meta });
        },
        commercialBreak(onStart) {
            post("commercial-break-requested");
            return window.TipTapAds.commercial(onStart, "subway-commercial");
        },
        rewardedBreak(options) {
            post("rewarded-break-requested");
            return window.TipTapAds.rewarded(options, "subway-rewarded");
        },
        sendHighscore(leaderboard, score, meta = {}) {
            reportScore(score, "send-highscore");
            post("highscore", { leaderboard, meta });
            return Promise.resolve([]);
        },
        getLeaderboard() {
            return Promise.resolve([]);
        },
        happyTime(intensity) {
            post("happy-time", { intensity: Number(intensity) || 0 });
        },
        measure(category, action, value) {
            if (debug) console.info("[Tip Tap bridge] measure", category, action, value);
        },
        customEvent(category, action, value) {
            if (debug) console.info("[Tip Tap bridge] event", category, action, value);
        },
        shareableURL() {
            return Promise.resolve(window.location.href);
        },
        getURLParam(key) {
            return new URLSearchParams(window.location.search).get(String(key));
        },
        getUser() {
            return Promise.resolve(null);
        },
        getToken() {
            return Promise.resolve(null);
        },
        login() {
            return Promise.reject(new Error("Tip Tap uses its own player account."));
        },
        openExternalLink(url) {
            post("external-link", { url: String(url) });
        },
        setPlayerAge() {},
        roundStart() {},
        roundEnd() {},
        setDebugTouchOverlayController() {},
        displayAd(options) { return window.TipTapAds.display(options, "subway-display"); },
        destroyAd() {},
        gameplayActive() {
            return gameplayActive;
        },
    };

    window.PokiSDK = sdk;
})();
