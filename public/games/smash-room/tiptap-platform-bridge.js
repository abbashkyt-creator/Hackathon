/* Same-origin Tip Tap lifecycle and owned-ad adapter for Smash Room. */
(function () {
  "use strict";

  window.PokiSDK = {
    init: function () { return Promise.resolve(); },
    gameLoadingStart: function () {},
    gameLoadingFinished: function () {},
    gameplayStart: function () {},
    gameplayStop: function () {},
    measure: function () {},
    commercialBreak: function (options) {
      return window.TipTapAds.commercial(options, "smash-room-commercial");
    },
    rewardedBreak: function (options) {
      return window.TipTapAds.rewarded(options, "smash-room-rewarded");
    },
    displayAd: function (options) {
      return window.TipTapAds.display(options, "smash-room-display");
    },
    destroyAd: function () {},
  };
}());
