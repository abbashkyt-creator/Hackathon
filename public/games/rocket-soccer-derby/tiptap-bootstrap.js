(() => {
  "use strict";
  const config = window.__TIPTAP_ROCKET_SOCCER_CONFIG__;
  const body = document.body;
  body.innerHTML = '<main id="shell"><div id="loading"><strong>ROCKET SOCCER DERBY</strong><span>Loading match…</span><div><i></i></div><b>0%</b></div><div id="game"></div><p id="error" hidden></p></main>';

  const loading = document.querySelector("#loading");
  const progress = loading.querySelector("i");
  const percent = loading.querySelector("b");
  const error = document.querySelector("#error");
  const style = document.createElement("style");
  style.textContent = 'html,body,#shell{width:100%;height:100%;margin:0;overflow:hidden;background:#231f20;color:#fff;font-family:Arial,sans-serif}#shell{position:relative}#game,#game canvas{width:100%!important;height:100%!important;display:block}#game{position:absolute;inset:0}#loading{position:absolute;z-index:2;inset:0;display:grid;place-content:center;gap:12px;text-align:center;background:radial-gradient(circle at 50% 35%,#315677,#101920 70%);letter-spacing:.08em}#loading[hidden]{display:none}#loading strong{font-size:clamp(20px,5vw,34px)}#loading span{opacity:.8;font-size:13px}#loading div{width:min(68vw,340px);height:9px;border-radius:99px;background:#ffffff30;overflow:hidden}#loading i{display:block;width:0;height:100%;background:linear-gradient(90deg,#ffd54a,#ff7a47);transition:width .15s ease}#loading b{font-size:13px}#error{position:absolute;inset:auto 16px 16px;z-index:3;padding:12px;border-radius:12px;background:#591b28;color:#fff;text-align:center}';
  document.head.appendChild(style);

  const fail = (reason) => {
    error.hidden = false;
    error.textContent = `Rocket Soccer Derby could not start: ${String(reason || "Unknown Unity error.")}`;
    loading.hidden = true;
  };
  if (!window.UnityLoader?.instantiate) {
    fail("The local Unity loader is unavailable.");
    return;
  }
  let revealed = false;
  const revealGame = () => {
    if (revealed) return;
    revealed = true;
    loading.hidden = true;
    window.__TIPTAP_ROCKET_SOCCER_READY__?.();
    window.parent.postMessage({ source: "tiptap-rocket-soccer-derby", type: "ready" }, window.location.origin);
  };
  // Unity's legacy progress callback can complete from a worker after the last
  // callback invocation. Observe the actual rendered 100% state as a fallback
  // so the local runtime is never hidden behind Tip Tap's loading layer.
  const revealWatch = window.setInterval(() => {
    if (percent.textContent === "100%") {
      window.clearInterval(revealWatch);
      revealGame();
    }
  }, 100);
  try {
    window.unityGame = window.UnityLoader.instantiate("game", config.buildUrl, {
      onProgress: (_instance, value) => {
        const ratio = Math.max(0, Math.min(1, Number(value) || 0));
        progress.style.width = `${Math.round(ratio * 100)}%`;
        percent.textContent = `${Math.round(ratio * 100)}%`;
        // This legacy loader marks all Unity jobs complete before it calls the
        // module hook in some Chromium/WebGL combinations. Both states mean
        // the source runtime has a real canvas and can begin its own main menu.
        if (Math.round(ratio * 100) >= 100) revealGame();
      },
      Module: {
        onRuntimeInitialized: () => {
          revealGame();
        },
      },
    });
  } catch (reason) {
    fail(reason);
  }
})();
