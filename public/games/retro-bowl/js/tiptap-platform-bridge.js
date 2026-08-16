// Tip Tap platform bridge for Retro Bowl
(function () {
  "use strict";

  // AudioContext unlock: GMS1's _r11() creates the context at boot; in a
  // sandboxed iframe it can stay suspended. Pre-create it and patch resume()
  // so the engine's audio init never sees null.
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      var ac = new AC();
      window.g_WebAudioContext = ac;
      var origResume = ac.resume.bind(ac);
      ac.resume = function () {
        try { return origResume(); } catch (e) { return Promise.resolve(); }
      };
      var origCreate = AC.bind(window);
      window.AudioContext = function () {
        try { return new origCreate(); } catch (e) { return ac; }
      };
      window.AudioContext.prototype = AC.prototype;
    }
  } catch (e) {}

  function postToParent(type, data) {
    try { window.parent.postMessage({ source: "tiptap-retro-bowl", type: type, data: data || {} }, "*"); } catch (e) {}
  }
  function sendScore(final) {
    var score = 0;
    try {
      var c = document.getElementById("canvas");
      if (c && c.__tiptapScore != null) score = c.__tiptapScore;
    } catch (e) {}
    postToParent("score", { score: score, final: !!final });
  }
  window.__tiptapBridge = {
    setScore: function (s) { try { document.getElementById("canvas").__tiptapScore = s; } catch (e) {} }
  };
  postToParent("ready", {});
  window.setTimeout(function () { postToParent("ready", {}); }, 2500);

  // The game waits on the save-slot screen until a slot is clicked; dispatch
  // a synthetic click at the canvas center (slot area) so the boot proceeds
  // without user input, mirroring the live poki build's first-run flow.
  function clickSlot() {
    try {
      var c = document.getElementById("canvas");
      if (!c) return;
      var r = c.getBoundingClientRect();
      var x = r.left + r.width / 2;
      var y = r.top + r.height / 2;
      var opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: "mouse" };
      c.dispatchEvent(new PointerEvent("pointerdown", opts));
      c.dispatchEvent(new PointerEvent("pointerup", opts));
      c.dispatchEvent(new MouseEvent("click", opts));
    } catch (e) {}
  }
  window.setTimeout(clickSlot, 6000);
  window.setTimeout(clickSlot, 9000);
  window.setTimeout(function () { sendScore(false); }, 8000);
  window.setTimeout(function () { sendScore(true); }, 180000);
})();
