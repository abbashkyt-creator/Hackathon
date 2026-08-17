class Sold extends Container {
    soldText;
    priceText;
    background;
    shadow;
    painting;

    paintingSizes = [
        {width: 378, height: 378},
        {width: 378, height: 284},
        {width: 284, height: 378},
        {width: 378, height: 378},
        {width: 378, height: 378}
    ]

    constructor(scene, listing, recycled) {
        super(scene, 960, 540);

        this.shadow = scene.add.image(0, 0, "shadow");
        this.shadow.displayWidth = 422;
        this.shadow.displayHeight = 630;
        this.addChild(this.shadow, 10, 10);

        this.background = scene.add.image(0, 0, "square");
        this.background.displayWidth = 422;
        this.background.displayHeight = 630;
        this.background.setInteractive();
        this.background.on("pointerdown", () => this.close(0.2));
        this.addChild(this.background, 0, 0);

        const paintingSize = this.paintingSizes[listing.studioId % 5];
        this.painting = listing.removeChild(listing.painting);
        this.painting.displayWidth = paintingSize.width;
        this.painting.displayHeight = paintingSize.height;
        this.painting.setDepth(1);
        this.addChild(this.painting, 0, -16)

        //print("Painting sold in studio " + (listing.studioId));
        if (listing.studioId % 5 === 3) {
            this.paintingMask = scene.addImageUi(378, 378, "circle-stencil");
            this.paintingMask.setDepth(1);
            this.addChild(this.paintingMask, 0, -16)
        }
        if (listing.studioId % 5 === 4) {
            this.paintingMask = scene.addImageUi(378, 378, "hexagon-stencil");
            this.paintingMask.setDepth(1);
            this.addChild(this.paintingMask, 0, -16)
        }

        this.soldText = scene.addText(0, 0, recycled ? "Recycled!" : "Sold!", normal48);
        this.addChild(this.soldText, 0, -262);

        this.priceText = scene.addText(0, 0, formattedMoney(listing.price), bold80);
        this.addChild(this.priceText, 0, 240);

        this.scale = 0;
        animateEaseOutBack(0.5, f => this.scale = f);

        this.depth = 2;

        sfx.cashMoney.play();
        scene.confetti();

        if (scene.tutorialProgress === 2) {
            scene.tutorialProgress = 3;
        }

        doAfterDelay(3, () => this.close(0.5));
    }

    close(duration) {
        animateEaseIn(duration, f => this.scale = 1 - f, () => {
            this.destroy()
        });
    }


}