var backgroundLow = document.getElementById("background-low");
    var backgroundHigh = document.getElementById("background-high");
    var backgroundContainer = document.getElementById("background-container");
    var animations = document.getElementById("animations");

    var rand = (min, max) => (max - min) * Math.random() + min;

    {
      const img = new Image();
      img.src = "Loader/bgimg_high.webp";
      img.onload = () => {
        animations.innerHTML = ['<img id="animation-creeper" src="Loader/creeper.webp" />', '<img id="animation-horse" src="Loader/horse.webp" />', '<img id="animation-frog" src="Loader/frog.webp" />', '<div id="animation-eye-big">', '<img id="animation-eye-big-image" src="Loader/eye_big.webp" />', "</div>", '<div id="animation-eye-small">', '<img id="animation-eye-small-image" src="Loader/eye_small.webp" />', "</div>"].join("\n");

        var sparkelsAmount = 10;
        var moveSparkle = (sparkleImage) => {
          sparkleImage.style.left = `calc(50% + ${rand(-220, 180)}px)`;
          sparkleImage.style.top = `calc(50% + ${rand(-340, -100)}px)`;
        };
        for (var i = 0; i < sparkelsAmount; i++) {
          timeouts.push(
            setTimeout(
              () => {
                var sparkleImage = new Image();
                sparkleImage.src = "Loader/sparkle.png";
                sparkleImage.className = "animation-sparkle";
                moveSparkle(sparkleImage);
                intervals.push(setInterval(() => moveSparkle(sparkleImage), 1500));
                animations.appendChild(sparkleImage);
              },
              i * (1500 / sparkelsAmount),
            ),
          );
        }

        const targets = [
          [69, 110, 3.5, 39.5],
          [285, -170, 285, -170],
          [-303, -450, -303, -450],
          [113, 170, 113, 170],
        ];
        const bigEye = document.getElementById("animation-eye-big");
        const smallEye = document.getElementById("animation-eye-small");

        const bigRadius = 15;
        const smallRadius = 10;
        const smoothFactor = 0.01;

        let bigCurrent = { x: 0, y: 0 };
        let smallCurrent = { x: 0, y: 0 };
        let targetIndex = 0;

        let bigTarget = { x: 0, y: 0 };
        let smallTarget = { x: 0, y: 0 };

        function updateTarget() {
          const coords = targets[targetIndex];
          bigTarget.x = coords[0] - 3.5;
          bigTarget.y = coords[1] - 39.5;
          smallTarget.x = coords[2] - 69;
          smallTarget.y = coords[3] - 110;
        }

        updateTarget();

        bigCurrent.x = bigTarget.x;
        bigCurrent.y = bigTarget.y;
        smallCurrent.x = smallTarget.x;
        smallCurrent.y = smallTarget.y;

        setInterval(() => {
          targetIndex = (targetIndex + Math.floor(Math.random() * (targets.length - 2)) + 1) % targets.length;
          updateTarget();
        }, 1000);

        function animateEyes() {
          bigCurrent.x += (bigTarget.x - bigCurrent.x) * smoothFactor;
          bigCurrent.y += (bigTarget.y - bigCurrent.y) * smoothFactor;

          const bigDistance = Math.hypot(bigCurrent.x, bigCurrent.y);
          if (bigDistance > bigRadius) {
            const scale = bigRadius / bigDistance;
            bigCurrent.x *= scale;
            bigCurrent.y *= scale;
          }
          bigEye.style.transform = `translate(${bigCurrent.x}px, ${bigCurrent.y}px)`;

          smallCurrent.x += (smallTarget.x - smallCurrent.x) * smoothFactor;
          smallCurrent.y += (smallTarget.y - smallCurrent.y) * smoothFactor;

          const smallDistance = Math.hypot(smallCurrent.x, smallCurrent.y);
          if (smallDistance > smallRadius) {
            const scale = smallRadius / smallDistance;
            smallCurrent.x *= scale;
            smallCurrent.y *= scale;
          }
          smallEye.style.transform = `translate(${smallCurrent.x}px, ${smallCurrent.y}px)`;

          requestAnimationFrame(animateEyes);
        }

        requestAnimationFrame(animateEyes);
      };
    }

    var intervals = [];
    var timeouts = [];
    var wWidth = () => Math.min(document.body.clientWidth, innerWidth);
    var wHeight = () => Math.min(document.body.clientHeight, innerHeight);

    var animationsWidth = 1120;
    var animationsHeight = 900;
    var animationsAspect = animationsWidth / animationsHeight;
    var resize = () => {
      var tWidth = wHeight() * animationsAspect;
      backgroundContainer.style.left = `${(wWidth() - tWidth) / 2}px`;
      backgroundContainer.style.top = "0px";
      backgroundContainer.style.width = `${animationsWidth}px`;
      backgroundContainer.style.height = `${animationsHeight}px`;
      backgroundContainer.style.transform = `scaleX(${tWidth / animationsWidth}) scaleY(${wHeight() / animationsHeight})`;
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
    var progressPercentageText = document.getElementById("progress-percentage");
    function updateProgressBar() {
      var enginePortion = 100 - preloadPercentage - fakeLoadingPercentage;
      displayedPercentage = Math.max(displayedPercentage, Math.floor(engineProgress * enginePortion) + preloadPercentage + fakeLoadingPercentage);
      progressPercentageText.innerText = `${displayedPercentage}%`;
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

      setTimeout(() => {
        backgroundHigh.style.opacity = "0";
        setTimeout(() => {
          backgroundHigh.remove();
        }, 500);
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
