class AntCounter extends Container {
    circles = [];
    justUpdated = false;
    ant;
    showing = false;

    get hovered() {
        return game.input.mousePointer.x < 620 && game.input.mousePointer.y > 980;
    }

    currentVelocity = {value: 0};
    background;

    constructor(scene, x, y) {
        super(scene, x, y);

        this.background = scene.addNineSliceUi(600, 68, "rounded", 32);
        this.addChild(this.background, 300, -34);

        this.circles.push(new CountCircle(this.scene, 0, new Color(115, 115, 115), new Color(47, 47, 47)));
        this.circles.push(new CountCircle(this.scene, 1, new Color(255, 109, 109), new Color(236, 83, 83)));
        this.circles.push(new CountCircle(this.scene, 2, new Color(235, 119, 213), new Color(209, 93, 188)));
        this.circles.push(new CountCircle(this.scene, 3, new Color(116, 108, 255), new Color(90, 82, 236)));
        this.circles.push(new CountCircle(this.scene, 4, new Color(166, 255, 110), new Color(140, 236, 83)));
        this.circles.push(new CountCircle(this.scene, 5, new Color(255, 255, 110), new Color(236, 232, 84)));
        this.circles.push(new CountCircle(this.scene, 6, new Color(175, 166, 166), new Color(149, 141, 141)));
        this.circles.push(new CountCircle(this.scene, 7, new Color(108, 255, 255), new Color(83, 230, 236)));
        this.circles.push(new CountCircle(this.scene, 8, new Color(255, 214, 109), new Color(236, 189, 83)));
        for (var i = 0; i < 9; i++) {
            this.addChild(this.circles[i], 77 + 61 * i, -34);
        }

        this.ant = scene.addImageUi(46, 33, "Black Ant Big");
        this.ant.angle = -90;
        this.addChild(this.ant, 30, -34);

        if (saveData.saveProfile.antCounter) {
            this.showing = true;
        } else {
            this.scale = 0;
        }

    }

    update(time, delta) {
        this.justUpdated = false;


        if (!this.showing && saveData.saveProfile.antCounter) {
            animateEaseOutBack(0.5, f => this.scale = f);
            this.showing = true;
        }
        if (this.showing) {
            this.scale = smoothDamp(this.scale, this.hovered ? 2 : 1, this.currentVelocity, 0.1, 999, delta / 1000);
        }
        this.circles.forEach(circle => circle.scale = this.scale);

    }

    updateCounts() {
        if (this.justUpdated) return;
        this.justUpdated = true;
        this.circles.forEach(circle => circle.update());
    }
}

class CountCircle extends Container {

    leftSide;
    rightSide;
    cover;
    text;
    fillColour;
    backgroundColour;
    id;
    showing = false;

    constructor(scene, id, fillColour, backgroundColour) {
        super(scene, 0, 0);
        this.id = id;
        this.fillColour = getColour(fillColour);
        this.backgroundColour = getColour(backgroundColour);

        this.leftSide = scene.addImageUi(27, 54, "semicircle");
        this.leftSide.tint = this.backgroundColour;
        this.addChild(this.leftSide, -12, 0);

        this.rightSide = scene.addImageUi(27, 54, "semicircle");
        this.rightSide.tint = this.fillColour;
        this.rightSide.angle = 180;
        this.addChild(this.rightSide, 12, 0);

        this.cover = scene.addImageUi(27, 54, "semicircle");
        this.cover.tint = this.backgroundColour;
        this.cover.setOrigin(0.96, 0.5);
        this.cover.angle = 180;
        this.addChild(this.cover, 0, 0);

        this.text = scene.addText(0, 0, "255", bold40);
        if (id === 0) {
            this.text.style.color = "white";
            this.text.updateText();
        }
        this.text.scale = 0.5;
        this.addChild(this.text, 0, 0);

        if (saveData.saveProfile.antCounter) {
            this.showing = true;
        } else {
            this.scale = 0;
        }
    }


    setValue(value, total) {
        var i = value / total;
        var extra = i > 0.5 ? 0 : 180;
        this.cover.angle = i.lerp(extra, 360 + extra);
        this.cover.tint = i > 0.5 ? this.fillColour : this.backgroundColour;
        this.text.setText(value);
    }

    update() {
        if (saveData.saveProfile.antCounter && !this.showing) {
            this.showing = true;
            animateEaseOutBack(0.5, f => this.scale = f);
        }
        this.setValue(saveData.saveProfile.studio.antCounts[this.id], this.id === 0 ? 230 : 225);
    }


}