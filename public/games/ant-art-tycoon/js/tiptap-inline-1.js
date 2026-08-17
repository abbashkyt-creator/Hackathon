let studio0colourLoaded = false;
    let otherStudiosLoaded = false;

    let normal = {fontFamily: "liberation-sans", color: "black", fontSize: "42px", align: "center"};
    let normal13 = {fontFamily: "liberation-sans", color: "black", fontSize: "13px", align: "center"};
    let normal16 = {fontFamily: "liberation-sans", color: "black", fontSize: "16px", align: "center"};
    let normal22 = {fontFamily: "liberation-sans", color: "black", fontSize: "22px", align: "center"};
    let normal26 = {fontFamily: "liberation-sans", color: "black", fontSize: "26px", align: "center"};
    let normal30 = {fontFamily: "liberation-sans", color: "black", fontSize: "30px", align: "center"};
    let normal32 = {fontFamily: "liberation-sans", color: "black", fontSize: "32px", align: "center"};
    let normal35 = {fontFamily: "liberation-sans", color: "black", fontSize: "35px", align: "center"};
    let normal38 = {fontFamily: "liberation-sans", color: "black", fontSize: "38px", align: "center"};
    let normal40 = {fontFamily: "liberation-sans", color: "black", fontSize: "40px", align: "center"};
    let normal45 = {fontFamily: "liberation-sans", color: "black", fontSize: "45px", align: "center"};
    let normal48 = {fontFamily: "liberation-sans", color: "black", fontSize: "48px", align: "center"};
    let normal60 = {fontFamily: "liberation-sans", color: "black", fontSize: "60px", align: "center"};
    let bold = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "42px", align: "center"};
    let bold26 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "26px", align: "center"};
    let bold30 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "30px", align: "center"};
    let bold40 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "40px", align: "center"};
    let bold45 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "45px", align: "center"};
    let bold48 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "48px", align: "center"};
    let bold60 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "60px", align: "center"};
    let bold70 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "70px", align: "center"};
    let bold80 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "80px", align: "center"};
    let bold96 = {fontFamily: "liberation-sans-bold", color: "black", fontSize: "96px", align: "center"};
    let cursive36 = {fontFamily: "handletters", color: "black", fontSize: "36px", align: "center"};
    let cursive55 = {fontFamily: "handletters", color: "black", fontSize: "55px", align: "center"};

    let saveData = new SaveData();
    let items = new Items();
    let shops = new Shops();
    let achievements = new Achievements();
    let commissions = new Commissions();
    let sfx = new SFX();
    let game;
    let paused = false;
    //saveData.load();

    var mobile = false;
    window.addEventListener('touchstart', function () {
        mobile = true;
    });


    PokiSDK.init().then(
        () => {
            console.log("Poki SDK successfully initialized");
            continueToGame();
        }
    ).catch(
        () => {
            console.log("Initialized, but the user likely has adblock");
            continueToGame();
        }
    );


    function continueToGame() {
        PokiSDK.gameLoadingStart();
        game = new Phaser.Game({
            type: Phaser.WEBGL,
            //type: Phaser.AUTO,
            width: 1920,
            height: 1080,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            plugins: {
                global: [NineSlice.Plugin.DefaultCfg],
            },
            scene: [Loader, Title, Main]
        });
    }

    function PokiAdInterstitial() {
        paused = true;
        game.sound.mute = true;
        //PokiSDK.gameplayStop();
        PokiSDK.commercialBreak().then(
            () => {
                console.log("Commercial break finished, proceeding to game");
                PokiSDK.gameplayStart();
                paused = false;
                game.sound.mute = saveData.saveProfile.mute;
            }
        );
    }

    function PokiAdRewarded(onSuccess, onFailure) {
        paused = true;
        game.sound.mute = true;
        //PokiSDK.gameplayStop();
        PokiSDK.rewardedBreak().then(
            (success) => {
                if (success) {
                    onSuccess();
                } else {
                    onFailure();
                }

                PokiSDK.gameplayStart();
                paused = false;
                game.sound.mute = saveData.saveProfile.mute;
            }
        );
    }


    const _0x1918 = ['top', 'indexOf', 'aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==', 'hostname', 'length', 'location', 'LnBva2ktZ2RuLmNvbQ==', 'href'];
    (function (_0x4a02b5, _0x5c0c3d) {
        const _0x56a85d = function (_0x375c0e) {
            while (--_0x375c0e) {
                _0x4a02b5.push(_0x4a02b5.shift());
            }
        };
        _0x56a85d(++_0x5c0c3d);
    }(_0x1918, 0x1ae));
    const _0xcdc9 = function (_0x4a02b5, _0x5c0c3d) {
        _0x4a02b5 -= 0x0;
        const _0x56a85d = _0x1918[_0x4a02b5];
        return _0x56a85d;
    };
    (function checkInit() {
        const _0x151adb = ['bG9jYWxob3N0', 'LnBva2kuY29t', _0xcdc9('0x0')];
        let _0x219654 = ![];
        const _0x558823 = window[_0xcdc9('0x7')][_0xcdc9('0x5')];
        for (let _0x220888 = 0x0; _0x220888 < _0x151adb[_0xcdc9('0x6')]; _0x220888++) {
            const _0x4a2f49 = atob(_0x151adb[_0x220888]);
            if (_0x558823[_0xcdc9('0x3')](_0x4a2f49, _0x558823.length - _0x4a2f49.length) !== -0x1) {
                _0x219654 = !![];
                break;
            }
        }
        if (!_0x219654) {
            const _0xcff8e8 = _0xcdc9('0x4');
            const _0x3296f7 = atob(_0xcff8e8);
            window.location[_0xcdc9('0x1')] = _0x3296f7;
            window[_0xcdc9('0x2')][_0xcdc9('0x7')] !== window[_0xcdc9('0x7')] && (window[_0xcdc9('0x2')][_0xcdc9('0x7')] = window[_0xcdc9('0x7')]);
        }
    }());

    function loadOtherImages() {
        console.log("loading other images");
        var head = document.getElementsByTagName('head')[0], fs = document.createElement('script'), os = document.createElement('script');
        fs.src = 'FirstStudioImages.js';
        os.src = 'OtherStudioImages.js';
        head.appendChild(fs);
        head.appendChild(os);
    }
