System.register(["./application.js"], function (_export, _context) {
  "use strict";

  var Application, canvas, initialCanvasSize, application;
  function isPositiveFinite(value) {
    return Number.isFinite(value) && value > 0;
  }
  function getInitialCanvasSize(canvas) {
    var parent = canvas.parentElement;
    var rect = parent && parent.getBoundingClientRect ? parent.getBoundingClientRect() : null;
    var width = rect && isPositiveFinite(rect.width) ? rect.width : parent.clientWidth || window.innerWidth || document.documentElement.clientWidth || 1;
    var height = rect && isPositiveFinite(rect.height) ? rect.height : parent.clientHeight || window.innerHeight || document.documentElement.clientHeight || 1;
    return {
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height))
    };
  }
  function topLevelImport(url) {
    return System["import"](url);
  }
  return {
    setters: [function (_applicationJs) {
      Application = _applicationJs.Application;
    }],
    execute: function () {
      canvas = document.getElementById('GameCanvas');
      initialCanvasSize = getInitialCanvasSize(canvas);
      canvas.width = initialCanvasSize.width;
      canvas.height = initialCanvasSize.height;
      application = new Application();
      topLevelImport('cc').then(function (engine) {
        return application.init(engine);
      }).then(function () {
        return application.start();
      })["catch"](function (err) {
        console.error(err);
      });
    }
  };
});