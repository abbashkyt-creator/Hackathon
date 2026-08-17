function startGame() {
    System.import('./index.js').catch(function(err) { console.error(err); });
  }


  PokiSDK.init().then(() => {
      console.log("Poki SDK successfully initialized");
      // fire your function to continue to game
      startGame();
  }).catch((ervc) => {
      console.log("Initialized, something went wrong, continuing your game anyway");
      // fire your function to continue to game
      startGame();
  });
