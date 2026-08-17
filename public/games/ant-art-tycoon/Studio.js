class StudioSaveData {

    maxWidth = 10;
    paintingId = 0;
    currentCommission = -1;
    currentPicturePixelCount = 0;
    paintedPixelCount = 0;
    coloursEnabled = false;
    purchasedShopListings = [];
    antCounts = [5, 0, 0, 0, 0, 0, 0, 0, 0];
    pixelsPerSecond = 3;
    percentageComplete = 0;
    movingPictureCompletion = 0;
    commuteSpeed = 1;
    pixelCountDelay = 5;

    constructor(studio) {
        this.maxWidth = studio.maxWidth;
        this.paintingId = studio.paintingId;
        this.currentCommission = studio.currentCommission;
        this.currentPicturePixelCount = studio.currentPicturePixelCount;
        this.paintedPixelCount = studio.paintedPixelCount;
        this.coloursEnabled = studio.coloursEnabled;
        this.purchasedShopListings = studio.purchasedShopListings;
        this.antCounts = studio.antCounts;
        this.pixelsPerSecond = studio.pixelsPerSecond;
        this.percentageComplete = studio.percentageComplete;
        this.movingPictureCompletion = studio.movingPictureCompletion;
        this.commuteSpeed = studio.commuteSpeed;
        this.pixelCountDelay = studio.pixelCountDelay;
    }
}

class Studio {

    PaintingType = {
        square: 1,
        landscape: 2,
        portrait: 3,
        circle: 4,
        hexagon: 5
    };

    get id() {
        return saveData.saveProfile.studios.indexOf(this);
    }

    get paintingType() {
        return [this.PaintingType.square, this.PaintingType.landscape, this.PaintingType.portrait, this.PaintingType.circle, this.PaintingType.hexagon][this.id % 5];
    }

    get totalAntCount() {
        return this.antCounts.sum();
    }

    get isCurrentStudio() {
        return this.id === saveData.saveProfile.currentStudioId;
    }

    //ints
    //maxWidth = 10;
    maxWidth = 10;
    paintingId = 0;
    currentCommission = -1;
    currentPicturePixelCount = 0;
    paintedPixelCount = 0;

    //bools
    coloursEnabled = false;

    //arrays
    purchasedShopListings = [];
    //antCounts = [200, 150, 100, 50, 20, 10, 5, 0, 0];
    antCounts = [5, 0, 0, 0, 0, 0, 0, 0, 0];

    //floats
    pixelsPerSecond = 3;
    percentageComplete = 0;
    movingPictureCompletion = 0;
    commuteSpeed = 1;
    pixelCountDelay = 5;

    //objects
    currentTexture;

    //strings
    currentTextureName;

    update(time, delta, scene) {
        if (this.isCurrentStudio) {
            this.percentageComplete = scene.getCompletion();
            this.pixelCountDelay -= delta / 1000;
            if (this.pixelCountDelay < 0) {
                this.pixelCountDelay = 1;
                var newPaintedCount = scene.currentPixels.count(pixel => pixel.painted);
                if (newPaintedCount > this.paintedPixelCount) {
                    this.pixelsPerSecond = (this.pixelsPerSecond * 4 + (newPaintedCount - this.paintedPixelCount)) / 5;
                }
                this.paintedPixelCount = newPaintedCount;
            }
            //print("Pixels per second: " + this.pixelsPerSecond);
        } else {

            this.backgroundUpdate(time, delta, scene);
        }
    }

    startCommission(commissionId, mainScene) {
        this.currentCommission = commissionId;
        if (this.isCurrentStudio) {
            this.percentageComplete = 0;
            mainScene.newCanvas(true);
            mainScene.ants.forEach(ant => ant.reset());
        } else {
            this.percentageComplete = 0;
            this.getNewImage(mainScene);
        }
    }

    completeCommission(uiScene) {
        uiScene.paymentMailQueue.push(commissions.commissions[this.currentCommission]);
        saveData.saveProfile.commissionsComplete[this.currentCommission] = 1;
        //this.currentCommission = -1;
    }

    getNewImage(scene) {

       

        if (this.currentCommission > -1) {
            let chosenTextureName = "commission" + this.currentCommission;
            let chosenTexture = scene.textures.getFrame(chosenTextureName);
            this.currentPicturePixelCount = chosenTexture.width * chosenTexture.height;
            return {texture: chosenTexture, textureName: chosenTextureName};
        }

        let texture;
        let textureName;
        let studioIdMod = this.id % 5;
        let blackId = studioIdMod < 3 ? studioIdMod : 0;
        if (studioIdMod === 1 && this.maxWidth < 12) this.maxWidth = 12;
        var goodPictureLuck = saveData.saveProfile.biggerPaintings;
        var minWidth = (this.maxWidth * (goodPictureLuck ? 3 / 4 : 2 / 3)).max(0.9);
        let breaker = 0;
        do {
            if (this.coloursEnabled) {
                textureName = studioIdMod + "-painting" + randomRangeIntSeeded(this.paintingId, 1, scene.paintingCounts[studioIdMod].colour);
            } else {
                textureName = blackId + "-black-painting" + randomRangeIntSeeded(this.paintingId, 1, scene.paintingCounts[blackId].black);
            }
            texture = scene.textures.getFrame(textureName);
            this.paintingId++;
            breaker++;
        } while ((texture.source.width > this.maxWidth || texture.source.width < minWidth) && breaker < 100);
        if (breaker > 99) print("Could not find texture with width less than " + this.maxWidth + " and more than " + minWidth);
        this.currentPicturePixelCount = texture.width * texture.height;

        return {texture: texture, textureName: textureName};
    }

    backgroundUpdate(time, delta, scene) {
        //this.pixelsPerSecond = this.pixelsPerSecond.max(0.5);

        if (this.percentageComplete === 0 || this.currentPicturePixelCount === 0 || !this.currentTexture) {
            var imageInfo = this.getNewImage(scene);
            this.currentTexture = imageInfo.texture;
            this.currentTextureName = imageInfo.textureName;
        }

        this.percentageComplete += (this.pixelsPerSecond / this.currentPicturePixelCount) * delta / 1000;//+ randomRange(0, 0.001);
        if (this.percentageComplete > 1) {
            if (this.movingPictureCompletion < 1) {
                this.percentageComplete = 1;
                this.movingPictureCompletion += delta / 5000;
            } else {
                this.movingPictureCompletion = 0;
                this.percentageComplete = 0;

                if (this.currentCommission > -1) {
                    this.completeCommission(scene.ui);
                    this.currentCommission = -1;
                } else {
                    scene.createListing(this);
                    this.paintingId++;
                }
            }
        }
    }

}