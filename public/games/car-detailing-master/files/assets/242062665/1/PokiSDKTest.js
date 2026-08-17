class PokiTesting {
    constructor(initSuccess, adSuccess, giveReward, app) {
        this.debugMode = false;
        this.initSuccess = initSuccess;
        this.show = {
            interstitial: adSuccess,
            rewarded: adSuccess
        };
        this.giveReward = giveReward;
        this.app = app;
    }

    init() {
        return new Promise((resolve, reject) => {
            if (this.initSuccess) {
                console.warn("Poki: Mock PokiSDK: Initializing");
                resolve();
            }
            else {
                reject(new Error("Failed to initialize the SDK"));
            }
        });
    }

    setDebug(enabled) {
        this.debugMode = enabled;
        console.warn("Poki: Mock PokiSDK: Set debug mode to", enabled);
    }

    gameLoadingFinished() {
        console.warn("Poki: Mock PokiSDK: Game loading finished");
    }

    gameplayStart() {
        console.warn("Poki: Mock PokiSDK: Gameplay started");
    }

    gameplayStop() {
        console.warn("Poki: Mock PokiSDK: Gameplay stopped");
    }

    commercialBreak(callback) {
        console.warn("Poki: MockPokiSDK: commercialBreak called");
        return new Promise((resolve, reject) => {
            if (this.show.interstitial) {
                callback?.();
                this.app.fire("SdkManager:ShowFakeAd", 'Commercial Break', 3, false, () => {
                    resolve();
                });
            }
            else {
                console.warn("Poki: Mock Interstitial Ad failed");
                reject();
            }
        });
    }

    rewardedBreak(callback) {
        console.warn("Poki: MockPokiSDK: rewardedBreak called");
        return new Promise((resolve, reject) => {
            if (this.show.rewarded) {
                callback?.();
                this.app.fire("SdkManager:ShowFakeAd", 'Reward In', 3, true, () => {
                    resolve(this.giveReward);
                });
            }
            else {
                console.warn("Poki: Moc Rewareded Ad failed");
                reject();
            }
        })
    }
}
