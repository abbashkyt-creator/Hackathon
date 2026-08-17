pc.script.createLoadingScreen(function (app) {
    var setProgress = function (value) {
        value = Math.min(1, Math.max(0, value));
        let temp = Math.max(value, window.loadingProgress);
        if (value > window.loadingProgress) {
            window.loadingProgress = value;
            if (window.loadingInterval != null) {
                clearInterval(window.loadingInterval);
                console.log("INTERVAL CLEARED...");
                window.loadingInterval = null;
            }
        }

        value = temp;
        var bar = document.getElementById('progress-bar');
        if (bar) {
            let progress = value * 100;
            bar.style.width = progress + '%';

            var progressText = document.getElementById('loadingText');
            if (progressText) progressText.textContent = Math.floor(progress) + '%';
        }
    };

    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'block';

        var logoContainer = document.createElement('div');
        logoContainer.id = 'logo-container';
        splash.appendChild(logoContainer);
        logoContainer.style.display = 'block';

        logoContainer.onload = function () {
            splash.style.display = 'block';
        };

        var progressBarContainer = document.createElement('div');
        progressBarContainer.id = 'progress-bar-container';
        splash.appendChild(progressBarContainer);

        var loadingText = document.createElement('div');
        loadingText.id = 'loadingText';
        loadingText.textContent = "1%";
        splash.appendChild(loadingText);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        progressBarContainer.appendChild(bar);

        window.loadingProgress = 0;

        window.loadingInterval = setInterval(() => {
            if (window.loadingProgress >= 0.5) {
                window.loadingProgress = 0.5;
                if (window.loadingInterval != null) {
                    clearInterval(window.loadingInterval);
                    console.log("INTERVAL CLEARED...");
                    window.loadingInterval = null;
                }
                return;
            }

            window.loadingProgress += 0.001;
            setProgress(window.loadingProgress);
        }, Math.random() * 50);
    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    let a = "#AA6B39";
    let b = "#AA6B39";
    let c = "yellow";

    var createCss = function () {
        var css = [
            'body {',
            '    margin: 0;',
            '    padding: 0;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background: radial-gradient(circle, #fff6c5 0%, #ff9800 100%);',
            '    background-size: cover;',  // Stretch the image to cover the entire container
            '    background-position: center;',  // Center the background image
            '    display: flex;',
            '    justify-content: center;',
            '    align-items: center;',
            '}',
            '',
            '#application-splash {',
            '    position: relative;',
            '    width: 80%;',  // Adjust the width of the splash container
            '    max-width: 600px;',  // Limit the maximum width
            '    text-align: center;',
            '}',
            '',
            '#logo-container {',
            '    aspect-ratio: 1;',  // Make the logo container take the full width of the splash container
            '    width: auto;',  // Make the logo container take the full width of the splash container
            '    height: 300px;',  // Adjust the height to make the logo bigger
            '    max-height: 60%;',  // Adjust the height to make the logo bigger
            `    background-image: url(${window.loadingLogo});`,
            '    background-size: contain;',  // Ensure the logo fits within the container
            '    background-position: center;',  // Center the logo
            '    background-repeat: no-repeat;',  // Prevent repetition
            '    margin: 0 auto 20px auto;',  // Center the logo horizontally and add space below it
            '    outline: 4px solid #AA6B39;',
            '    border-radius: 20px;',
            '}',
            '',
            '#progress-bar-container {',
            '    display: flex;',
            '    border-radius: 15px;',
            '    border: 4px solid #AA6B39;',
            '    margin: 5px auto 0 auto;',
            '    height: 15px;',
            '    width: 300px;',
            '    max-width: calc(100% - 4px);',
            '    background-color: #1d292c;',
            '}',
            '',
            '#progress-bar {',
            '    border-radius: 25px;',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: yellow;',
            '}',
            '',
            '#loadingText {',
            '   margin: 10px 0;',  // Adjust margin for better spacing
            '   color: #001;',
            '   font-size: 28px;',
            '   text-align: center;',
            '   font-family: Montserrat, sans-serif;',
            '   font-weight: 700;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 90%;',  // Adjust for smaller screens
            '    }',
            '    #logo-container {',
            '        height: 150px;',  // Adjust logo height for smaller screens
            '    }',
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

    var createTextures = function () {
        // Texture creation logic (if any)
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        createTextures();
        app.off('preload:progress');
        // console.log("root:", app.root);
        // aa
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});