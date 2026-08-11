(() => {
  "use strict";

  const canvas = document.querySelector("#unity-canvas");
  const loading = document.querySelector("#unity-loading");
  const progressText = loading.querySelector("b");
  const progressBar = loading.querySelector(".loading-track span");
  const error = document.querySelector("#unity-error");
  const controls = document.querySelector("#city-touch-controls");
  const params = new URLSearchParams(window.location.search);
  let instance;
  let started = false;

  const inputMap = Object.freeze({
    left: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
    right: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
    accelerate: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
    brake: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  });
  const pressed = new Map();
  const inputEvents = [];
  window.__TIPTAP_INPUT_STATE__ = { pressed: [], events: inputEvents };

  const recordInput = (control, phase) => {
    inputEvents.push({ control, phase, at: Date.now() });
    if (inputEvents.length > 60) inputEvents.shift();
    window.__TIPTAP_INPUT_STATE__.pressed = [...pressed.keys()];
  };

  const dispatchControl = (control, phase) => {
    const input = inputMap[control];
    if (!input) return;
    const options = {
      key: input.key,
      code: input.code,
      keyCode: input.keyCode,
      which: input.keyCode,
      bubbles: true,
      cancelable: true,
    };
    for (const target of [window, document, canvas]) {
      target.dispatchEvent(new KeyboardEvent(phase, options));
    }
    recordInput(control, phase);
  };

  const releaseControl = (control) => {
    const button = pressed.get(control);
    if (!button) return;
    pressed.delete(control);
    button.classList.remove("is-pressed");
    dispatchControl(control, "keyup");
  };

  const releaseAllControls = () => {
    for (const control of [...pressed.keys()]) releaseControl(control);
  };

  const installTouchControls = () => {
    const touchCapable =
      params.get("touchControls") === "1" ||
      navigator.maxTouchPoints > 0 ||
      matchMedia("(pointer: coarse)").matches;
    document.body.classList.toggle("touch-capable", touchCapable);
    controls.setAttribute("aria-hidden", String(!touchCapable));
    controls.querySelectorAll("button[data-control]").forEach((button) => {
      const control = button.dataset.control;
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (pressed.has(control)) return;
        button.setPointerCapture?.(event.pointerId);
        pressed.set(control, button);
        button.classList.add("is-pressed");
        canvas.focus({ preventScroll: true });
        dispatchControl(control, "keydown");
      });
      const release = (event) => {
        event.preventDefault();
        event.stopPropagation();
        releaseControl(control);
      };
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", () => releaseControl(control));
      button.addEventListener("contextmenu", (event) => event.preventDefault());
    });
  };

  installTouchControls();
  window.addEventListener("blur", releaseAllControls);
  window.addEventListener("pagehide", releaseAllControls);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) releaseAllControls();
  });

  const config = {
    dataUrl: "Build/TaxiRush-V1.3.4.data",
    frameworkUrl: "Build/TaxiRush-V1.3.4.framework.js",
    codeUrl: "Build/TaxiRush-V1.3.4.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "FunkyTap",
    productName: "Taxi Rush",
    productVersion: "1.3.3",
    showBanner: () => {},
    matchWebGLToCanvasSize: true,
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  };

  const report = (message) => {
    loading.hidden = true;
    error.hidden = false;
    error.textContent = `City Cab Rush could not start. ${message}`;
    window.parent.postMessage(
      { source: "tiptap-city-cab-rush", type: "runtime-error", detail: String(message) },
      window.location.origin,
    );
  };

  const dispatchSpace = () => {
    const eventOptions = { key: " ", code: "Space", keyCode: 32, which: 32, bubbles: true };
    for (const target of [window, document, canvas]) {
      target.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
      target.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }
  };

  const dispatchStartTap = () => {
    const rect = canvas.getBoundingClientRect();
    const clientX = rect.left + rect.width / 2;
    const clientY = rect.top + rect.height / 2;
    const eventOptions = {
      bubbles: true,
      clientX,
      clientY,
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
    };
    canvas.dispatchEvent(new PointerEvent("pointerdown", eventOptions));
    canvas.dispatchEvent(new PointerEvent("pointerup", eventOptions));
    canvas.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX, clientY }));
  };

  const autoStart = () => {
    if (!instance || started) return;
    started = true;
    canvas.focus({ preventScroll: true });
    // The source listing uses Space to begin. Unity input is not ready at the
    // exact same instant as its promise resolves on every device, so send the
    // same harmless start input across the first few rendered frames. This is
    // still one automatic start attempt, not a repeating game action. The tap
    // covers the source build's mobile-first start screen.
    for (const delay of [350, 1200, 2500, 5000]) {
      window.setTimeout(() => {
        dispatchSpace();
        dispatchStartTap();
      }, delay);
    }
  };

  const applyMute = (muted) => {
    if (!instance) return;
    instance.SetMasterVolume?.(muted ? 0 : 1);
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.source !== "tiptap-parent") return;
    if (event.data.type === "auto-start") autoStart();
    if (event.data.type === "pause") releaseAllControls();
    if (event.data.type === "set-muted") applyMute(Boolean(event.data.muted));
  });

  if (typeof window.createUnityInstance !== "function") {
    report("The local Unity loader is unavailable.");
    return;
  }

  window
    .createUnityInstance(canvas, config, (progress) => {
      const percent = Math.round(progress * 100);
      progressText.textContent = `${percent}%`;
      progressBar.style.width = `${percent}%`;
    })
    .then((unityInstance) => {
      instance = unityInstance;
      window.unityGame = unityInstance;
      window.__TIPTAP_UNITY_INSTANCE__ = unityInstance;
      if (window.pokiBridge) unityInstance.SendMessage(window.pokiBridge, "ready");
      else window.pokiReady = true;
      applyMute(params.get("muted") === "1");
      loading.hidden = true;
      window.parent.postMessage({ source: "tiptap-city-cab-rush", type: "ready" }, window.location.origin);
      if (params.get("autoplay") === "1") autoStart();
    })
    .catch((reason) => report(String(reason || "Unknown Unity error.")));
})();
