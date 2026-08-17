pc.script.createLoadingScreen(function (app) {

  var disableGA = true;

  function showSplash() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const lang = params.lang || "en";

    // ====== CONFIG ======
    var LOGO_SRC = "";
    var GAME_TITLE = "DEADRISE.IO";
    // ====================

    var isTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    // wrapper
    var wrapper = document.createElement("div");
    wrapper.id = "application-splash-wrapper";
    document.body.appendChild(wrapper);
    if (isTouch) wrapper.classList.add('is-mobile');

    // Single vignette overlay (scanlines removed - expensive repeating gradient)
    var vignette = document.createElement("div");
    vignette.className = "zload__vignette";
    wrapper.appendChild(vignette);

    // splash container
    var splash = document.createElement("div");
    splash.id = "application-splash";
    wrapper.appendChild(splash);

    // skull icon
    var icon = document.createElement("div");
    icon.className = "zload__icon";
    icon.innerHTML = `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 8c-10 0-18 8-18 18 0 7 4 13 10 16v8c0 2 2 4 4 4h8c2 0 4-2 4-4v-3h3c2 0 4-2 4-4v-5c6-3 10-9 10-16 0-10-8-18-18-18z"
                  fill="currentColor" opacity=".9"/>
            <circle cx="25" cy="30" r="4" fill="#0b0b0b"/>
            <circle cx="39" cy="30" r="4" fill="#0b0b0b"/>
            <path d="M32 36l-4 6h8l-4-6z" fill="#0b0b0b" opacity=".9"/>
          </svg>
        `;
    splash.appendChild(icon);

    // titles
    var titleWrap = document.createElement("div");
    titleWrap.className = "zload__title";
    titleWrap.innerHTML = `
          <div class="zload__game">${GAME_TITLE}</div>
        `;
    splash.appendChild(titleWrap);

    if (LOGO_SRC) {
      var logo = document.createElement("img");
      logo.className = "zload__logo";
      logo.src = LOGO_SRC;
      logo.alt = "DEADRISE.IO Logo";
      splash.appendChild(logo);
    }

    // Progress section
    var progressSection = document.createElement("div");
    progressSection.className = "zload__progressSection";
    splash.appendChild(progressSection);

    var row = document.createElement("div");
    row.className = "zload__row";
    progressSection.appendChild(row);

    var status = document.createElement("div");
    status.className = "zload__status";
    status.innerHTML = `
          <div id="zloadStatus" class="zload__statusText">Initializing…</div>
        `;
    row.appendChild(status);

    var pct = document.createElement("div");
    pct.id = "zloadPct";
    pct.className = "zload__pct";
    pct.textContent = "0%";
    row.appendChild(pct);

    var bar = document.createElement("div");
    bar.className = "zload__bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", "0");
    progressSection.appendChild(bar);

    var fill = document.createElement("div");
    fill.id = "progress-bar";
    fill.className = "zload__fill";
    bar.appendChild(fill);

    var gun = document.createElement("div");
    gun.id = "zloadZombie";
    gun.className = "zload__gun";
    gun.innerHTML = `
          <svg viewBox="0 0 128 64" aria-hidden="true">
            <ellipse class="gshadow" cx="64" cy="56" rx="36" ry="6"></ellipse>
            <rect class="gmetal" x="18" y="24" width="62" height="10" rx="3"></rect>
            <rect class="gmetal2" x="74" y="22" width="14" height="14" rx="3"></rect>
            <rect class="gmetal" x="88" y="25" width="10" height="8" rx="2"></rect>
            <rect class="gaccent" x="96" y="26.5" width="6" height="5" rx="2"></rect>
            <rect class="gbody" x="38" y="18" width="38" height="16" rx="4"></rect>
            <rect class="gbody2" x="54" y="16" width="18" height="8" rx="3"></rect>
            <path class="ggrip" d="M52 34h14l6 20c.6 2-1 4-3.2 4H56c-1.6 0-3-1-3.5-2.5L48 42c-1-2.6.8-8 4-8z"></path>
            <path class="gmetal2" d="M58 34h12c4 0 7 3 7 7v7h-6v-7c0-.7-.6-1.3-1.3-1.3H60c-.7 0-1.3.6-1.3 1.3v6h-6v-6c0-4.4 3.6-7.3 5.3-7.3z"></path>
            <rect class="gbody" x="68" y="44" width="10" height="18" rx="3"></rect>
            <rect class="gaccent" x="42" y="22" width="10" height="3" rx="1.5"></rect>
            <rect class="gaccent" x="42" y="28" width="14" height="3" rx="1.5"></rect>
            <path class="gshine" d="M40 20h20c-6 5-11 8-20 8z"></path>
          </svg>
        `;
    bar.appendChild(gun);

    var foot = document.createElement("div");
    foot.className = "zload__foot";
    foot.innerHTML = `
  <div class="zload__controlsLabel">CONTROLS</div>
  <span id="zloadControls" class="zload__small"></span>
`;
    splash.appendChild(foot);

    var controlsEl = document.getElementById("zloadControls");
    if (controlsEl) {
      controlsEl.textContent = isTouch
        ? "Left Stick Move • Right Side Look"
        : "WASD Move • Space Jump • LMB Fire • RMB Aim • R Reload";
    }

    if (disableGA) return;

    if (window.gameanalytics && !window.__gaInitialized) {
      const GA = gameanalytics.GameAnalytics;

      GA.setEnabledVerboseLog(false); // or true if debugging
      GA.setEnabledInfoLog(false);

      GA.configureBuild("5.0.2"); // match your buildVer
      GA.configureAvailableResourceCurrencies(["coins"]);

      GA.initialize("37c16fc29a9dff3513702d4a31b744a2", "c3cc47393497eecdf024ed4dfbf3990ee874abeb");

      window.__gaInitialized = true;

      //console.log("GA initialized from splash");

      const isMobileOrTab = isMobileOrTablet() ? 'Mobile' : 'Desktop';
      // Send loading start event
      const isReturning = isReturningUser() ? 'Old' : 'New';

      GA.addDesignEvent(isMobileOrTab);
      GA.addDesignEvent(`${isReturning}:Loading:Start`);

    }

  }

  function isMobileOrTablet() {
    try {
      const primaryCoarse = safeMq("(pointer: coarse)");
      const noHover = safeMq("(hover: none)") || safeMq("(any-hover: none)");
      const anyFine = safeMq("(any-pointer: fine)");
      const touchCapable = safeMaxTouchPoints() > 0;
      const minDim = safeMinViewportDim();

      // Strong signal: touch-first primary input
      if (primaryCoarse && noHover) return true;

      // iPadOS desktop-mode fallback
      const isIPadOS = touchCapable && /Mac/.test(navigator.platform || "");
      if (isIPadOS) return true;

      // Touch device, no fine pointer available, tablet-ish size
      if (touchCapable && !anyFine && minDim <= 1100) return true;

      return false;
    } catch {
      return false;
    }
  }

  function isReturningUser() {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    const data = localStorage.getItem("deadRiseData3");
    if (!data) {
      return false;
    }

    try {
      const parsedData = JSON.parse(data);
      return !!(parsedData && parsedData.playedBefore);
    } catch (e) {
      //console.warn("deadRiseData3 contains invalid JSON. Clearing it.", e, data);
      localStorage.removeItem("deadRiseData3");
      return false;
    }
  }

  function isLocalStorageAvailable() {
    var test = 'test';
    try {
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };

  function hideSplash() {

    if (!disableGA) {
      const GA = gameanalytics.GameAnalytics;
      if (isReturningUser()) {
        GA.addDesignEvent("Old:Loading:Complete");
      } else {
        GA.addDesignEvent("New:Loading:Complete");
      }
    }

    var wrapper = document.getElementById("application-splash-wrapper");
    if (!wrapper) return;

    if (wrapper && wrapper.parentElement) wrapper.parentElement.removeChild(wrapper);
  }

  function setProgress(value) {
    var fill = document.getElementById("progress-bar");
    var pctEl = document.getElementById("zloadPct");
    var statusEl = document.getElementById("zloadStatus");
    var bar = document.querySelector(".zload__bar");
    var gun = document.getElementById("zloadZombie");

    if (!fill) return;

    value = Math.min(1, Math.max(0, value));
    var p = Math.round(value * 100);

    fill.style.width = p + "%";
    if (pctEl) pctEl.textContent = p + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(p));

    if (bar && gun) {
      var barW = bar.clientWidth;
      var gW = gun.offsetWidth || 60;
      var x = Math.max(0, Math.min(barW - gW, (p / 100) * (barW - gW)));
      gun.style.transform = "translateX(" + x + "px)";
    }

    if (statusEl) {
      if (p < 10) statusEl.textContent = "Warming up…";
      else if (p < 35) statusEl.textContent = "Loading textures…";
      else if (p < 65) statusEl.textContent = "Loading models…";
      else if (p < 90) statusEl.textContent = "Compiling shaders…";
      else if (p < 100) statusEl.textContent = "Finalizing…";
      else statusEl.textContent = "RUN!";
    }
  }

  function createCss() {
    var css = [
      ":root{",
      "  --bg:#0F3B5E;",
      "  --dead:#e02b2b;",
      "  --dead2:#b41515;",
      "  --bone:#e9e2d4;",
      "  --bone2:#cfc6b6;",
      "  --cyan:#61DBD5;",
      "}",

      "body{ background: var(--bg); }",

      "#application-splash-wrapper{",
      "  position: fixed; inset: 0; z-index: 999999;",
      "  display: flex; align-items: center; justify-content: center;",
      "  overflow: hidden;",
      "  color: var(--bone);",
      "  font-family: system-ui, -apple-system, sans-serif;",
      "  background: var(--bg);",
      "}",

      ".zload__vignette{",
      "  position: absolute; inset: 0;",
      "  background: radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,.7) 100%);",
      "  pointer-events: none;",
      "}",

      "#application-splash{",
      "  width: 100%;",
      "  height: 100%;",
      "  display: flex;",
      "  flex-direction: column;",
      "  align-items: center;",
      "  justify-content: center;",
      "  gap: 24px;",
      "  padding: 40px 24px;",
      "  box-sizing: border-box;",
      "  position: relative;",
      "  z-index: 10;",
      "}",

      ".zload__icon{",
      "  width: 90px; height: 90px;",
      "  color: var(--dead);",
      "}",
      ".zload__icon svg{ width: 100%; height: 100%; display: block; }",

      ".zload__title{",
      "  text-align: center;",
      "  margin-top: -8px;",
      "}",
      ".zload__game{",
      "  font-weight: 900;",
      "  letter-spacing: .22em;",
      "  font-size: clamp(32px, 8vw, 56px);",
      "  line-height: 1;",
      "  color: var(--bone);",
      "  text-shadow: 0 0 40px rgba(233,226,212,.3), 0 4px 16px rgba(0,0,0,.8);",
      "}",

      ".zload__progressSection{",
      "  width: min(600px, 85vw);",
      "  margin-top: 20px;",
      "}",

      ".zload__row{",
      "  display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;",
      "  margin-bottom: 12px;",
      "}",
      ".zload__status{ display: flex; flex-direction: column; gap: 4px; }",
      ".zload__label{",
      "  font-size: 11px; letter-spacing: .2em; text-transform: uppercase;",
      "  color: rgba(233,226,212,.5);",
      "}",
      ".zload__statusText{",
      "  font-size: 14px; color: rgba(233,226,212,.8);",
      "}",
      ".zload__pct{",
      "  font-size: 28px;",
      "  font-variant-numeric: tabular-nums;",
      "  letter-spacing: .05em;",
      "  font-weight: 900;",
      "  color: var(--cyan);",
      "}",

      ".zload__bar{",
      "  height: 24px;",
      "  border-radius: 999px;",
      "  background: rgba(255,255,255,.06);",
      "  border: 1px solid rgba(255,255,255,.1);",
      "  overflow: hidden;",
      "  position: relative;",
      "}",

      ".zload__fill{",
      "  height: 100%;",
      "  width: 0%;",
      "  border-radius: 999px;",
      "  background: linear-gradient(90deg, rgba(224,43,43,.7), var(--dead), var(--dead2));",
      "  transition: width .25s ease;",
      "  position: relative;",
      "}",

      ".zload__gun{",
      "  position: absolute;",
      "  top: -10px;",
      "  left: 0;",
      "  width: 62px;",
      "  height: 38px;",
      "  pointer-events: none;",
      "  will-change: transform;",
      "}",
      ".zload__gun svg{ width: 100%; height: 100%; display: block; }",
      ".zload__gun .gshadow{ fill: rgba(0,0,0,.4); }",
      ".zload__gun .gmetal{ fill: rgba(233,226,212,.95); }",
      ".zload__gun .gmetal2{ fill: rgba(233,226,212,.75); }",
      ".zload__gun .gbody{ fill: rgba(25,25,25,.95); }",
      ".zload__gun .gbody2{ fill: rgba(45,45,45,.95); }",
      ".zload__gun .ggrip{ fill: rgba(15,15,15,.95); }",
      ".zload__gun .gaccent{ fill: var(--cyan); }",
      ".zload__gun .gshine{ fill: rgba(255,255,255,.15); }",

      ".zload__foot{",
      "  position: absolute;",
      "  bottom: 30px;",
      "  left: 50%;",
      "  transform: translateX(-50%);",
      "  text-align: center;",
      "}",
      ".zload__small{",
      "  font-size: 12px;",
      "  color: rgba(233,226,212,.7);",
      "  letter-spacing: .08em;",
      "}",
      ".zload__controlsLabel{",
      "  font-size: 11px;",
      "  letter-spacing: .15em;",
      "  color: rgba(255,255,255,1);",
      "  margin-bottom: 16px;",
      "  font-weight: 600;",
      "}",

      "#application-splash-wrapper.is-hidden{ animation: zfade .3s ease forwards; pointer-events: none; }",
      "@keyframes zfade{ to { opacity: 0; } }",

      "@media (max-width: 520px){",
      "  .zload__icon{ width: 70px; height: 70px; }",
      "  .zload__pct{ font-size: 22px; }",
      "  .zload__gun{ top: -12px; width: 55px; height: 34px; }",
      "  .zload__foot{ bottom: 20px; }",
      "  .zload__small{ font-size: 10px; }",
      "}",
      "#application-splash-wrapper.is-mobile #application-splash{ gap: 10px; padding: 20px 24px; }",
      "#application-splash-wrapper.is-mobile .zload__icon{ width: 50px; height: 50px; }",
      "#application-splash-wrapper.is-mobile .zload__game{ font-size: 28px; }",
      "#application-splash-wrapper.is-mobile .zload__title{ margin-top: 0; }",
      "#application-splash-wrapper.is-mobile .zload__progressSection{ margin-top: 8px; }",
      "#application-splash-wrapper.is-mobile .zload__row{ margin-bottom: 8px; }",
      "#application-splash-wrapper.is-mobile .zload__pct{ font-size: 20px; }",
      "#application-splash-wrapper.is-mobile .zload__bar{ height: 20px; }",
      "#application-splash-wrapper.is-mobile .zload__gun{ top: -8px; width: 50px; height: 30px; }",
      "#application-splash-wrapper.is-mobile .zload__foot{ bottom: 12px; }",
      "#application-splash-wrapper.is-mobile .zload__controlsLabel{ margin-bottom: 10px; }",
    ].join("\n");

    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  createCss();
  showSplash();

  app.on("preload:end", function () {
    app.off("preload:progress");
  });
  app.on("preload:progress", setProgress);
  app.on("start", hideSplash);

});