(() => {
  "use strict";
  const build = {
    loaderUrl: "./Build/6529111a7bc210fd4b0e5e9b7b7de456.loader.js",
    frameworkUrl: "./Build/74316103438b469864841eb099023290.framework.js.br",
    dataUrl: "./Build/b6a11a5769b57ef475b5d3f311a674fc.data.br",
    codeUrl: "./Build/8f2628f842ab3743cb74934c84aa0c5c.wasm.br",
    companyName: "Incredi.Games",
    productName: "Dig out of Prison",
    productVersion: "50",
  };
  const unityLogs = [];
  const rememberUnityLog = (level, values) => {
    const message = values.map((value) => String(value)).join(" ");
    unityLogs.push({ level, message, at: Date.now() });
    if (unityLogs.length > 120) unityLogs.shift();
    window.__TIPTAP_UNITY_LOGS__ = unityLogs;
    try {
      localStorage.setItem("tiptap-debug:dig-out-of-prison", JSON.stringify(unityLogs));
    } catch {}
    (level === "error" ? console.error : console.log)(`[Dig out of Prison] ${message}`);
  };
  build.print = (...values) => rememberUnityLog("log", values);
  build.printErr = (...values) => rememberUnityLog("error", values);
  document.body.innerHTML = '<main id="shell"><div id="backdrop" aria-hidden="true"></div><canvas id="unity-canvas"></canvas><section id="loading" aria-live="polite"><strong>DIG OUT OF PRISON</strong><span>Preparing your escape…</span><div><i></i></div><b>0%</b></section><section id="touch-controls" aria-label="Dig out of Prison mobile controls"><div class="move-pad"><button data-key="KeyW" aria-label="Move forward">▲</button><div><button data-key="KeyA" aria-label="Move left">◀</button><button data-key="KeyD" aria-label="Move right">▶</button></div><button data-key="KeyS" aria-label="Move backward">▼</button></div><div class="actions"><button data-pointer="dig" class="dig" aria-label="Dig or pick up"><span>⛏</span><small>DIG</small></button><button data-key="Space" aria-label="Jump or use rope"><span>↑</span><small>JUMP</small></button><button data-key="KeyE" aria-label="Interact"><span>E</span><small>USE</small></button><button data-key="KeyX" aria-label="Extra action"><span>X</span><small>ACT</small></button><button data-key="KeyQ" aria-label="Open menu"><span>☰</span><small>MENU</small></button></div></section><p id="error" hidden></p></main>';
  const style = document.createElement("style");
  style.textContent = 'html,body,#shell{width:100%;height:100%;margin:0;overflow:hidden;background:#0d1623;color:#fff;font-family:system-ui,sans-serif}#shell{position:relative;background:linear-gradient(180deg,#111f31,#07101b)}#backdrop{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#405776 0%,#182537 42%,#09121d 82%)}#unity-canvas{position:absolute;z-index:2;top:50%;left:50%;display:block;width:100%!important;height:auto!important;max-width:100%;max-height:100%;aspect-ratio:16/9;transform:translate(-50%,-50%);overflow:hidden;background:#101a2c;object-fit:contain}#loading{position:absolute;z-index:8;inset:0;display:grid;place-content:center;gap:12px;text-align:center;background:radial-gradient(circle at 50% 35%,#456782,#0b1623 72%);letter-spacing:.07em}#loading[hidden]{display:none}#loading strong{font-size:clamp(20px,5vw,34px);font-weight:900}#loading span{font-size:13px;opacity:.86}#loading div{width:min(68vw,340px);height:9px;overflow:hidden;border-radius:999px;background:#ffffff31}#loading i{display:block;width:0;height:100%;background:linear-gradient(90deg,#85e7ff,#7bcf63);transition:width .15s ease}#loading b{font-size:13px}#touch-controls{display:none}#error{position:absolute;z-index:10;right:16px;bottom:16px;left:16px;margin:0;padding:12px;border-radius:12px;background:#642332;text-align:center}@media (hover:none),(pointer:coarse){#unity-canvas{top:42%}#touch-controls{position:absolute;z-index:6;right:0;bottom:max(10px,env(safe-area-inset-bottom));left:0;display:flex;align-items:flex-end;justify-content:space-between;padding:0 62px 0 10px;pointer-events:none;user-select:none;-webkit-user-select:none}.move-pad,.actions{display:flex;gap:4px;pointer-events:none}.move-pad{flex-direction:column;align-items:center}.move-pad>div{display:flex;gap:28px;margin:-5px 0}.actions{max-width:106px;flex-wrap:wrap;justify-content:flex-end}.actions button:first-child{width:58px;height:58px;background:linear-gradient(145deg,#d89535,#a83c2a)}#touch-controls button{width:42px;height:42px;border:2px solid rgba(255,255,255,.92);border-radius:50%;display:grid;place-content:center;color:#fff;background:linear-gradient(145deg,rgba(36,60,83,.96),rgba(8,18,30,.96));box-shadow:0 6px 14px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.24);pointer-events:auto;touch-action:none;-webkit-tap-highlight-color:transparent}#touch-controls button.is-pressed{transform:translateY(2px) scale(.94);filter:brightness(1.28)}#touch-controls span{font-size:18px;font-weight:900;line-height:1}#touch-controls small{margin-top:2px;font-size:7px;font-weight:900;letter-spacing:.04em}}';
  document.head.appendChild(style);
  const loading = document.querySelector("#loading");
  const bar = loading.querySelector("i");
  const percent = loading.querySelector("b");
  const error = document.querySelector("#error");
  const codes = { KeyW: ["w", 87], KeyA: ["a", 65], KeyS: ["s", 83], KeyD: ["d", 68], Space: [" ", 32], KeyE: ["e", 69], KeyX: ["x", 88], KeyQ: ["q", 81] };
  const pressed = new Map();
  const canvas = () => document.querySelector("#unity-canvas");
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
    const gameCanvas = canvas();
    const requestPointerLock = gameCanvas?.requestPointerLock?.bind(gameCanvas);
    if (requestPointerLock) {
      gameCanvas.requestPointerLock = (...args) => {
        const attempt = requestPointerLock(...args);
        return attempt?.catch?.((reason) => {
          if (reason?.name === "NotAllowedError") return undefined;
          throw reason;
        }) ?? attempt;
      };
    }
  }
  const emitKey = (type, code) => {
    const [key, keyCode] = codes[code];
    const event = new KeyboardEvent(type, { key, code, bubbles: true, cancelable: true });
    for (const field of ["keyCode", "which"]) { try { Object.defineProperty(event, field, { get: () => keyCode }); } catch {} }
    window.dispatchEvent(event);
    canvas()?.dispatchEvent(event);
  };
  const endPointer = (id) => {
    const control = pressed.get(id); if (!control) return; pressed.delete(id);
    document.querySelector(`[data-control-id="${id}"]`)?.classList.remove("is-pressed");
    if (control.kind === "key" && ![...pressed.values()].some((item) => item.kind === "key" && item.value === control.value)) emitKey("keyup", control.value);
    if (control.kind === "dig") dispatchMouse("mouseup");
  };
  const dispatchMouse = (type) => {
    const element = canvas(); if (!element) return;
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: type === "mouseup" ? 0 : 1 }));
  };
  const lastPointerDown = new WeakMap();
  document.querySelectorAll("#touch-controls button").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault(); event.stopPropagation(); lastPointerDown.set(button, Date.now()); button.setPointerCapture?.(event.pointerId); button.dataset.controlId = String(event.pointerId); button.classList.add("is-pressed");
      const control = button.dataset.key ? { kind: "key", value: button.dataset.key } : { kind: "dig" }; pressed.set(event.pointerId, control);
      if (control.kind === "key") emitKey("keydown", control.value); else dispatchMouse("mousedown");
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) button.addEventListener(type, (event) => { event.preventDefault(); endPointer(event.pointerId); });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (Date.now() - (lastPointerDown.get(button) || 0) < 500) return;
      if (button.dataset.key) {
        emitKey("keydown", button.dataset.key);
        window.setTimeout(() => emitKey("keyup", button.dataset.key), 80);
      } else {
        dispatchMouse("mousedown");
        window.setTimeout(() => dispatchMouse("mouseup"), 80);
      }
    });
  });
  const releaseAll = () => [...pressed.keys()].forEach(endPointer);
  window.addEventListener("blur", releaseAll); window.addEventListener("pagehide", releaseAll); document.addEventListener("visibilitychange", () => { if (document.hidden) releaseAll(); });
  const fail = (reason) => { error.hidden = false; error.textContent = `Dig out of Prison could not start: ${String(reason || "Unknown Unity error.")}`; loading.hidden = true; };
  if (!window.createUnityInstance) { fail("The local Unity loader is unavailable."); return; }
  let revealed = false;
  const reveal = () => { if (revealed) return; revealed = true; loading.hidden = true; window.parent.postMessage({ source: "tiptap-dig-out-of-prison", type: "ready" }, window.location.origin); };
  window.createUnityInstance(canvas(), build, (value) => { const ratio = Math.max(0, Math.min(1, Number(value) || 0)); bar.style.width = `${Math.round(ratio * 100)}%`; percent.textContent = `${Math.round(ratio * 100)}%`; }).then((instance) => {
    window.__TIPTAP_UNITY__ = instance;
    window.unityGameInstance = instance;
    window.dispatchEvent(new Event("tiptap-unity-ready"));
    reveal();
  }).catch(fail);
})();
