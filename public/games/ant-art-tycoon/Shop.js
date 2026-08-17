class Shop extends Container {

    currentItems = [];
    scene;

    constructor(scene) {
        super(scene, 1680, 102);
        this.scene = scene;
    }

    reset() {
        this.currentItems.forEach(item => item.destroy());
        this.currentItems = [];
    }

    update(time, delta) {
        if (this.scene.tutorialProgress > -1 && this.scene.tutorialProgress < 3) return;
        while (this.currentItems.length < saveData.saveProfile.maxShopItems) {
            this.newItem();
        }
        this.currentItems.clearEmpties();
        this.currentItems.forEach(item => item.update(time, delta));
        for (var i = 0; i < this.currentItems.length; i++) this.currentItems[i].targetY = this.y + i * 164;
    }

    newItem() {
        var item = new ShopItem(this.scene, shops.shop.find(x => !this.currentItems.exists(y => y.item.id === x.id) && !saveData.saveProfile.studio.purchasedShopListings[x.id]));
        this.addChild(item, 0, 0);
        this.currentItems.push(item);
    }
}

class ShopItem extends Container {

    scene;
    shadow;
    background;
    nameText;
    priceText;
    iconBackground;
    icon;
    green;
    red;
    item;
    itemDetails;
    targetY;
    currentVelocityY = {value: 0};
    bought = false;
    halfPrice = false;
    tooExpensiveGradient = new Gradient([
        {value: 0, colour: new Color(255, 255, 255)},
        {value: 0.285, colour: new Color(255, 199, 199)},
        {value: 1, colour: new Color(255, 255, 255)},
    ]);

    constructor(scene, item) {
        super(scene, 1680, 30);

        this.scene = scene;

        this.item = item;
        this.itemDetails = items.getItemDetails(item);

        print("getting new item. Name: " + this.itemDetails.name + ", value: " + item.value);

        this.shadow = scene.addImageUi(422, 144, "shadow");
        this.shadow.depth = -2;
        this.addChild(this.shadow, 8, 8);

        this.background = scene.addImageUi(422, 144, "square");
        this.background.setInteractive({cursor: 'pointer'});
        this.background.on('pointerdown', () => this.buy(false));
        this.background.depth = -1;
        this.addChild(this.background, 0, 0);

        this.iconBackground = scene.addImageUi(108, 108, "square");
        this.iconBackground.tint = this.itemDetails.backgroundColour;
        if (item.type === 2) this.iconBackground.alpha = 50;
        this.addChild(this.iconBackground, -138, 0);

        this.icon = scene.addImageUi(108, 108, this.itemDetails.image);
        this.icon.tint = this.itemDetails.imageTint;
        this.addChild(this.icon, -138, 0);

        this.nameText = scene.addText(0, 0, this.itemDetails.name, normal);
        this.nameText.fitInWidth(250);
        this.addChild(this.nameText, 62, -29);

        this.priceText = scene.addText(0, 0, formattedMoney(this.item.price), bold);
        this.addChild(this.priceText, 62, 28);

        this.green = getColourHex(new Color(123, 197, 87));
        this.red = getColourHex(new Color(209, 65, 54));

        animateEaseOutBack(0.5, f => this.scale = f);

        this.depth = 4;
    }

    update(time, delta) {
        var price = this.halfPrice ? (this.item.price / 2).round() : this.item.price;
        this.priceText.text = formattedMoney(price);
        this.y = smoothDamp(this.y, this.targetY, this.currentVelocityY, 0.1, 9999, delta / 1000);
        this.priceText.style.color = saveData.saveProfile.money < price ? this.red : this.green;
        this.priceText.updateText();
    }

    buy(skipNewItemMessage) {

        if (!skipNewItemMessage && !saveData.saveProfile.purchasedItemTypes.includes(this.itemDetails.id)) {
            new NewShopItem(this.scene, this.item, this.itemDetails, this);
            return;
        }

        if (this.bought) return;

        var price = this.halfPrice ? (this.item.price / 2).round() : this.item.price;

        if (saveData.saveProfile.money < price) {
            sfx.no.play();
            print("too expensive");
            animate(0.5, f => this.background.tint = getColour(this.tooExpensiveGradient.evaluate(f)));
        } else {
            sfx.click.play();
            this.bought = true;
            saveData.saveProfile.money -= price;
            saveData.saveProfile.studio.purchasedShopListings[this.item.id] = true;
            this.purchase();
            animateEaseIn(0.2, f => this.scale = 1 - f, () => {
                this.scene.shop.currentItems.remove(this);
                this.destroy()
            });
            if (this.scene.tutorialProgress === 3) {
                this.scene.tutorialProgress = -1;
            }

        }
    }

    purchase() {
        saveData.saveProfile.itemsBought++;
        let type = this.item.type;
        if (type === shops.itemType.blackAnt) saveData.saveProfile.studio.antCounts[0] += this.item.value;
        if (type === shops.itemType.whiteAnt) saveData.saveProfile.studio.antCounts[this.item.level] += this.item.value;
        if (type === shops.itemType.pictureSize) saveData.saveProfile.studio.maxWidth += 4;
        if (type === shops.itemType.listingSlots) saveData.saveProfile.maxListings++;
        if (type === shops.itemType.shopSlots) saveData.saveProfile.maxShopItems++;
        if (type === shops.itemType.antCounter) saveData.saveProfile.antCounter = true;
        if (type === shops.itemType.colours) saveData.saveProfile.studio.coloursEnabled = true;
        if (type === shops.itemType.commuteSpeed) saveData.saveProfile.studio.commuteSpeed += 0.1;
        if (type === shops.itemType.achievements) saveData.saveProfile.achievementsUnlocked = true;
        if (type === shops.itemType.multipleStudios) saveData.saveProfile.multipleStudiosUnlocked = true;
        if (type === shops.itemType.mail) saveData.saveProfile.commissionsUnlocked = true;
        if (type === shops.itemType.blackAntSpeed) saveData.saveProfile.antSpeedMultipliers[0] *= 1.1;
        if (type === shops.itemType.redAntSpeed) saveData.saveProfile.antSpeedMultipliers[1] *= 1.1;
        if (type === shops.itemType.purpleAntSpeed) saveData.saveProfile.antSpeedMultipliers[2] *= 1.1;
        if (type === shops.itemType.blueAntSpeed) saveData.saveProfile.antSpeedMultipliers[3] *= 1.1;
        if (type === shops.itemType.greenAntSpeed) saveData.saveProfile.antSpeedMultipliers[4] *= 1.1;
        if (type === shops.itemType.yellowAntSpeed) saveData.saveProfile.antSpeedMultipliers[5] *= 1.1;
        if (type === shops.itemType.greyAntSpeed) saveData.saveProfile.antSpeedMultipliers[6] *= 1.1;
        if (type === shops.itemType.cyanAntSpeed) saveData.saveProfile.antSpeedMultipliers[7] *= 1.1;
        if (type === shops.itemType.orangeAntSpeed) saveData.saveProfile.antSpeedMultipliers[8] *= 1.1;
        if (type === shops.itemType.afkPainting) saveData.saveProfile.afkPainting = true;
        if (type === shops.itemType.betterSpecialOffers) saveData.saveProfile.betterSpecialOffers = true;
        if (type === shops.itemType.autoRemoveCheapestListing) saveData.saveProfile.autoRemoveCheapestListing = true;
        if (type === shops.itemType.biggerPaintings) saveData.saveProfile.biggerPaintings = true;
        if (type === shops.itemType.instaSell) saveData.saveProfile.instaSell = true;
        if (type === shops.itemType.skipPainting) saveData.saveProfile.skipPainting = true;
        if (type === shops.itemType.autoSell) saveData.saveProfile.autoSell = true;
        if (type === shops.itemType.interest) saveData.saveProfile.interest = true;
        if (type === shops.itemType.certification) saveData.saveProfile.certification = true;
        if (type === shops.itemType.statsMenu) saveData.saveProfile.statsUnlocked = true;
    }
}


class NewShopItem extends Container {
    darkBG;
    background;
    itemNameText;
    itemPriceText;
    descriptionText;
    iconBackground;
    icon;
    closeButton;
    closeText;
    openButton;
    openText;
    closing = false;
    open = false;
    itemDetails;
    shopItem;

    constructor(scene, item, itemDetails, shopItem) {
        super(scene, 960, 540);

        this.itemDetails = itemDetails;
        this.shopItem = shopItem;

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(596, 262, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -66);

        this.itemNameText = scene.addText(0, 0, itemDetails.name, normal40);
        this.addChild(this.itemNameText, 55, -141);

        this.itemPriceText = scene.addText(0, 0, formattedMoney(item.price), bold45);
        this.itemPriceText.setColour(new Color(123, 197, 87));
        this.addChild(this.itemPriceText, 55, -79);

        this.descriptionText = scene.addText(0, 0, itemDetails.description, normal30);
        this.descriptionText.style.wordWrap = true;
        this.descriptionText.style.setWordWrapWidth(550);
        this.addChild(this.descriptionText, 0, 4);

        this.iconBackground = scene.addImageUi(108, 108, "square");
        this.iconBackground.tint = this.itemDetails.backgroundColour;
        if (item.type === 2) this.iconBackground.alpha = 50;
        this.addChild(this.iconBackground, -212, -113);

        this.icon = scene.addImageUi(108, 108, this.itemDetails.image);
        this.icon.tint = this.itemDetails.imageTint;
        this.addChild(this.icon, -212, -113);


        this.closeButton = scene.addImageUi(286, 92, "square");
        this.closeButton.setInteractive({cursor: "pointer"});
        this.closeButton.on("pointerdown", () => this.close());
        this.addChild(this.closeButton, -153, 131);

        this.closeText = scene.addText(0, 0, "Close", normal35);
        this.addChild(this.closeText, -153, 131);


        this.buyButton = scene.addImageUi(286, 92, "square");
        this.buyButton.setInteractive({cursor: "pointer"});
        this.buyButton.on("pointerdown", () => this.buy());
        this.addChild(this.buyButton, 153, 131);

        this.buyText = scene.addText(0, 0, "Buy", normal35);
        this.addChild(this.buyText, 153, 131);


        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.depth = 1500;


    }

    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => this.destroy());
    }

    buy() {
        saveData.saveProfile.purchasedItemTypes.push(this.itemDetails.id);
        this.shopItem.buy(true);
        this.close();

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
}