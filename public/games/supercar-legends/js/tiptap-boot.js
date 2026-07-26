(() => {
    "use strict";

    // Local Unity WebGL bootstrapper. Replaces Poki's remote master-loader so
    // the mirror boots straight into the game with zero source-site, ad,
    // analytics, or remote-config traffic. Points Unity's own loader at the
    // locally hosted, byte-preserved build (brotli transport stripped; the
    // build server re-adds lossless .br sidecars at build time).

    const SOURCE = "tiptap-supercar-legends";
    const post = (type, detail = {}) => {
        if (window.parent !== window) {
            window.parent.postMessage({ source: SOURCE, type, ...detail }, window.location.origin);
        }
    };

    const buildUrl = "Build";
    const config = {
        dataUrl: buildUrl + "/supercar-legends.data",
        frameworkUrl: buildUrl + "/supercar-legends.framework.js",
        codeUrl: buildUrl + "/supercar-legends.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "supercar-evolution",
        productVersion: "0.1",
    };

    const canvas = document.querySelector("#unity-canvas");

    const boot = () => {
        if (typeof window.createUnityInstance !== "function") {
            post("runtime-error", { detail: "Unity loader unavailable" });
            return;
        }
        window
            .createUnityInstance(canvas, config, (progress) => {
                post("loading-progress", { progress: Math.round(progress * 100) });
            })
            .then((instance) => {
                window.__TIPTAP_UNITY__ = instance;
                // Poki's Unity glue references the instance as window.unityGame;
                // the bridge's SendMessage handshake depends on it.
                window.unityGame = instance;
                post("unity-ready");
            })
            .catch((message) => {
                post("runtime-error", { detail: String(message) });
            });
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        boot();
    } else {
        window.addEventListener("DOMContentLoaded", boot);
    }
})();
