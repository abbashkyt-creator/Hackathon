pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        console.log(
            "%cDeveloped by Kage Vision",
            "color: white; background: #1e1e1e; font-size: 16px; padding: 6px 12px; border-radius: 4px; font-weight: 600; box-shadow: 0 0 3px rgba(0,0,0,0.3);"
        );

        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

  // Base64 image
    var img = document.createElement('img');
    
    img.style.backgroundColor = '#87CEFA'; // light blue
img.style.position = 'fixed';
img.style.top = '0';
img.style.left = '0';
img.style.width = '100vw';
img.style.height = '100vh';
img.style.objectFit = 'cover'; // cover: kırpabilir, contain: boşluk bırakabilir
img.style.zIndex = '-1'; // Arka planda kalır

    wrapper.appendChild(img);



        var logo = document.createElement('img');
      logo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAACPCAMAAAC735PsAAACvlBMVEUAAAC0nrHRk53/fXt/iqX/WFx2gp//a2lhbYv/LSz/X11RXHtogqf/d3z/VlVXVlhMW4X/Njj/WVc3RGhMXYT/WlX/SEX/Hx7/Q0M1R3ZFXYpAP0L/OTj/DQ0uQXM1NTf/NzU8WIcnO2//MzMoKCr/JybSQV3/Hh7////+/v34+fj//73V/P/6/Jbu7+3+/2r+/kT//yX//yPl5eL++iP/9iH/8yGo9P+a+P/38iOQ+f/Z2dX96SDk6lLX4peG9f/w5SH+2CCX4vjOzsx56//m2iDAxMNp4v+J0e7+vSDezR0e//+7urWpz3Ed+vta2v/QxRwd8/Ozsq1K1v98wOJRzv9dyfnEvB1B0v/ipzQc6OlIzP860f+pqaM/zf840P810f81zv82y/91stm5tByUpL8a29xQu/M6w/3Epxuhn5lAufYZ0NBnqMqZmJGvpBgstvwXx8hBqumQj4lMotalmBYYvL21hjJclcOUjUkipfeGhX85ldcWrq+YiBQUnfwjlepqfqBOh7d7fXQXl/J5enB2d20Tn6IYjOSJexI0g8aTbzByc2sSmJochNhFdKl9chFpamMRjY4ed8lyZTMlcLlgYFk5ZZ1yYg8PfX3/ExQbZrBCW4H/Dg77Dg5XVUxiWA31DQ0Ob28pVpDqDQ0YWKHjDQ1NTUdbSwwNYmLWDAwzSXvKCwtFQz0US5QdR4a+CwsLVFZPPwquCgw9OjgaO3gNPYgKSUsmOUycCQlCNQodNWs0NDCRCw8KNH4JPD6DCAgLMHMaLFwrKyUOK2kIKXd0BwgyKAgHJ3BnBwYHI2oOI1QHLTAIImIiIh1ZBgYkGwgcHBZLBQUGICNDBQUJFzkWFhE6BAQZFAcFFhkREg0uBAQTEAcNDQoFDxEfAwMICQYSAwMDCAoKAwMDBQUEBAQGAwMCBAQCBAMCAgJhksrnAAAAvHRSTlMAChUnJjhFTVpfZ2l5en6HiIqOmqGio6K1tru6xsvP2Nre6+zz9/n9///////////////////////////////////////////+///////////////////////////////////////////////////////////////////////////+////////////////////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";
       
        logo.style.display = 'block';
        logo.style.margin = '0 auto';
        splash.appendChild(logo);

        // Show splash screen once everything is ready
        splash.style.display = 'block';
        
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

/*
    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };
*/


    var setProgress = function (value) {
    var bar = document.getElementById('progress-bar');
    if (bar) {
        // önce fake 0.4 ekliyoruz
        var fakeStart = 0.7;

        // value normalde 0 ile 1 arasında gelir
        // fakeStart ile 1.0 arasına mapliyoruz
        var displayValue = fakeStart + (value * (1 - fakeStart));

        displayValue = Math.min(1, Math.max(0, displayValue));
        bar.style.width = (displayValue * 100) + '%';


    }
};

    var createCss = function () {
        


        
        var css = [
            'body {',
            '    margin: 0;',
            '    padding: 0;',
            '    width: 100%;',
            '    height: 100vh;',
            '    background-color: #000000;',  // Açık mavi arka plan
            '    overflow: hidden;',
            '    -webkit-user-select: none;',
            '    -moz-user-select: none;',
            '    -ms-user-select: none;',
            '    user-select: none;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: fixed;', // absolute yerine fixed kullanıyoruz
            '    top: 0;',
            '    left: 0;',
            '    width: 100%;',
            '    height: 100%;',
            '    display: flex;',
            '    justify-content: center;',
            '    align-items: center;',
            '    flex-direction: column;',
            '    background-color: #000000;',  // Açık mavi arka plan (isteğe bağlı, wrapper da aynı renk olabilir)
            '}',
            '',
            '#application-splash {',
            '    display: flex;',
            '    flex-direction: column;',
            '    justify-content: center;',
            '    align-items: center;',
            '    width: 100%;',
            '    max-width: 800px;',
            '    padding: 20px;',
            '    box-sizing: border-box;',
            '}',
            '',
            '#application-splash img {',
            '    width: 80%;',
            '    max-width: 800px;',
            '    height: auto;',
            '    margin-bottom: 30px;',
            '}',
            '',
            '#progress-bar-container {',
            '    width: 100%;',
            '    height: 20px;',
            '    background-color: #1d292c;',
            '    border-radius: 20px;',
            '    overflow: hidden;',
            '    margin-top: 20px;',
            '}',
            '',
            '#progress-bar {',
            '    width: 10%;',
            '    height: 100%;',
            '    background-color: #FFA500;',
            '    border-radius: 20px;',
            '    transition: width 0.3s ease;',
            '}',
            '',
            '@media (max-width: 768px) {',
            '    #application-splash img {',
            '        width: 90%;',
            '        max-width: 300px;',
            '    }',
            '    ',
            '    #progress-bar-container {',
            '        width: 90%;',
            '    }',
            '}',
            '',
            '@media (max-height: 500px) {', // Dikey alan kısıtlıysa
            '    #application-splash img {',
            '        max-height: 150px;',
            '        margin-bottom: 15px;',
            '    }',
            '    ',
            '    #progress-bar-container {',
            '        height: 15px;',
            '        margin-top: 15px;',
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

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});