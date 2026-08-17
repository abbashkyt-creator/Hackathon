class StudioSelect extends Container {

    background;
    vignette;
    buttons = [];
    i = 0;
    loadAll = false;
    containerX = 0;
    targetContainerX = 0;
    startMouseX = 0;
    startContainerX = 0;
    dragging = false;
    currentVelocity = {value: 0};
    readyToClick = true;
    statsButton;

    constructor(scene) {
        super(scene, 960, 540);
        this.background = scene.add.tileSprite(960, 540, 1920, 1080, 'ss-bg');
        this.background.setInteractive();
        animate(0.1, f => this.background.alpha = f);
        this.addChild(this.background, 0, 0);

        this.vignette = scene.addImageUi(1920, 1080, "vignette");
        this.addChild(this.vignette, 0, 0);

        // this.addButton();
        // this.addButton();
        // this.addButton();
        // this.addButton();
        // this.addButton();
        // this.addButton();
        // this.addButton();
        // this.addButton();
        // this.addButton();
        // this.addButton();

        for (let i = 0; i < (saveData.saveProfile.studios.length + 1).min(10); i++) {
            this.addButton();
        }

        doAfterDelay(0.1, () => this.loadAll = true);

        scene.input.on("pointerdown", pointer => {
            this.dragging = true;
            this.startMouseX = pointer.x;
            this.startContainerX = this.containerX;
            this.readyToClick = true;
        });
        scene.input.on("pointerup", () => this.dragging = false);
        scene.input.on("pointermove", pointer => {
            if (this.dragging) {
                this.containerX = this.startContainerX + pointer.x - this.startMouseX;
                if ((pointer.x - this.startMouseX).abs() > 100) this.readyToClick = false;
            }
        });

        this.containerX = -500 * saveData.saveProfile.currentStudioId;

        if (saveData.saveProfile.statsUnlocked) {
            this.statsButton = new StatsButton(this.scene);
            this.addChild(this.statsButton, 870, -440);
        }

        this.depth = 20;

        this.buttons.forEach(button => {
            button.depth = 25;
            if (button.progressRing !== undefined) button.progressRing.depth = 30;
        });

        if (saveData.saveProfile.statsUnlocked) this.statsButton.depth = 50;
        this.vignette.depth = 40;
    }

    addButton() {
        let button = new StudioSelectButton(this.scene, this.i);
        this.buttons.push(button);
        this.addChild(button, this.i * 500, 0);
        this.i++;
    }

    update(time, delta) {

        print("buttons: " + this.buttons.length + ", studios: " + saveData.saveProfile.studios.length);
        if (this.buttons.length < (saveData.saveProfile.studios.length + 1).min(10)) {
            this.addButton();
            this.buttons.forEach(button => {
                button.depth = 25;
                if (button.progressRing !== undefined) button.progressRing.depth = 30;
            });
        }

        var minScroll = (this.buttons.length - 1) * -500;


        this.targetContainerX = this.containerX.round(500).clamp(minScroll, 0);

        if (!this.dragging) {
            this.containerX = smoothDamp(this.containerX, this.targetContainerX, this.currentVelocity, 0.1, 999, delta / 1000)
        }

        this.containerX = this.containerX.clamp(minScroll, 0);

        this.buttons.forEach((button, i) => {
            button.update(time, delta);
            button.x = 960 + i * 500 + this.containerX;
        });
    }


}

class StudioSelectButton extends Container {

    background;
    titleNameText;
    titleNumberText;
    titleNumberCircle;
    priceText;
    reputationText;
    antCountText;
    progressRing;
    ant;
    id = 0;
    closing = false;
    colours = [
        new Color(255, 81, 81),
        new Color(66, 235, 51),
        new Color(82, 135, 255),
        new Color(255, 82, 237),
        new Color(255, 176, 82),
        new Color(66, 230, 222),
        new Color(219, 214, 25),
        new Color(158, 158, 158),
        new Color(204, 168, 128),
        new Color(191, 54, 255)
    ];
    green = new Color(123, 197, 87);
    red = new Color(209, 65, 54);
    price;
    reputationRequired;

    paintingCommissionBg;
    paintingCommissionTriangle;
    paintingCommissionText;

    tooExpensiveGradient = new Gradient([
        {value: 0, colour: new Color(255, 255, 255)},
        {value: 0.285, colour: new Color(255, 199, 199)},
        {value: 1, colour: new Color(255, 255, 255)},
    ]);

    uiLayouts = [
        {
            background: {texture: "square", width: 300, height: 300},
            titleNameText: {x: -38, y: -89, scale: 1},
            titleNumberText: {x: 95, y: -89, scale: 1},
            titleNumberCircle: {x: 95, y: -89, width: 72, height: 72},
            ant: {x: -84, y: 32, width: 100, height: 68},
            antCountText: {x: -84, y: 97, scale: 1},
            progressRing: {x: 53, y: 50, scale: 1}
        },
        {
            background: {texture: "square", width: 300, height: 225},
            titleNameText: {x: -33, y: -69, scale: 0.85},
            titleNumberText: {x: 80, y: -69, scale: 0.85},
            titleNumberCircle: {x: 80, y: -69, width: 62, height: 62},
            ant: {x: -74, y: 22, width: 71, height: 52},
            antCountText: {x: -74, y: 82, scale: 0.76},
            progressRing: {x: 50, y: 35, scale: 0.76}
        },
        {
            background: {texture: "square", width: 225, height: 300},
            titleNameText: {x: -28, y: -84, scale: 0.69},
            titleNumberText: {x: 70, y: -84, scale: 0.69},
            titleNumberCircle: {x: 70, y: -84, width: 50, height: 50},
            ant: {x: -64, y: 27, width: 74, height: 50},
            antCountText: {x: -64, y: 92, scale: 0.74},
            progressRing: {x: 43, y: 45, scale: 0.74}
        },
        {
            background: {texture: "circle", width: 300, height: 300},
            titleNameText: {x: -35, y: -79, scale: 0.8},
            titleNumberText: {x: 72, y: -79, scale: 0.8},
            titleNumberCircle: {x: 72, y: -79, width: 58, height: 58},
            ant: {x: -74, y: 22, width: 82, height: 56},
            antCountText: {x: -74, y: 87, scale: 0.82},
            progressRing: {x: 43, y: 40, scale: 0.82}
        },
        {
            background: {texture: "hexagon", width: 300, height: 300},
            titleNameText: {x: -30, y: -69, scale: 0.74},
            titleNumberText: {x: 67, y: -69, scale: 0.74},
            titleNumberCircle: {x: 67, y: -69, width: 53, height: 53},
            ant: {x: -64, y: 22, width: 75, height: 51},
            antCountText: {x: -64, y: 87, scale: 0.75},
            progressRing: {x: 43, y: 40, scale: 0.75}
        }
    ];

    get owned() {
        return saveData.saveProfile.studios.length > this.id;
    }

    constructor(scene, id) {
        super(scene, 0, 0);

        this.id = id;


        this.price = id * id * 1000000;

        this.reputationRequired = id < 5 ? 0 : (id - 1) * 5;

        var ui = this.uiLayouts[id % 5];

        this.background = scene.addImageUi(ui.background.width, ui.background.height, ui.background.texture);
        this.background.setInteractive({cursor: "pointer"});
        this.background.on("pointerup", () => this.click());
        this.addChild(this.background, 0, 0);

        this.titleNameText = scene.addText(0, 0, "Studio", normal60);
        this.titleNameText.scale = ui.titleNameText.scale;
        this.addChild(this.titleNameText, ui.titleNameText.x, ui.titleNameText.y);

        this.titleNumberText = scene.addText(0, 0, id + 1, bold60);
        this.titleNumberText.setColour(this.colours[id]);
        this.titleNumberText.scale = ui.titleNumberText.scale;
        if (id === 9) this.titleNumberText.scale *= 0.8;
        this.addChild(this.titleNumberText, ui.titleNumberText.x, ui.titleNumberText.y);

        this.titleNumberCircle = scene.addImageUi(ui.titleNumberCircle.width, ui.titleNumberCircle.height, "ring");
        this.titleNumberCircle.setColour(this.colours[id]);
        this.addChild(this.titleNumberCircle, ui.titleNumberCircle.x, ui.titleNumberCircle.y);

        if (this.owned) {
            this.showOwned(scene, ui);
        } else {
            this.showNotOwned(scene, ui);
        }

        if (this.owned && saveData.saveProfile.studios[id].currentCommission > -1) {
            this.paintingCommissionBg = scene.addImageUi(244, 58, "square");
            this.addChild(this.paintingCommissionBg, 0, -230);

            this.paintingCommissionTriangle = scene.addImageUi(20, 20, "triangle");
            this.paintingCommissionTriangle.angle = 270;
            this.addChild(this.paintingCommissionTriangle, 0, -195);

            this.paintingCommissionText = scene.addText(0, 0, "Painting commission", normal22);
            this.addChild(this.paintingCommissionText, 0, -230);

            //this.animatePaintingCommission();
        }

        this.scale *= 1.5;

        animate(0.1, f =>
            this.children.forEach(child => {
                child.gameObject.alpha = f;
            }));

    }

    // animatePaintingCommission() {
    //     animateEaseThereAndBack(1, f => {
    //         this.paintingCommissionBg.y = f.lerp(-200, 230);
    //         print("y: " + this.paintingCommissionBg.y);
    //     }, () => this.animatePaintingCommission());
    // }

    get canAfford() {
        return saveData.saveProfile.money >= this.price;
    }

    get enoughReputation() {
        return saveData.saveProfile.reputation >= this.reputationRequired;
    }

    showNotOwned(scene, ui) {
        this.priceText = scene.addText(0, 0, formattedMoneyNoDecimals(this.price), bold70);
        this.priceText.setColour(this.canAfford ? this.green : this.red);
        this.addChild(this.priceText, 0, 20);

        if (this.reputationRequired > 0) {
            this.reputationText = scene.addText(0, 0, "(Level " + this.reputationRequired + " reputation required)", normal16);
            this.reputationText.setColour(this.enoughReputation ? this.green : this.red);
            this.addChild(this.reputationText, 0, 70);
        }
    }

    showOwned(scene, ui) {
        this.ant = scene.addImageUi(ui.ant.width, ui.ant.height, "ant-big");
        this.ant.angle = -90;
        this.addChild(this.ant, ui.ant.x, ui.ant.y);

        this.antCountText = scene.addText(0, 0, saveData.saveProfile.studios[this.id].totalAntCount, bold26);
        this.antCountText.scale = ui.antCountText.scale;
        this.addChild(this.antCountText, ui.antCountText.x, ui.antCountText.y);

        this.progressRing = new ProgressRing(this.scene, this.id, ui.progressRing.scale);
        this.addChild(this.progressRing, ui.progressRing.x, ui.progressRing.y);
        this.progressRing.setValue(30, 100);
    }

    click() {
        if (!this.scene.studioSelect.readyToClick) {
            print("dragged too much to click");
            return;
        }

        if (!this.owned) {
            if (this.canAfford && this.enoughReputation) {
                this.priceText.destroy();
                if (this.reputationText !== undefined) this.reputationText.destroy();
                saveData.saveProfile.studios.push(new Studio());
                this.showOwned(this.scene, this.uiLayouts[this.id % 5]);
                this.ant.depth = 26;
                this.antCountText.depth = 26;
                this.progressRing.depth = 26;
                saveData.saveProfile.money -= this.price;
            } else {
                animate(0.5, f => this.background.tint = getColour(this.tooExpensiveGradient.evaluate(f)));
            }
            return;
        }

        if (this.id !== saveData.saveProfile.currentStudioId) {
            saveData.saveProfile.currentStudioId = this.id;
            this.scene.main.changingScene = true;
            this.scene.main.scene.start("main");
            this.scene.main.canvas = undefined;
            this.scene.shop.reset();
        }


        animate(0.1, f => {
            this.scene.studioSelect.children.forEach(child => {
                child.gameObject.alpha = 1 - f;
            })
            this.scene.studioSelect.buttons.forEach(button => {
                button.children.forEach(child => {
                    child.gameObject.alpha = 1 - f;
                });
                button.progressRing.children.forEach(child => {
                    child.gameObject.alpha = 1 - f;
                });
            })
        }, () => {
            this.scene.studioSelect.destroy();
            this.scene.studioSelect = undefined;
        });

    }

    update(time, delta) {
        // if (this.closing) {
        //     print("closing so not updating");
        //     return;
        // }
        if (this.owned) {
            if (this.id === saveData.saveProfile.currentStudioId) {
                this.progressRing.setValue(this.scene.main.getCompletion() * 100, 100);
            } else {
                this.progressRing.setValue(saveData.saveProfile.studios[this.id].percentageComplete * 100, 100);
            }
            this.progressRing.update(time, delta);
        }

        var distanceFromCentreOfScreen = (this.x - 960).abs();
        this.scale = distanceFromCentreOfScreen.inverseLerpClamped(100, 0).lerpClamped(1.5, 1.6);
        if (this.owned) this.progressRing.scale = this.scale;

    }

}

class ProgressRing extends Container {

    leftSide;
    rightSide;
    cover;
    text;
    fillColour;
    backgroundColour;
    id;
    centre;
    i = 0;
    target = 0;
    closing = false;

    constructor(scene, id, scale) {
        super(scene, 0, 0);
        this.id = id;

        this.fillColour = getColour(new Color(0, 0, 0));
        this.backgroundColour = getColour(new Color(235, 235, 235));

        this.leftSide = scene.addImageUi(80 * scale, 160 * scale, "semicircle-big");
        this.leftSide.tint = this.backgroundColour;
        this.addChild(this.leftSide, -37 * scale, 0);

        this.rightSide = scene.addImageUi(80 * scale, 160 * scale, "semicircle-big");
        this.rightSide.tint = this.fillColour;
        this.rightSide.angle = 180;
        this.addChild(this.rightSide, 37 * scale, 0);

        this.cover = scene.addImageUi(81 * scale, 162 * scale, "semicircle-big");
        this.cover.tint = this.backgroundColour;
        this.cover.setOrigin(0.96, 0.5);
        this.cover.angle = 180;
        this.addChild(this.cover, 0, 0);

        this.centre = scene.addImageUi(138 * scale, 138 * scale, "circle128");
        this.addChild(this.centre, 0, 0);

        this.text = scene.addText(0, 0, "34%", bold48);
        this.text.scale = scale;
        this.addChild(this.text, 0, 0);

        this.scale = 1.5;

        animate(0.1, f =>
            this.children.forEach(child => {
                child.gameObject.alpha = f;
            }));
    }

    setValue(value, total) {
        this.target = value / total;
    }

    currentVelocity = {value: 0};

    update(time, delta) {
        if (this.closing) return;
        if (this.target > this.i) {
            this.i = smoothDamp(this.i, this.target, this.currentVelocity, 0.1, 999, delta / 1000);
        } else {
            this.i = this.target;
        }
        var extra = this.i > 0.5 ? 0 : 180;
        this.cover.angle = this.i.lerp(extra, 360 + extra);
        this.cover.tint = this.i > 0.5 ? this.fillColour : this.backgroundColour;
        this.text.setText((this.i * 100).round() + "%");
    }


}

class StatsButton extends Container {

    text;
    background;
    shadow;
    icon;

    constructor(scene) {
        super(scene, 0, 0);


        this.shadow = scene.addImageUi(137, 161, "shadow");
        this.addChild(this.shadow, 8, 8);

        this.background = scene.addImageUi(137, 161, "square");
        this.background.setInteractive({cursor: "pointer"});
        this.background.on("pointerdown", () => scene.openStats());
        this.addChild(this.background, 0, 0);

        this.icon = scene.addImageUi(97, 97, "stats");
        this.addChild(this.icon, 0, -18);

        this.text = scene.addText(0, 0, "Stats", normal30);
        this.addChild(this.text, 0, 49);
    }

}