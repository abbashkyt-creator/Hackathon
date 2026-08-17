System.register([], function (_export, _context) {
  "use strict";

  var cc, progressBar, progressIcon, progress, loadingInterval, Application;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
  function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
  function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
  return {
    setters: [],
    execute: function () {
      progressBar = document.getElementById("progress-bar");
      progressIcon = document.getElementById("progress-icon");
      progress = parseInt(progressBar.style.width || "0");
      _export("Application", Application = /*#__PURE__*/function () {
        function Application() {
          _classCallCheck(this, Application);
          this.settingsPath = 'src/settings.json';
          this.showFPS = false;
        }
        _createClass(Application, [{
          key: "init",
          value: function init(engine) {
            // console.log('init() in application.js', performance.now());

            cc = engine;
            cc.game.onPostBaseInitDelegate.add(this.onPostInitBase.bind(this));
            cc.game.onPostSubsystemInitDelegate.add(this.onPostSystemInit.bind(this));
            loadingInterval = setInterval(function () {
              progress += 2;
              if (progress > 100) {
                progress = 100;
                isLooping = true;
              }

              // Update progress bar width
              if (progressBar.style.width == "100%") {
                loadingInterval && clearInterval(loadingInterval);
                return;
              }
              if (progress > parseInt(progressBar.style.width || "0")) {
                progressBar.style.width = progress + "%";
                progressIcon.style.left = "calc(".concat(progress, "% - 15px)");
              }
            }, 2000);
          }
        }, {
          key: "onPostInitBase",
          value: function onPostInitBase() {
            // cc.settings.overrideSettings('assets', 'server', '');
            // do custom logic
            // console.log('onPostInitBase() in application.js', performance.now());
          }
        }, {
          key: "onPostSystemInit",
          value: function onPostSystemInit() {
            // do custom logic
            // console.log('onPostSystemInit() in application.js', performance.now());
            loadingInterval && clearInterval(loadingInterval);
          }
        }, {
          key: "start",
          value: function start() {
            // inform the poki sdk that the game is loading.
            // console.log('GameLoadingStart() in application.js', performance.now());
            PokiSDK.gameLoadingStart();
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
              console.log('GameLoadingEnd() in application.js', performance.now());
              cc.game.run();
              //Set the debug value in pokisdk based on the build settings.
            });
          }
        }]);
        return Application;
      }());
    }
  };
});