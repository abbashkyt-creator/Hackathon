window.createNoZoomBlocker = window.createNoZoomBlocker || function (target) {
    if (!target) {
        return function () {};
    }

    var lastTouchEndAt = 0;
    var opts = { passive: false, capture: true };
    var preventDefault = function (e) {
        if (e && e.cancelable !== false) {
            e.preventDefault();
        }
    };
    var onMultiTouch = function (e) {
        if (e.touches && e.touches.length > 1) {
            preventDefault(e);
        }
    };
    var onTouchEnd = function (e) {
        var now = Date.now();

        if (now - lastTouchEndAt <= 300) {
            preventDefault(e);
        }

        lastTouchEndAt = now;
    };

    target.style.touchAction = 'none';
    target.style.overscrollBehavior = 'none';

    target.addEventListener('gesturestart', preventDefault, opts);
    target.addEventListener('gesturechange', preventDefault, opts);
    target.addEventListener('gestureend', preventDefault, opts);
    target.addEventListener('touchstart', onMultiTouch, opts);
    target.addEventListener('touchmove', onMultiTouch, opts);
    target.addEventListener('touchend', onTouchEnd, opts);

    return function () {
        target.removeEventListener('gesturestart', preventDefault, opts);
        target.removeEventListener('gesturechange', preventDefault, opts);
        target.removeEventListener('gestureend', preventDefault, opts);
        target.removeEventListener('touchstart', onMultiTouch, opts);
        target.removeEventListener('touchmove', onMultiTouch, opts);
        target.removeEventListener('touchend', onTouchEnd, opts);
    };
};

pc.script.createLoadingScreen(function (app) {
    var releaseLoadingNoZoom = null;
    var showSplash = function () {
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        releaseLoadingNoZoom = window.createNoZoomBlocker(wrapper);
        document.body.appendChild(wrapper);

        // splash section
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        // progress bar
        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var percentage = document.createElement('div');
        percentage.id = 'progress-percentage';
        container.appendChild(percentage);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

        wrapper.appendChild(container);

        // 📰 NEWS AREA
        var newsArea = document.createElement('div');
        newsArea.id = 'news-area';
        newsArea.innerHTML = `
            <span class="news-title">🎢 Roller Coaster world added!</span>
            <span class="news-content">
                Improve your cart and go faster! You can also switch to other worlds for planes, cars, boats and rockets!
            </span>
            <div class="news-icons">
                <img src="https://assets.venge.io/Suspension.png" alt="Engine" />
                <img src="https://assets.venge.io/GoldenBlock.png" alt="Engine" />
                <img src="https://assets.venge.io/CarSeat.png" alt="Engine" />
            </div>
        `;
        wrapper.appendChild(newsArea);
    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');

        if (releaseLoadingNoZoom) {
            releaseLoadingNoZoom();
            releaseLoadingNoZoom = null;
        }
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        var percentage = document.getElementById('progress-percentage');
        if (bar && percentage) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
            percentage.innerText = Math.round(value * 100) + '%';
        }
    };

    var createCss = function () {
        var css = [
            ':root {',
            '   --bg_color_1: #10cbfa;',
            '   --bg_color_2: #8d10e0;',
            '}',
            '',
            'body {',
            '    background-color: var(--bg_color_1);',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background: var(--bg_color_1) url("https://assets.venge.io/Loading-BL-v10.jpg") no-repeat center center;',
            '    background-size: cover;',
            '    overflow: hidden;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 180px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
            '    z-index: 100;',
            '}',
            '',
            '#progress-bar-container {',
            '    height: 30px;',
            '    width: 50vw;',
            '    position: fixed;',
            '    left: 50%;',
            '    bottom: 10%;',
            '    transform: translate(-50%, 0%);',
            '    background-color: rgba(0, 0, 0);',
            '    border-radius: 30px;',
            '    border: solid 5px #000;',
            '    overflow: hidden;',
            '}',
            '',
            '#progress-percentage {',
            '    position: absolute;',
            '    width: 100%;',
            '    height: 100%;',
            '    display: flex;',
            '    align-items: center;',
            '    justify-content: center;',
            '    color: white;',
            '    font-weight: bold;',
            '    z-index: 1;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background: linear-gradient(0deg, rgba(110,13,13,1) 0%, rgba(255,0,0,1) 100%);',
            '}',
            '',
            /* 📰 News area styles */
            '#news-area {',
            '    position: absolute;',
            '    top: 20px;',
            '    left: 20px;',
            '    background: rgba(0, 0, 0, 0.85);',
            '    color: white;',
            '    padding: 12px 16px;',
            '    border-radius: 10px;',
            '    font-family: sans-serif;',
            '    font-size: 16px;',
            '    line-height: 1.4;',
            '    max-width: 420px;',
            '    z-index: 200;',
            '    box-shadow: 0 0 10px rgba(0,0,0,0.5);',
            '}',
            '.news-title {',
            '    font-weight: bold;',
            '    font-size: 20px;',
            '    display: block;',
            '    margin-bottom: 4px;',
            '    text-transform: uppercase;',
            '}',
            '.news-icons {',
            '    margin-top: 10px;',
            '    display: flex;',
            '    flex-wrap: wrap;',
            '    gap: 8px;',
            '    justify-content: flex-start;',
            '}',
            '.news-icons img {',
            '    max-width: 120px;',
            '    max-height: 120px;',
            '    border-radius: 6px;',
            '    background: rgba(255,255,255,0.7);',
            '    padding: 4px;',
            '    object-fit: contain;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
            '    }',
            '',
            '    #progress-bar-container {',
            '       bottom: 5%;',
            '    }',
            '',
            '    #news-area {',
            '        top: 10px;',
            '        right: 10px;',
            '        font-size: 12px;',
            '        max-width: 220px;',
            '    }',
            '    .news-icons img {',
            '        max-width: 48px;',
            '        max-height: 48px;',
            '    }',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});
