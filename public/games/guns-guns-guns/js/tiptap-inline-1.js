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
