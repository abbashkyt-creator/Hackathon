(() => {
  "use strict";
  const canvas = document.querySelector("#unity-canvas");
  const loading = document.querySelector("#unity-loading");
  const error = document.querySelector("#unity-error");
  const config = {
    dataUrl: "Build/180b03074745078a7fe292b2c22f6060.data.unityweb",
    frameworkUrl: "Build/2320a17ab13f3e61f4a62a2cc0382528.framework.js.unityweb",
    codeUrl: "Build/f1c87ec2ef0c4ed9b3c34bb439b0c5de.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Jungle Tavern",
    productName: "Count Control Legends",
    productVersion: "1.0.0",
    showBanner: () => {},
    matchWebGLToCanvasSize: true,
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  };

  const report = (message) => {
    error.hidden = false;
    error.textContent = `Count Control Legends could not start. ${message}`;
    loading.hidden = true;
  };

  if (typeof window.createUnityInstance !== "function") {
    report("The local Unity loader is unavailable.");
    return;
  }

  window.createUnityInstance(canvas, config, (progress) => {
    loading.querySelector("b").textContent = `${Math.round(progress * 100)}%`;
  }).then((instance) => {
    window.__TIPTAP_UNITY_INSTANCE__ = instance;
    if (window.pokiBridge) instance.SendMessage(window.pokiBridge, "ready");
    else window.pokiReady = true;
    loading.hidden = true;
    window.parent.postMessage({ source: "tiptap-count-control-legends", type: "ready" }, window.location.origin);
  }).catch((reason) => report(String(reason || "Unknown Unity error.")));
})();
