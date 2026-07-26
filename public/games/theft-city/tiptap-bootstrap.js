(() => {
  "use strict";
  window.__tiptapBootStarted = performance.now();
  const canvas = document.querySelector("#unity-canvas");
  const loading = document.querySelector("#loading");
  const progress = document.querySelector("#progress");
  const status = document.querySelector("#status");
  const error = document.querySelector("#error");
  const retry = document.querySelector("#retry");
  const build = "./Build";
  const config = {
    dataUrl: `${build}/8bc556d41883b6be8f80213b91efe600.data.br`,
    frameworkUrl: `${build}/979af833673a60ff35395c80a3587e2f.framework.js.br`,
    codeUrl: `${build}/2350b7d1bb3972d0e9fb9dd7afee2404.wasm.br`,
    streamingAssetsUrl: "./StreamingAssets",
    companyName: "Kwalee",
    productName: "Theft City",
    productVersion: "1.0",
  };

  const focusGame = () => canvas.focus({ preventScroll: true });
  const activateFirstRun = () => {
    const rect = canvas.getBoundingClientRect();
    const init = {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      button: 0,
      buttons: 1,
    };
    canvas.dispatchEvent(new PointerEvent("pointerdown", { ...init, pointerType: "mouse", pointerId: 1 }));
    canvas.dispatchEvent(new MouseEvent("mousedown", init));
    canvas.dispatchEvent(new MouseEvent("mouseup", { ...init, buttons: 0 }));
    canvas.dispatchEvent(new PointerEvent("pointerup", { ...init, buttons: 0, pointerType: "mouse", pointerId: 1 }));
    canvas.dispatchEvent(new MouseEvent("click", { ...init, buttons: 0 }));
  };
  const nativePointerLock = canvas.requestPointerLock?.bind(canvas);
  if (nativePointerLock) {
    canvas.requestPointerLock = (...args) => {
      if (canvas.ownerDocument !== document || !document.contains(canvas)) return Promise.resolve();
      try {
        const result = nativePointerLock(...args);
        result?.catch?.((reason) => console.warn("Pointer lock was unavailable", reason));
        return result;
      } catch (reason) {
        console.warn("Pointer lock was unavailable", reason);
        return Promise.resolve();
      }
    };
  }
  const fail = (reason) => {
    console.error("Theft City startup failed", reason);
    loading.hidden = true;
    error.hidden = false;
  };
  retry.addEventListener("click", () => location.reload());
  window.addEventListener("pointerdown", focusGame, { passive: true });
  window.addEventListener("message", (event) => {
    if (event.origin === location.origin && event.data?.type === "auto-start") focusGame();
  });

  const loader = document.createElement("script");
  loader.src = `${build}/c625c615e3bc7427873de64777c82fba.loader.js`;
  loader.onload = () => {
    createUnityInstance(canvas, config, (value) => {
      const percentage = Math.round(value * 100);
      progress.style.width = `${percentage}%`;
      status.textContent = percentage < 100 ? `Loading city… ${percentage}%` : "Starting…";
    })
      .then((instance) => {
        window.unityGame = instance;
        window.__tiptapReadyMs = performance.now();
        if (window.pokiBridge) instance.SendMessage(window.pokiBridge, "ready");
        loading.hidden = true;
        focusGame();
        window.setTimeout(activateFirstRun, 350);
        window.parent.postMessage({ source: "tiptap-game", type: "ready", game: "theft-city" }, location.origin);
      })
      .catch(fail);
  };
  loader.onerror = fail;
  document.body.appendChild(loader);
})();
