class TitleAnt extends Phaser.GameObjects.Image {

    delay;
    speed;
    direction;
    startX;
    startY;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        this.delay = Math.random() * 5;
        this.startX = x;
        this.startY = y;
        this.reset();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.speed = randomRange(4, 5);
        this.direction = new Phaser.Math.Vector2(randomRange(610, 1310) - this.x, randomRange(390, 690) - this.y).normalize();
    }

    update(time, delta) {
        if (this.delay > 0) {
            this.delay -= delta / 1000;
        } else {
            this.x += this.speed * this.direction.x;
            this.y += this.speed * this.direction.y;
            this.rotation = Math.atan2(-this.direction.y, -this.direction.x) + 0.2 * Math.sin(time / 30);
            if (this.y > 1100 || this.y < -50) {
                this.reset();
            }
        }
    }

}