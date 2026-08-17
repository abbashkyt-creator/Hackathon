class Paint extends Phaser.GameObjects.Image {

    highlight;
    colour;

    constructor(scene, id, colour) {
        let texture = "paint";
        super(scene, 0, 0, texture);
        this.colour = colour;
        this.tint = getColour(colour);
        let degrees = (id * 360) / scene.currentColours.length;
        let pos = this.onCircle(degrees, 40 + 1.41 * 5 * scene.pictureSize.width);
        this.x = pos.x + 960;
        this.y = pos.y + 540;
        this.scale = 0;
        doAfterDelay(0.2 + degrees / 1000, () => {
            this.highlight = scene.add.image(this.x, this.y, "paint-highlight");
            this.highlight.scale = 0;
            animateEaseOutBack(0.5, f => {
                this.scale = f * 0.5;
                this.highlight.scale = f * 0.5;
            })
        });
    }

    onCircle(degrees, radius) {
        let radians = (degrees + 180) * degToRad();
        return {x: radius * Math.sin(radians), y: radius * Math.cos(radians)};
    }

    update(time, delta) {

    }

}