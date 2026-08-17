class Title extends Phaser.Scene {
    constructor() {
        super({key: 'title'})
    }

    preload() {

    }

    titleAnts = [];


    create() {

        //testing
        //this.scene.start("main");
        //remember to delete!

        let background = this.add.tileSprite(960, 540, 1920, 1080, 'wood1');

        for (let i = 0; i < 10; i++) {
            const y = Math.random() > 0.5 ? -50 : 1100;
            const x = randomRange(0, 1920);
            let ant = new TitleAnt(this, x, y, "ant");
            this.titleAnts.push(ant);
            this.add.existing(ant);
        }

        let logo = this.add.image(960, 350, 'title');
        logo.scale = 1.1;


        var label = "Play";
        if (saveData.saveProfile.totalAntCount > 5) label = "Continue (" + saveData.saveProfile.totalAntCount + " ants)";

        let playButton = drawButton(this, label, 960, 830, 440, 107, () => {
            console.log("Studio 1 colour pictures loaded: " + studio0colourLoaded);
            console.log("All pictures loaded: " + otherStudiosLoaded);
            animateEaseIn(1, f => {
                playButton.setPosY(f.lerp(830, -100));
                logo.y = f.lerp(350, -580);
            }, () => {

                PokiSDK.commercialBreak().then(
                    () => {
                        console.log("Commercial break finished, proceeding to game");
                        PokiSDK.gameplayStart();
                        game.scene.add("ui", new UI());
                        this.scene.start("main")
                    }
                );

            })
        });
    }

    update(time, delta) {
        this.titleAnts.forEach(ant => ant.update(time, delta));
    }
}

