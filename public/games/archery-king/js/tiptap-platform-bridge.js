/* Local-only host bridge for the authorized Archery King source mirror. */
(function () {
  "use strict";

  var PARENT_SOURCE = "tiptap-parent";

  function isParentMessage(event) {
    return event.origin === window.location.origin && event.data && event.data.source === PARENT_SOURCE;
  }

  function setMuted(muted) {
    try {
      if (window.Howler) window.Howler.mute(Boolean(muted));
    } catch (_) {}
  }

  // The copied source checks the GameDistribution SDK in a few legacy UI
  // branches. Keep those branches local and ad-free without loading its SDK.
  window.gdsdk = {
    AdType: { rewarded: "rewarded", interstitial: "interstitial" },
    preloadAd: function () {
      return Promise.resolve();
    },
    showAd: function () {
      return Promise.resolve();
    },
  };

  window.addEventListener("message", function (event) {
    if (!isParentMessage(event)) return;
    if (event.data.type === "set-muted") setMuted(event.data.muted);
    if (event.data.type === "auto-start" && typeof window.__TIPTAP_ARCHERY_AUTOSTART__ === "function") {
      window.__TIPTAP_ARCHERY_AUTOSTART__();
    }
  });

  window.__TIPTAP_ARCHERY_SET_MUTED__ = setMuted;
})();
