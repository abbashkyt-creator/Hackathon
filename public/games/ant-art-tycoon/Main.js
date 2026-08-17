class Main extends Phaser.Scene {
    constructor() {
        super({key: 'main'})
    }

    preload() {


    }

    paintingCounts = [
        {black: 17, colour: 151},
        {black: 14, colour: 102},
        {black: 10, colour: 110},
        {black: 0, colour: 154},
        {black: 0, colour: 155}
    ];

    houseLocation = {x: 860, y: 640};
    targetCamSize = 300;
    stamps = [];
    stampsHalfRes = [];
    stampsFifthRes = [];
    canvas;
    currentPixels = [];
    currentColours = [];
    ants = [];
    paints = [];
    listings = [];
    colourFidelity = 51;
    antSpeed = 4;
    pictureSize;
    ui;
    started = false;

    roundedColour(input) {
        let fidelity = this.colourFidelity;
        return new Phaser.Display.Color(input.r.round(fidelity), input.g.round(fidelity), input.b.round(fidelity), input.a);
    }

    getNewImage() {

        if (saveData.saveProfile.studio.coloursEnabled && !studio0colourLoaded || saveData.saveProfile.studios.length > 1 && !otherStudiosLoaded) {
            this.ui.restartMainScene();
            return;
        }

        var imageInfo = saveData.saveProfile.studio.getNewImage(this);
        saveData.saveProfile.studio.currentTexture = imageInfo.texture;
        saveData.saveProfile.studio.currentTextureName = imageInfo.textureName;

        let texture = imageInfo.texture;
        let textureName = imageInfo.textureName;

        this.pictureSize = {width: texture.source.width, height: texture.source.height};

        var pixelInfo = this.getPixelInfo(this.pictureSize, textureName);

        this.currentPixels = pixelInfo.currentPixels;
        this.currentColours = pixelInfo.currentColours;
        this.houseLocation.x = 960 - this.pictureSize.width * 5 - 100;
        this.houseLocation.y = 540 + this.pictureSize.height * 5 + 100;

    }

    getPixelInfo(pictureSize, textureName) {
        var currentPixels = [];
        var currentColours = [];
        for (var x = 0; x < pictureSize.width; x++) {
            for (var y = 0; y < pictureSize.height; y++) {
                if (this.isCircleStudio && distance(x + 0.5, y + 0.5, pictureSize.width / 2, pictureSize.height / 2) > pictureSize.width / 2) continue;
                if (this.isHexagonStudio) {
                    var normalisedPosition = new Vector2((x + 0.5) / pictureSize.width - 0.5, (y + 0.5) / pictureSize.height - 0.5);
                    if (2 * (normalisedPosition.x.abs() - 0.25) > 0.5 - normalisedPosition.y.abs()) continue;
                }
                let col = this.textures.getPixel(x, y, textureName);
                if (col.a > 1) col.a = 255;
                let colour = this.roundedColour(col);
                let isWhite = colour.r > 250 && colour.g > 250 && colour.b > 250;
                if (colour.a > 1 && !isWhite) {
                    currentPixels.push({
                        colour: colour,
                        x: x,
                        y: y,
                        available: true,
                        painted: false
                    });
                    if (!currentColours.exists(x => x.rgba == colour.rgba)) {
                        currentColours.push(colour);
                    }
                }
            }
        }
        return {currentPixels: currentPixels, currentColours: currentColours};
    }

    pixelToWorldPoint(x, y) {
        return {
            x: 965 - 5 * this.pictureSize.width + 10 * x,
            y: 545 - 5 * this.pictureSize.height + 10 * y
        }
    }

    paintPercentage(perc) {
        var pixels = (this.currentPixels.length * perc).round() - this.currentPixels.count(pixel => pixel.painted);

        this.canvas.beginDraw();
        for (var i = 0; i < pixels; i++) {
            var randomPixel = randomRangeInt(0, this.currentPixels.length);
            //print("random pixel: " + randomPixel);
            var breaker = 0;
            while (this.currentPixels[randomPixel].painted && breaker < 1000) {
                randomPixel = (randomPixel + 1) % this.currentPixels.length;
                breaker++;
            }
            if (breaker > 900) {
                print("breaker used on paintPercentage");
                continue;
            }
            this.paintQuick(this.currentPixels[randomPixel % this.currentPixels.length], this.canvas, this.pictureSize);

        }
        this.canvas.endDraw();
        print("painted " + pixels + " pixels");
    }

    paint(pixel, canvas, pictureSize) {
        if (pixel === undefined) return;
        if (canvas === undefined) {
            print("error - no canvas to paint on!");
            return;
        }
        var scale = pictureSize.width > 120 ? 2 : pictureSize.width > 80 ? 5 : 10
        let x = -scale + pixel.x * scale;
        let y = -scale + pixel.y * scale;
        if (pictureSize.width > 120) {
            canvas.draw(this.stampsFifthRes.random(), x, y, 1, getColour2(pixel.colour));
        } else if (pictureSize.width > 80) {
            canvas.draw(this.stampsHalfRes.random(), x, y, 1, getColour2(pixel.colour));
        } else {
            canvas.draw(this.stamps.random(), x, y, 1, getColour2(pixel.colour));
        }
        pixel.painted = true;
        pixel.available = false;
    }

    paintQuick(pixel, canvas, pictureSize) {
        if (pixel === undefined) return;
        if (canvas === undefined) {
            print("error - no canvas to paint on!");
            return;
        }
        var scale = pictureSize.width > 120 ? 2 : pictureSize.width > 80 ? 5 : 10
        let x = -scale + pixel.x * scale;
        let y = -scale + pixel.y * scale;
        if (pictureSize.width > 120) {
            canvas.batchTextureFrame(this.stampsFifthRes.random(), x, y, 1, getColour(pixel.colour));
        } else if (pictureSize.width > 80) {
            canvas.batchTextureFrame(this.stampsHalfRes.random(), x, y, 1, getColour(pixel.colour));
        } else {
            canvas.batchTextureFrame(this.stamps.random(), x, y, 1, getColour(pixel.colour));
        }
        pixel.painted = true;
        pixel.available = false;
    }

    canvasMask;

    create() {

        this.ui = this.scene.get('ui');
        let background = this.add.tileSprite(960, 540, 1920 * 3, 1080 * 3, 'wood' + (saveData.saveProfile.currentStudioId + 1));

        this.initGame();

    }

    initGame() {
        console.log("init");

        if (saveData.saveProfile.studio.coloursEnabled && !studio0colourLoaded) {
            new LoadingImagesMessage(this, true, "init");
            paused = true;
            return;
        }

        if (saveData.saveProfile.studios.length > 1 && !otherStudiosLoaded) {
            new LoadingImagesMessage(this, false, "init");
            paused = true;
            return;
        }


        for (var i = 0; i < 6; i++) {
            this.stamps[i] = this.textures.getFrame('stamp' + i);
            this.stampsHalfRes[i] = this.textures.getFrame('stampHalfRes' + i);
            this.stampsFifthRes[i] = this.textures.getFrame('stampFifthRes' + i);
        }

        this.canvas = undefined;

        this.newCanvas(true);


        this.ants = [];

        var startOnPaper = saveData.saveProfile.studio.percentageComplete > 0 && saveData.saveProfile.studio.percentageComplete < 1;

        // doAfterDelay(10, () => this.antSpeed = 0);
        for (let i = 0; i < 9; i++) {
            while (this.ants.count(x => x.level === i) < saveData.saveProfile.studio.antCounts[i]) {
                this.addAnt(true, i, startOnPaper);
            }
        }

        if (saveData.saveProfile.studio.percentageComplete > 0) {
            var p = saveData.saveProfile.studio.percentageComplete;
            print("Already " + (saveData.saveProfile.studio.percentageComplete * 100).round() + "% completed");
            doNextFrame(() => this.paintPercentage(p));
        }

        print("WebGL: " + game.isWebGL());
        print("Canvas: " + game.isCanvas());


        //this.input.on("pointerdown", () => this.paintPercentage(0.5));
    }

    addAnt(done, level, startOnPaper) {
        // print("adding ant");
        let ant = new Ant(this, level, this.i);
        this.add.existing(ant);
        this.ants.push(ant);
        ant.done = done;
        if (startOnPaper) {
            ant.x = 960 + randomRange(-this.pictureSize.width * 5, this.pictureSize.width * 5);
            ant.y = 540 + randomRange(-this.pictureSize.height * 5, this.pictureSize.height * 5);
        }
        this.i++;
        this.ui.antCounter.updateCounts();
    }

    i = 0;
    interestPaymentDelay = 1;
    started = false;


    update(time, delta) {

        if (paused) return;

        for (let i = 0; i < 9; i++) {
            var breaker = 0;
            while (this.ants.count(x => x.level === i) < saveData.saveProfile.studio.antCounts[i] && breaker < 10000) {
                this.addAnt(this.ants[0].done, i, false);
                breaker++;
            }
            if (breaker > 9000) print("Breaker used on ant creation");
        }

        let camSize = this.cameras.main.getOrthographicSize();
        this.cameras.main.setOrthographicSize(camSize + (this.targetCamSize - camSize) / 8);


        if (this.ui.tutorialProgress === 0) return;

        if (!this.changingCanvas) {
            this.ants.forEach(ant => ant.updateWorking(time, delta));
        }

        this.listings.forEach(listing => listing.update(time, delta));


        this.ui.setCompletionText(this.getCompletion());
        this.ui.size.setText("(" + (this.pictureSize.width / 10) + "cm x " + (this.pictureSize.height / 10) + "cm)");

        if (!this.changingCanvas) {
            if (this.ants.all(x => x.state == x.states.idle)) {
                this.ants.forEach(ant => ant.updateFinished(time, delta));

                let antsStillMoving = this.ants.exists(x => x.moving);
                if (!antsStillMoving) {
                    //print("no ants are moving... getting new canvas");
                    this.newCanvas(false);
                }
            }
        }

        this.targetCamSize = 150 + 20 * this.pictureSize.width;

        saveData.saveProfile.studios.forEach(studio => studio.update(time, delta, this));

        if (saveData.saveProfile.interest) {
            this.interestPaymentDelay -= delta / 1000;
            if (this.interestPaymentDelay < 0) {
                this.interestPaymentDelay = 60;
                saveData.saveProfile.money = (saveData.saveProfile.money * 1.01).ceil();
            }
        }


        if (this.started) {
            if (epochSeconds() > saveData.saveProfile.timeLastPlayed + 30) {
                var t = epochSeconds() - saveData.saveProfile.timeLastPlayed;
                print("RESUMING - it's been " + t + " seconds since you last played");
                if (this.ui.whileYouWereGone === undefined) {
                    this.ui.whileYouWereGone = new WhileYouWereGone(this.ui, false);
                }
            }
        }

        saveData.setTime();
        this.started = true;

        saveData.saveProfile.speedBoostTimeLeft -= delta / 1000;
        saveData.saveProfile.artistSpotlightTimeLeft -= delta / 1000;

        //this.canvasMask.x += 0.1;
    }


    getCompletion() {
        var completed = this.currentPixels.count(pixel => pixel.painted);
        return completed / this.currentPixels.length;
    }

    createListing(studio) {
        print("Creating new listing! " + Math.random());
        var texture = studio.currentTexture;
        var pictureSize = {width: texture.source.width, height: texture.source.height};
        var scale = pictureSize.width > 120 ? 2 : pictureSize.width > 80 ? 5 : 10
        var canvas = this.add.renderTexture(960, -2000, pictureSize.width * scale, pictureSize.height * scale);
        canvas.fill(0xFFFFFF);
        canvas.setOrigin(0.5, 0.5);
        var pixelInfo = this.getPixelInfo(pictureSize, studio.currentTextureName);

        canvas.beginDraw();
        pixelInfo.currentPixels.forEach(pixel => this.paintQuick(pixel, canvas, pictureSize));
        canvas.endDraw();
        var listing = new Listing(this.ui, canvas, pictureSize, pixelInfo.currentColours.length, studio.id);
        this.add.existing(listing);
        this.listings.push(listing);

    }

    createCommissionCanvas(commission) {
        let textureName = "commission" + commission.id;
        let texture = this.textures.getFrame(textureName);
        var pictureSize = {width: texture.width, height: texture.height};
        var scale = pictureSize.width > 120 ? 2 : pictureSize.width > 80 ? 5 : 10
        var canvas = this.add.renderTexture(960, -2000, pictureSize.width * scale, pictureSize.height * scale);
        canvas.fill(0xFFFFFF);
        canvas.setOrigin(0.5, 0.5);
        var pixelInfo = this.getPixelInfo(pictureSize, textureName);
        pixelInfo.currentPixels.forEach(pixel => this.paint(pixel, canvas, pictureSize));
        return canvas;
    }

    changingCanvas;

    newCanvas(dontAddListing) {

        // if (saveData.saveProfile.studio.coloursEnabled && !studio0colourLoaded) {
        //     new LoadingImagesMessage(this.ui, true, this.newCanvas);
        //     return;
        // }


        if (this.changingCanvas && !dontAddListing) return;
        this.changingCanvas = true;

        var finishingCommission = false;


        if (!dontAddListing) {
            if (saveData.saveProfile.studio.currentCommission > -1) {
                saveData.saveProfile.studio.completeCommission(this.ui);
                saveData.saveProfile.studio.currentCommission = -1;
                finishingCommission = true;
            }
        }

        if (this.canvas !== undefined) {
            let oldCanvas = this.canvas;
            let oldMask = this.canvasMask;
            let startY = oldCanvas.y;
            let oldPictureSize = this.pictureSize;
            let oldColourCount = this.currentColours.length;
            animateEaseInOut(2, f => {
                oldCanvas.y = f.lerp(startY, startY - 2000);
                if (this.isMaskStudio) oldMask.y = oldCanvas.y - 540;
            }, () => {
                if (!dontAddListing) {
                    if (finishingCommission) {
                        //send image to payment letter
                        oldCanvas.destroy();
                    } else {
                        var listing = new Listing(this.ui, oldCanvas, oldPictureSize, oldColourCount, saveData.saveProfile.currentStudioId);
                        this.add.existing(listing);
                        this.listings.push(listing);
                    }
                } else {
                    oldCanvas.destroy();
                }
                if (oldMask !== undefined) oldMask.destroy();
            });
            animateEaseIn(0.3, f => {
                this.paints.forEach(paint => {
                    paint.scale = f.lerp(0.5, 0);
                    paint.highlight.scale = f.lerp(0.5, 0);
                })
            }, () => {
                this.paints.forEach(paint => {
                    paint.highlight.destroy();
                    paint.destroy();
                });
                this.paints = [];
            })

        }


        this.getNewImage();

        // print("new image! pixel count: " + this.currentPixels.length + ", colour count: " + this.currentColours.length);

        var scale = this.pictureSize.width > 120 ? 2 : this.pictureSize.width > 80 ? 5 : 10
        this.canvas = this.add.renderTexture(960, 540, this.pictureSize.width * scale, this.pictureSize.height * scale);
        this.canvas.scale = this.pictureSize.width > 120 ? 5 : this.pictureSize.width > 80 ? 2 : 1;
        this.canvas.fill(0xFFFFFF);
        this.canvas.setOrigin(0.5, 0.5);

        if (this.isMaskStudio) {
            this.canvasMask = this.make.graphics();
            this.canvasMask.fillStyle(0xffffff);
            this.canvasMask.beginPath();
            if (this.isCircleStudio) {
                this.canvasMask.fillCircle(960, 540, 5 * this.pictureSize.width);
            } else {
                var radius = 5 * this.pictureSize.width;
                this.canvasMask.moveTo(960 - radius, 540);
                this.canvasMask.lineTo(960 - radius / 2, 540 - radius);
                this.canvasMask.lineTo(960 + radius / 2, 540 - radius);
                this.canvasMask.lineTo(960 + radius, 540);
                this.canvasMask.lineTo(960 + radius / 2, 540 + radius);
                this.canvasMask.lineTo(960 - radius / 2, 540 + radius);
                this.canvasMask.closePath();
                this.canvasMask.fill();

                //this.canvas.scaleX = 1.1;
            }
            var shape = this.canvasMask.createGeometryMask();
            this.canvas.setMask(shape);
        }

        var resuming = saveData.saveProfile.studio.percentageComplete > 0 && saveData.saveProfile.studio.percentageComplete < 1;

        if (!resuming) saveData.saveProfile.studio.paintingId++;

        let startY = this.canvas.y;
        animateEaseInOut(resuming ? 0 : 2, f => {
            this.canvas.y = f.lerp(startY + 2000, startY);
            if (this.isMaskStudio) this.canvasMask.y = this.canvas.y - 540;
        }, () => {
            this.changingCanvas = false;
            this.ants.forEach(ant => ant.done = false);
            for (var i = 0; i < this.currentColours.length; i++) {
                let paint = new Paint(this, i, this.currentColours[i]);
                this.add.existing(paint);
                this.paints.push(paint);
            }
        });

    }

    get isMaskStudio() {
        return saveData.saveProfile.currentStudioId % 5 === 3 || saveData.saveProfile.currentStudioId % 5 === 4;
    }

    get isCircleStudio() {
        return saveData.saveProfile.currentStudioId % 5 === 3;
    }

    get isHexagonStudio() {
        return saveData.saveProfile.currentStudioId % 5 === 4;
    }


}


document.addEventListener('pointerup', (event) => {
    console.log('Pointer up');
    //Copy code here
}, {once: true});