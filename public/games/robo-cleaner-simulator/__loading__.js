pc.script.createLoadingScreen(function (app) {
    app.p = true;

    window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
    });
    window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });

    if (app.p) {
        PokiSDK.init().then(
            () => {
                app.ab = false;
            }
        ).catch(
            () => {
                app.ab = true;
            }
        );

        PokiSDK.gameLoadingStart();
    }

    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        var logo = document.createElement('img');
        logo.src = 'data:image/png;base64,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'
        splash.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #70a1eb;',
            '}',
            '',
 '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
          //  '    background: rgb(147,237,255);',
          //  '    background: linear-gradient(0deg, rgba(147,237,255,1) 0%, rgba(0,116,255,1) 100%);',
           'background: ',
'conic-gradient(',
'from 0deg,',
'transparent 0deg,',
'transparent 15deg,',
'rgba(0,116,255,1) 15deg,',
'rgba(0,116,255,1) 30deg,',
'transparent 30deg,',
'transparent 45deg,',
'rgba(0,116,255,1) 45deg,',
'rgba(0,116,255,1) 60deg,',
'transparent 60deg,',
'transparent 75deg,',
'rgba(0,116,255,1) 75deg,',
'rgba(0,116,255,1) 90deg,',
'transparent 90deg,',
'transparent 105deg,',
'rgba(0,116,255,1) 105deg,',
'rgba(0,116,255,1) 120deg,',
'transparent 120deg,',
'transparent 135deg,',
'rgba(0,116,255,1) 135deg,',
'rgba(0,116,255,1) 150deg,',
'transparent 150deg,',
'transparent 165deg,',
'rgba(0,116,255,1) 165deg,',
'rgba(0,116,255,1) 180deg,',
'transparent 180deg,',
'transparent 195deg,',
'rgba(0,116,255,1) 195deg,',
'rgba(0,116,255,1) 210deg,',
'transparent 210deg,',
'transparent 225deg,',
'rgba(0,116,255,1) 225deg,',
'rgba(0,116,255,1) 240deg,',
'transparent 240deg,',
'transparent 255deg,',
'rgba(0,116,255,1) 255deg,',
'rgba(0,116,255,1) 270deg,',
'transparent 270deg,',
'transparent 285deg,',
'rgba(0,116,255,1) 285deg,',
'rgba(0,116,255,1) 300deg,',
'transparent 300deg,',
'transparent 315deg,',
'rgba(0,116,255,1) 315deg,',
'rgba(0,116,255,1) 330deg,',
'transparent 330deg,',
'transparent 345deg,',
'rgba(0,116,255,1) 345deg,',
'rgba(0,116,255,1) 360deg',
'),',
'radial-gradient(circle, rgba(147,237,255,1), rgba(0,116,255,1));',
'background-blend-mode: screen;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(45% + 6px);',
            '    width: 64px;',
            '    left: calc(50% - 32px);',
            '}',
            '',
            '#application-splash img {',
            '    width: 100%;',
            '}',
            '',
            '#progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 2px;',
            '    width: 100%;',
            '    background-color: #AABBFF;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #fff;',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        if (app.p) {
            PokiSDK.gameLoadingFinished();
        }
        app.off('preload:progress');
    });

    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});