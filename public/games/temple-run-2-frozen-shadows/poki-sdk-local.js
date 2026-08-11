/* Offline compatibility layer: no ads, analytics, leaderboard, or network. */
(function installLocalPokiSdk(global) {
  const resolved = () => Promise.resolve();
  global.PokiSDK = Object.freeze({
    init: resolved,
    gameLoadingStart() {}, gameLoadingFinished() {},
    gameplayStart() {}, gameplayStop() {},
    commercialBreak: (options) => global.TipTapAds.commercial(options, "temple-run-commercial"),
    rewardedBreak: (options) => global.TipTapAds.rewarded(options, "temple-run-rewarded"),
    displayAd: (options) => global.TipTapAds.display(options, "temple-run-display"),
    destroyAd() {}, setDebug() {},
  });
}(window));
