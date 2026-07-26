(function () {
  "use strict";

  function setMuted(muted) {
    window.muted = Boolean(muted);
    if (window.Howler && typeof window.Howler.mute === "function") {
      window.Howler.mute(Boolean(muted));
    }
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin || event.data?.source !== "tiptap-parent") return;
    if (event.data.type === "set-muted") setMuted(event.data.muted);
  });

  var parameters = new URLSearchParams(window.location.search);
  setMuted(parameters.get("muted") === "1");
  var holdHint = document.querySelector(".tiptap-hold-hint");
  function hideHoldHint() {
    holdHint?.classList.add("is-hidden");
  }
  window.addEventListener("pointerdown", hideHoldHint, { once: true, passive: true });
  window.addEventListener("touchstart", hideHoldHint, { once: true, passive: true });
  window.addEventListener("load", function () {
    // This calls the real source loader. It enters the original object/weapon
    // sandbox as soon as its local assets have decoded; no source SDK or ad
    // break is provided by this local launcher.
    window.loadLang("en");
  }, { once: true });
}());
