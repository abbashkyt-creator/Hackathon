(function () {
        var gears = document.getElementById("preloader-center");
        if (!gears) return;
        function scaleGears() {
          gears.style.display = "block";
          var w = window.innerWidth;
          var h = window.innerHeight;

          var scale = Math.min((w * 0.45) / 250, (h * 0.3) / 220, 1);
          gears.style.transform = "scale(" + scale + ")";
        }

        window.addEventListener("resize", scaleGears);
        setTimeout(scaleGears, 500);
        setTimeout(scaleGears, 1000);
      })();
