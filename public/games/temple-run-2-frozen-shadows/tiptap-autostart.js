/*
 * Tip Tap host integration only. The captured source renders its own PLAY
 * button after its loading screen. When this local game is the active feed
 * card, start that original control once so a player lands directly in a run.
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const state = (window.__TipTapTempleRunAutostart = {
    enabled: params.get("autoplay") === "1",
    status: "idle",
  });
  if (!state.enabled) return;
  state.status = "watching";

  let started = false;
  let observer;
  let timeout;

  function stopWatching() {
    if (observer) observer.disconnect();
    if (timeout) window.clearTimeout(timeout);
  }

  function startSourceGame() {
    if (started) return;
    const playButton = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent && button.textContent.trim() === "PLAY",
    );

    if (!playButton) return;
    started = true;
    state.status = "started";
    document.documentElement.dataset.tiptapAutostarted = "true";
    playButton.click();
    stopWatching();
  }

  observer = new MutationObserver(startSourceGame);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("load", startSourceGame, { once: true });
  timeout = window.setTimeout(() => {
    if (!started) state.status = "timed-out";
    stopWatching();
  }, 45000);
  startSourceGame();
})();
