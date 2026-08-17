class Confetti extends Container {


    constructor(scene, x, y) {
        super(scene, x, y);

        this.particles = scene.add.particles('confetti');

        var emitter = this.particles.createEmitter({
            frame: [
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'
            ],
            x: x,
            y: y,
            frequency: -1,
            lifespan: 8000,
            speed: {min: 100, max: 1000},
            scale: {start: 1, end: 1},
            //angle: {min: 0, max: 180},
            rotate:// [
                {start: 0, end: 2000},
            //   {start: 1000, end: 0},
            // ],
            gravityY: 200,
            tint: [
                getColour(new Color(255, 0, 0)),
                getColour(new Color(255, 170, 44)),
                getColour(new Color(241, 255, 0)),
                getColour(new Color(0, 255, 23)),
                getColour(new Color(39, 255, 255)),
                getColour(new Color(105, 156, 255)),
                getColour(new Color(180, 96, 255)),
                getColour(new Color(255, 255, 255))
            ]
//            angle: {start: {min: 0, max: 360}, end: {min: 0, max: 360}},
        });

        emitter.explode(100, this.x, this.y);

        doAfterDelay(8, () => this.destroy());
    }


}