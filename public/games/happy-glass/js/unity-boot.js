/*
 * Unity boot config for Happy Glass (external file so the strict wasm CSP
 * needs no 'unsafe-inline' exception).
 */
(function () {
  'use strict';
  var build = {
    loaderUrl: "Build/e40682cd4a2e8826aa72fb3216daf773.loader.js",
    dataUrl: "Build/95d6764c749dfc845fdc8176ba7206d7.data.br",
    frameworkUrl: "Build/2034c3a3f31fb182d5dab076c578d580.framework.js.br",
    codeUrl: "Build/a4ab965b7735e46ca3f22b32204cb8c5.wasm.br",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Lion Studios",
    productName: "Happy Glass",
    productVersion: "2.0"
  };
  var canvas = document.querySelector("#unity-canvas");
  window.createUnityInstance(canvas, build, function (progress) {
    canvas.dataset.progress = String(Math.min(100, Math.round(progress * 100)));
  }).then(function (instance) {
    window.__unityInstance = instance;
    window.dispatchEvent(new CustomEvent("tiptap-game-ready"));
  }).catch(function (err) {
    console.error("[Happy Glass] Unity boot failed", err);
  });
})();
