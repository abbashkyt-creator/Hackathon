// Tip Tap platform bridge for Stickman Battle
(function () {
  "use strict";
  function postToParent(type, data) {
    try { window.parent.postMessage({ source: "tiptap-stickman-battle", type: type, data: data || {} }, "*"); } catch (e) {}
  }
  function sendScore(final) {
    var score = 0;
    try {
      var c = document.getElementById("GameCanvas");
      if (c && c.__tiptapScore != null) score = c.__tiptapScore;
    } catch (e) {}
    postToParent("score", { score: score, final: !!final });
  }
  window.__tiptapBridge = {
    setScore: function (s) { try { document.getElementById("GameCanvas").__tiptapScore = s; } catch (e) {} }
  };
  postToParent("ready", {});
  window.setTimeout(function () { postToParent("ready", {}); }, 2500);
  window.setTimeout(function () { sendScore(false); }, 8000);
  window.setTimeout(function () { sendScore(true); }, 180000);
})();
