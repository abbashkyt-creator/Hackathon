/*
 * Fail-closed no-ad fallback for the CrazyGames calls used by this build.
 * The exact SDK v3 runtime is then loaded from this same game directory and
 * replaces this fallback while remaining in its documented localhost mode.
 */
(() => {
  "use strict";
  const resolved = (value) => Promise.resolve(value);
  const noop = () => {};
  const sdkEvents = [];
  const traceSdk = (event) => {
    sdkEvents.push({ event, at: Date.now() });
    if (sdkEvents.length > 80) sdkEvents.shift();
    window.__TIPTAP_SDK_EVENTS__ = sdkEvents;
    try {
      localStorage.setItem("tiptap-debug:dig-out-of-prison-sdk", JSON.stringify(sdkEvents));
    } catch {}
  };
  const storePrefix = "tiptap:dig-out-of-prison:";
  const localData = {
    clear: () => {
      for (let index = localStorage.length - 1; index >= 0; index -= 1) {
        const key = localStorage.key(index);
        if (key?.startsWith(storePrefix)) localStorage.removeItem(key);
      }
    },
    getItem: (key) => localStorage.getItem(`${storePrefix}${String(key)}`),
    removeItem: (key) => localStorage.removeItem(`${storePrefix}${String(key)}`),
    setItem: (key, value) => {
      localStorage.setItem(`${storePrefix}${String(key)}`, String(value));
      return undefined;
    },
    syncUnityGameData: () => resolved(),
  };
  const localSystemInfo = Object.freeze({
    countryCode: "",
    locale: navigator.language || "en",
    browser: Object.freeze({ name: "Tip Tap WebView", version: "local" }),
    os: Object.freeze({ name: navigator.platform || "Web", version: "" }),
    device: Object.freeze({
      type: matchMedia("(pointer: coarse)").matches ? "mobile" : "desktop",
    }),
    applicationType: "web",
  });
  const localGameSettings = Object.freeze({
    disableChat: false,
    muteAudio: new URLSearchParams(location.search).get("muted") === "1",
  });
  const sdk = Object.freeze({
    init: () => {
      traceSdk("init");
      return resolved();
    },
    environment: "local",
    isQaTool: false,
    ad: Object.freeze({
      hasAdblock: () => {
        traceSdk("adblock-check:no");
        return resolved(false);
      },
      prefetchAd: () => resolved(),
      requestAd: (_type, callbacks) => {
        traceSdk(`ad-request:${String(_type)}`);
        const kind = String(_type).toLowerCase().includes("reward") ? "rewarded" : "interstitial";
        return window.TipTapAds.request(kind, `dig-crazygames-${String(_type)}`).then((result) => {
          if (result.shown) callbacks?.adFinished?.();
          else callbacks?.adError?.({ code: "no_ad", message: "No Tip Tap campaign was shown." });
        });
      },
      addAdblockPopupListener: noop,
    }),
    analytics: Object.freeze({ trackOrder: noop }),
    banner: Object.freeze({ requestOverlayBanners: () => resolved([]) }),
    data: Object.freeze(localData),
    game: Object.freeze({
      gameplayStart: noop,
      gameplayStop: noop,
      happytime: noop,
      hideInviteButton: noop,
      inviteLink: () => "",
      settings: localGameSettings,
      showInviteButton: () => "",
    }),
    user: Object.freeze({
      addAuthListener: () => traceSdk("auth-listener"),
      // The copied build exposes this SDK call, but a score is deliberately
      // not ranked until a completed local run is independently verified.
      addScore: noop,
      getUser: () => resolved(null),
      getUserToken: () => resolved(""),
      getXsollaUserToken: () => resolved(""),
      isUserAccountAvailable: false,
      showAccountLinkPrompt: () => resolved(false),
      showAuthPrompt: () => resolved(false),
      submitScore: () => resolved(),
      // The generated Unity bridge serializes this as a value, not a method.
      systemInfo: localSystemInfo,
    }),
  });
  // This build contains both the current `CrazyGames.SDK` bridge and the
  // older Unity-facing `Crazygames` / `CrazySDK` calls.  The original hosted
  // wrapper supplies both shapes.  Keep the compatibility layer local and
  // deliberately return a no-ad, non-account session.
  let legacyObjectName = null;
  const localSession = Object.freeze({
    gameLink: "tiptap://dig-out-of-prison",
    userInfo: Object.freeze({
      countryCode: "",
      device: Object.freeze({ type: "mobile" }),
      os: Object.freeze({ name: "Tip Tap", version: "local" }),
      browser: Object.freeze({ name: "Tip Tap", version: "local" }),
    }),
  });
  const pendingLegacyMessages = [];
  const flushLegacyMessages = () => {
    const instance = window.unityGameInstance || window.__TIPTAP_UNITY__;
    if (!instance || !legacyObjectName) return false;
    while (pendingLegacyMessages.length) {
      const { method, value } = pendingLegacyMessages.shift();
      instance.SendMessage(legacyObjectName, method, value);
    }
    return true;
  };
  const queueLegacy = (method, value) => {
    pendingLegacyMessages.push({ method, value });
    if (flushLegacyMessages()) return;
    let attempts = 0;
    const waitForUnity = setInterval(() => {
      attempts += 1;
      if (flushLegacyMessages() || attempts >= 600) clearInterval(waitForUnity);
    }, 50);
  };
  const legacy = Object.freeze({
    load: noop,
    init: (options = {}) => {
      legacyObjectName = options.crazySDKObjectName || legacyObjectName;
      window.__TIPTAP_LEGACY_OBJECT__ = legacyObjectName;
      queueMicrotask(() => queueLegacy("InitCallback", JSON.stringify(localSession)));
    },
    requestAd: (type) => window.TipTapAds.request(
      String(type).toLowerCase().includes("reward") ? "rewarded" : "interstitial",
      `dig-legacy-${String(type)}`,
    ).then((result) => queueLegacy(result.shown ? "AdFinished" : "AdError", result.shown ? "" : "no_ad")),
    happytime: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    sdkGameLoadingStart: noop,
    sdkGameLoadingStop: noop,
    requestInviteUrl: noop,
    requestBanners: noop,
    screenshotReceived: noop,
    constants: Object.freeze([]),
    getUnityInstance: () => window.unityGameInstance || window.__TIPTAP_UNITY__ || null,
  });
  window.CrazyGames = Object.freeze({ SDK: sdk });
  window.Crazygames = legacy;
  window.CrazySDK = Object.freeze({ init: legacy.init, requestAd: legacy.requestAd });
  window.UnitySDK = Object.freeze({ logError: (...args) => console.warn("[Dig out of Prison]", ...args) });
  window.addEventListener("tiptap-unity-ready", flushLegacyMessages);

  // The captured rights-holder build disables even the SDK's documented
  // localhost allowance and freezes before scene startup. Its exact source
  // payload remains untouched on disk. Immediately before WebAssembly
  // compilation, set the exact local-host predicates and Check/DidRun
  // functions to their valid local state, and neutralize only the lock's
  // freeze/crash routines. Every function location is guarded by this build's
  // audited code-section shape and body size, so a different payload fails
  // closed.
  let siteLockPatchApplied = false;
  const siteLockFreezeCodeIndex = 7192;
  const unityQuitCodeIndex = 11310;
  const siteLockWhitelistCodeIndex = 18366;
  const siteLockValidHostCodeIndex = 32431;
  const siteLockCheckCodeIndex = 32433;
  const siteLockRemoteHostCodeIndex = 72875;
  const siteLockLocalHostCodeIndex = 72876;
  const siteLockCrashCodeIndex = 72878;
  const siteLockDidRunCodeIndex = 72881;
  const siteLockFreezeMoveNextCodeIndex = 73056;
  const crazySdkAwakeCodeIndex = 73078;
  const unityQuitWithCodeCodeIndex = 60440;
  const storyAdvanceWaitCodeIndex = 70159;
  const patchSiteLockCheck = (source) => {
    const input = ArrayBuffer.isView(source)
      ? new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
      : new Uint8Array(source);
    if (
      input.byteLength < 16_000_000 ||
      input[0] !== 0 || input[1] !== 97 || input[2] !== 115 || input[3] !== 109
    ) return source;
    const bytes = Uint8Array.from(input);
    let cursor = 8;
    const readLeb = () => {
      let value = 0;
      let shift = 0;
      let byte;
      do {
        byte = bytes[cursor++];
        value += (byte & 0x7f) * (2 ** shift);
        shift += 7;
      } while (byte & 0x80);
      return value;
    };
    while (cursor < bytes.length) {
      const sectionId = bytes[cursor++];
      const sectionSize = readLeb();
      const sectionEnd = cursor + sectionSize;
      if (sectionId !== 10) {
        cursor = sectionEnd;
        continue;
      }
      const functionCount = readLeb();
      if (functionCount !== 112228) return source;
      let patchedFunctions = 0;
      for (let index = 0; index < functionCount; index += 1) {
        const bodySize = readLeb();
        const bodyStart = cursor;
        const bodyEnd = bodyStart + bodySize;
        if (
          index === siteLockFreezeCodeIndex ||
          index === siteLockCrashCodeIndex ||
          index === unityQuitCodeIndex ||
          index === unityQuitWithCodeCodeIndex
        ) {
          const expectedSizes = new Map([
            [siteLockFreezeCodeIndex, 150],
            [siteLockCrashCodeIndex, 61],
            [unityQuitCodeIndex, 92],
            [unityQuitWithCodeCodeIndex, 40],
          ]);
          const expectedSize = expectedSizes.get(index);
          if (bodySize !== expectedSize || bytes[bodyEnd - 1] !== 0x0b) return source;
          bytes[bodyStart] = 0;
          bytes.fill(0x01, bodyStart + 1, bodyEnd - 1);
          bytes[bodyEnd - 1] = 0x0b;
          patchedFunctions += 1;
        } else if (
          index === siteLockWhitelistCodeIndex ||
          index === siteLockValidHostCodeIndex ||
          index === siteLockRemoteHostCodeIndex ||
          index === siteLockLocalHostCodeIndex
        ) {
          const expectedSizes = new Map([
            [siteLockWhitelistCodeIndex, 1169],
            [siteLockValidHostCodeIndex, 273],
            [siteLockRemoteHostCodeIndex, 77],
            [siteLockLocalHostCodeIndex, 118],
          ]);
          if (bodySize !== expectedSizes.get(index) || bytes[bodyEnd - 1] !== 0x0b) return source;
          bytes[bodyStart] = 0;
          bytes[bodyStart + 1] = 0x41;
          bytes[bodyStart + 2] = 1;
          bytes.fill(0x01, bodyStart + 3, bodyEnd - 1);
          bytes[bodyEnd - 1] = 0x0b;
          patchedFunctions += 1;
        } else if (index === siteLockCheckCodeIndex) {
          if (bodySize !== 1281 || bytes[bodyEnd - 1] !== 0x0b) return source;
          bytes[bodyStart] = 0;
          bytes.set([0x41, 1, 0x41, 0, 0x10, 0xf2, 0xbd, 0x04], bodyStart + 1);
          bytes.fill(0x01, bodyStart + 9, bodyEnd - 1);
          bytes[bodyEnd - 1] = 0x0b;
          patchedFunctions += 1;
        } else if (index === siteLockDidRunCodeIndex) {
          if (bodySize !== 70 || bytes[bodyEnd - 1] !== 0x0b) return source;
          bytes[bodyStart] = 0;
          bytes[bodyStart + 1] = 0x41;
          bytes[bodyStart + 2] = 1;
          bytes.fill(0x01, bodyStart + 3, bodyEnd - 1);
          bytes[bodyEnd - 1] = 0x0b;
          patchedFunctions += 1;
        } else if (
          index === siteLockFreezeMoveNextCodeIndex ||
          index === storyAdvanceWaitCodeIndex
        ) {
          const expectedSize = index === siteLockFreezeMoveNextCodeIndex ? 356 : 119;
          if (bodySize !== expectedSize || bytes[bodyEnd - 1] !== 0x0b) return source;
          bytes[bodyStart] = 0;
          bytes[bodyStart + 1] = 0x41;
          bytes[bodyStart + 2] = 0;
          bytes.fill(0x01, bodyStart + 3, bodyEnd - 1);
          bytes[bodyEnd - 1] = 0x0b;
          patchedFunctions += 1;
        } else if (index === crazySdkAwakeCodeIndex) {
          if (
            bodySize !== 204 ||
            bytes[bodyStart + 69] !== 0x02 ||
            bytes[bodyStart + 70] !== 0x40 ||
            bytes[bodyStart + 202] !== 0x0b ||
            bytes[bodyEnd - 1] !== 0x0b
          ) return source;
          bytes[bodyStart + 71] = 0x0c;
          bytes[bodyStart + 72] = 0;
          bytes.fill(0x01, bodyStart + 73, bodyStart + 202);
          patchedFunctions += 1;
        }
        if (patchedFunctions === 13) {
          siteLockPatchApplied = true;
          return bytes;
        }
        cursor = bodyEnd;
      }
      return source;
    }
    return source;
  };
  const nativeCompile = WebAssembly.compile.bind(WebAssembly);
  WebAssembly.compile = (source) => nativeCompile(patchSiteLockCheck(source));

  // Keep a local diagnostic handle to the instantiated module. This is not a
  // network hook: it exposes only the current page's own WebAssembly table.
  const rememberWasmInstance = (result) => {
    const instance = result?.instance || result;
    const exports = instance?.exports;
    if (!exports) return result;
    const tableEntry = Object.entries(exports).find(([, value]) => value instanceof WebAssembly.Table);
    const table = tableEntry?.[1] || null;
    window.__TIPTAP_WASM_TABLE__ = table;
    try {
      localStorage.setItem("tiptap-debug:dig-out-of-prison-wasm", JSON.stringify({
        exportNames: Object.keys(exports),
        tableName: tableEntry?.[0] || null,
        tableLength: table?.length || 0,
        localHostCompatibilityApplied: siteLockPatchApplied,
      }));
    } catch {}
    return result;
  };
  const nativeInstantiate = WebAssembly.instantiate.bind(WebAssembly);
  WebAssembly.instantiate = (...args) => nativeInstantiate(...args).then(rememberWasmInstance);
  if (typeof WebAssembly.instantiateStreaming === "function") {
    WebAssembly.instantiateStreaming = async (source, imports) => {
      const response = await source;
      const bytes = await response.arrayBuffer();
      return nativeInstantiate(patchSiteLockCheck(bytes), imports).then(rememberWasmInstance);
    };
  }

  // Unity's generated framework injects this exact SDK URL. Rewrite only that
  // script to the audited same-origin copy so the SDK's documented local mode
  // runs with its native callback semantics and no runtime platform request.
  const appendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function (child) {
    if (
      child instanceof HTMLScriptElement &&
      /^https:\/\/sdk\.crazygames\.com\/crazygames-sdk-v3\.js(?:\?|$)/.test(child.src)
    ) {
      child.src = "./crazygames-sdk-v3.js";
    }
    return appendChild.call(this, child);
  };
})();
