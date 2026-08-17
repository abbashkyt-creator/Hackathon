PokiSDK.init().then(() => {
      console.log("Poki SDK successfully initialized");
      setGoogleLoginBtnUI();
    }).catch(() => {
      console.log("Initialized, something went wrong, load your game anyway");
      // fire your function to continue to game
      setGoogleLoginBtnUI();
    });

    // prevent page scroll
    window.addEventListener('keydown', ev => {
      if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
      }
    });
    window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });

    // You can also listen for orientation changes
    window.addEventListener('resize', function () {
      setGoogleLoginBtnUI();
    });

    function setGoogleLoginBtnUI() {
      let scale = window.innerHeight / 5.767;
      var gbtn = document.getElementById('poki_btn');
      gbtn.style.scale = scale.toString() + "%";
    }
