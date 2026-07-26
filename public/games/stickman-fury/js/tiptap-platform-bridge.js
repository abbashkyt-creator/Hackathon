(function () {
  "use strict";

  var SOURCE = "tiptap-stickman-fury";
  var PARENT = "tiptap-parent";
  var params = new URLSearchParams(window.location.search);
  var muted = params.get("muted") === "1";
  var parentOrigin = "*";
  try {
    if (document.referrer) parentOrigin = new URL(document.referrer).origin;
  } catch (_error) {
    parentOrigin = "*";
  }

  function post(type, extra) {
    if (window.parent === window) return;
    window.parent.postMessage(Object.assign({ source: SOURCE, type: type }, extra || {}), parentOrigin);
  }

  // Embedded games intentionally run without allow-same-origin. Supply the one
  // synchronous storage surface the original game expects, then persist only
  // its save key through the trusted parent frame.
  try {
    void window.localStorage;
  } catch (_storageError) {
    var saveValue = params.get("save") || "";
    var memory = saveValue ? { stickmanfuryv4: saveValue } : {};
    var storageShim = {
      get length() { return Object.keys(memory).length; },
      key: function (index) { return Object.keys(memory)[index] || null; },
      getItem: function (key) {
        key = String(key);
        return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
      },
      setItem: function (key, value) {
        key = String(key);
        value = String(value);
        memory[key] = value;
        if (key === "stickmanfuryv4") post("storage-set", { key: key, value: value });
      },
      removeItem: function (key) {
        key = String(key);
        delete memory[key];
        if (key === "stickmanfuryv4") post("storage-remove", { key: key });
      },
      clear: function () {
        var hadSave = Object.prototype.hasOwnProperty.call(memory, "stickmanfuryv4");
        memory = {};
        if (hadSave) post("storage-remove", { key: "stickmanfuryv4" });
      },
    };
    try {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: storageShim,
      });
    } catch (_defineError) {
      // The source game already degrades safely when storage is unavailable.
    }
  }

  function setMuted(value) {
    muted = Boolean(value);
    window.muted = muted;
    if (window.Howler && typeof window.Howler.mute === "function") window.Howler.mute(muted);
  }

  function finishBreak(start, result) {
    if (typeof start === "function") start();
    return Promise.resolve(result);
  }

  // Local platform compatibility only. No ad, analytics, account, or remote
  // platform request is made. Rewarded placements return false so paid
  // rewards are never silently granted.
  window.PokiSDK = {
    init: function () { return Promise.resolve(); },
    getLanguage: function () { return "en"; },
    gameLoadingStart: function () {},
    gameLoadingFinished: function () {
      post("ready");
      requestAnimationFrame(function () {
        document.getElementById("canvas")?.focus({ preventScroll: true });
      });
    },
    gameplayStart: function () { post("gameplay-start"); },
    gameplayStop: function () { post("gameplay-stop"); },
    commercialBreak: function (onStart) { return finishBreak(onStart, false); },
    rewardedBreak: function (onStart) { return finishBreak(onStart, false); },
    measure: function () {},
    movePill: function () {},
  };

  window.addEventListener("message", function (event) {
    if (event.source !== window.parent || event.data?.source !== PARENT) return;
    if (parentOrigin !== "*" && event.origin !== parentOrigin) return;
    if (event.data.type === "set-muted") setMuted(event.data.muted);
    if (event.data.type === "pause" && typeof window.visiblePause === "function") window.visiblePause();
    if ((event.data.type === "resume" || event.data.type === "auto-start") &&
        typeof window.visibleResume === "function") {
      window.visibleResume();
      document.getElementById("canvas")?.focus({ preventScroll: true });
    }
    if (event.data.type === "ready-check" && window.gameState && window.gameState !== "loading") {
      post("ready");
    }
  });

  // The captured source contains a developer physics panel on
  // Shift+Backquote. Keep that diagnostic surface unreachable in production.
  window.addEventListener("keydown", function (event) {
    if (event.shiftKey && (event.code === "Backquote" || event.keyCode === 192)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  setMuted(muted);
}());
