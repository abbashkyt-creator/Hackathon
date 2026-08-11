/*
 * Same-origin Tip Tap owned-ad client used by every copied game.
 * It never downloads an ad SDK. The parent app decides whether a local,
 * explicitly configured Tip Tap campaign is eligible; disabled/no-fill paths
 * resolve immediately so source games can always resume.
 */
(function installTipTapAdClient() {
  "use strict";

  var CHILD_SOURCE = "tiptap-ad-client";
  var PARENT_SOURCE = "tiptap-ad-parent";
  var HOST_SOURCE = "tiptap-parent";
  var pending = new Map();
  var sequence = 0;
  window.__TIPTAP_AD_CLIENT_VERSION__ = "owned-v1";
  // Every copied game is served by and embedded into the same Tip Tap origin.
  // Do not derive this from document.referrer: network-lock intentionally
  // presents a source-compatible Poki referrer to a few site-locked builds.
  var parentOrigin = window.location.origin;

  function gameSlug() {
    var match = window.location.pathname.match(/^\/games\/([^/]+)/);
    return match ? match[1] : "unknown";
  }

  function noAd(reason) {
    return { shown: false, rewarded: false, reason: reason || "unavailable" };
  }

  function request(kind, placement) {
    if (window.parent === window) return Promise.resolve(noAd("standalone"));
    var requestId = gameSlug() + "-" + Date.now() + "-" + (++sequence);
    return new Promise(function (resolve) {
      var initialTimer = window.setTimeout(function () {
        pending.delete(requestId);
        resolve(noAd("parent-timeout"));
      }, 1800);
      pending.set(requestId, { resolve: resolve, timer: initialTimer });
      window.parent.postMessage({
        source: CHILD_SOURCE,
        type: "request",
        requestId: requestId,
        kind: kind,
        placement: String(placement || "source-break").slice(0, 80),
        gameSlug: gameSlug(),
      }, parentOrigin);
    });
  }

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "preview-owned-ad-request") {
      window.__TIPTAP_AD_PREVIEW_DEBUG__ = {
        sourceMatches: event.source === window.parent,
        origin: event.origin,
        expectedOrigin: parentOrigin,
        source: event.data.source,
        host: location.hostname,
      };
    }
    if (event.source !== window.parent || !event.data) return;
    if (parentOrigin !== "*" && event.origin !== parentOrigin) return;
    // Localhost-only acceptance hook: the parent asks the child to originate
    // the request, preserving the same Window/source checks used in production.
    // Results stay in the child for VEU inspection and never enable a campaign.
    if (
      event.data.source === HOST_SOURCE &&
      event.data.type === "preview-owned-ad-request" &&
      (location.hostname === "127.0.0.1" || location.hostname === "localhost")
    ) {
      var previewKind = event.data.kind === "rewarded" ? "rewarded" : "interstitial";
      window.__TIPTAP_AD_PREVIEW_RESULT__ = "pending";
      request(previewKind, event.data.placement || "local-preview").then(function (result) {
        window.__TIPTAP_AD_PREVIEW_RESULT__ = result;
      });
      return;
    }
    if (event.data.source !== PARENT_SOURCE) return;
    var item = pending.get(event.data.requestId);
    if (!item) return;
    if (event.data.type === "started") {
      window.clearTimeout(item.timer);
      item.timer = window.setTimeout(function () {
        pending.delete(event.data.requestId);
        item.resolve(noAd("completion-timeout"));
      }, 125000);
      return;
    }
    if (event.data.type !== "complete") return;
    window.clearTimeout(item.timer);
    pending.delete(event.data.requestId);
    item.resolve({
      shown: event.data.shown === true,
      rewarded: event.data.rewarded === true,
      reason: String(event.data.reason || "complete"),
    });
  });

  function onStart(options) {
    var callback = typeof options === "function"
      ? options
      : options && typeof options.onStart === "function" ? options.onStart : null;
    if (callback) callback();
  }

  window.TipTapAds = Object.freeze({
    request: request,
    commercial: function (options, placement) {
      onStart(options);
      return request("interstitial", placement || "source-commercial").then(function () {});
    },
    rewarded: function (options, placement) {
      onStart(options);
      return request("rewarded", placement || "source-rewarded").then(function (result) {
        if (options && typeof options === "object" && typeof options.onEnd === "function") {
          options.onEnd(result.rewarded);
        }
        return result.rewarded;
      });
    },
    display: function (options, placement) {
      return request("interstitial", placement || "source-display").then(function (result) {
        return result.shown;
      });
    },
  });
}());
