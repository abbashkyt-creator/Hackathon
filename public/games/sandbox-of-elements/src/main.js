import { PokiSDK } from './platform/PokiSDK.js';
import { setLang } from './i18n/ru.js';
import { Game } from './Game.js';

window.addEventListener('unhandledrejection', (e) => e.preventDefault());

// Poki mandatory: block arrow/space scrolling of the host page
window.addEventListener('keydown', (e) => {
  const k = e.key;
  if ((k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight' || k === ' ') &&
      e.target === document.body) {
    e.preventDefault();
  }
}, { passive: false });

// Poki mandatory: block mouse-wheel page scroll. Wheel events over the scrollable
// element rows / vertical menu lists are left alone so they scroll normally;
// everywhere else (canvas, empty UI) the default page scroll is prevented.
window.addEventListener('wheel', (e) => {
  if (e.target.closest && e.target.closest('.scrollable-container, .quest-list, .recipe-list')) return;
  e.preventDefault();
}, { passive: false });

async function main() {
  const sdk = new PokiSDK();
  await sdk.init();

  const lang = sdk.getLanguage();
  setLang(lang);

  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Block swipe-to-refresh / overscroll on mobile
  document.addEventListener('touchmove', (e) => {
    const scrollable = e.target.closest('.scrollable-container');
    if (!scrollable) { e.preventDefault(); return; }
    if (scrollable.classList.contains('scroll-x')) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollable;
      if (scrollLeft <= 0 && scrollLeft + clientWidth >= scrollWidth - 1) {
        e.preventDefault();
      }
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = scrollable;
    if (scrollTop <= 0 && scrollTop + clientHeight >= scrollHeight - 1) {
      e.preventDefault();
    }
  }, { passive: false });

  const game = new Game(lang);

  // Load progress from localStorage (Poki has no cloud save)
  const savedData = await sdk.loadProgress();
  if (savedData) {
    if (savedData.unlocked || savedData.unlockedSlots) {
      game.ui.setUnlockedFromCloud(savedData.unlocked, savedData.unlockedSlots);
    }
    if (savedData.level) {
      game.level = savedData.level;
      game.xp = savedData.xp || 0;
      game.ui.updateLevel(game.level, game.xp / game.xpForLevel(game.level));
    }
    if (savedData.quests) game.loadQuestsFromCloud(savedData.quests);
    if (savedData.recipes) game.loadRecipesFromCloud(savedData.recipes);
  }

  // Mandatory: signal that loading finished so Poki can hide its loader and
  // the pre-roll can start at the right moment.
  sdk.gameReady();

  async function saveLocal() {
    await sdk.saveProgress({
      unlocked: game.ui.getUnlockedArray(),
      unlockedSlots: game.ui.getUnlockedSlotsArray(),
      level: game.level,
      xp: game.xp,
      quests: game.getQuestSaveData(),
      recipes: game.getRecipeSaveData()
    });
  }

  // Flush a save when the tab is hidden or closed. The in-loop autosave is skipped
  // while the sim is frozen (pause / tab-hidden / ad), so persist progress now —
  // otherwise XP gained by painting while paused would be lost if the player closes
  // the tab without unpausing. saveProgress writes localStorage synchronously, so it
  // completes even during pagehide. (visibilitychange covers mobile, where pagehide
  // is unreliable.)
  window.addEventListener('pagehide', () => { saveLocal().catch(() => {}); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveLocal().catch(() => {});
  });

  // --- Gameplay / ad state machine ---------------------------------------
  // Poki requires gameplayStart()/gameplayStop() to bracket every interruption
  // (menu, pause, lost focus, ad) and forbids firing the same event twice in a
  // row. Rather than scatter start/stop calls, we keep a handful of boolean
  // flags and derive the desired state in syncGameplay(). The PokiSDK wrapper
  // itself guards against duplicate events, so calling this repeatedly is safe.
  let hasInteracted = false; // first genuine GAMEPLAY gesture has happened
  let menuDepth = 0;         // open overlay menus (Quests / Discoveries / My Worlds)
  let userPaused = false;      // pause button / spacebar
  let tabHidden = false;       // tab hidden (visibilitychange) → real pause (freeze sim)
  let windowBlurred = false;   // window lost focus (tab still visible) → mute + stop only
  let adActive = false;        // an ad is actually on screen → freeze sim + gameplayStop
  let adBreakPending = false;  // a commercial/rewarded break is in progress → mute audio

  function syncGameplay() {
    // "Stopped" = the player is not actively playing: a menu/overlay is up, they
    // paused, the tab is hidden, the window lost focus, or an ad is on screen.
    const stopped = menuDepth > 0 || userPaused || tabHidden || windowBlurred || adActive;
    if (hasInteracted && !stopped) sdk.gameplayStart();
    else sdk.gameplayStop();
    // The sim keeps running behind the translucent menus (a living background) and
    // while the window is merely blurred-but-visible. It is frozen ONLY for hard
    // interruptions that hide or replace the canvas: pause, tab hidden, a live ad.
    // Crucially, window-blur does NOT freeze the materials — freezing on blur (with
    // an unreliable focus event to undo it) is exactly what left the game "paused
    // with the pause button unchanged / stuck frozen" in the review.
    game.sim.paused = userPaused || tabHidden || adActive;
    // Audio is muted for the FULL duration of any ad break (adBreakPending is set
    // before the break and cleared after, so muting never depends on Poki's
    // before-break callback — which the docs say "might not always get called"),
    // while the tab is hidden, and while the window is blurred. Otherwise we honour
    // the player's own sound toggle. (unmute() ignores userMuted, so the decision
    // must be made here.)
    if (adActive || adBreakPending || tabHidden || windowBlurred || game.sound.userMuted) game.sound.mute();
    else game.sound.unmute();
    // The pause button must ALWAYS reflect whether the materials are really frozen,
    // so it can never read "running" while the sim is paused (review bug #1).
    game.ui.setPausedVisual(game.sim.paused);
  }

  // commercialBreak — fired only at Poki-approved "returning to gameplay"
  // moments. We never gate it with our own timer; Poki's SDK decides whether an
  // ad actually shows. Audio is muted for the whole break (defensive, per Poki
  // docs); the sim is only frozen and gameplayStop only fired once an ad truly
  // starts (onOpen), so a no-ad break causes no gameplay hitch or stray events.
  let adInFlight = false;
  async function commercialBreak() {
    // Never request an interstitial before the player has actually started playing
    // (e.g. switching category, or pause→unpause, as the very first action). Poki
    // ads bracket gameplay, so just reconcile state (this still unpauses, since
    // userPaused is already cleared by the caller) and bail.
    if (!hasInteracted) { syncGameplay(); return; }
    // If an ad is already mid-flight, just reconcile state and bail — the
    // in-flight ad's restore will fire the final syncGameplay() at the right
    // moment, so the caller (e.g. unpause) is never left stranded.
    if (adInFlight) { syncGameplay(); return; }
    adInFlight = true;
    adBreakPending = true;
    syncGameplay();                                  // mute audio before the break
    try {
      await sdk.showFullscreenAd(
        () => { adActive = true; syncGameplay(); },  // an ad really started → freeze sim + gameplayStop
        () => {}                                     // ad ended; restore happens in finally below
      );
    } finally {
      adActive = false;
      adBreakPending = false;
      syncGameplay();                                // always restore audio + gameplay
      adInFlight = false;
    }
  }

  // Rewarded ad — unlocks optional content (extra materials / save slots). The
  // ad is always on screen for the whole await, so adActive brackets it (sim +
  // gameplayStop + mute via syncGameplay). Never triggers a commercialBreak.
  async function runRewarded() {
    adActive = true;
    adBreakPending = true;
    syncGameplay();
    let rewarded = false;
    try {
      rewarded = await sdk.showRewardedAd();
    } catch (e) {
      rewarded = false;
    } finally {
      adActive = false;
      adBreakPending = false;
      syncGameplay();
    }
    if (rewarded) saveLocal().catch(() => {});
    return rewarded;
  }

  game.ui.onRequestUnlock = () => runRewarded();
  game.ui.onRequestSlotUnlock = () => runRewarded();

  // A genuine gameplay gesture (drawing, weather, lightning, loading a world)
  // starts/resumes the Poki gameplay session. Opening a menu, pausing, toggling a
  // setting or picking a tool is NOT gameplay and intentionally does not fire
  // gameplayStart() — that previously produced spurious start/stop pairs. Combined
  // with the input-lock in Game.js (the sim is inert while stopped), this is what
  // guarantees the player can never affect the game without gameplayStart() active.
  function gameplayGesture() {
    hasInteracted = true;
    syncGameplay();
  }
  game.onGameplayAction = gameplayGesture;

  // Periodic background save from the game loop.
  game.onLevelSave = () => { saveLocal().catch(() => {}); };

  // --- Poki-required commercialBreak / gameplayStop trigger points -------

  // (1) Pressing play after pausing → commercialBreak. Pausing → gameplayStop.
  game.ui.onPause = (paused) => {
    userPaused = paused;
    if (paused) {
      syncGameplay();      // gameplayStop + freeze sim
    } else {
      // Resuming also clears any stale "away" state (e.g. a dropped visibility/focus
      // event), so tapping play always truly resumes — even if it was the recovery tap.
      tabHidden = false;
      windowBlurred = false;
      commercialBreak();   // ad (if any), then resume via syncGameplay
    }
  };

  // (2) Switching between element categories → commercialBreak.
  game.ui.onCategoryChange = () => { commercialBreak(); };

  // (3)+(4) Menu screens (Quests / Discoveries / My Worlds): gameplayStop when
  // shown, commercialBreak when the player returns to the game. Closing My
  // Worlds via Load/Save also routes through onMenuClose, so "loading a save
  // game" is covered too.
  //
  // The rewarded-unlock confirm dialog (showUnlockPopup) is ALSO a full-screen
  // overlay that must fire gameplayStop while it is on screen — Poki's review
  // flagged "fire gameplayStop once these screens are shown". But it is NOT one
  // of the four commercialBreak moments, and firing a commercial right after a
  // rewarded video would stack two ads. So it closes with fireAd=false: drop the
  // menu and just resume gameplay (gameplayStart), without a commercialBreak.
  game.ui.onMenuOpen = () => { menuDepth++; syncGameplay(); };
  game.ui.onMenuClose = (fireAd = true) => {
    menuDepth = Math.max(0, menuDepth - 1);
    if (fireAd) commercialBreak();   // real menu → return-to-gameplay ad opportunity
    else syncGameplay();             // confirm dialog → resume only, no extra ad
  };

  game.start();

  // Self-healing safety net: any real pointer/key interaction proves the game is
  // focused and in front, so clear any stale "away" flag that a missed
  // focus/visibility event may have left set. Capture phase → this runs BEFORE the
  // canvas paint handler, so the very click that brings the game back also
  // un-freezes it within the same gesture. This makes it impossible for the sim to
  // stay stuck paused with the pause button unchanged (review bug #1), and it
  // re-opens the gameplay session so painting can never happen without
  // gameplayStart() (review SDK issue) even if a focus event was dropped.
  const clearAwayState = (e) => {
    // Let the pause button's OWN handler manage a tap on it (its resume branch
    // clears away-state). Pre-clearing here first would resume, then togglePause
    // would immediately re-pause — an inverted double-toggle. Everywhere else, heal.
    if (e && e.target && e.target.closest && e.target.closest('#btn-pause')) return;
    if (!tabHidden && !windowBlurred) return;
    tabHidden = false;
    windowBlurred = false;
    syncGameplay();
  };
  document.addEventListener('pointerdown', clearAwayState, { capture: true });
  document.addEventListener('keydown', clearAwayState, { capture: true });

  // Lifecycle signals from the SDK wrapper:
  //   • visibility (reliable, symmetric) → a TRUE pause: freeze the sim + gameplayStop
  //   • focus (unreliable inside embeds)  → audio mute + gameplayStop ONLY; the
  //     canvas keeps animating, so a blurred-but-visible game never looks frozen.
  sdk.onLifecycle(
    () => { tabHidden = true; syncGameplay(); },     // tab hidden
    () => { tabHidden = false; syncGameplay(); },    // tab visible again
    () => { windowBlurred = true; syncGameplay(); }, // window lost focus
    () => { windowBlurred = false; syncGameplay(); } // window regained focus
  );
}

main().catch(console.error);
