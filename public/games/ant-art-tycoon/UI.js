class UI extends Phaser.Scene {

    constructor() {
        super({key: 'ui', active: true})
    }

    completion;
    size;
    maxSize;
    moneyCounter;
    antCounter;
    studioButton;
    mailButton;
    muteButton;
    achievementsButton;
    achievementMenu;
    shop;
    currentListings = [];
    opinions = [];
    recentOpinions = [];
    main;
    studioSelect;
    letter;
    mailQueue = [];
    paymentMailQueue = [];
    mailCheckDelay = 5;
    skipButton;
    whileYouWereGone;
    saveTimer = 10;
    tutorialProgress = -1;
    topTutorial;
    listingCount = -1;
    placeholders = []
    adOffer;
    timeUntilNextAd = 120;

    preload() {

    }

    create() {

        this.completion = this.addText(960, 970, "", bold48);
        this.size = this.addText(960, 95, "1cm x 1cm", normal48);
        this.maxSize = this.addText(960, 150, "(max 1cm x 1cm)", normal26);
        this.moneyCounter = new MoneyCounter(this, 1690, 973);
        this.shop = new Shop(this);
        this.antCounter = new AntCounter(this, 20, 1060);
        this.achievementsButton = new AchievementButton(this, 1400, 973);
        this.studioButton = new StudioButton(this, 1379, 102);
        this.mailButton = new MailButton(this, 541, 102);
        this.skipButton = new SkipButton(this, 1238, 994);
        this.muteButton = new MuteButton(this, 1870, 865);
        this.main = this.scene.get('main');
        this.input.on("pointerdown", () => saveData.saveProfile.totalClicks++);
        if (saveData.saveProfile.afkPainting) this.whileYouWereGone = new WhileYouWereGone(this, true);

        if (saveData.saveProfile.totalAntCount === 5 && saveData.saveProfile.studios[0].purchasedShopListings.length === 0) {
            this.tutorialProgress = 0;
            new Tutorial1(this);
            this.size.scale = 0;
            this.maxSize.scale = 0;
        }

        sfx.music.play();

        game.sound.mute = saveData.saveProfile.mute;

        //new LoadingImagesMessage(this, true);

        // new FinalLetter(this);
    }

    restartMainScene() {
        this.main.changingScene = true;
        this.main.scene.start("main");
        this.main.canvas = undefined;
        this.shop.reset();
    }

    confetti() {
        new Confetti(this, 960, -50);
    }

    setCompletionText(completion) {
        if (completion === 1) this.completion.setText("Painting completed!");
        else if (completion === 0) this.completion.setText("");
        else this.completion.setText((completion * 100).floor() + "% complete");
    }

    heightMultipliers = [1, 3 / 4, 4 / 3, 1, 1];

    update(time, delta) {
        if (paused) return;

        saveData.saveProfile.totalPlayTime += delta / 1000;

        this.moneyCounter.setValue(saveData.saveProfile.money);
        this.shop.update(time, delta);
        this.antCounter.update(time, delta);
        this.mailButton.update(time, delta);
        this.studioButton.update(time, delta);
        if (this.adOffer !== undefined) this.adOffer.update(time, delta);
        if (this.studioSelect !== undefined) this.studioSelect.update(time, delta);
        let max = saveData.saveProfile.studio.maxWidth / 10;
        this.maxSize.setText("(max " + max + "cm x " + (max * this.heightMultipliers[saveData.saveProfile.currentStudioId % 5]).round(0.1).toFixed(1) + "cm)");
        if (saveData.saveProfile.achievementsUnlocked) {
            achievements.checkAchievements(this);
        }
        this.achievementDelay -= delta / 1000;
        this.mailCheckDelay -= delta / 1000;

        if (this.mailCheckDelay < 0) {
            if (saveData.saveProfile.commissionsUnlocked) {
                for (let i = 0; i < 50; i++) {
                    if (saveData.saveProfile.commissionsComplete[i] === 0) {
                        if (saveData.saveProfile.totalAntCount >= commissions.commissions[i].antCountRequirement) {
                            if (!this.mailQueue.exists(x => x.id === i)) {
                                if (!this.paymentMailQueue.exists(x => x.id === i)) {
                                    if (!saveData.saveProfile.studios.exists(x => x.currentCommission === i)) {
                                        this.mailQueue.push(commissions.commissions[i]);
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.mailQueue.length === 0) {
                    if (saveData.saveProfile.achievementUnlocks.count(x => x) >= 100) {
                        this.mailQueue.push("final");
                    }
                }
            }
            this.mailCheckDelay = 5;
        }

        this.saveTimer -= delta / 1000;
        if (this.saveTimer < 0) {
            this.saveTimer = 10;
            saveData.save();
        }


        if (this.topTutorial !== undefined && !this.closingTutorial) {
            if (this.tutorialProgress < 0) {
                if (this.topTutorial.isOpen) {
                    this.topTutorial.close();
                    doAfterDelay(0.5, () => this.topTutorial.destroy());
                } else {
                    this.topTutorial.destroy();
                }
                this.size.scale = 1;
                this.maxSize.scale = 1;
                this.closingTutorial = true;
            } else if (this.topTutorial.progress < this.tutorialProgress) {
                this.topTutorial.progress++;
                if (this.topTutorial.isOpen) {
                    this.topTutorial.close();
                    doAfterDelay(0.5, () => this.topTutorial.open());
                } else {
                    this.topTutorial.open();
                }
            }
        }


        if (this.listingCount !== this.currentListings.length && this.tutorialProgress !== 0 && this.tutorialProgress !== 1) {
            this.listingCount = this.currentListings.length;
            // this.placeholders.forEach(placeholder => placeholder.destroy());
            // this.placeholders = [];
            for (var i = 0; i < this.listingCount; i++) {
                if (this.placeholders[i]) {
                    this.placeholders[i].destroy();
                    this.placeholders[i] = undefined;
                }
            }
            for (var i = this.listingCount; i < saveData.saveProfile.maxListings; i++) {
                if (this.placeholders[i]) continue;
                var placeholder = new Placeholder(this, i);
                placeholder.y = i * 164 + 97;
                this.placeholders[i] = placeholder;
            }
        }

        if (this.timeUntilNextAd > 0) {
            this.timeUntilNextAd -= delta / 1000;
        } else {
            this.timeUntilNextAd = 120;
            this.adOffer = new AdOffer(this);
        }


    }

    closingTutorial;
    achievementDelay = 0;

    showAchievementNotification(achievement) {
        if (this.achievementDelay > 0) {
            doAfterDelay(this.achievementDelay, () => new AchievementNotification(this, achievement));
        } else {
            new AchievementNotification(this, achievement);
        }

        this.achievementDelay += 5.5;
    }

    openStudioSelect() {
        sfx.click.play();
        this.studioSelect = new StudioSelect(this);
    }

    openMail() {
        sfx.click.play();
        //var mailCount = this.paymentMailQueue.length + this.mailQueue.length;

        if (this.mailQueue.length > 0 && this.mailQueue[0] === "final") {
            new FinalLetter(this);
            return;
        }

        if (this.paymentMailQueue.length > 0) {
            this.letter = new PaymentLetter(this, this.paymentMailQueue[0]);
        } else if (this.mailQueue.length > 0) {
            this.letter = new Letter(this, this.mailQueue[0]);
        }
    }

    openStats() {
        sfx.click.play();
        print("open stats");
        new StatsMenu(this);
    }

    skip() {
        sfx.click.play();
        if (!this.main.changingCanvas) {
            saveData.saveProfile.studio.percentageComplete = 0;
            saveData.saveProfile.studio.paintingId++;
            this.main.ants.forEach(ant => {
                ant.state = ant.states.idle;
                ant.moving = false;
                ant.headingToFirstPaint = true;
                ant.done = true;
            });
            this.main.newCanvas(true);
        }
        print("skip");
    }
}

class AchievementNotification extends Container {

    shadow;
    background;
    icon;
    iconBackground;
    yellow = new Color(250, 230, 110);
    gold = new Color(192, 160, 0);
    newAchievementText;
    achievementNameText;
    achievement;

    constructor(scene, achievement) {
        super(scene, 960, 100);

        this.achievement = achievement;

        this.shadow = scene.addNineSliceUi(415, 74, "rounded-shadow", 32);
        this.addChild(this.shadow, 5, 5);

        this.background = scene.addNineSliceUi(415, 74, "rounded", 32);
        this.addChild(this.background, 0, 0);

        this.iconBackground = scene.addImageUi(60, 60, "circle");
        this.iconBackground.tint = getColour(this.yellow);
        this.addChild(this.iconBackground, -170, 0);

        this.icon = scene.addImageUi(40, 40, "trophy");
        this.icon.tint = getColour(this.gold);
        this.addChild(this.icon, -170, 2);

        this.newAchievementText = scene.addText(0, 0, "New achievement!", bold30);
        this.addChild(this.newAchievementText, 30, 0);

        this.achievementNameText = scene.addText(0, 0, achievement.name, bold30);
        this.achievementNameText.fitInWidth(300);
        this.achievementNameText.alpha = 0;
        this.addChild(this.achievementNameText, 30, 30);

        animateEaseOutBack(0.5, f => this.y = f.lerp(-100, 100), () => doAfterDelay(2, () => {
            animateEaseInOut(0.5, f => {
                this.newAchievementText.y = f.lerp(100, 70);
                this.achievementNameText.y = f.lerp(130, 100);
                this.newAchievementText.alpha = f.lerp(1, 0);
                this.achievementNameText.alpha = f.lerp(0, 1);
            }, () => doAfterDelay(2, () => {
                animateEaseIn(0.5, f => {
                    this.y = f.lerp(100, -100);
                    this.achievementNameText.y = f.lerp(100, -100);
                }, () => this.destroy());
            }))
        }));

        this.scale = 1.25;

        sfx.achievement.play();
        sfx.applauseQuiet.play();
    }
}

class StudioButton extends Container {

    text;
    background;
    shadow;
    icon;
    showing = false;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.shadow = scene.addImageUi(124, 144, "shadow");
        this.addChild(this.shadow, 8, 8);

        this.background = scene.addImageUi(124, 144, "square");
        this.background.setInteractive({cursor: "pointer"});
        this.background.on("pointerdown", () => scene.openStudioSelect());
        this.addChild(this.background, 0, 0);

        this.icon = scene.addImageUi(85, 85, "home");
        this.addChild(this.icon, 0, -16);

        this.text = scene.addText(0, 0, "Studios", normal26);
        this.addChild(this.text, 0, 48);

        if (saveData.saveProfile.multipleStudiosUnlocked) {
            this.showing = true;
        } else {
            this.scale = 0;
        }
    }

    update() {
        if (saveData.saveProfile.multipleStudiosUnlocked && !this.showing) {
            this.showing = true;
            animateEaseOutBack(0.5, f => this.scale = f);
        }
    }

}

class MailButton extends Container {

    text;
    background;
    shadow;
    icon;
    notificationBg;
    notificationText;
    red = new Color(255, 26, 26);
    green = new Color(33, 227, 0);
    showing = false;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.shadow = scene.addImageUi(124, 144, "shadow");
        this.addChild(this.shadow, 8, 8);

        this.background = scene.addImageUi(124, 144, "square");
        this.background.setInteractive({cursor: "pointer"});
        this.background.on("pointerdown", () => scene.openMail());
        this.addChild(this.background, 0, 0);

        this.icon = scene.addImageUi(97, 97, "mail");
        this.addChild(this.icon, 0, -16);

        this.text = scene.addText(0, 0, "Mail", normal26);
        this.addChild(this.text, 0, 48);

        this.notificationBg = scene.addImageUi(38, 38, "circle128");
        this.notificationBg.setColour(scene.paymentMailQueue.length > 0 ? this.green : this.red);
        this.addChild(this.notificationBg, 64, -68);

        this.notificationText = scene.addText(0, 0, "9", bold26);
        this.notificationText.setColour(new Color(255, 255, 255));
        this.addChild(this.notificationText, 64, -68);

        if (saveData.saveProfile.commissionsUnlocked) {
            this.showing = true;
        } else {
            this.scale = 0;
        }
    }

    update(time, delta) {
        var mailCount = this.scene.paymentMailQueue.length + this.scene.mailQueue.length;
        this.notificationBg.setColour(this.scene.paymentMailQueue.length > 0 ? this.green : this.red);
        this.notificationBg.scale = mailCount > 0 ? 0.3 : 0;
        this.notificationText.scale = mailCount > 0 ? 1 : 0;
        this.notificationText.setText(mailCount);


        if (saveData.saveProfile.commissionsUnlocked && !this.showing) {
            this.showing = true;
            animateEaseOutBack(0.5, f => this.scale = f);
        }
    }


}

class MoneyCounter extends Container {

    text;
    background;
    shadow;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.shadow = scene.add.nineslice(0, 0, 402, 150, 'rounded-shadow', 32);
        this.shadow.setOrigin(0.5, 0.5);
        this.addChild(this.shadow, 10, 10);

        this.background = scene.addNineSliceUi(402, 150, "rounded", 32);
        this.addChild(this.background, 0, 0);

        this.text = scene.addText(0, 0, "$0", bold96);
        this.addChild(this.text);
        this.scale = 0;
        doAfterDelay(1, () => animateEaseOutBack(0.5, f => this.scale = f));
    }

    setValue(value) {
        this.text.setText(formattedMoney(value));
    }
}

class AchievementButton extends Container {
    background;
    icon;
    completeText;
    totalText;
    showing = false;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.background = this.scene.addImageUi(108, 108, "circle");
        this.background.tint = getColour(new Color(250, 230, 110));
        this.background.setInteractive({cursor: 'pointer'});
        this.background.on("pointerdown", () => this.openMenu());
        this.addChild(this.background, 0, -24);

        this.icon = this.scene.addImageUi(73, 73, "trophy");
        this.icon.tint = getColour(new Color(192, 159, 0));
        this.addChild(this.icon, 0, -24);

        this.completeText = this.scene.addText(0, 0, "0", bold48);
        this.completeText.style.textAlign = "right";
        this.completeText.updateText();
        this.completeText.setOrigin(1, 0.5);
        this.completeText.setInteractive({cursor: 'pointer'});
        this.completeText.on("pointerdown", () => this.openMenu());
        this.addChild(this.completeText, -1, 62);

        this.totalText = this.scene.addText(0, 0, "/100", normal26);
        this.totalText.style.textAlign = "left";
        this.totalText.updateText();
        this.totalText.setOrigin(0, 0.5);
        this.totalText.setInteractive({cursor: 'pointer'});
        this.totalText.on("pointerdown", () => this.openMenu());
        this.addChild(this.totalText, 0, 69);

        if (saveData.saveProfile.achievementsUnlocked) {
            this.showing = true;
        } else {
            this.scale = 0;
        }

        this.update();
    }

    update() {
        this.completeText.setText(achievements.completeCount());
        if (saveData.saveProfile.achievementsUnlocked && !this.showing) {
            this.showing = true;
            animateEaseOutBack(0.5, f => this.scale = f);
        }
    }

    openMenu() {
        sfx.click.play();
        this.scene.achievementMenu = new AchievementMenu(this.scene);
    }
}

class SkipButton extends Container {

    background;
    shadow;
    icon;
    showing = false;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.shadow = scene.addImageUi(124, 104, "shadow");
        this.addChild(this.shadow, 8, 8);

        this.background = scene.addImageUi(124, 104, "square");
        this.background.setInteractive({cursor: "pointer"});
        this.background.on("pointerdown", () => scene.skip());
        this.addChild(this.background, 0, 0);

        this.icon = scene.addImageUi(97, 75, "skip");
        this.addChild(this.icon, 0, 0);

        if (saveData.saveProfile.skipPainting) {
            this.showing = true;
        } else {
            this.scale = 0;
        }
    }

    update() {
        if (saveData.saveProfile.skipPainting && !this.showing) {
            this.showing = true;
            animateEaseOutBack(0.5, f => this.scale = f);
        }
    }

}

class MuteButton extends Container {
    icon;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.icon = scene.addImageUi(60, 47, game.sound.mute ? "sound-off" : "sound-on");
        this.icon.setInteractive({cursor: 'pointer'});
        this.icon.on("pointerdown", () => this.toggle());
        this.addChild(this.icon, 0, 0);
    }

    toggle() {
        saveData.saveProfile.mute = !saveData.saveProfile.mute;
        game.sound.mute = saveData.saveProfile.mute;
        this.icon.setTexture(saveData.saveProfile.mute ? "sound-off" : "sound-on");
    }

}

class LoadingImagesMessage extends Container {

    darkBG;
    background;
    title;
    text;
    bottomText;
    uiScene;
    mainScene;
    action;

    closing = false;
    open = false;

    constructor(scene, studio1, action) {
        super(scene, 960, 540);


        this.uiScene = scene.ui;
        this.mainScene = scene;
        this.action = action;

        this.mainScene.paused = true;

        this.darkBG = this.uiScene.addImageUi(1920, 4080, "square");
        this.darkBG.setInteractive();
        this.darkBG.depth = -20;
        this.darkBG.setColour(new Color(0, 0, 0, 0));
        this.addChild(this.darkBG, 0, 0);

        this.background = this.uiScene.addImageUi(592, 447, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, 12);

        this.title = this.uiScene.addText(0, 0, "Hold on...", normal48);
        this.addChild(this.title, 0, -155);

        var message = "We just need to load a few\nmore things before the game\ncan continue. Normal service\nwill resume shortly";
        this.text = this.uiScene.addText(0, 0, message, normal38);
        this.addChild(this.text, 0, 5);

        var bottomMessage = "If this message doesn't disappear after a few seconds,\ntry refreshing the page (your progress is saved)";
        this.bottomText = this.uiScene.addText(0, 0, bottomMessage, normal22);
        this.bottomText.setColour(new Color(127, 127, 127));
        this.addChild(this.bottomText, 0, 163);

        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f * 0.5;
        }, () => this.open = true);

        this.depth = 2500;

        if (studio1) {
            doWhen(() => studio0colourLoaded === true, () => this.close());
        } else {
            doWhen(() => otherStudiosLoaded === true, () => this.close());
        }

    }

    close() {

        if (this.closing) return;
        this.closing = true;

        console.log("closing");

        if (this.action === "init") {
            this.mainScene.initGame();
        }

        paused = false;

        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 0.5 - f * 0.5;
        }, () => this.destroy());
    }

}
