function POKI_INIT()
      {

        PokiSDK.init().then(
            () => {
                console.log("Poki SDK successfully initialized");
                // your code to continue to game
                PokiSDK.gameLoadingStart();
             if(!window.AudioContext && !window.webkitAudioContext) g_WebAudioContext = {};
                GameMaker_Init();
             if(!window.AudioContext && !window.webkitAudioContext) g_WebAudioContext = null;
            }   
        ).catch(
            () => {
                console.log("Initialized, but the user likely has adblock");
                // your code to continue to game
                PokiSDK.gameLoadingStart();
             if(!window.AudioContext && !window.webkitAudioContext) g_WebAudioContext = {};
                GameMaker_Init();
             if(!window.AudioContext && !window.webkitAudioContext) g_WebAudioContext = null;
            }   
        );
        PokiSDK.setDebug(false);
      }

      window.onload = POKI_INIT;
