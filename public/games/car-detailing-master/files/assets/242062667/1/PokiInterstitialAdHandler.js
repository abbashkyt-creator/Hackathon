class PokiInterstitialAdhandler {
    constructor(handler) {
        this.app = handler.app;
        this.manager = handler.manager;
        this.handler = handler;
    }

    show(callback) {
        console.log("7676:Poki:Interstitial Ad Show", callback);
        var isAdPlayed = false;
        var failedToPlay = false;
        // we closed the gameplay now let’s trigger the break
        PokiSDK.commercialBreak(() => {
            // if we actually start showing an ad, pause the game ( this function also mutes the game music)
            isAdPlayed = true;
            this.pauseGame();
        }).then(() => {
            console.log("7676:Poki:Ad completed")
            isAdPlayed = true;
            this.unPauseGame();
            if (failedToPlay) return;
            callback?.(null);
        }).catch(() => {
            isAdPlayed = true;
            if (failedToPlay) return;
            callback?.("7676:Ad failed");
            this.unPauseGame();
        });

        CustomCoroutine.Instance.set(() => {
            console.log("Poki:Interstitial Ad:CustomCoroutine: isAdPlayed: failedToPlay: ", isAdPlayed, failedToPlay);
            if (isAdPlayed) return;
            failedToPlay = true;
            this.unPauseGame();
            callback?.("Poki:Interstitial: Ad:CustomCoroutine: Ad Failed");
        }, 20);

    }

    pauseGame() {
       this.app.fire("Sdk:PauseGame");
        console.log("7676:Starting break");
    }

    unPauseGame() {
        this.app.fire("Sdk:UnPauseGame");
        console.log("7676:Break Completed");
    }


}