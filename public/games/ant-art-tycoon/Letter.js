class Letter extends Container {

    darkBG;
    background;
    text;
    yoursSincerelyText;
    signatureText;
    directorNameText;
    closeButton;
    closeText;
    acceptButton;
    acceptText;
    closing = false;
    open = false;
    commission;

    getLetterText(commission) {
        var texture = this.scene.textures.getFrame("commission" + commission.id);
        var size = (texture.source.width / 10).round(0.1).toFixed(1) + "cm x " + (texture.source.height / 10).round(0.1).toFixed(1) + "cm";
        var output = "Dear Sir/Madam\n\n" + commission.letterContents + "\n\n";
        output += "We would like a " + size + " painting of " + commission.paintingContent + "\n\n";
        output += "For this, we can offer a payment of " + formattedMoney(commission.payment);
        print(output);
        return output;
    }

    constructor(scene, commission) {
        super(scene, 960, 540);

        this.commission = commission;

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(595, 733, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -54);

        this.text = scene.addText(0, 0, this.getLetterText(commission), normal35);
        this.text.style.wordWrap = true;
        this.text.style.setWordWrapWidth(550);
        //this.text.style.overflow = 550;
        this.text.setOrigin(0, 0);
        this.text.style.align = "left";
        this.text.setPadding(10, 10, 10, 10);
        this.text.updateText();
        this.addChild(this.text, -277, -400);

        this.yoursSincerelyText = scene.addText(0, 0, "Yours sincerely,", normal26);
        this.yoursSincerelyText.setOrigin(0, 0.5);
        this.addChild(this.yoursSincerelyText, -265, 180);

        this.signatureText = scene.addText(0, 0, commission.director, cursive55);
        this.signatureText.setOrigin(0, 0.5);
        this.signatureText.setPadding(10, 10, 10, 10);
        this.signatureText.updateText();
        this.addChild(this.signatureText, -275, 230);

        this.directorNameText = scene.addText(0, 0, commission.director + ", Director", normal26);
        this.directorNameText.setOrigin(0, 0.5);
        this.addChild(this.directorNameText, -265, 280);

        this.closeButton = scene.addImageUi(286, 92, "square");
        this.closeButton.setInteractive({cursor: "pointer"});
        this.closeButton.on("pointerdown", () => this.close());
        this.addChild(this.closeButton, -153, 376);

        this.closeText = scene.addText(0, 0, "Close", normal35);
        this.addChild(this.closeText, -153, 376);

        this.acceptButton = scene.addImageUi(286, 92, "square");
        this.acceptButton.setInteractive({cursor: "pointer"});
        this.acceptButton.on("pointerdown", () => this.accept());
        this.addChild(this.acceptButton, 153, 376);

        this.acceptText = scene.addText(0, 0, "Accept", normal35);
        this.addChild(this.acceptText, 153, 376);

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

    accept() {
        this.close();
        //new Confirmation(this.scene, 0, this.commission);
        new CommissionStudioSelect(this.scene, this.commission);
    }
}

class Confirmation extends Container {

    darkBG;
    background;
    text;
    noButton;
    noText;
    yesButton;
    yesText;
    closing = false;
    open = false;
    commission;
    studioId;

    constructor(scene, studioId, commission) {
        super(scene, 960, 540);

        this.studioId = studioId;
        this.commission = commission;

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(595, 253, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -60);

        this.text = scene.addText(0, 0, "Create painting in Studio " + (studioId + 1) + "?\n\n(Your current painting will be\ndiscarded)", normal35);
        this.addChild(this.text, 0, -63);

        this.noButton = scene.addImageUi(286, 92, "square");
        this.noButton.setInteractive({cursor: "pointer"});
        this.noButton.on("pointerdown", () => this.no());
        this.addChild(this.noButton, -153, 131);

        this.noText = scene.addText(0, 0, "No", normal35);
        this.addChild(this.noText, -153, 131);

        this.yesButton = scene.addImageUi(286, 92, "square");
        this.yesButton.setInteractive({cursor: "pointer"});
        this.yesButton.on("pointerdown", () => this.yes());
        this.addChild(this.yesButton, 153, 131);

        this.yesText = scene.addText(0, 0, "Yes", normal35);
        this.addChild(this.yesText, 153, 131);

        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.depth = 1500;
    }

    no() {
        if (this.closing || !this.open) return;
        this.scene.letter = new Letter(this.scene, this.commission);
        this.close();
    }

    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => this.destroy());
    }

    yes() {
        print("accepting commission");

        //saveData.saveProfile.studios[this.studioId].currentCommission = this.scene.mailQueue[0].id;
        saveData.saveProfile.studios[this.studioId].startCommission(this.scene.mailQueue[0].id, this.scene.main);

        this.scene.mailQueue = this.scene.mailQueue.slice(1);
        this.close();
    }
}

class InvalidStudio extends Container {

    darkBG;
    background;
    text;
    okayButton;
    okayText;
    closing = false;
    open = false;
    commission;

    constructor(scene, studioId, commission) {
        super(scene, 960, 540);

        this.commission = commission;

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(420, 209, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -60);

        var message = "This studio cannot\ncreate paintings that\nare big enough";
        if (studioId % 5 !== commission.paintingType) message = "This studio cannot\ncreate paintings that\nare the right shape";
        if (saveData.saveProfile.studios[studioId].currentCommission > -1) message = "This studio is\nalready working on\na commission";

        this.text = scene.addText(0, 0, message, normal35);
        this.addChild(this.text, 0, -63);

        this.okayButton = scene.addImageUi(420, 92, "square");
        this.okayButton.setInteractive({cursor: "pointer"});
        this.okayButton.on("pointerdown", () => this.okay());
        this.addChild(this.okayButton, 0, 106);

        this.okayText = scene.addText(0, 0, "Okay", normal35);
        this.addChild(this.okayText, 0, 106);


        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.depth = 1500;
    }

    okay() {
        if (this.closing || !this.open) return;
        this.scene.letter = new Letter(this.scene, this.commission);
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => this.destroy());
    }

}


class CommissionStudioSelect extends Container {

    darkBG;
    titleBackground;
    titleText;
    cancelButton;
    cancelText;
    closing = false;
    open = false;
    commission;
    buttons = [];

    constructor(scene, commission) {
        super(scene, 960, 540);

        this.commission = commission;


        var studioCount = saveData.saveProfile.studios.length;
        var offsetY = 0;
        if (studioCount < 5) {
            offsetY = (5 - studioCount) * 50;
        }

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -10;
        this.addChild(this.darkBG, 0, 0);

        this.titleBackground = scene.addImageUi(310, 75, "square");
        this.addChild(this.titleBackground, 0, -293 + offsetY);

        this.titleText = scene.addText(0, 0, "Select a studio", normal35);
        this.titleText.depth = 10;
        this.addChild(this.titleText, 0, -293 + offsetY);

        this.cancelButton = scene.addImageUi(310, 94, "square");
        this.cancelButton.setInteractive({cursor: "pointer"});
        this.cancelButton.on("pointerdown", () => this.cancel());
        this.addChild(this.cancelButton, 0, 302 - offsetY);

        this.cancelText = scene.addText(0, 0, "Cancel", normal35);
        this.cancelText.depth = 10;
        this.addChild(this.cancelText, 0, 302 - offsetY);

        var texture = this.scene.textures.getFrame("commission" + commission.id);
        var width = texture.source.width;

        for (var i = 0; i < studioCount; i++) {
            var button = new CommissionStudioSelectButton(scene, i, this, commission, width);
            this.buttons.push(button);
            var x = i < 5 ? -160 : 160;
            if (studioCount < 6) x = 0;
            var y = -200 + 100 * (i % 5) + offsetY;
            this.addChild(button, x, y);
        }

        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.depth = 1500;
    }

    cancel() {
        if (this.closing || !this.open) return;
        this.scene.letter = new Letter(this.scene, this.commission);
        this.close();
    }

    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => this.destroy());
    }

    button(id, isCompatible) {
        print("You clicked on studio " + (id + 1));
        if (this.closing || !this.open) return;
        if (isCompatible) {
            new Confirmation(this.scene, id, this.commission);
        } else {
            new InvalidStudio(this.scene, id, this.commission);
        }
        this.close();
    }

}

class CommissionStudioSelectButton extends Container {

    background;
    text;
    ring;
    numberText;
    compatibleIcon;
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

    constructor(scene, studioId, studioSelect, commission, commissionWidth) {
        super(scene, 960, 540);


        var isCompatible =
            commission.paintingType === studioId % 5 &&
            commissionWidth <= saveData.saveProfile.studios[studioId].maxWidth &&
            saveData.saveProfile.studios[studioId].currentCommission < 0;

        this.background = scene.addImageUi(310, 90, "square");
        this.background.depth = -1;
        this.background.setInteractive({cursor: "pointer"})
        this.background.on("pointerdown", () => studioSelect.button(studioId, isCompatible));
        this.addChild(this.background, 0, 0);

        this.text = scene.addText(0, 0, "Studio", normal35);
        this.addChild(this.text, -70, 0);

        this.ring = scene.addImageUi(50, 50, "ring");
        this.ring.setColour(this.colours[studioId]);
        this.addChild(this.ring, 22, 0);

        this.numberText = scene.addText(0, 0, studioId + 1, bold40);
        this.numberText.setColour(this.colours[studioId]);
        this.addChild(this.numberText, 22, 0);


        this.compatibleIcon = scene.addImageUi(42, 42, isCompatible ? "tick" : "cross");
        this.addChild(this.compatibleIcon, 106, 0);

        this.depth = 2000;
    }

}

class PaymentLetter extends Container {

    darkBG;
    background;
    text;
    yoursSincerelyText;
    signatureText;
    directorNameText;
    closeButton;
    closeText;
    acceptButton;
    acceptText;
    closing = false;
    open = false;
    commission;
    cheque;
    chequeAmountWordsText;
    chequeAmountNumbersText;
    chequeDateText;
    chequeSignatureText;
    photoBackground;
    photoVignette;
    photoFrame;
    photoCanvas;

    getLetterText(commission) {
        var output = "Dear Sir/Madam\n\n" + commission.paymentLetterContents + "\n\n";
        output += "Enclosed is a cheque for " + formattedMoney(commission.payment) + " and a photograph of the painting hanging in our gallery";
        return output;
    }

    constructor(scene, commission) {
        super(scene, 960, 540);

        this.commission = commission;

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(595, 733, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -54);

        this.text = scene.addText(0, 0, this.getLetterText(commission), normal30);
        this.text.style.wordWrap = true;
        this.text.style.setWordWrapWidth(550);
        //this.text.style.overflow = 550;
        this.text.setOrigin(0, 0);
        this.text.style.align = "left";
        this.text.setPadding(10, 10, 10, 10);
        this.text.updateText();
        this.addChild(this.text, -277, -400);

        this.yoursSincerelyText = scene.addText(0, 0, "Yours sincerely,", normal26);
        this.yoursSincerelyText.setOrigin(0, 0.5);
        this.addChild(this.yoursSincerelyText, -265, 180 - 200);

        this.signatureText = scene.addText(0, 0, commission.director, cursive55);
        this.signatureText.setOrigin(0, 0.5);
        this.signatureText.setPadding(10, 10, 10, 10);
        this.signatureText.updateText();
        this.addChild(this.signatureText, -275, 230 - 200);

        this.directorNameText = scene.addText(0, 0, commission.director + ", Director", normal26);
        this.directorNameText.setOrigin(0, 0.5);
        this.addChild(this.directorNameText, -265, 280 - 200);

        //cheque
        this.cheque = scene.addImageUi(372, 168, "cheque");
        this.cheque.angle = -2.6;
        this.addChild(this.cheque, -128, 211);

        this.chequeAmountWordsText = scene.addText(0, 0, numberToWords(commission.payment), normal16);
        this.chequeAmountWordsText.angle = -2.6;
        this.addChild(this.chequeAmountWordsText, -153, 193);

        this.chequeAmountNumbersText = scene.addText(0, 0, formattedMoney(commission.payment).slice(1), normal16);
        this.chequeAmountNumbersText.angle = -2.6;
        this.addChild(this.chequeAmountNumbersText, 6, 188);

        this.chequeDateText = scene.addText(0, 0, "04/02/2021", normal13);
        this.chequeDateText.angle = -2.6;
        this.addChild(this.chequeDateText, -41, 163);

        this.chequeSignatureText = scene.addText(0, 0, commission.director, cursive36);
        this.chequeSignatureText.angle = -2.6;
        this.chequeSignatureText.setPadding(10, 10, 10, 10);
        this.chequeSignatureText.updateText();
        this.addChild(this.chequeSignatureText, -43, 248);

        //photo
        this.photoBackground = scene.addImageUi(199, 262, "square");
        this.photoBackground.setColour(commission.galleryWallColour);
        this.photoBackground.angle = 4.7;
        this.addChild(this.photoBackground, 204, 161);


        var width = commission.paintingType % 5 === 1 ? 193 : 145;
        var height = commission.paintingType % 5 === 2 ? 193 : 145;

        if (commission.paintingType % 5 < 3) {
            this.photoFrame = scene.addNineSliceUi(width, height, "frame", 22);
            this.photoFrame.angle = 4.7;
            this.addChild(this.photoFrame, 204, 161);
        }

        this.photoCanvas = scene.add.existing(scene.main.createCommissionCanvas(commission));
        this.photoCanvas.displayWidth = width - 42;
        this.photoCanvas.displayHeight = height - 42;
        this.photoCanvas.angle = 4.7;
        this.addChild(this.photoCanvas, 204, 161);

        if (commission.paintingType % 5 >= 3) {
            var circle = commission.paintingType % 5 === 3;
            width = circle ? 165 : 135;
            height = circle ? 165 : 132;

            if (!circle) {
                var hexagonMask = scene.addImageUi(110, 120, "hexagon-stencil");
                hexagonMask.angle = 4.7;
                hexagonMask.setColour(commission.galleryWallColour);
                this.addChild(hexagonMask, 204, 161);
            }

            this.photoFrame = scene.addImageUi(width, height, circle ? "frame-circle" : "frame-hexagon");
            this.photoFrame.angle = 4.7;
            this.addChild(this.photoFrame, 204, 161);
        }

        this.photoVignette = scene.addImageUi(199, 262, "vignette");
        this.photoVignette.alpha = 0.37;
        this.photoVignette.angle = 4.7;
        this.addChild(this.photoVignette, 204, 161);


        ///buttons
        this.closeButton = scene.addImageUi(286, 92, "square");
        this.closeButton.setInteractive({cursor: "pointer"});
        this.closeButton.on("pointerdown", () => this.close());
        this.addChild(this.closeButton, -153, 376);

        this.closeText = scene.addText(0, 0, "Close", normal35);
        this.addChild(this.closeText, -153, 376);

        this.acceptButton = scene.addImageUi(286, 92, "square");
        this.acceptButton.setInteractive({cursor: "pointer"});
        this.acceptButton.on("pointerdown", () => this.accept());
        this.addChild(this.acceptButton, 153, 376);

        this.acceptText = scene.addText(0, 0, "Accept", normal35);
        this.addChild(this.acceptText, 153, 376);

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

    accept() {
        this.close();
        //new Confirmation(this.scene, 0, this.commission);

        saveData.saveProfile.reputation++;
        this.scene.paymentMailQueue = this.scene.paymentMailQueue.slice(1);
        saveData.saveProfile.money += this.commission.payment;
        new ReputationLetter(this.scene);
    }
}

class ReputationLetter extends Container {
    darkBG;
    background;
    titleText;
    text;
    rosette;
    rosetteText;
    okayButton;
    okayText;
    closing = false;
    open = false;
    commission;

    constructor(scene) {
        super(scene, 960, 540);

        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(420, 406, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -56);

        this.titleText = scene.addText(0, 0, "Your reputation\nlevel went up!", bold40);
        this.addChild(this.titleText, -20, -177);

        var message = "You are now level " + saveData.saveProfile.reputation + ". If\nyou increase your\nreputation level you\nwill receive higher\nvalued commissions";
        this.text = scene.addText(0, 0, message, normal35);
        this.addChild(this.text, 0, 5);

        this.rosette = scene.addImageUi(234, 234, "rosette");
        this.rosette.angle = -14;
        this.addChild(this.rosette, 224, -188);

        this.rosetteText = scene.addText(0, 0, saveData.saveProfile.reputation, bold70);
        this.rosetteText.angle = -14;
        this.rosetteText.fitInWidth(60);
        this.rosetteText.setColour(new Color(255, 255, 255));
        this.addChild(this.rosetteText, 212, -238);

        this.okayButton = scene.addImageUi(420, 92, "square");
        this.okayButton.setInteractive({cursor: "pointer"});
        this.okayButton.on("pointerdown", () => this.okay());
        this.addChild(this.okayButton, 0, 214);

        this.okayText = scene.addText(0, 0, "Nice!", normal35);
        this.addChild(this.okayText, 0, 214);


        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.depth = 1500;
    }

    okay() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.darkBG.alpha = 1 - f;
        }, () => this.destroy());
    }
}

class FinalLetter extends Container {

    darkBG;
    background;
    text;
    yoursSincerelyText;
    signatureText;
    directorNameText;
    closeButton;
    closeText;
    acceptButton;
    acceptText;
    closing = false;
    open = false;

    getLetterText() {
        var output = "Dear Ant Art Tycoon\n\n";
        output += "You did it! you made it all the way to the end of the game. It was a long journey but I always knew you could make it!\n\n";
        output += "Thank you for playing my game. I hope you enjoyed playing it as much as I did making it\n\n";
        output += "If you had fun, try playing our other games";
        return output;
    }

    constructor(scene) {
        super(scene, 960, 540);


        this.darkBG = scene.addImageUi(1920, 4080, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.alpha = 0;
        this.darkBG.depth = -20;
        this.addChild(this.darkBG, 0, 0);

        this.background = scene.addImageUi(595, 733, "square");
        this.background.depth = -10;
        this.addChild(this.background, 0, -54);

        this.text = scene.addText(0, 0, this.getLetterText(), normal35);
        this.text.style.wordWrap = true;
        this.text.style.setWordWrapWidth(550);
        this.text.setOrigin(0, 0);
        this.text.style.align = "left";
        this.text.setPadding(10, 10, 10, 10);
        this.text.updateText();
        this.addChild(this.text, -277, -400);

        this.yoursSincerelyText = scene.addText(0, 0, "Yours sincerely,", normal26);
        this.yoursSincerelyText.setOrigin(0, 0.5);
        this.addChild(this.yoursSincerelyText, -265, 180);

        this.signatureText = scene.addText(0, 0, "Simon Wixon", cursive55);
        this.signatureText.setOrigin(0, 0.5);
        this.signatureText.setPadding(10, 10, 10, 10);
        this.signatureText.updateText();
        this.addChild(this.signatureText, -275, 230);

        this.directorNameText = scene.addText(0, 0, "Simon Wixon, Wix Games", normal26);
        this.directorNameText.setOrigin(0, 0.5);
        this.addChild(this.directorNameText, -265, 280);

        this.closeButton = scene.addImageUi(286, 92, "square");
        this.closeButton.setInteractive({cursor: "pointer"});
        this.closeButton.on("pointerdown", () => this.close());
        this.addChild(this.closeButton, -153, 376);

        this.closeText = scene.addText(0, 0, "Close", normal35);
        this.addChild(this.closeText, -153, 376);

        this.acceptButton = scene.addImageUi(286, 92, "square");
        this.acceptButton.setInteractive({cursor: "pointer"});
        this.acceptButton.on("pointerdown", () => this.accept());
        this.addChild(this.acceptButton, 153, 376);

        this.acceptText = scene.addText(0, 0, "Accept", normal35);
        this.addChild(this.acceptText, 153, 376);

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

    accept() {
        this.close();
    }
}