// Poki SDK wrapper — implements the mandatory integration points:
//   init(), gameLoadingFinished(), gameplayStart/Stop(), commercialBreak(), rewardedBreak()
// Docs: https://sdk.poki.com/html5
//
// This wrapper keeps the same interface used by the game (onLifecycle, loadProgress,
// saveProgress, etc.) so the rest of the codebase is unchanged between Yandex & Poki builds.
export class PokiSDK {
  constructor() {
    this.initialized = false;
    this.lang = 'en';
    this.gameplayActive = false;
    this.lifecycleHandlers = null; // { onHidden, onVisible, onBlur, onFocus }
  }

  async init() {
    try {
      const sdk = window.PokiSDK;
      if (sdk) {
        // Enable SDK debug UI on localhost so ads play in sandbox mode
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
          try { sdk.setDebug(true); } catch (e) {}
        }
        await sdk.init();
        this.initialized = true;
      } else {
        console.warn('Poki SDK not loaded — running in dev mode without ads');
      }
    } catch (e) {
      console.warn('Poki SDK init failed:', e);
    }
    // Poki doesn't expose locale — use navigator language
    try {
      const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      this.lang = nav.startsWith('ru') ? 'ru' : 'en';
    } catch (e) {}

    // Poki has no dedicated pause event, so we derive it from two DOM signals and
    // keep them SEPARATE because they mean different things:
    //   • tab visibility (visibilitychange) is reliable and symmetric → a true pause
    //   • window blur/focus is a weaker, embed-unreliable signal (clicking outside
    //     the iframe while the tab is still visible, an ad iframe stealing focus…)
    // The game decides what each one freezes/mutes; we only forward the events.
    document.addEventListener('visibilitychange', () => {
      const h = this.lifecycleHandlers; if (!h) return;
      if (document.hidden) h.onHidden && h.onHidden();
      else h.onVisible && h.onVisible();
    });
    window.addEventListener('blur', () => { const h = this.lifecycleHandlers; if (h && h.onBlur) h.onBlur(); });
    window.addEventListener('focus', () => { const h = this.lifecycleHandlers; if (h && h.onFocus) h.onFocus(); });
  }

  getLanguage() { return this.lang; }

  // Mandatory: signal when the game has finished loading assets
  gameReady() {
    if (this.initialized) {
      try { window.PokiSDK.gameLoadingFinished(); } catch (e) {}
    }
  }

  // Mandatory: signal when the user starts actively playing
  gameplayStart() {
    if (!this.initialized || this.gameplayActive) return;
    this.gameplayActive = true;
    try { window.PokiSDK.gameplayStart(); } catch (e) {}
  }

  // Mandatory: signal when the user pauses or reaches a menu
  gameplayStop() {
    if (!this.initialized || !this.gameplayActive) return;
    this.gameplayActive = false;
    try { window.PokiSDK.gameplayStop(); } catch (e) {}
  }

  // Register lifecycle callbacks. Visibility (onHidden/onVisible) is the reliable
  // "real pause" signal; focus (onBlur/onFocus) is advisory — the caller uses it
  // only for audio/gameplay bracketing, never to freeze the canvas.
  onLifecycle(onHidden, onVisible, onBlur, onFocus) {
    this.lifecycleHandlers = { onHidden, onVisible, onBlur, onFocus };
  }

  // Poki has no cloud save — use localStorage only. Interface kept identical to Yandex wrapper.
  async saveProgress(data) {
    try { localStorage.setItem('game_save', JSON.stringify(data)); } catch (e) {}
  }

  async loadProgress() {
    try {
      const raw = localStorage.getItem('game_save');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  // Fullscreen ad — Poki requires audio pause via the pre-ad callback.
  // The SDK controls whether an ad plays; we always honour the same onOpen/onClose flow.
  async showFullscreenAd(onOpen, onClose) {
    if (!this.initialized) { if (onClose) onClose(false); return; }
    // commercialBreak's callback fires BEFORE the ad starts → perfect spot to mute audio
    try {
      await window.PokiSDK.commercialBreak(() => {
        if (onOpen) onOpen();
      });
      if (onClose) onClose(true);
    } catch (e) {
      console.warn('commercialBreak failed:', e);
      if (onClose) onClose(false);
    }
  }

  // Rewarded ad — returns a Promise<boolean> for reward success.
  async showRewardedAd() {
    if (!this.initialized) {
      // Dev convenience only: auto-grant on localhost. In production a missing or
      // ad-blocked SDK must NOT grant a reward without showing an ad (Poki req.).
      return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    }
    try {
      const rewarded = await window.PokiSDK.rewardedBreak(() => {});
      return !!rewarded;
    } catch (e) {
      console.warn('rewardedBreak failed:', e);
      return false;
    }
  }

  // Poki has no leaderboard API — stub kept for interface parity
  async setLeaderboardScore(_name, _score) { /* no-op */ }
}
