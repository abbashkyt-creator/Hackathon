/* Pre-game crash probe + bundle watchdog: survives where the module bundle
       SyntaxErrors on old browsers (Vite es2020 ?? / ?.). ES5-only, no network, no UI.
       Reports on two channels: console.error + PokiSDK.captureError (when present).

       [ghost] DISABLED 2026-07-14 — LOG=false, so the listeners/watchdog still arm but
       emit NOTHING (no console.error, no captureError into Poki's live error logs).
       Keep in sync with GHOST_ERROR_LOGS in src/config/dev.js; flip both to true to
       re-open an investigation window. */
    var PG_LOG = false;
    function pgReport(msg) {
      if (!PG_LOG) return;
      console.error(msg);
      if (window.PokiSDK && PokiSDK.captureError) { PokiSDK.captureError(msg); }
    }
    window.addEventListener('error', function (e) {
      pgReport('[pre-game] ' + e.message + ' ' + e.filename + ' ' + e.lineno + ' ' +
        ((e.error && (e.error.stack || e.error.name)) || '') + ' ' + navigator.userAgent);
    });
    window.addEventListener('unhandledrejection', function (e) {
      var r = e.reason;
      pgReport('[pre-game][promise] ' + ((r && (r.stack || r.message)) || r) + ' ' + navigator.userAgent);
    });
    /* Watchdog: detects ABSENCE of bundle execution, independent of any error event.
       On old engines a module SyntaxError often never reaches window.error, so we
       instead check that main.js set window.__bundleAlive within 10s of arming. */
    var t0 = Date.now();
    setTimeout(function () {
      if (!window.__bundleAlive) {
        pgReport('[pre-game] bundle never started ' + navigator.userAgent + ' ' + (Date.now() - t0));
      }
    }, 10000);
