(() => {
  "use strict";
  const config = window.__TIPTAP_ROCKET_SOCCER_CONFIG__;
  const body = document.body;
  body.innerHTML = '<main id="shell"><div id="loading"><strong>ROCKET SOCCER DERBY</strong><span>Loading match…</span><div><i></i></div><b>0%</b></div><div id="game"></div><section id="touch-controls" aria-label="Rocket Soccer touch controls"><div class="drive-pad"><button data-control="forward" aria-label="Accelerate"><span>▲</span><small>GO</small></button><div><button data-control="left" aria-label="Steer left"><span>◀</span></button><button data-control="right" aria-label="Steer right"><span>▶</span></button></div><button data-control="reverse" aria-label="Reverse"><span>▼</span><small>REV</small></button></div><div class="action-pad"><button data-control="nitro" aria-label="Nitro"><span>⚡</span><small>NITRO</small></button><button data-control="jump" aria-label="Jump"><span>↑</span><small>JUMP</small></button><button data-control="camera" aria-label="Ball camera"><span>◎</span><small>CAM</small></button></div></section><p id="error" hidden></p></main>';

  const loading = document.querySelector("#loading");
  const progress = loading.querySelector("i");
  const percent = loading.querySelector("b");
  const error = document.querySelector("#error");
  const style = document.createElement("style");
  style.textContent = 'html,body,#shell{width:100%;height:100%;margin:0;overflow:hidden;background:#111725;color:#fff;font-family:Arial,sans-serif}#shell{position:relative;background:radial-gradient(circle at 50% 72%,rgba(67,117,183,.42),transparent 38%),linear-gradient(180deg,#151c2c,#0b101a)}#shell::after{position:absolute;z-index:1;inset:0;content:"";background:linear-gradient(180deg,rgba(7,12,22,.08),rgba(7,12,22,.34));pointer-events:none}#game-backdrop{position:absolute;z-index:0;inset:-8%;width:116%;height:116%;object-fit:cover;filter:blur(22px) saturate(1.25) brightness(.58);transform:scale(1.08);pointer-events:none}#game{position:absolute;z-index:2;top:50%;left:50%;width:100%;height:auto;aspect-ratio:16/9;overflow:hidden;transform:translate(-50%,-50%);background:#231f20;box-shadow:0 18px 55px rgba(0,0,0,.46)}#game canvas{width:100%!important;height:100%!important;display:block}@media (min-aspect-ratio:16/9){#game{width:auto;height:100%;aspect-ratio:16/9}}#loading{position:absolute;z-index:6;inset:0;display:grid;place-content:center;gap:12px;text-align:center;background:radial-gradient(circle at 50% 35%,#315677,#101920 70%);letter-spacing:.08em}#loading[hidden]{display:none}#loading strong{font-size:clamp(20px,5vw,34px)}#loading span{opacity:.8;font-size:13px}#loading div{width:min(68vw,340px);height:9px;border-radius:99px;background:#ffffff30;overflow:hidden}#loading i{display:block;width:0;height:100%;background:linear-gradient(90deg,#ffd54a,#ff7a47);transition:width .15s ease}#loading b{font-size:13px}#touch-controls{display:none}#error{position:absolute;inset:auto 16px 16px;z-index:7;padding:12px;border-radius:12px;background:#591b28;color:#fff;text-align:center}@media (hover:none),(pointer:coarse){#game{top:34%}#touch-controls{position:absolute;z-index:5;left:0;right:0;bottom:max(18px,env(safe-area-inset-bottom));display:flex;align-items:flex-end;justify-content:space-between;padding:0 18px;pointer-events:none;user-select:none;-webkit-user-select:none}.drive-pad,.action-pad{display:flex;align-items:center;gap:9px;pointer-events:none}.drive-pad{flex-direction:column}.drive-pad>div{display:flex;gap:48px;margin:-4px 0}.action-pad{max-width:162px;flex-wrap:wrap;justify-content:flex-end}.action-pad button:first-child{width:76px}#touch-controls button{width:58px;height:58px;padding:0;border:2px solid rgba(255,255,255,.88);border-radius:50%;display:grid;place-content:center;color:#fff;background:linear-gradient(145deg,rgba(44,54,82,.92),rgba(13,18,33,.94));box-shadow:0 7px 16px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:auto;touch-action:none;-webkit-tap-highlight-color:transparent}#touch-controls button[data-control=nitro]{background:linear-gradient(145deg,#ffb51f,#f05a24)}#touch-controls button[data-control=jump]{background:linear-gradient(145deg,#43a7ff,#4756e9)}#touch-controls button.is-pressed{transform:translateY(2px) scale(.94);filter:brightness(1.3);box-shadow:0 2px 7px rgba(0,0,0,.38),inset 0 2px 5px rgba(0,0,0,.25)}#touch-controls span{font-size:22px;font-weight:900;line-height:1}#touch-controls small{margin-top:3px;font-size:8px;font-weight:900;letter-spacing:.05em}}';
  document.head.appendChild(style);

  // The source Unity build exposes keyboard driving only. Translate real
  // multi-touch press/hold gestures into the same local key events so mobile
  // players can steer while accelerating, jumping, or using nitro.
  const keyBindings = {
    forward: { key: "w", code: "KeyW", keyCode: 87 },
    reverse: { key: "s", code: "KeyS", keyCode: 83 },
    left: { key: "a", code: "KeyA", keyCode: 65 },
    right: { key: "d", code: "KeyD", keyCode: 68 },
    nitro: { key: "Shift", code: "ShiftLeft", keyCode: 16 },
    jump: { key: " ", code: "Space", keyCode: 32 },
    camera: { key: "c", code: "KeyC", keyCode: 67 },
  };
  const activePointers = new Map();
  const activeControls = new Set();
  const dispatchKey = (type, binding) => {
    const event = new KeyboardEvent(type, {
      key: binding.key,
      code: binding.code,
      bubbles: true,
      cancelable: true,
    });
    for (const property of ["keyCode", "which"]) {
      try { Object.defineProperty(event, property, { get: () => binding.keyCode }); } catch {}
    }
    window.dispatchEvent(event);
  };
  const pressControl = (name) => {
    if (activeControls.has(name)) return;
    activeControls.add(name);
    document.querySelector(`[data-control="${name}"]`)?.classList.add("is-pressed");
    dispatchKey("keydown", keyBindings[name]);
  };
  const releaseControl = (name) => {
    if (!activeControls.delete(name)) return;
    document.querySelector(`[data-control="${name}"]`)?.classList.remove("is-pressed");
    dispatchKey("keyup", keyBindings[name]);
  };
  const releasePointer = (pointerId) => {
    const name = activePointers.get(pointerId);
    if (!name) return;
    activePointers.delete(pointerId);
    if (![...activePointers.values()].includes(name)) releaseControl(name);
  };
  const releaseAllControls = () => {
    activePointers.clear();
    [...activeControls].forEach(releaseControl);
  };
  document.querySelectorAll("#touch-controls button").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.setPointerCapture?.(event.pointerId);
      const name = button.dataset.control;
      activePointers.set(event.pointerId, name);
      pressControl(name);
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
      button.addEventListener(type, (event) => {
        event.preventDefault();
        event.stopPropagation();
        releasePointer(event.pointerId);
      });
    }
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  });
  window.addEventListener("blur", releaseAllControls);
  window.addEventListener("pagehide", releaseAllControls);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) releaseAllControls();
  });

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
