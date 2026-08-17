window.gameplayStarted = 0;
    window.removedLoader = false;
    window.dontUseIt = false;
    window.rewarded = false;


    document.addEventListener('visibilitychange', () => {
      console.warn('vis changed');
      if(!window.dontUseIt){
        if (document.hidden && window.compl && window.compl.sounds) {
          window.compl.sounds.disable();
        } else {
          if(window.compl && window.compl.sounds)
            window.compl.sounds.enable();
        }
      }
    })
    window.onload = function() {
      const loader = document.querySelector(".loader");

      loader.classList.add("loader--hidden");

      loader.addEventListener("transitionend", () => {

        if(window.removedLoader === false)
          document.body.removeChild(loader);

        window.removedLoader = true;

      });
    }



    window.firstStart = false;


    window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });


    window.reward = false;
    window.errorCounter = 0;

    window.compl = null;
    window.adType = 'none';
    window.wasAds  = false;
