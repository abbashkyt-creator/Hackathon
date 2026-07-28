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
  style.textContent = 'html,body,#shell{width:100%;height:100%;margin:0;overflow:hidden;background:#111725;color:#fff;font-family:Arial,sans-serif}#shell{position:relative;background:radial-gradient(circle at 50% 72%,rgba(67,117,183,.42),transparent 38%),linear-gradient(180deg,#151c2c,#0b101a)}#shell::after{position:absolute;z-index:1;inset:0;content:"";background:linear-gradient(180deg,rgba(7,12,22,.08),rgba(7,12,22,.34));pointer-events:none}#game-backdrop{position:absolute;z-index:0;inset:-8%;width:116%;height:116%;object-fit:cover;filter:blur(22px) saturate(1.25) brightness(.58);transform:scale(1.08);pointer-events:none}#game{position:absolute;z-index:2;top:50%;left:50%;width:100%;height:auto;aspect-ratio:16/9;overflow:hidden;transform:translate(-50%,-50%);background:#231f20;box-shadow:0 18px 55px rgba(0,0,0,.46)}#game canvas{width:100%!important;height:100%!important;display:block}@media (min-aspect-ratio:16/9){#game{width:auto;height:100%;aspect-ratio:16/9}}#loading{position:absolute;z-index:4;inset:0;display:grid;place-content:center;gap:12px;text-align:center;background:radial-gradient(circle at 50% 35%,#315677,#101920 70%);letter-spacing:.08em}#loading[hidden]{display:none}#loading strong{font-size:clamp(20px,5vw,34px)}#loading span{opacity:.8;font-size:13px}#loading div{width:min(68vw,340px);height:9px;border-radius:99px;background:#ffffff30;overflow:hidden}#loading i{display:block;width:0;height:100%;background:linear-gradient(90deg,#ffd54a,#ff7a47);transition:width .15s ease}#loading b{font-size:13px}#error{position:absolute;inset:auto 16px 16px;z-index:5;padding:12px;border-radius:12px;background:#591b28;color:#fff;text-align:center}';
  document.head.appendChild(style);

  const attachLiveBackdrop = () => {
    if (document.querySelector("#game-backdrop")) return true;
    const canvas = document.querySelector("#game canvas");
    if (!canvas || typeof canvas.captureStream !== "function") return false;
    try {
      const stream = canvas.captureStream(15);
      if (!stream?.getVideoTracks().length) return false;
      const backdrop = document.createElement("video");
      backdrop.id = "game-backdrop";
      backdrop.autoplay = true;
      backdrop.muted = true;
      backdrop.playsInline = true;
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.srcObject = stream;
      document.querySelector("#shell").prepend(backdrop);
      void backdrop.play().catch(() => {});
      return true;
    } catch {
      return false;
    }
  };
  let backdropAttempts = 0;
  const backdropWatch = window.setInterval(() => {
    backdropAttempts += 1;
    if (attachLiveBackdrop() || backdropAttempts >= 200) window.clearInterval(backdropWatch);
  }, 100);

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
