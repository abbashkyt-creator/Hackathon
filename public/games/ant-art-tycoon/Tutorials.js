class Tutorial1 extends Container {

    scene;

    constructor(scene) {
        super(scene, 960, 540);

        this.scene = scene;

        var background = scene.addNineSliceUi(837, 529, "rounded", 32);
        background.setInteractive({cursor: "pointer"});
        background.on("pointerdown", () => this.close());
        this.addChild(background, 0, 0);


        var ant = scene.addImageUi(148, 101, "Black Ant Big");
        ant.angle = -100;
        this.addChild(ant, -260, -95);

        ant = scene.addImageUi(148, 101, "Black Ant Big");
        ant.angle = -95;
        this.addChild(ant, -130, -95);

        ant = scene.addImageUi(148, 101, "Black Ant Big");
        ant.angle = -90;
        this.addChild(ant, -0, -95);

        ant = scene.addImageUi(148, 101, "Black Ant Big");
        ant.angle = -85;
        this.addChild(ant, 130, -95);

        ant = scene.addImageUi(148, 101, "Black Ant Big");
        ant.angle = -80;
        this.addChild(ant, 260, -95);


        var text = scene.addText(0, 0, "You are an art dealer with nothing to\nyour name but 5 highly-trained ants", normal40);
        this.addChild(text, 0, 103);

        var callToAction = mobile ? "Tap to continue" : "Click to continue";

        var clickToContinue = scene.addText(0, 0, callToAction, bold45);
        clickToContinue.setColour(new Color(219, 219, 219));
        this.addChild(clickToContinue, 0, 200);


        animateEaseOutBack(0.5, f => this.scale = f);

    }

    close() {
        animateEaseIn(0.5, f => this.scale = 1 - f, () => {
            this.scene.tutorialProgress = 1;
            this.destroy();
            doAfterDelay(2, () => this.scene.topTutorial = new TopTutorial(this.scene));
        });
    }
}

class TopTutorial extends Container {

    scene;
    isOpen = false;
    messages = [
        "",
        "Look at them go! They are creating\ntheir very first painting",
        "Truly a masterpiece! Let's put it up for sale!\nSet the sale price by using the + and - buttons",
        "Congratulations on your first sale! Now let's put\nthat money to good use by buying more ants"
    ];
    progress = 1;
    text;

    constructor(scene) {
        super(scene, 960, 136);

        this.scene = scene;

        var background = scene.addNineSliceUi(837, 224, "rounded", 32);
        background.setInteractive({cursor: "pointer"});
        background.on("pointerdown", () => this.close());
        this.addChild(background, 0, 0);


        this.text = scene.addText(0, 0, this.messages[this.progress], normal38);
        this.addChild(this.text, 0, -25);

        var callToAction = mobile ? "Tap to continue" : "Click to continue";

        var clickToContinue = scene.addText(0, 0, callToAction, bold45);
        clickToContinue.setColour(new Color(219, 219, 219));
        this.addChild(clickToContinue, 0, 64);

        this.open();
    }

    open() {
        this.isOpen = true;
        this.text.setText(this.messages[this.progress]);
        //this.text.fitInWidth(800);
        animateEaseOutBack(0.5, f => this.scale = f);
    }


    close() {
        animateEaseIn(0.5, f => this.scale = 1 - f, () => {
            if (this.scene.tutorialProgress > 2) {
                this.destroy();
            }
            this.isOpen = false;
        });
    }
}