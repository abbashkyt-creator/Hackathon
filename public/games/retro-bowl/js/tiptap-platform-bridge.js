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

// ---- Auto-advance (dialog CONTINUE) ----
// The engine's button state sync needs trusted events; in a sandboxed iframe
// that is unreliable, so drive the dialogs through the game's own handlers.
(function () {
  "use strict";
  var fired = {};
  function fireContinue() {
    try {
      var w = window;
      if (typeof w.GetWithArray !== "function" || typeof w.script_execute !== "function") return;
      var btnMap = w.GetWithArray(w.YYASSET_REF(0x21));
      var targets = [];
      for (var k in btnMap) {
        var b = btnMap[k];
        // ONLY the first-run dialogs: welcome dialog CONTINUE (100900) and
        // New Career details CONTINUE (100089). NEVER the home "Continue"
        // (100074, starts a match) — firing that during the intro flow
        // creates obj_prematch before its gmlname array is set and crashes.
        if (b && b.gmltext && String(b.gmltext).toLowerCase().indexOf("continue") >= 0 &&
            (b.gmlonClickAction === 100900 || b.gmlonClickAction === 100089)) {
          targets.push(b);
        }
      }
      // prefer the dialog continue (y near 224) first; then the details continue
      targets.sort(function (a, b2) { return Math.abs(a.y - 224) - Math.abs(b2.y - 224); });
      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        var key = t.gmlonClickAction + "@" + Math.round(t.x) + "," + Math.round(t.y);
        if (fired[key]) continue;
        w.script_execute(t, t, t.gmlonClickAction);
        fired[key] = 1;
        try { console.log("[tiptap] auto-continue fired", key); } catch (e) {}
        return true;
      }
    } catch (e) {}
    return false;
  }
  function loop() {
    if (fireContinue()) {
      // after firing, wait a beat before looking again (room transitions)
      setTimeout(loop, 2500);
    } else {
      setTimeout(loop, 1500);
    }
  }
  setTimeout(loop, 15000);
})();
