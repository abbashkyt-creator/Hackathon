(function () {
  var debug = window._CCSettings.debug;
  var splash = document.getElementById('splash');
  splash.style.display = 'block';

  function loadScript (moduleName, cb) {
    function scriptLoaded () {
      document.body.removeChild(domScript);
      domScript.removeEventListener('load', scriptLoaded, false);
      cb && cb();
    }
    var domScript = document.createElement('script');
    domScript.async = true;
    domScript.src = moduleName;
    domScript.addEventListener('load', scriptLoaded, false);
    document.body.appendChild(domScript);
  }

  // Poki gate: wait for the shim's init promise, then boot the engine
  function startEngine() {
    loadScript('cocos2d-js-min.9eb31.js', function () {
      if (typeof CC_PHYSICS_BUILTIN !== 'undefined' && (CC_PHYSICS_BUILTIN || (typeof CC_PHYSICS_CANNON !== 'undefined' && CC_PHYSICS_CANNON))) {
        loadScript('physics-min.js', window.boot);
      } else {
        window.boot();
      }
    });
  }

  if (window.PokiSDK) {
    PokiSDK.init().then(function () { startEngine(); }).catch(function () { startEngine(); });
  } else {
    window.addEventListener('poki-sdk-ready', startEngine);
    setTimeout(startEngine, 2500);
  }
})();
