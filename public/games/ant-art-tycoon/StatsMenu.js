class StatsMenu extends Container {

    darkBG;
    background;
    shadow;
    closing = false;
    open = false;
    listEntries = [];
    shape;
    mask;
    startMouseY;
    startScrollAmount = 250;
    scrollAmount = 250;
    dragging = false;
    draggingScrollbar = false;
    scrollbar;

    loadedCount = 0;

    constructor(scene) {
        super(scene, 960, 540);

        this.darkBG = scene.addImageUi(19200, 10800, "shadow");
        this.darkBG.setInteractive();
        this.darkBG.on("pointerdown", () => this.close());
        this.darkBG.alpha = 0;
        this.addChild(this.darkBG, 0, 0);

        this.shadow = scene.addNineSliceUi(660, 730, "rounded-shadow", 32);
        this.addChild(this.shadow, 10, 10);

        this.background = scene.addNineSliceUi(660, 730, "rounded", 32);
        this.background.setInteractive();
        this.background.on("pointerdown", pointer => {
            if (pointer.x < 1260) {
                this.dragging = true;
            } else {
                this.draggingScrollbar = true;
            }
            this.startScrollAmount = this.scrollAmount;
            this.startMouseY = pointer.y;
        });
        this.addChild(this.background, 0, 0);

        scene.input.on('pointermove', pointer => this.pointerMove(pointer, this));
        scene.input.on('pointerup', pointer => {
            this.dragging = false;
            this.draggingScrollbar = false;
            this.startScrollAmount = this.scrollAmount;
        });
        scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.startScrollAmount = (this.startScrollAmount - deltaY).clamp(-1780, 250);
            this.setScrollPosition(0);
        });

        this.shape = scene.make.graphics();
        this.shape.fillStyle(0xffffff);
        this.shape.beginPath();
        this.shape.fillRect(630, 175, 660, 730);
        this.mask = this.shape.createGeometryMask();

        this.addEntry("Play time: " + saveData.saveProfile.totalPlayTime.toString().toHMMSS());
        this.addEntry("Square paintings sold: " + saveData.saveProfile.squareSellCount);
        this.addEntry("Landscape paintings sold: " + saveData.saveProfile.landscapeSellCount);
        this.addEntry("Portrait paintings sold: " + saveData.saveProfile.portraitSellCount);
        this.addEntry("Circular paintings sold: " + saveData.saveProfile.circleSellCount);
        this.addEntry("Hexagonal paintings sold: " + saveData.saveProfile.hexagonSellCount);
        this.addEntry("Total paintings sold: " + saveData.saveProfile.sellCount);
        this.addEntry("AFK paintings sold: " + saveData.saveProfile.afkSellCount);
        this.addEntry("Most expensive painting sold: " + formattedMoney(saveData.saveProfile.biggestSaleValue));
        this.addEntry("Paintings per minute: " + (saveData.saveProfile.sellCount / (saveData.saveProfile.totalPlayTime * 60)).toFixed(1));
        this.addEntry("Total money earned: " + formattedMoney(saveData.saveProfile.totalMoney));
        this.addEntry("Shop items purchased: " + saveData.saveProfile.itemsBought);
        this.addEntry("Money spent at shops: " + formattedMoney(saveData.saveProfile.totalMoney - saveData.saveProfile.money));
        this.addEntry("Commissions sold: " + (saveData.saveProfile.reputation - 1));
        this.addEntry("Total clicks: " + saveData.saveProfile.totalClicks);
        this.addEntry("Black ants: " + saveData.saveProfile.getTotalAntCount(0));
        this.addEntry("Red ants: " + saveData.saveProfile.getTotalAntCount(1));
        this.addEntry("Purple ants: " + saveData.saveProfile.getTotalAntCount(2));
        this.addEntry("Blue ants: " + saveData.saveProfile.getTotalAntCount(3));
        this.addEntry("Green ants: " + saveData.saveProfile.getTotalAntCount(4));
        this.addEntry("Yellow ants: " + saveData.saveProfile.getTotalAntCount(5));
        this.addEntry("Grey ants: " + saveData.saveProfile.getTotalAntCount(6));
        this.addEntry("Cyan ants: " + saveData.saveProfile.getTotalAntCount(7));
        this.addEntry("Orange ants: " + saveData.saveProfile.getTotalAntCount(8));
        this.addEntry("Total ants: " + saveData.saveProfile.totalAntCount);
        this.addEntry("Average distance walked per ant: " + this.getDistanceString(saveData.saveProfile.antDistanceWalked / saveData.saveProfile.totalAntCount));
        this.addEntry("Total distance walked by ants: " + this.getDistanceString(saveData.saveProfile.antDistanceWalked));

        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.shape.y = f.lerp(1080, 0);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.scrollbar = scene.addImageUi(16, 256, "scrollbar");
        this.addChild(this.scrollbar, 310, -220);

        this.depth = 2000;
    }

    getDistanceString(cmWalked) {
        var mWalked = cmWalked / 100;
        var kmWalked = mWalked / 1000;
        if (cmWalked < 100) return cmWalked.toFixed(1) + "cm";
        if (cmWalked < 100000) return mWalked.toFixed(1) + "m";
        return kmWalked.toFixed(1) + "km";
    }

    pointerMove(pointer, t) {
        if (t.dragging) {
            this.setScrollPosition(pointer.y - this.startMouseY);
        }
        if (t.draggingScrollbar) {
            this.startScrollAmount = pointer.y.inverseLerp(760, 320).lerp(-1780, 250);
            this.setScrollPosition(0);
        }
    }

    setScrollPosition(pos) {
        this.scrollAmount = (this.startScrollAmount + pos).clamp(-1780, 250);
        this.listEntries.forEach((entry, i) => {
            entry.y = this.scrollAmount + i * 100
        });
        this.scrollbar.y = this.scrollAmount.inverseLerp(-1780, 250).lerp(760, 320);
    }

    addEntry(message) {
        var listEntry = new StatsListEntry(this.scene, message);
        listEntry.text.setMask(this.mask);
        listEntry.depth = 2500;
        this.addChild(listEntry, 0, -300 + this.listEntries.length * 80);
        this.listEntries.push(listEntry);
        this.loadedCount++;
    }

    close() {
        if (this.closing || !this.open) return;
        this.closing = true;
        animateEaseIn(0.3, f => {
            this.y = f.lerp(540, 1620);
            this.shape.y = f.lerp(0, 1080);
            this.darkBG.alpha = 1 - f;
        }, () => this.destroy());

    }
}

class StatsListEntry extends Container {

    text;

    constructor(scene, message) {
        super(scene, 0, 0);

        this.text = scene.addText(0, 0, message, normal35);
        this.text.fitInWidth(550);
        this.text.setOrigin(0, 0.5);
        this.addChild(this.text, -280, 0);
    }


}