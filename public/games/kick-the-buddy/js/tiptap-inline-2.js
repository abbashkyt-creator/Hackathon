window.isSplashScreenHidden = false;
        var splashHiddenCallback = null;

        //Loader
        var splashScreen = document.querySelector("#custom-splash-screen");
        var progressFill = document.querySelector("#custom-progress-fill");
        var progressText = document.querySelector("#custom-progress-text");
        var phaseText = document.querySelector("#custom-phase-text");
        var spinner = document.querySelector(".custom-spinner");
        
        var preloadProgress = 0;
        var postloadProgress = 0;

        var prevTotal = 0;
        function updateTotalProgress() {
          // 50% max from preloading, 50% max from postloading
          var totalProgress = (preloadProgress * 0.5) + (postloadProgress * 0.5);
          var percentage = Math.min(Math.round(totalProgress * 100), 100);
          if (percentage >= prevTotal) {
              prevTotal = percentage;
              progressFill.style.width = percentage + "%";
              progressText.innerText = percentage + "%";
          }

          if (preloadProgress < 1) {
            phaseText.innerText = "1/3 - Downloading";
          } else if (percentage < 52) {
            phaseText.innerText = "2/3 - Initializing...";
          } else if (percentage < 100) {
            phaseText.innerText = "3/3 - Loading...";
          } else {
            phaseText.innerText = "Ready!";
            spinner.style.display = "none"; // Hide spinner when completely done
          }
        }
        window.SetPostloadProgress = function(progress) {
          postloadProgress = progress;
          updateTotalProgress();
        };

        window.onSplashHidden = function(callback) {
          if (window.isSplashScreenHidden) {
            callback();
          } else {
            splashHiddenCallback = callback;
          }
        };

        window.HideSplashScreen = function() {
          if (window.isSplashScreenHidden) return; // Prevent double-firing
          
          window.isSplashScreenHidden = true;
          if (splashHiddenCallback) {
            splashHiddenCallback();
            splashHiddenCallback = null;
          }
          splashScreen.classList.add("fade-out");
            setTimeout(() => {
              splashScreen.style.display = "none";
            }, 500);
        }
      
      //Unity
      var canvas = document.querySelector("#unity-canvas");

      function unityShowBanner(msg, type) {
        var warningBanner = document.querySelector("#unity-warning");
        function updateBannerVisibility() {
          warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
          if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
          setTimeout(function() {
            warningBanner.removeChild(div);
            updateBannerVisibility();
          }, 5000);
        }
        updateBannerVisibility();
      }

      var buildUrl = "Build";
      var loaderUrl = buildUrl + "/099d35df65a5a26c3c9a9214b09af038.loader.js";
      var config = {
        arguments: [],
        dataUrl: buildUrl + "/e2fe354e6d475d10df99f9aafe97e85e.data.br",
        frameworkUrl: buildUrl + "/58a3db4a24556aa9a7d3e3ef36a9a071.framework.js.br",
        codeUrl: buildUrl + "/70fe40ce89b8fe69119a7a4f07602e02.wasm.br",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Playgendary",
        productName: "Kick The Buddy",
        productVersion: "2.11.1",
        showBanner: unityShowBanner,
      };

      // All file writes inside Unity Application.persistentDataPath directory will automatically persist so that the contents are remembered when the user revisits the site the next time:
      config.autoSyncPersistentDataPath = true;

	  ///////////////////////////////////////////
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
		
		if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			// Mobile device style: fill the whole browser client area with the game canvas:
			document.querySelector("#unity-container").className = "unity-mobile";
			canvas.className = "unity-mobile";
			
			// To lower canvas resolution on mobile devices to gain some
			// performance, uncomment the following line:
			// config.devicePixelRatio = 1;
		}
		else if ("TRUE".toUpperCase() == "TRUE") {//Full screen for desktop (generated parameter)
			document.querySelector("#unity-container").className = "unity-desktop-full";
			canvas.className = "unity-desktop-full";
		}
		else {//Fixed 16/9 for desktop
			document.querySelector("#unity-container").className = "unity-common";
			canvas.className = "unity-common";
		}
  	  ///////////////////////////////////////////


      var script = document.createElement("script");
      script.src = loaderUrl;
      script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
          preloadProgress = progress; 
          updateTotalProgress();
        }).then((unityInstance) => {
          //
        }).catch((message) => {
          alert(message);
        });
      };

	  document.body.appendChild(script);
