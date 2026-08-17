System.register([], function (_export, _context) {
  "use strict";

  var cc, Application;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
  function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
  function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
  function isPositiveFinite(value) {
    return Number.isFinite(value) && value > 0;
  }
  function hasBrowserViewport() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
  function getDevicePixelRatio() {
    if (!hasBrowserViewport()) {
      return 1;
    }
    var ratio = window.devicePixelRatio || 1;
    return isPositiveFinite(ratio) ? ratio : 1;
  }
  function readCanvasCssSize() {
    if (!hasBrowserViewport()) {
      return null;
    }
    var gameDiv = document.getElementById('GameDiv');
    var canvas = document.getElementById('GameCanvas');
    var fallbackElement = canvas && canvas.parentElement ? canvas.parentElement : document.documentElement;
    var target = gameDiv || fallbackElement;
    var rect = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;
    var cssWidth = rect && isPositiveFinite(rect.width) ? rect.width : target.clientWidth || window.innerWidth || document.documentElement.clientWidth;
    var cssHeight = rect && isPositiveFinite(rect.height) ? rect.height : target.clientHeight || window.innerHeight || document.documentElement.clientHeight;
    if (!isPositiveFinite(cssWidth) || !isPositiveFinite(cssHeight)) {
      return null;
    }
    return {
      cssWidth: cssWidth,
      cssHeight: cssHeight,
      ratio: getDevicePixelRatio()
    };
  }
  function installSafeResizeGuard(engine) {
    if (!hasBrowserViewport()) {
      return;
    }
    var view = engine && engine.view;
    if (!view || view.__pokiSafeResizeGuardInstalled || typeof view._updateAdaptResult !== 'function') {
      return;
    }
    var originalUpdateAdaptResult = view._updateAdaptResult;
    var lastCssWidth = 0;
    var lastCssHeight = 0;
    var lastRatio = getDevicePixelRatio();
    var replayScheduled = false;
    var rememberSize = function rememberSize(width, height, ratio) {
      var safeRatio = isPositiveFinite(ratio) ? ratio : getDevicePixelRatio();
      lastCssWidth = width / safeRatio;
      lastCssHeight = height / safeRatio;
      lastRatio = safeRatio;
    };
    var applyCssSize = function applyCssSize(targetView, cssWidth, cssHeight, ratio) {
      var safeRatio = isPositiveFinite(ratio) ? ratio : getDevicePixelRatio();
      var width = Math.max(1, Math.round(cssWidth * safeRatio));
      var height = Math.max(1, Math.round(cssHeight * safeRatio));
      targetView.setFrameSize(cssWidth, cssHeight);
      rememberSize(width, height, safeRatio);
      return originalUpdateAdaptResult.call(targetView, width, height, safeRatio);
    };
    var scheduleReplay = function scheduleReplay(targetView) {
      if (replayScheduled) {
        return;
      }
      var replay = function replay() {
        replayScheduled = false;
        var size = readCanvasCssSize();
        if (size) {
          applyCssSize(targetView, size.cssWidth, size.cssHeight, size.ratio);
        }
      };
      replayScheduled = true;
      requestAnimationFrame(replay);
      setTimeout(replay, 100);
    };
    view._updateAdaptResult = function (width, height, ratio) {
      if (isPositiveFinite(width) && isPositiveFinite(height)) {
        rememberSize(width, height, ratio);
        return originalUpdateAdaptResult.call(this, width, height, ratio);
      }
      var size = readCanvasCssSize();
      if (size) {
        return applyCssSize(this, size.cssWidth, size.cssHeight, size.ratio);
      }
      if (isPositiveFinite(lastCssWidth) && isPositiveFinite(lastCssHeight)) {
        scheduleReplay(this);
        return applyCssSize(this, lastCssWidth, lastCssHeight, lastRatio);
      }
      scheduleReplay(this);
    };
    Object.defineProperty(view, '__pokiSafeResizeGuardInstalled', {
      value: true,
      configurable: true
    });
  }
  return {
    setters: [],
    execute: function () {
      _export("Application", Application = /*#__PURE__*/function () {
        function Application() {
          _classCallCheck(this, Application);
          this.settingsPath = 'src/settings.json';
          this.showFPS = false;
        }
        _createClass(Application, [{
          key: "init",
          value: function init(engine) {
            cc = engine;
            installSafeResizeGuard(cc);
            cc.game.onPostBaseInitDelegate.add(this.onPostInitBase.bind(this));
            cc.game.onPostSubsystemInitDelegate.add(this.onPostSystemInit.bind(this));
          }
        }, {
          key: "onPostInitBase",
          value: function onPostInitBase() {
            // cc.settings.overrideSettings('assets', 'server', '');
            // do custom logic
          }
        }, {
          key: "onPostSystemInit",
          value: function onPostSystemInit() {
            // do custom logic
          }
        }, {
          key: "start",
          value: function start() {
            return cc.game.init({
              debugMode: false ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
              settingsPath: this.settingsPath,
              overrideSettings: {
                // assets: {
                //      preloadBundles: [{ bundle: 'main', version: 'xxx' }],
                // }
                profiling: {
                  showFPS: this.showFPS
                }
              }
            }).then(function () {
              return cc.game.run();
            });
          }
        }]);
        return Application;
      }());
    }
  };
});