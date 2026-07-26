/* Offline compatibility layer: no ads, analytics, leaderboard, or network. */
(function installLocalPokiSdk(global) {
  const resolved = () => Promise.resolve();
  global.PokiSDK = Object.freeze({
    init: resolved,
    gameLoadingStart() {}, gameLoadingFinished() {},
    gameplayStart() {}, gameplayStop() {},
    commercialBreak: resolved, rewardedBreak: resolved,
    displayAd() {}, destroyAd() {}, setDebug() {},
  });
}(window));
