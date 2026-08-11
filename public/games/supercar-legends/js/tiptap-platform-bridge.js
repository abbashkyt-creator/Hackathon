(() => {
    "use strict";

    // Local stand-in for Poki's platform SDK. Supercar Legends (Unity WebGL,
    // by Jungle Tavern) calls window.PokiSDK for ad breaks and gameplay
    // lifecycle only — it never calls a score/highscore/leaderboard method, so
    // this card is intentionally UNRANKED. No score is ever forwarded or
    // invented. Ads are skipped locally and never downloaded or displayed.

    const SOURCE = "tiptap-supercar-legends";
    const PARENT_SOURCE = "tiptap-parent";
    let debug = false;
    let gameplayActive = false;
    const query = new URLSearchParams(window.location.search);
    const autoStartEnabled =
        query.get("autoplay") === "1" || query.get("embedded") === "tiptap";
    let muted = query.get("muted") === "1";
    const audioContexts = new Set();
    const autoStartTimers = new Set();
    let autoStartAttempt = 0;
    // Auto-start is a strictly one-time courtesy (first visible run). Once a
    // run has begun we never synthesize input again — the player owns the
    // garage, shop, upgrades, and every subsequent race.
    let autoStartConsumed = false;

    const persistMuted = (value) => {
        muted = Boolean(value);
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
        if (!autoStartEnabled || gameplayActive || autoStartConsumed) {
            clearAutoStartTimers();
            return false;
        }
        const canvas = document.querySelector("canvas");
        if (!canvas) return false;
        const bounds = canvas.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) return false;
        const eventInit = {
            bubbles: true,
            cancelable: true,
            clientX: bounds.left + bounds.width / 2,
            clientY: bounds.top + bounds.height / 2,
            pointerId: 1,
            pointerType: "touch",
            isPrimary: true,
            button: 0,
        };
        post("autoplay-attempt", { attempt });
        if (typeof window.PointerEvent === "function") {
            canvas.dispatchEvent(new PointerEvent("pointerdown", eventInit));
            canvas.dispatchEvent(new PointerEvent("pointerup", eventInit));
        }
        canvas.dispatchEvent(new MouseEvent("mousedown", eventInit));
        canvas.dispatchEvent(new MouseEvent("mouseup", eventInit));
        canvas.click();
        // The start/garage screen also accepts Space ("PRESS SPACE OR CLICK").
        const keyInit = { bubbles: true, cancelable: true, key: " ", code: "Space", keyCode: 32, which: 32 };
        canvas.dispatchEvent(new KeyboardEvent("keydown", keyInit));
        canvas.dispatchEvent(new KeyboardEvent("keyup", keyInit));
        window.dispatchEvent(new KeyboardEvent("keydown", keyInit));
        window.dispatchEvent(new KeyboardEvent("keyup", keyInit));
        return true;
    };

    const scheduleAutoStart = () => {
        if (!autoStartEnabled || gameplayActive || autoStartConsumed) return;
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
            if (autoStartAttempt >= 8) {
                clearAutoStartTimers();
                post("autoplay-exhausted", { attempts: autoStartAttempt });
                return;
            }
            queue(attempted ? 1_200 : 400);
        };
        queue(400);
    };

    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin || event.data?.source !== PARENT_SOURCE) {
            return;
        }
        if (event.data.type === "set-muted") {
            persistMuted(Boolean(event.data.muted));
            post("muted", { muted });
        }
        if (event.data.type === "auto-start") scheduleAutoStart();
    });

    const noAd = (options) => {
        const onStart =
            typeof options === "function"
                ? options
                : options && typeof options.onStart === "function"
                  ? options.onStart
                  : null;
        if (onStart) onStart();
    };

    const sdk = {
        adBlockerOn: false,
        setDebug(value) {
            debug = Boolean(value);
        },
        init() {
            post("sdk-ready");
            return Promise.resolve();
        },
        gameLoadingStart() {
            post("loading-start");
        },
        gameLoadingProgress(progress) {
            const value = Number(progress && progress.percentageDone != null ? progress.percentageDone : progress);
            if (Number.isFinite(value)) post("loading-progress", { progress: value });
        },
        gameLoadingFinished() {
            post("loading-finished");
            scheduleAutoStart();
        },
        gameInteractive() {
            post("interactive");
        },
        gameplayStart() {
            gameplayActive = true;
            autoStartConsumed = true;
            clearAutoStartTimers();
            post("gameplay-start");
        },
        gameplayStop() {
            gameplayActive = false;
            post("gameplay-stop");
            // Auto-start is a one-time courtesy so the card is already playing
            // when it becomes visible. After the first run ends we hand full
            // control back to the player (RACE / GARAGE / SHOP / upgrades) and
            // never synthesize input again.
        },
        // Ads: routed to the same-origin parent pipeline. It is off by default,
        // never loads an outside SDK, and grants rewards only after completion.
        commercialBreak(onStart) {
            post("commercial-break-requested");
            return window.TipTapAds.commercial(onStart, "supercar-commercial");
        },
        rewardedBreak(options) {
            post("rewarded-break-requested");
            return window.TipTapAds.rewarded(options, "supercar-rewarded");
        },
        displayAd(options) {
            return window.TipTapAds.display(options, "supercar-display");
        },
        destroyAd() {},
        isAdBlocked() {
            return Promise.resolve(false);
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
        logError(error) {
            if (debug) console.warn("[Tip Tap bridge] game error", error);
        },
        movePill() {},
        getLanguage() {
            return "en";
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
        gameplayActive() {
            return gameplayActive;
        },
    };

    window.PokiSDK = sdk;

    // Unity <-> Poki interop. The captured Unity build's jslib calls these
    // top-level globals and blocks its own startup until it receives a
    // SendMessage(gameObject, "ready") handshake. We reimplement that protocol
    // locally (no ads, instant ready) so the game boots straight into play.
    // window.unityGame is set by tiptap-boot.js once the instance exists.
    let unityBridgeObject = null;
    const sendToGame = (method, value) => {
        if (window.unityGame && unityBridgeObject) {
            if (value === undefined) window.unityGame.SendMessage(unityBridgeObject, method);
            else window.unityGame.SendMessage(unityBridgeObject, method, value);
        }
    };

    window.initPokiBridge = (name) => {
        unityBridgeObject = name;
        if (!window.unityGame) {
            window.setTimeout(() => window.initPokiBridge(name), 100);
            return;
        }
        if (window.pokiReady) window.unityGame.SendMessage(name, "ready");
        else window.pokiBridge = name;
    };

    window.commercialBreak = () => {
        Promise.resolve(sdk.commercialBreak()).then(() => sendToGame("commercialBreakCompleted"));
    };

    window.rewardedBreak = (...args) => {
        Promise.resolve(sdk.rewardedBreak(...args)).then((withReward) =>
            sendToGame("rewardedBreakCompleted", String(Boolean(withReward))),
        );
    };

    window.shareableURL = (options) => {
        Promise.resolve(sdk.shareableURL(options))
            .then((url) => sendToGame("shareableURLResolved", String(url)))
            .catch(() => sendToGame("shareableURLRejected"));
    };

    // Complete the readiness handshake locally.
    Promise.resolve(sdk.init()).then(() => {
        if (window.pokiBridge && window.unityGame) {
            window.unityGame.SendMessage(window.pokiBridge, "ready");
        } else {
            window.pokiReady = true;
        }
    });
})();
