PokiSDK.init().then(
    () => {
        console.log("Poki SDK successfully initialized");
        // fire your function to continue to game
    }   
    ).catch(
    () => {
        console.log("Initialized, but the user likely has adblock");
        // fire your function to continue to game
    }
    );

    //Poki solution for disabling page scroll.
    window.addEventListener('keydown', ev => {
      if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
          ev.preventDefault();
      }
    });
    window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });

    (() => {
      let replayResizeWhenValid = false;
      let replayScheduled = false;

      const isValidViewport = () => {
        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;
        const gameDiv = document.getElementById('GameDiv');
        const containerWidth = gameDiv ? gameDiv.clientWidth : width;
        const containerHeight = gameDiv ? gameDiv.clientHeight : height;
        return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 &&
          Number.isFinite(containerWidth) && Number.isFinite(containerHeight) && containerWidth > 0 && containerHeight > 0;
      };

      const replayResize = () => {
        replayScheduled = false;
        if (!replayResizeWhenValid) return;
        if (!isValidViewport()) {
          scheduleReplay();
          return;
        }
        replayResizeWhenValid = false;
        window.dispatchEvent(new Event('resize'));
      };

      const scheduleReplay = () => {
        if (replayScheduled) return;
        replayScheduled = true;
        requestAnimationFrame(replayResize);
        setTimeout(replayResize, 100);
      };

      const guardInvalidSizeEvent = ev => {
        if (isValidViewport()) return;
        replayResizeWhenValid = true;
        ev.stopImmediatePropagation();
        scheduleReplay();
      };

      window.addEventListener('resize', guardInvalidSizeEvent, true);
      window.addEventListener('orientationchange', guardInvalidSizeEvent, true);
    })();
