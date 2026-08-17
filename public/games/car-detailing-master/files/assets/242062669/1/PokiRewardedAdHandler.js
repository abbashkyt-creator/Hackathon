class PokiRewardedAdhandler {
    constructor(handler) {
        this.app = handler.app;
        this.manager = handler.manager;
        this.handler = handler;
    }

    show(callback) {
        console.log("7676:Poki:Rewarded Ad Show: ", callback);
        PokiSDK.rewardedBreak(() => {
            // if the ad loads and will show pause the game and mute the menu music
            this.pauseGame();
        }).then((withReward) => {
            // when the ad is completed, skipped or did not play we run this code
            if (withReward) {
                // withReward is a boolean that you receive that indicates wether a user actually finished the video correctly
                console.log("7676:User completed the video");
                // this.app.fire("SdkManager:GameplayStart");
            } else {
                console.log("7676:User skipped the video, not entitled to a reward");
                // User skipped the video, not entitled to a reward
            }
            callback?.(withReward ? null : "7676:User skipped the video");
            this.unPauseGame();
        });
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