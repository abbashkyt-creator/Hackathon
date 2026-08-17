class Placeholder extends Container {

    shadow;
    background;
    thumbnail;
    text;

    constructor(scene, id) {
        super(scene, 236, 97);

        this.shadow = scene.addImageUi(422, 144, "shadow");
        this.shadow.depth = -20;
        this.addChild(this.shadow, 8, 8);

        this.background = scene.addImageUi(422, 144, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, 0);

        this.thumbnail = scene.addImageUi(108, 108, "square");
        this.thumbnail.setColour(new Color(226, 226, 226));
        this.addChild(this.thumbnail, -139, 0);

        this.text = scene.addText(0, 0, "Empty", normal45);
        this.text.setColour(new Color(226, 226, 226));
        this.addChild(this.text, 62, 0);


        this.scale = 0;
        doAfterDelay(0.3 + id * 0.05, () =>
            animateEaseOutBack(0.5, f => this.scale = f)
        );

        this.depth = 1000;
    }
}

class Listing extends Container {

    background;
    painting;
    paintingMask;
    statusText;
    priceText;
    plusButton;
    minusButton;

    get targetY() {
        return this.scene.currentListings.indexOf(this) * 164 + 97;
    }

    currentVelocityY = {value: 0};
    price;
    value;
    redGradient;
    greenGradient;
    timeCreated = 0;
    interested = 0;
    offerShowing = false;
    opinionDelay = 3;
    sold = false;
    showingInfo = false;
    opinion;
    hovered = false;
    studioId = 0;
    size;
    blockMovement = false;
    colourCount;

    infoBubble;
    offer;

    studioBg;
    studioRing;
    studioText;


    get oldestListing() {
        if (saveData.saveProfile.autoRemoveCheapestListing) {
            return this.scene.currentListings.orderBy(x => x.value)[0];
        } else {
            return this.scene.currentListings.orderBy(x => x.timeCreated)[0];
        }
    }

    get valueForMoney() {
        return (this.value - this.value / 2) / Math.max(0.5, this.price - this.value / 2);
    }

    paintingSizes = [
        {width: 108, height: 108},
        {width: 108, height: 81},
        {width: 81, height: 108},
        {width: 108, height: 108},
        {width: 108, height: 108}
    ]

    studioColours = [
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


    constructor(scene, painting, size, colourCount, studioId) {
        super(scene, 236, 97);

        this.studioId = studioId;
        this.size = size;
        this.colourCount = colourCount;
        this.value = Math.round(Math.pow(new Vector2(size.width, size.height).magnitude() - 10, 2) * colourCount * 0.2);// * fameMultiplier);
        if (saveData.saveProfile.doubleListingValueCount > 0) {
            saveData.saveProfile.doubleListingValueCount--;
            this.value *= 2;
        }

        this.price = this.value;
        this.timeCreated = epochSeconds();
        if (this.scene.currentListings.length >= saveData.saveProfile.maxListings) this.oldestListing.end();
        this.scene.currentListings.push(this);
        if (this.scene.currentListings.length >= saveData.saveProfile.maxListings) this.oldestListing.endingSoon();
        this.scene.currentListings = this.scene.currentListings.clearEmpties().orderByDescending(listing => listing.timeCreated);

        this.shadow = scene.add.image(236, 97, "shadow");
        this.shadow.displayWidth = 422;
        this.shadow.displayHeight = 144;
        this.shadow.depth = -20;
        this.addChild(this.shadow, 8, 8);

        this.background = scene.add.image(236, 97, "square");
        this.background.displayWidth = 422;
        this.background.displayHeight = 144;
        this.background.setInteractive();
        this.background.on('pointerover', () => this.hovered = true);
        this.background.on('pointerout', () => this.hovered = false);
        this.background.depth = -10;
        this.addChild(this.background, 0, 0);

        const paintingSize = this.paintingSizes[studioId % 5];
        this.painting = scene.add.existing(painting);
        this.painting.displayWidth = paintingSize.width;
        this.painting.displayHeight = paintingSize.height;
        this.painting.mask = undefined;
        this.addChild(this.painting, -139, 0)

        //print("Painting finished in studio " + (studioId % 5));
        if (studioId % 5 === 3) {
            this.paintingMask = scene.addImageUi(108, 108, "circle-stencil");
            this.addChild(this.paintingMask, -139, 0)
        }
        if (studioId % 5 === 4) {
            this.paintingMask = scene.addImageUi(108, 108, "hexagon-stencil");
            this.addChild(this.paintingMask, -139, 0)
        }

        if (saveData.saveProfile.studios.length > 1) {
            this.studioBg = scene.addImageUi(46, 46, "circle128");
            this.addChild(this.studioBg, -87, -45);

            this.studioRing = scene.addImageUi(46, 46, "ring");
            this.studioRing.setColour(this.studioColours[studioId]);
            this.addChild(this.studioRing, -87, -45);

            this.studioText = scene.addText(0, 0, studioId + 1, bold40);
            this.studioText.setColour(this.studioColours[studioId]);
            if (studioId === 9) this.studioText.scale = 0.8;
            this.addChild(this.studioText, -87, -45);
        }

        this.statusText = scene.addText(298, 68, "On sale", normal);
        this.addChild(this.statusText, 62, -29);

        this.priceText = scene.addText(298, 124, formattedMoney(this.price), bold);
        this.addChild(this.priceText, 62, 28);

        this.plusButton = scene.add.image(389, 125, "plus");
        this.plusButton.setInteractive({cursor: 'pointer'});
        this.plusButton.on('pointerdown', () => this.plusClicked());
        this.addChild(this.plusButton, 160, 28);

        this.minusButton = scene.add.image(202, 125, "minus");
        this.minusButton.setInteractive({cursor: 'pointer'});
        this.minusButton.on('pointerdown', () => this.minusClicked());
        this.addChild(this.minusButton, -39, 28);

        this.greenGradient = new Gradient([
            {value: 0, colour: new Color(0, 0, 0)},
            {value: 0.3, colour: new Color(113, 209, 40)},
            {value: 1.1, colour: new Color(113, 209, 40)}
        ]);
        this.redGradient = new Gradient([
            {value: 0, colour: new Color(0, 0, 0)},
            {value: 0.33, colour: new Color(214, 129, 45)},
            {value: 0.63, colour: new Color(202, 35, 35)},
            {value: 1, colour: new Color(202, 35, 35)}
        ]);

        this.y = this.targetY;

        this.infoBubble = new InfoBubble(this.scene, 236, 97);
        this.addChild(this.infoBubble, 228, 0);


        //animateEaseOutBack(0.5, f => this.x = f.lerp(-250, 236));
        animateEaseOutBack(0.5, f => this.scale = f);

        this.depth = 1000;

        if (scene.tutorialProgress === 1) {
            scene.tutorialProgress = 2;
        }

    }

    changePrice(multiplier, atLeastOne) {
        sfx.click.play();
        var change = this.price * 0.05 * multiplier;
        if (atLeastOne && change.abs() < 1) change = multiplier.sign();
        this.price = clamp(this.price + change, 1, 2147483647).round();
    }

    plusClicked() {
        this.changePrice(1, true);
    }

    minusClicked() {
        this.changePrice(-1, true);
    }

    createOpinion() {

        this.opinionDelay = 5;
        this.opinion = new Opinion(this.scene, this.price, this.value, this.valueForMoney, this.colourCount)
        this.addChild(this.opinion, 228, 0);

        animateEaseOutBack(0.25, f => this.opinion.scale = f,
            () => doAfterDelay(2, () => {
                if (this.opinion == null) return;
                animateEaseIn(0.2, f => this.opinion.scale = 1 - f, () => this.destroyOpinion());
            })
        );
    }


    reset() {
        this.statusText.text = "On sale";
        this.background.tint = getColour(new Color(255, 255, 255));
        if (this.paintingMask !== undefined) this.paintingMask.tint = getColour(new Color(255, 255, 255));
        this.offer = undefined;
    }

    sell(recycle, instaBought) {
        if (recycle) this.price = (this.value * 0.25).round();
        if (instaBought) this.price = (this.value * 0.5).round();

        this.sold = true;
        this.statusText.setText("Sold");
        //GameController.instance.Sell(this, recycle);
        //SFX.PlayEffect("cash");
        this.background.tint = getColour(new Color(153, 242, 94));
        if (this.paintingMask !== undefined) this.paintingMask.tint = getColour(new Color(153, 242, 94));
        saveData.saveProfile.sellCount++;
        if (this.studioId === 0 || this.studioId === 5) saveData.saveProfile.squareSellCount++;
        if (this.studioId === 1 || this.studioId === 6) saveData.saveProfile.landscapeSellCount++;
        if (this.studioId === 2 || this.studioId === 7) saveData.saveProfile.portraitSellCount++;
        if (this.studioId === 3 || this.studioId === 8) saveData.saveProfile.circleSellCount++;
        if (this.studioId === 4 || this.studioId === 9) saveData.saveProfile.hexagonSellCount++;
        saveData.saveProfile.money += this.price;
        saveData.saveProfile.totalMoney += this.price;
        saveData.saveProfile.biggestPaintingSize = saveData.saveProfile.biggestPaintingSize.max(this.size.width);
        saveData.saveProfile.biggestSaleValue = saveData.saveProfile.biggestSaleValue.max(this.price);
        saveData.saveProfile.biggestValueToSaleRatio = saveData.saveProfile.biggestValueToSaleRatio.max(this.price / this.value);
        this.destroyOpinion();

        // this.ended = true;
        this.animateExit();

        this.scene.currentListings.forEach(listing => listing.reset());

        var sold = new Sold(this.scene, this, recycle);

    }

    destroyOpinion() {
        if (this.opinion != null) {
            this.opinion.destroy();
        }
    }

    animateExit() {
        this.blockMovement = true;
        this.scene.currentListings.remove(this);
        animateEaseIn(0.5, f => this.x = f.lerp(236, -236), () => {
            this.destroy()
        });
    }

    endingSoon() {
        this.statusText.text = "Ending soon";
        this.background.tint = getColour(new Color(255, 128, 128));
        if (this.paintingMask !== undefined) this.paintingMask.tint = getColour(new Color(255, 128, 128));
        if (saveData.saveProfile.instaSell) {
            this.destroyOpinion();
            if (this.offer === undefined) {
                this.offer = new Offer(this.scene, (this.value * 0.5).round(), this);
                this.addChild(this.offer, 231, -36);
            }
            // offer.Activate();
            // closeButton.SetScaleXY(0);
            // buyButton.SetScaleXY(0);
            // offer.GetComponentInChildren<TextMeshProUGUI>().text = "I'll buy it for <b>" + GameController.FormattedMoney(value / 2);
            // Delayer.AnimateEaseOutElastic(0.3f, f => offer.transform.SetScaleXY(f), () => {
            //     Delayer.AnimateEaseOut(0.2f, f => buyButton.SetScaleXY(f));
            //     Delayer.DoAfterDelay(0.1f, () => Delayer.AnimateEaseOut(0.2f, f => closeButton.SetScaleXY(f), () => offerShowing = true));
            // });
        }
    }

    end() {
        if (saveData.saveProfile.autoSell) {
            this.sell(true, false);
            this.statusText.text = "Recycled";
        } else {
            this.destroyOpinion();
            this.animateExit();
            this.statusText.text = "Not sold";
        }

        //this.ended = true;
    }

    attemptSale() {
        if (Math.random() < this.valueForMoney / 250 && !this.sold) {
            this.interested++;
        }

        if (epochSeconds() - this.timeCreated > 5 + (Math.min(5, this.value / 2000))) {
            let timeAddition = Math.min(500, this.price / 100);
            if (Math.random() < this.valueForMoney / (500 + timeAddition) && !this.sold) {
                this.sell(false, false);
            }
        }
    }


    update(time, delta) {
        if (this.blockMovement) return;

        this.y = smoothDamp(this.background.y, this.targetY, this.currentVelocityY, 0.1, 9999, delta / 1000)
        this.priceText.setText(formattedMoney(this.price));
        var i = ((time / 1000) % 1);


        if (this.valueForMoney < 1) {
            this.priceText.style.color = (getColourHex(this.redGradient.evaluate(1 - this.valueForMoney)));
        }

        if (this.valueForMoney > 1) {
            this.priceText.style.color = (getColourHex(this.greenGradient.evaluate(this.valueForMoney / 10)));
        }

        // if (this.y > 540) {
        //     this.destroy();
        //     return;
        // }


        this.infoBubble.timeText.setText(secondsToFormatted(Math.floor(epochSeconds() - this.timeCreated)));
        this.infoBubble.interestedText.setText(this.interested + (this.interested === 1 ? " buyer\ninterested" : " buyers\ninterested"));


        if (saveData.saveProfile.sellCount > 0 && !(saveData.saveProfile.instaSell && (this.statusText.text === "Ending soon" || this.offerShowing))) {
            this.opinionDelay -= delta / 1000;
            if (this.opinionDelay < 0 && Math.random() < 0.01) this.createOpinion();
        }

        if (this.price < this.value * 10) {
            this.attemptSale();
            if (saveData.saveProfile.artistSpotlightTimeLeft > 0) this.attemptSale();
        } else {
            this.interested = 0;
        }

        if (saveData.saveProfile.sellCount > 0) {
            if (this.hovered && this.offer === undefined) {
                if (!this.showingInfo) {
                    this.showingInfo = true;
                    animateEaseOutBack(0.25, f => this.infoBubble.scale = f);
                    if (this.opinion != null) {
                        this.opinion.destroy();
                    }
                }

                this.opinionDelay = 1;
            } else {
                if (this.showingInfo) {
                    this.showingInfo = false;
                    animateEaseIn(0.25, f => this.infoBubble.scale = 1 - f);
                }
            }
        }
    }

}

class InfoBubble extends Container {
    timeText;
    interestedText;
    background;
    shadow;
    triangle;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.depth = 500;

        this.shadow = scene.add.image(0, 0, "shadow");
        this.shadow.displayWidth = 156;
        this.shadow.displayHeight = 144;
        this.addChild(this.shadow, 108, 8);

        this.background = scene.add.image(0, 0, "square");
        this.background.displayWidth = 156;
        this.background.displayHeight = 144;
        this.addChild(this.background, 100, 0);

        this.triangle = scene.add.image(0, 0, "triangle");
        this.addChild(this.triangle, 16, 0);

        this.timeText = scene.addText(0, 0, "0:00", bold);
        this.addChild(this.timeText, 99, -29);

        this.interestedText = scene.addText(0, 0, "0 buyers\ninterested", normal26);
        this.addChild(this.interestedText, 99, 27);

        this.scale = 0;
    }


}


class Opinion extends Container {
    constructor(scene, price, value, valueForMoney, colourCount, size) {
        super(scene, 0, 0);

        this.shadow = scene.add.image(0, 0, "shadow");
        this.shadow.displayWidth = 268;
        this.shadow.displayHeight = 68;
        this.addChild(this.shadow, 164, 7);

        this.background = scene.add.image(0, 0, "square");
        this.background.displayWidth = 268;
        this.background.displayHeight = 68;
        this.addChild(this.background, 157, 0);

        this.triangle = scene.add.image(0, 0, "triangle");
        this.addChild(this.triangle, 16, 0);

        this.text = scene.addText(0, 0, this.getOpinion(price, value, valueForMoney, colourCount, size), normal26);
        this.text.fitInWidth(250);
        this.addChild(this.text, 158, 0);

    }

    shadow;
    background;
    triangle;
    text;


    getOpinion(price, value, valueForMoney, colourCount, size) {
        if (this.scene.opinions.length < 1) {
            this.scene.opinions = [
                "I love paintings like this!",
                "This painting really speaks to me",
                "Fantastic composition!",
                "It's not really my style...",
                "This would look great in my bedroom",
                "My grandma would love this",
                "Too modern for my taste!",
                "I think I've seen this somewhere before...",
                "What is this even supposed to be?",
                "This would be a perfect piece for my gallery!",
                "I don't know why but I really like it!",
                "So fresh, so new!",
                "I love the originality!",
                "Very good!",
                "Such skillful craft",
                "What a skillfully made painting!",
                "I tip my hat to the artist!",
                "This artist seems to know their craft",
                "It's fairly well made",
                "My kids would love this!",
                "Tremendous!",
                "Exquisite!",
                "I won't invest in this",
                "This is the best painting ever.",
                "Flawless design",
                "It's very... unique...",
                "My dog could do better!",
                "You put the 'A' in artist",
                "Cheesy but I like it!",
                "What a fine piece of work!",
                "Don't quit your day job...",
                "Trash. Absolute trash.",
                "Art these days...",
                "Not your best work I must say",
                "Absolutely horrible!",
                "Lovely",
                "A painting only a mother could love!"
            ];

            if (price === 420) {
                this.scene.opinions.push("That price is a little 'high'");
            }

            if (price === 1) {
                for (var i = 0; i < 10; i++) {
                    this.scene.opinions.push("For $1 how could I not buy it?");
                }
            }

            if (valueForMoney > 1) {
                this.scene.opinions.push("Wow! What great value!");
                this.scene.opinions.push("So cheap, I must have it!");
                if (price < 1000 && value >= 1000) {
                    this.scene.opinions.push("A painting like this for less than $1000? Amazing!");
                }

                if (price < 10000 && value >= 10000) {
                    this.scene.opinions.push("This painting must be worth $10k at least!");
                }
            }

            if (valueForMoney > 50) {
                this.scene.opinions.push("Unbelievably cheap!");
                this.scene.opinions.push("What a steal!");
                this.scene.opinions.push("I can't believe this is on sale for so little money!");
            }

            if (valueForMoney < 1) {
                this.scene.opinions.push("It's a bit expensive for me...");
                this.scene.opinions.push("A little pricey!");
                if (price > 1000 && value <= 1000) {
                    this.scene.opinions.push("There's no way I'm paying over $1000 for this...");
                }
            }

            if (valueForMoney < 0.2) {
                this.scene.opinions.push("I'm not paying that much for that!");
                this.scene.opinions.push("Absurd price!");
                this.scene.opinions.push("Why would anyone buy this??");
                this.scene.opinions.push("It costs how much?!");
                this.scene.opinions.push("Only an idiot would pay that much!");
            }

            if (colourCount === 1) {
                this.scene.opinions.push("I don't like paintings without colour");
                this.scene.opinions.push("This painting is dark just like my soul!");
            }

            if (colourCount <= 3) {
                this.scene.opinions.push("It's a bit basic");
                this.scene.opinions.push("Did the artist even try at all?");
                this.scene.opinions.push("I could do better than that!");
                this.scene.opinions.push("This looks like it was painted by ants...");
                this.scene.opinions.push("I want more radical colours!");
                this.scene.opinions.push("Far too bland for me!");
                this.scene.opinions.push("A minimalistic approach? I approve!");
            }

            if (colourCount > 10) {
                this.scene.opinions.push("I love the choice of colours!");
                this.scene.opinions.push("Utterly magnificent!");
                this.scene.opinions.push("Wow!...the colours...the lines..");
            }

            if (colourCount > 20) {
                this.scene.opinions.push("Look at all the pretty colours!");
                this.scene.opinions.push("This could brighten up my dreary house");
                this.scene.opinions.push("The choice of colours is all wrong...");
            }

            if (size < 12) {
                this.scene.opinions.push("What a tiny painting! Adorable!");
                this.scene.opinions.push("I like my paintings much bigger..");
                this.scene.opinions.push("What is this, a painting for ants?");
                this.scene.opinions.push("Did a child paint this?");
            }

            if (size > 50) {
                this.scene.opinions.push("It's a masterpiece!");
                this.scene.opinions.push("It's almost like a photograph");
            }

            if (size > 100) {
                this.scene.opinions.push("Wow! This painting is so detailed!");
                this.scene.opinions.push("The amount of detail is incredible!");
                this.scene.opinions.push("Beautiful painting!");
                this.scene.opinions.push("Only a human could create something so amazing!");
                this.scene.opinions.push("Far too complex for my liking");
                this.scene.opinions.push("There's just too much detail!");
            }
        }

        var opinion = this.scene.opinions.random();
        if (this.scene.recentOpinions.includes(opinion)) {
            return this.getOpinion();
        }

        this.scene.recentOpinions.push(opinion);
        if (this.scene.recentOpinions.length > 5) {
            this.scene.recentOpinions.shift();
        }

        return opinion;
    }
}


class Offer extends Container {
    text;
    closeText;
    closeButton;
    sellText;
    sellButton;
    background;
    //shadow;
    triangle;
    listing;

    constructor(scene, amount, listing) {
        super(scene, 0, 0);

        this.depth = 500;
        this.listing = listing;

        this.background = scene.addImageUi(268, 68, "square");
        this.addChild(this.background, 158, 0);

        this.triangle = scene.add.image(0, 0, "triangle");
        this.addChild(this.triangle, 16, 0);

        this.text = scene.addText(0, 0, "I'll buy it for " + formattedMoney(amount), normal26);
        this.addChild(this.text, 158, 0);

        this.closeButton = scene.addImageUi(128, 64, "square");
        this.closeButton.setInteractive({cursor: "pointer"});
        this.closeButton.on("pointerdown", () => this.close());
        this.addChild(this.closeButton, 87, 77);

        this.closeText = scene.addText(0, 0, "Close", normal26);
        this.addChild(this.closeText, 87, 77);

        this.sellButton = scene.addImageUi(128, 64, "square");
        this.sellButton.setInteractive({cursor: "pointer"});
        this.sellButton.on("pointerdown", () => this.sell());
        this.addChild(this.sellButton, 227, 77);

        this.sellText = scene.addText(0, 0, "Sell", normal26);
        this.addChild(this.sellText, 227, 77);

        animateEaseOutBack(0.25, f => this.scale = f);

        //this.scale = 0;
    }

    close() {
        animateEaseIn(0.25, f => this.scale = 1 - f, () => this.destroy());
    }

    sell() {
        this.listing.sell(false, true);
        animateEaseIn(0.25, f => this.scale = 1 - f);
    }


}