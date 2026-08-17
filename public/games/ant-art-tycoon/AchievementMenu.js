class AchievementMenu extends Container {

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
            this.startScrollAmount = (this.startScrollAmount - deltaY).clamp(-9050, 250);
            this.setScrollPosition(0);
        });

        this.shape = scene.make.graphics();
        this.shape.fillStyle(0xffffff);
        this.shape.beginPath();
        this.shape.fillRect(630, 175, 660, 730);
        this.mask = this.shape.createGeometryMask();

        for (var i = 0; i < 10; i++) {
            this.loadNextEntry(true);
        }

        doAfterDelay(0.5, () =>
            doUntil(() => this.loadedCount >= achievements.achievements.length || this.closing, () => {
                this.loadNextEntry(false);
            })
        );

        animateEaseOutBack(0.5, f => {
            this.y = f.lerp(1620, 540);
            this.shape.y = f.lerp(1080, 0);
            this.darkBG.alpha = f;
        }, () => this.open = true);

        this.scrollbar = scene.addImageUi(16, 256, "scrollbar");
        this.addChild(this.scrollbar, 310, -220);

    }

    pointerMove(pointer, t) {
        if (t.dragging) {
            this.setScrollPosition(pointer.y - this.startMouseY);
        }
        if (t.draggingScrollbar) {
            this.startScrollAmount = pointer.y.inverseLerp(760, 320).lerp(-9050, 250);
            this.setScrollPosition(0);
        }
    }

    setScrollPosition(pos) {
        this.scrollAmount = (this.startScrollAmount + pos).clamp(-9050, 250);
        this.listEntries.forEach((entry, i) => {
            entry.y = this.scrollAmount + i * 100
        });
        this.scrollbar.y = this.scrollAmount.inverseLerp(-9050, 250).lerp(760, 320);
    }

    loadNextEntry(animate) {
        var achievement = achievements.achievements[this.loadedCount];
        var listEntry = new AchievementListEntry(this.scene, achievement, animate);
        listEntry.background.setMask(this.mask);
        listEntry.icon.setMask(this.mask);
        listEntry.text.setMask(this.mask);
        this.addChild(listEntry, 0, -300 + achievement.id * 100);
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

class AchievementListEntry extends Container {

    achievement;
    background;
    icon;
    text;
    grey = new Color(230, 230, 230);
    white = new Color(255, 255, 255);
    yellow = new Color(250, 230, 110);
    gold = new Color(192, 160, 0);


    constructor(scene, achievement, animate) {
        super(scene, 0, 0);
        this.achievement = achievement;

        var complete = achievements.isComplete(achievement);
        
        this.background = scene.addImageUi(87, 87, "circle");
        this.background.tint = getColour(complete ? this.yellow : this.grey);
        this.addChild(this.background, -247, 0);

        this.icon = scene.addImageUi(56, 56, "trophy");
        this.icon.tint = getColour(complete ? this.gold : this.white);
        this.addChild(this.icon, -247, 0);

        this.text = scene.addText(0, 0, achievement.name, normal35);
        this.text.fitInWidth(450);
        this.addChild(this.text, 54, 0);
    }


}