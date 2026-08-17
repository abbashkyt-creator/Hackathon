class WhileYouWereGone extends Container {

    icon;
    darkBG;
    background;
    titleText;
    text;
    closeButton;
    closeText;
    closing = false;
    open = false;
    mainScene;
    uiScene;

    constructor(scene, firstCalculation) {
        super(scene, 960, 540);

        this.mainScene = this.scene.main;
        this.uiScene = this.scene;

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(670, 490, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -58);

        this.icon = scene.addImageUi(70, 70, "clock");
        this.addChild(this.icon, -255, -220);

        var progress = this.calculateProgress(firstCalculation);

        var message = "Your ants have been busy! They've\npainted and sold " + progress.paintingCount + " paintings!\n\n" +
            "Without your sales talent they only\nmanaged to sell all of the paintings\nfor a total of " + formattedMoney(progress.sellValue);
        if (saveData.saveProfile.interest) message += "\n\nYou also acquired " + formattedMoney(progress.interestAmount) + " from interest";
        var textStyle = saveData.saveProfile.interest ? normal32 : normal35;

        this.titleText = scene.addText(0, 0, "While you were away...", normal48);
        this.addChild(this.titleText, 46, -220);

        this.text = scene.addText(0, 0, message, textStyle);
        this.addChild(this.text, 0, -2);

        this.closeButton = scene.addImageUi(286, 92, "square");
        this.closeButton.setInteractive({cursor: "pointer"});
        this.closeButton.on("pointerdown", () => this.close());
        this.addChild(this.closeButton, 0, 258);

        this.closeText = scene.addText(0, 0, "Close", normal35);
        this.addChild(this.closeText, 0, 258);


        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.depth = 1500;

        PokiSDK.gameplayStop();
        paused = true;
        game.sound.mute = true;
        PokiSDK.commercialBreak().then(
            () => {
                console.log("Commercial break finished, proceeding to game");
                PokiSDK.gameplayStart();
                paused = false;
                game.sound.mute = saveData.saveProfile.mute;
                this.close();
            }
        );
    }


    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => {
            this.destroy();
            this.uiScene.whileYouWereGone = undefined;
        });
    }

    calculateProgress(firstCalculation) {
        var time = epochSeconds();
        var secondsSinceLastPlayed = time - saveData.saveProfile.timeLastPlayed;
        if (secondsSinceLastPlayed > 604800) secondsSinceLastPlayed = 604800; //Limits afk max time to a week
        var paintingsComplete = 0;
        var totalValue = 0;

        saveData.saveProfile.studios.forEach(studio => {
            var percentageComplete = studio.percentageComplete +
                secondsSinceLastPlayed * (studio.pixelsPerSecond / studio.currentPicturePixelCount.max(100));
            if (percentageComplete < 1) {
                studio.percentageComplete = percentageComplete;
                if (studio.id === saveData.saveProfile.currentStudioId && !firstCalculation) {
                    this.mainScene.paintPercentage(studio.percentageComplete);
                }
            } else {
                totalValue += studio.currentPicturePixelCount.max(100) * percentageComplete * 0.1;
                paintingsComplete += percentageComplete.floor();
                studio.percentageComplete = percentageComplete % 1;
                studio.paintingId++;
                if (studio.id === saveData.saveProfile.currentStudioId && !firstCalculation) {
                    this.mainScene.newCanvas(true);
                }
            }
        });

        var paintingCount = paintingsComplete;
        var sellValue = totalValue.round();
        var interestAmount = 0;

        if (saveData.saveProfile.interest) {
            var iterations = (secondsSinceLastPlayed / 60).min(500).round();
            print("Working out interest... It's been " + iterations + " minutes")
            var money = saveData.saveProfile.money;
            for (let i = 0; i < iterations; i++) money *= 1.01;
            interestAmount = money - saveData.saveProfile.money;
            print("new money value: " + money + ", total interest: " + interestAmount);
            saveData.saveProfile.money = money.floor();
        }

        saveData.saveProfile.money += totalValue.floor();
        saveData.saveProfile.afkSellCount += paintingsComplete;


        return {paintingCount: paintingCount, sellValue: sellValue, interestAmount: interestAmount};
    }

}