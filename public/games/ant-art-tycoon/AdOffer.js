class AdOffer extends Container {

    titleBackground;
    titleShadow;
    titleText;
    titleIcon;
    darkBG;
    noThanksBackground;
    noThanksShadow;
    noThanksText;
    closing = false;
    offer1;
    offer2;
    offer3;
    timeLeft = 30;
    countDown = true;

    arrangements = [
        ["cash", "speed-boost", "half-price"],
        ["double-value", "cash", "artist-spotlight"],
        ["speed-boost", "artist-spotlight", "cash"],
        ["half-price", "artist-spotlight", "cash"],
        ["cash", "speed-boost", "double-value"],
        ["half-price", "cash", "double-value"]
    ]

    constructor(scene) {
        super(scene, 960, 540);

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.titleBackground = scene.addImageUi(520, 112, "square");
        this.titleBackground.depth = -10;
        this.addChild(this.titleBackground, 0, -305);

        this.titleShadow = scene.addImageUi(520, 112, "shadow");
        this.titleShadow.depth = -12;
        this.addChild(this.titleShadow, 8, -297);

        this.titleText = scene.addText(0, 0, "Special offer! (30)", normal48);
        this.addChild(this.titleText, 44, -305);

        this.titleIcon = scene.addImageUi(80, 80, "video-ad");
        this.addChild(this.titleIcon, -204, -305);

        this.noThanksBackground = scene.addImageUi(520, 130, "square");
        this.noThanksBackground.depth = -10;
        this.noThanksBackground.setInteractive({cursor: "pointer"});
        this.noThanksBackground.on("pointerdown", () => this.showAdThenClose());
        this.addChild(this.noThanksBackground, 0, 295);

        this.noThanksShadow = scene.addImageUi(520, 130, "shadow");
        this.noThanksShadow.depth = -12;
        this.addChild(this.noThanksShadow, 8, 303);

        this.noThanksText = scene.addText(0, 0, "No thanks, decline", normal48);
        this.addChild(this.noThanksText, 0, 295);


        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);


        this.depth = 2500;

        var arrangement = this.arrangements.random();

        this.offer1 = new OfferButton(scene, this, arrangement[0]);
        this.addChild(this.offer1, 0, -160);

        this.offer2 = new OfferButton(scene, this, arrangement[1]);
        this.addChild(this.offer2, 0, -8);

        this.offer3 = new OfferButton(scene, this, arrangement[2]);
        this.addChild(this.offer3, 0, 144);

        PokiSDK.gameplayStop();


    }

    update(time, delta) {
        if (!this.countDown) return;
        if (this.timeLeft > 0) {
            this.timeLeft -= delta / 1000;
            var timeString = this.timeLeft.round();
            if (this.timeLeft < 10) {
                timeString = this.timeLeft.toFixed(1);
            }
            this.titleText.text = "Special offer! (" + timeString + ")";
        } else {
            this.titleText.text = "Special offer! (0.0)";
            this.showAdThenClose();
        }
    }

    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => {
            this.scene.adOffer = undefined;
            this.destroy()
        });
    }

    showAdThenClose() {
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
}

class OfferButton extends Container {
    background;
    shadow;
    text;
    icon;
    adOffer;
    value;
    type
    description;

    constructor(scene, adOffer, type) {
        super(scene, 960, 540);

        this.type = type;
        this.adOffer = adOffer;

        this.background = scene.addImageUi(520, 136, "square");
        this.background.depth = -10;
        this.background.setInteractive({cursor: "pointer"});
        this.background.on("pointerdown", () => this.click());
        this.addChild(this.background, 0, 0);

        this.shadow = scene.addImageUi(520, 136, "shadow");
        this.shadow.depth = -12;
        this.addChild(this.shadow, 8, 8);

        var texture = "";

        if (type === "cash") {
            this.value = saveData.saveProfile.biggestSaleValue * 1.5 + 10;
            if (saveData.saveProfile.betterSpecialOffers) this.value *= 1.5;
            this.value = this.value.round();
            this.description = formattedMoney(this.value) + " cash";
            texture = "cash";
        }

        if (type === "speed-boost") {
            this.value = [20, 30, 40].random();
            this.description = this.value + " second ant speed boost";
            texture = "speed-boost";
        }

        if (type === "half-price") {
            this.description = "Half price shop items";
            texture = "half-price";
        }

        if (type === "double-value") {
            this.value = [1, 2, 3].random();
            if (this.value > 1) this.description = "Double the value of the next " + this.value + " paintings";
            else this.description = "Double the value of the next painting";
            texture = "listing-price";
        }

        if (type === "artist-spotlight") {
            this.value = [20, 30, 40].random();
            this.description = this.value + "s artist spotlight (faster sales)";
            texture = "spotlight";
        }

        this.text = scene.addText(0, 0, this.description, normal40);
        this.text.style.wordWrap = true;
        this.text.style.setWordWrapWidth(370);
        this.text.setPadding(10, 10, 10, 10);
        this.text.updateText();
        this.addChild(this.text, 63, 0);

        this.icon = scene.addImageUi(105, 105, texture);
        this.addChild(this.icon, -190, 0);

        this.depth = 2500;


    }

    click() {

        this.adOffer.countDown = false;

        paused = true;
        game.sound.mute = true;
        PokiSDK.rewardedBreak().then(
            (success) => {
                //if (success) {
                if (this.type === "cash") {
                    saveData.saveProfile.money += this.value;
                }

                if (this.type === "speed-boost") {
                    saveData.saveProfile.speedBoostTimeLeft = this.value;
                    print("SPEED BOOST PURCHASED - " + this.value);
                }

                if (this.type === "half-price") {
                    this.scene.shop.currentItems.forEach(item => item.halfPrice = true);
                }

                if (this.type === "double-value") {
                    saveData.saveProfile.doubleListingValueCount = this.value;
                }

                if (this.type === "artist-spotlight") {
                    saveData.saveProfile.artistSpotlightTimeLeft = this.value;
                }
                new Success(this.scene, this.description);
                // } else {
                //     print("Error with ad - no reward given");
                //     new UhOh(this.scene);
                // }

                this.adOffer.close();
                PokiSDK.gameplayStart();
                paused = false;
                game.sound.mute = saveData.saveProfile.mute;
            }
        );


    }
}

class Success extends Container {

    titleBackground;
    titleShadow;
    titleText;
    titleIcon;
    messageBackground;
    messageShadow;
    messageText;
    darkBG;
    okayBackground;
    okayShadow;
    okayText;
    closing = false;

    constructor(scene, prize) {
        super(scene, 960, 540);

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.titleBackground = scene.addImageUi(520, 112, "square");
        this.titleBackground.depth = -10;
        this.addChild(this.titleBackground, 0, -208);

        this.titleShadow = scene.addImageUi(520, 112, "shadow");
        this.titleShadow.depth = -12;
        this.addChild(this.titleShadow, 8, -200);

        this.titleText = scene.addText(0, 0, "Success!", normal48);
        this.addChild(this.titleText, 44, -208);

        this.titleIcon = scene.addImageUi(80, 80, "video-ad");
        this.addChild(this.titleIcon, -204, -208);

        this.messageBackground = scene.addImageUi(520, 248, "square");
        this.messageBackground.depth = -10;
        this.addChild(this.messageBackground, 0, -8);

        this.messageShadow = scene.addImageUi(520, 248, "shadow");
        this.messageShadow.depth = -12;
        this.addChild(this.messageShadow, 8, 0);

        this.messageText = scene.addText(0, 0, "You have been awarded:\n\n" + prize, normal40);
        this.messageText.style.wordWrap = true;
        this.messageText.style.setWordWrapWidth(500);
        this.messageText.setPadding(10, 10, 10, 10);
        this.messageText.updateText();
        this.addChild(this.messageText, 0, -8);

        this.okayBackground = scene.addImageUi(520, 130, "square");
        this.okayBackground.depth = -10;
        this.okayBackground.setInteractive({cursor: "pointer"});
        this.okayBackground.on("pointerdown", () => this.close());
        this.addChild(this.okayBackground, 0, 200);

        this.okayShadow = scene.addImageUi(520, 130, "shadow");
        this.okayShadow.depth = -12;
        this.addChild(this.okayShadow, 8, 208);

        this.okayText = scene.addText(0, 0, "Okay", normal48);
        this.addChild(this.okayText, 0, 200);


        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);


        this.depth = 2500;


    }


    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => {
            this.destroy()
        });
    }
}

class UhOh extends Container {

    titleBackground;
    titleShadow;
    titleText;
    titleIcon;
    messageBackground;
    messageShadow;
    messageText;
    darkBG;
    okayBackground;
    okayShadow;
    okayText;
    closing = false;

    constructor(scene) {
        super(scene, 960, 540);

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.titleBackground = scene.addImageUi(520, 112, "square");
        this.titleBackground.depth = -10;
        this.addChild(this.titleBackground, 0, -238);

        this.titleShadow = scene.addImageUi(520, 112, "shadow");
        this.titleShadow.depth = -12;
        this.addChild(this.titleShadow, 8, -230);

        this.titleText = scene.addText(0, 0, "Uh oh...", normal48);
        this.addChild(this.titleText, 44, -238);

        this.titleIcon = scene.addImageUi(80, 80, "video-ad");
        this.addChild(this.titleIcon, -204, -238);

        this.messageBackground = scene.addImageUi(520, 302, "square");
        this.messageBackground.depth = -10;
        this.addChild(this.messageBackground, 0, -11);

        this.messageShadow = scene.addImageUi(520, 302, "shadow");
        this.messageShadow.depth = -12;
        this.addChild(this.messageShadow, 8, -3);

        this.messageText = scene.addText(0, 0, "Something went wrong with the ad\n\nYou have not been awarded your prize", normal40);
        this.messageText.style.wordWrap = true;
        this.messageText.style.setWordWrapWidth(500);
        this.messageText.setPadding(10, 10, 10, 10);
        this.messageText.updateText();
        this.addChild(this.messageText, 0, -11);

        this.okayBackground = scene.addImageUi(520, 130, "square");
        this.okayBackground.depth = -10;
        this.okayBackground.setInteractive({cursor: "pointer"});
        this.okayBackground.on("pointerdown", () => this.close());
        this.addChild(this.okayBackground, 0, 226);

        this.okayShadow = scene.addImageUi(520, 130, "shadow");
        this.okayShadow.depth = -12;
        this.addChild(this.okayShadow, 8, 234);

        this.okayText = scene.addText(0, 0, "Try again", normal48);
        this.addChild(this.okayText, 0, 226);


        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);


        this.depth = 2500;


    }


    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => {
            this.destroy()
            this.scene.adOffer = new AdOffer(this.scene);
        });
    }
}
