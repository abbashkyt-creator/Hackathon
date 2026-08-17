class Loader extends Phaser.Scene {
    constructor() {
        super({key: 'loader'})
    }

    loadingText;
    antSpinner;

    paintingCounts = [
        {black: 17, colour: 151},
        {black: 14, colour: 102},
        {black: 10, colour: 110},
        {black: 0, colour: 154},
        {black: 0, colour: 155}
    ];

    animateSpinner() {
        animate(1, f => {
            this.antSpinner.angle = f.lerp(0, 360);
            this.smoothValue = smoothDamp(this.smoothValue, this.value, this.currentVelocity, 0.1, 999, 0.016);
            if (this.value >= 1) this.smoothValue = 1;
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(800, 570, 320 * this.smoothValue, 50);
        }, () => this.animateSpinner());
    }

    loadedIcon;
    value;
    smoothValue;
    progressBar;
    currentVelocity = {value: 0};

    preload() {


        this.load.image('white-ant-big', 'assets/images/White Ant Big.png');

        this.progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(800, 570, 320, 50);
        this.loadingText = this.addText(960, 595, "Loading...", normal26);
        this.loadingText.setColour(new Color(255, 255, 255));


        this.load.on('progress', value => {
                this.value = value;
                if (!this.loadedIcon && value > 0.05) {
                    this.loadedIcon = true;
                    doAfterDelay(0.5, () => {
                        this.antSpinner = this.addImageUi(100, 70, "white-ant-big");
                        this.antSpinner.x = 960;
                        this.antSpinner.y = 500;
                        this.animateSpinner();
                    });
                }
                this.loadingText.setText("Loading " + parseInt(value * 100) + '%');

            }
        );

        /* this.load.on('fileprogress', function (file) {
             assetText.setText('Loading asset: ' + file.key);
         });
 */
        this.load.on('complete', function () {

            PokiSDK.gameLoadingFinished();

            sfx.applause = game.sound.add("applause");
            sfx.applauseQuiet = game.sound.add("applause-quiet");
            sfx.achievement = game.sound.add("achievement");
            sfx.cashMoney = game.sound.add("cash-money");
            sfx.no = game.sound.add("no");
            sfx.click = game.sound.add("click");
            sfx.music = game.sound.add("music");
            sfx.music.loop = true;
            //saveData.clear();
            saveData.load();

            loadOtherImages();

            game.scene.start("title");
        });

        this.load.image('ant-big', 'assets/images/Black Ant Big.png');
        this.load.image('title', 'assets/images/title.png');
        for (let i = 1; i <= 10; i++) {
            this.load.image('wood' + i, 'assets/images/wood/' + i + '.png');
        }
        this.load.image('button', 'assets/images/RoundedCorners.png');
        this.load.image('ant', 'assets/images/Black Ant.png');
        this.load.image('ant-white', 'assets/images/White Ant.png');
        for (let i = 0; i < 6; i++) {
            this.load.image('stamp' + i, 'assets/images/stamps/full-res/stamp' + (i + 1) + '.png');
            this.load.image('stampHalfRes' + i, 'assets/images/stamps/half-res/stamp' + (i + 1) + '.png');
            this.load.image('stampFifthRes' + i, 'assets/images/stamps/fifth-res/stamp' + (i + 1) + '.png');
        }
        // for (var studio = 0; studio < 5; studio++) {
        //     for (var i = 1; i <= this.paintingCounts[studio].black; i++) {
        //         this.load.image(studio + '-black-painting' + i, 'assets/images/Paintings/Studio ' + studio + '/Black/Painting' + i + '.png');
        //     }
        //     for (var i = 1; i <= this.paintingCounts[studio].colour; i++) {
        //         this.load.image(studio + '-painting' + i, 'assets/images/Paintings/Studio ' + studio + '/Painting' + i + '.png');
        //     }
        // }
        // for (var i = 0; i < 50; i++) {
        //     this.load.image('commission' + i, 'assets/images/Paintings/Commissions/' + i + '.png');
        // }

        for (let i = 0; i < studio0black.length; i++) {
            game.textures.addBase64('0-black-painting' + i, "data:image/png;base64," + studio0black[i]);
        }

        // doWhen(() => studio0colourLoaded === true, () => {
        //     console.log("Loaded studio 0 colour images " + studio0colour.length);
        //     for (let i = 0; i < studio0colour.length; i++) {
        //         game.textures.addBase64('0-painting' + i, "data:image/png;base64," + studio0colour[i]);
        //     }
        //
        // });


        // doWhen(() => otherStudiosLoaded, () => {
        //     console.log("Loaded all images");
        //     for (let i = 0; i < studio1black.length; i++) {
        //         game.textures.addBase64('1-black-painting' + i, "data:image/png;base64," + studio1black[i]);
        //     }
        //
        //     for (let i = 0; i < studio1colour.length; i++) {
        //         game.textures.addBase64('1-painting' + i, "data:image/png;base64," + studio1colour[i]);
        //     }
        //
        //     for (let i = 0; i < studio2black.length; i++) {
        //         game.textures.addBase64('2-black-painting' + i, "data:image/png;base64," + studio2black[i]);
        //     }
        //
        //     for (let i = 0; i < studio2colour.length; i++) {
        //         game.textures.addBase64('2-painting' + i, "data:image/png;base64," + studio2colour[i]);
        //     }
        //
        //     for (let i = 0; i < studio3black.length; i++) {
        //         game.textures.addBase64('3-black-painting' + i, "data:image/png;base64," + studio3black[i]);
        //     }
        //
        //     for (let i = 0; i < studio3colour.length; i++) {
        //         game.textures.addBase64('3-painting' + i, "data:image/png;base64," + studio3colour[i]);
        //     }
        //
        //     for (let i = 0; i < studio4black.length; i++) {
        //         game.textures.addBase64('4-black-painting' + i, "data:image/png;base64," + studio4black[i]);
        //     }
        //
        //     for (let i = 0; i < studio4colour.length; i++) {
        //         game.textures.addBase64('4-painting' + i, "data:image/png;base64," + studio4colour[i]);
        //     }
        //
        //     for (let i = 0; i < commissionImages.length; i++) {
        //         game.textures.addBase64('commission' + i, "data:image/png;base64," + commissionImages[i]);
        //     }
        //
        // });

        this.load.image('paint', 'assets/images/paint.png');
        this.load.image('paint-highlight', 'assets/images/paint-highlight.png');
        this.load.image('triangle', 'assets/images/triangle.png');
        this.load.image('plus', 'assets/images/plus.png');
        this.load.image('minus', 'assets/images/minus.png');
        this.load.image('rounded', 'assets/images/RoundedCorners.png');
        this.load.image('rounded-shadow', 'assets/images/RoundedCornersShadow.png');
        this.load.image('square', 'assets/images/square10.png');
        this.load.image('shadow', 'assets/images/shadow10.png');
        this.quickLoad("assets/images/Shop Icons/Achievements.png");
        this.quickLoad("assets/images/Shop Icons/afk.png");
        this.quickLoad("assets/images/Shop Icons/Ant Counter.png");
        this.quickLoad("assets/images/Shop Icons/autosell25.png");
        this.quickLoad("assets/images/Shop Icons/betterpaintings.png");
        this.quickLoad("assets/images/Shop Icons/Bigger Paintings.png");
        this.quickLoad("assets/images/Shop Icons/Black Ant Shop.png");
        this.quickLoad("assets/images/Shop Icons/Black Ant Speed.png");
        this.quickLoad("assets/images/Shop Icons/Blue.png");
        this.quickLoad("assets/images/Shop Icons/Certification.png");
        this.quickLoad("assets/images/Shop Icons/Colours.png");
        this.quickLoad("assets/images/Shop Icons/Commute.png");
        this.quickLoad("assets/images/Shop Icons/Cyan.png");
        this.quickLoad("assets/images/Shop Icons/Extra Listing.png");
        this.quickLoad("assets/images/Shop Icons/Green.png");
        this.quickLoad("assets/images/Shop Icons/Grey.png");
        this.quickLoad("assets/images/Shop Icons/interest.png");
        this.quickLoad("assets/images/Shop Icons/MailShopIcon.png");
        this.quickLoad("assets/images/Shop Icons/Multiple Studios.png");
        this.quickLoad("assets/images/Shop Icons/Orange.png");
        this.quickLoad("assets/images/Shop Icons/Purple.png");
        this.quickLoad("assets/images/Shop Icons/quicksell.png");
        this.quickLoad("assets/images/Shop Icons/Red.png");
        this.quickLoad("assets/images/Shop Icons/removecheapestlisting.png");
        this.quickLoad("assets/images/Shop Icons/Shop Slot.png");
        this.quickLoad("assets/images/Shop Icons/skipbutton.png");
        this.quickLoad("assets/images/Shop Icons/specialoffers.png");
        this.quickLoad("assets/images/Shop Icons/Stats.png");
        this.quickLoad("assets/images/Shop Icons/White Ant Shop.png");
        this.quickLoad("assets/images/Shop Icons/Yellow.png");
        this.quickLoad("assets/images/semicircle.png");
        this.quickLoad("assets/images/semicircle-big.png");
        this.quickLoad("assets/images/Black Ant Big.png");
        this.quickLoad("assets/images/trophy.png");
        this.quickLoad("assets/images/circle.png");
        this.quickLoad("assets/images/scrollbar.png");
        this.quickLoad("assets/images/home.png");
        this.quickLoad("assets/images/mail.png");
        this.quickLoad("assets/images/ring.png");
        this.quickLoad("assets/images/circle128.png");
        this.quickLoad("assets/images/hexagon.png");
        this.quickLoad("assets/images/cross.png");
        this.quickLoad("assets/images/tick.png");
        this.quickLoad("assets/images/cheque.jpg");
        this.quickLoad("assets/images/circle-stencil.png");
        this.quickLoad("assets/images/hexagon-stencil.png");
        this.quickLoad("assets/images/wood/ss-bg.png");
        this.quickLoad("assets/images/frame.jpg");
        this.quickLoad("assets/images/frame-circle.png");
        this.quickLoad("assets/images/frame-hexagon.png");
        this.quickLoad("assets/images/vignette.png");
        this.quickLoad("assets/images/rosette.png");
        this.quickLoad("assets/images/skip.png");
        this.quickLoad("assets/images/stats.png");
        this.quickLoad("assets/images/clock.png");
        this.quickLoad("assets/images/sound-off.png");
        this.quickLoad("assets/images/sound-on.png");
        this.quickLoad("assets/images/video-ad.png");
        this.quickLoad("assets/images/cash.png");
        this.quickLoad("assets/images/speed-boost.png");
        this.quickLoad("assets/images/half-price.png");
        this.quickLoad("assets/images/listing-price.png");
        this.quickLoad("assets/images/spotlight.png");

        this.load.audio('applause', 'assets/SFX/Applause.mp3');
        this.load.audio('applause-quiet', 'assets/SFX/ApplauseQuiet.mp3');
        this.load.audio('achievement', 'assets/SFX/Achievement.mp3');
        this.load.audio('cash-money', 'assets/SFX/CashMoney.mp3');
        this.load.audio('no', 'assets/SFX/No.mp3');
        this.load.audio('click', 'assets/SFX/Click.mp3');
        this.load.audio('music', 'assets/SFX/music.mp3');

        this.load.unityAtlas("confetti", "assets/images/confetti.png", "assets/images/confetti.png.meta");

    }
}