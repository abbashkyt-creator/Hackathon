/* [beacon] TEMPORARY phantom-user diagnostic — fires ONE "arrived" ping to our OWN
       (Poki-approved) Scaleway function. Placed AFTER the Poki SDK on purpose: anything
       above it delays the SDK's execution, and the SDK firing `game/loading` late loses
       players who bounce in that window. Still runs BEFORE the module bundle, so
       page-arrivals are counted even when the bundle never executes (old-engine
       SyntaxError, failed chunk fetch…). ES5-only, no UI, never blocks boot. Mints
       window.__sid so the bundle's later milestones (play/time1/level2) join the SAME
       session. Set ON=false to disable. Remove with the rest of [beacon]. */
    (function () {
      var ON = false; /* [beacon] DISABLED 2026-07-14 — measurement window over. No `arrived` ping.
                         Must stay in sync with TELEMETRY_BEACON in src/config/dev.js. */
      if (!ON) return;
      try {
        var sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
        window.__sid = sid;
        /* Build tag — isolates this build's presence table from players on other builds,
           and separates DEV from PROD (local tests must not pollute the prod table). The
           inline can't read import.meta, so it decides by hostname. KEEP the prod value in
           sync with TELEMETRY_VERSION in src/config/dev.js; bump both to start a fresh
           table for a new measurement build. The bundle reads this via window.__tver, so a
           whole session (arrived + play + …) is tagged consistently. */
        var _local = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '';
        var tver = _local ? 'dev' : 'v3';
        window.__tver = tver;
        var uuid = '';
        try {
          uuid = (JSON.parse(localStorage.getItem('snowyeet_scoreboard') || '{}') || {}).uuid || '';
          if (!uuid) { /* stable per-device id so no-score players still count as one unique */
            uuid = localStorage.getItem('snowyeet_pid') || '';
            if (!uuid) { uuid = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); localStorage.setItem('snowyeet_pid', uuid); }
          }
        } catch (e) {}
        var url = 'https://snowyeetleaderboardbsjc6drk-fct-score-check.functions.fnc.fr-par.scw.cloud';
        var body = JSON.stringify({ type: 'ping', sid: sid, uuid: uuid, ver: tver, m: 'arrived', t: Date.now() });
        /* fetch + JSON + keepalive (same transport as the score submit, which works
           on Poki); sendBeacon throws NS_ERROR_FAILURE inside Poki's iframe on Firefox. */
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true })['catch'](function () {});
      } catch (e) { /* a diagnostic must never break boot */ }
    })();
