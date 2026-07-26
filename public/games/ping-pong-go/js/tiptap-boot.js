/*
 * Externalized copy of the game's original inline bootstrap.
 *
 * The upstream index.html ended with an inline <script> that initializes the SDK
 * and then calls the game's loadLang(). Tip Tap's strict production CSP forbids
 * inline scripts, so the exact same logic lives here as a same-origin file. The
 * behavior is unchanged: initialize the (now local) SDK, then start the game.
 */
(function () {
  'use strict';

  var browserLang = (navigator.language || 'en').slice(0, 2);
  var lang = 'en';
  if (browserLang === 'fr' || browserLang === 'de' || browserLang === 'pt' || browserLang === 'es') {
    lang = browserLang;
  }

  function start() {
    if (typeof window.loadLang === 'function') {
      window.loadLang(lang);
    }
  }

  window.PokiSDK.init().then(start).catch(start);
})();
