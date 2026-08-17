var backgroundLow = document.getElementById("background-low");
    var root = document.getElementById("root");
    var backgroundHigh = document.getElementById("background-high");
    var visualsContainer = document.getElementById("visuals-container");
    var animations = document.getElementById("animations");

    var rand = (min, max) => (max - min) * Math.random() + min;

    {
      const img = new Image();
      img.src = "Loader/bgimg_high.webp";
      img.onload = () => {
        animations.innerHTML = [
          '<div id="animation-girl-container">',
            '<img id="animation-girl" src="Loader/girl.webp" />',
            '<img id="animation-hand" src="Loader/hand.webp" />',
            '<img id="animation-eye-closed" src="Loader/eye_closed.webp" />',
          '</div>',
          '<img id="animation-logo" src="Loader/logo.webp" />',
        ].join("\n");
        var sideSparkles = 20;
        var setupSideSparkle = (sparkleImage, right) => {
          if (right) {
            sparkleImage.style.left = `calc(50% + ${rand(-500, -200)}px)`;
          } else {
            sparkleImage.style.left = `calc(50% + ${rand(200, 500)}px)`;
          }
          sparkleImage.style.top = `calc(50% + ${rand(-440, 270)}px)`;
        };
        for (var i = 0; i < sideSparkles; i++) {
          const right = i % 2 === 0;
          timeouts.push(
            setTimeout(
              () => {
                var sparkleImage = new Image();
                sparkleImage.src = "Loader/sparkle.png";
                sparkleImage.className = "animation-sparkle";
                sparkleImage.style.scale = (1 + Math.random() * 0.5).toString();
                sparkleImage.style.rotate = `${360 * Math.random()}deg`;
                setupSideSparkle(sparkleImage, right);
                intervals.push(setInterval(() => setupSideSparkle(sparkleImage, right), 1500));
                animations.appendChild(sparkleImage);
              },
              i * (1500 / sideSparkles),
            ),
          );
        }

        var logoSparkles = 6;
        var setupLogoSparkle = (sparkleImage) => {
          sparkleImage.style.left = `calc(50% + ${rand(-150, 150)}px)`;
          sparkleImage.style.top = `calc(50% + ${rand(-430, -270)}px)`;
        };
        for (var i = 0; i < logoSparkles; i++) {
          timeouts.push(
            setTimeout(
              () => {
                var sparkleImage = new Image();
                sparkleImage.src = "Loader/sparkle.png";
                sparkleImage.className = "animation-sparkle";
                sparkleImage.style.scale = (1 + Math.random() * 0.5).toString();
                sparkleImage.style.rotate = `${360 * Math.random()}deg`;
                setupLogoSparkle(sparkleImage);
                intervals.push(setInterval(() => setupLogoSparkle(sparkleImage), 1500));
                animations.appendChild(sparkleImage);
              },
              i * (1500 / logoSparkles),
            ),
          );
        }
      };
    }

    var intervals = [];
    var timeouts = [];

    var animationsWidth = 1120;
    var animationsHeight = 900;
    var animationsAspect = animationsWidth / animationsHeight;
    var resize = () => {
      var tWidth = innerHeight * animationsAspect;
      visualsContainer.style.left = `${(innerWidth - tWidth) / 2}px`;
      visualsContainer.style.top = "0px";
      visualsContainer.style.width = `${animationsWidth}px`;
      visualsContainer.style.height = `${animationsHeight}px`;
      visualsContainer.style.transform = `scaleX(${tWidth / animationsWidth}) scaleY(${innerHeight / animationsHeight})`;
    };
    resize();
    window.addEventListener("resize", resize);

    var blurredOut = false;
    window.addEventListener("focus", () => (blurredOut = false));
    window.addEventListener("blur", () => (blurredOut = true));

    var fakeLoadingPercentage = 0;
    var engineProgress = 0;
    var displayedPercentage = 0;
    var preloadPercentage = 0;

    var progressUpdateInterval = setInterval(() => {
      if (fakeLoadingPercentage < 6) {
        fakeLoadingPercentage += 1;
        updateProgressBar();
      } else {
        clearInterval(progressUpdateInterval);
      }
    }, 2000);
    intervals.push(progressUpdateInterval);

    var progressBarFill = document.getElementById("progress-bar-fill");
    var progressTextOutline = document.querySelector(".progress-text-outline");
    var progressTextFill = document.querySelector(".progress-text-fill");
    function updateProgressBar() {
      var enginePortion = 100 - preloadPercentage - fakeLoadingPercentage;
      displayedPercentage = Math.max(displayedPercentage, Math.floor(engineProgress * enginePortion) + preloadPercentage + fakeLoadingPercentage);
      var text = `${displayedPercentage}%`;
      progressTextOutline.textContent = text;
      progressTextFill.textContent = text;
      progressBarFill.style.width = `${displayedPercentage}%`;
    }

    window.addEventListener("set-loader-progress", (event) => {
      engineProgress = event.detail.progress;
      updateProgressBar();
    });

    window.addEventListener("hide-loader", () => {
      for (var i = 0; i < intervals.length; i++) clearInterval(intervals[i]);
      for (var i = 0; i < timeouts.length; i++) clearTimeout(timeouts[i]);

      backgroundLow.remove();

      root.style.opacity = "0";

      setTimeout(() => {
        root.remove();
      }, 500);
    });

    function preloadGameAssets() {
      var gameAssets = [
        ["data.json", 2],
        ["scripts/main.js", 3],
        ["scripts/c3main.js", 4],
      ];

      Promise.all(
        gameAssets.map(([url, percentage]) => {
          var handle = (response) => {
            if (!response.ok) return;
            preloadPercentage += percentage;
            updateProgressBar();
          };

          return fetch(url).then(handle, handle);
        }),
      );
    }

    preloadGameAssets();
