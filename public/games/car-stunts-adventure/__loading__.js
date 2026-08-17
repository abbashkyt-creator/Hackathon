pc.script.createLoadingScreen(function (app) {
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

        // Base64 encoded image, generated from: https://base64.guru/converter/encode/image
        // Data URI -- content type
        logo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAAAdCAQAAAAkusnLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKVWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNC0yNlQxNzozNTozMCswNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDQtMjZUMTc6Mzg6NTYrMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDQtMjZUMTc6Mzg6NTYrMDU6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmZlZmU2N2JlLTkzMDEtZjI0My1iODdhLWRjOGE4ZjU1NTJlNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjVmODRkZWM5LTg5MzEtMDM0NC1iOTNmLWRhOWQ5MTFmZDFlOSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjFkNzZmOTY4LTE1MjgtOTk0Yi04MGNiLTBhYjA2YmRmYmU1MiI+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iTE9BRElORyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iTE9BRElORyIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWQ3NmY5NjgtMTUyOC05OTRiLTgwY2ItMGFiMDZiZGZiZTUyIiBzdEV2dDp3aGVuPSIyMDI1LTA0LTI2VDE3OjM1OjMwKzA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTAyZThjYjQtMzZiOS0wNzQwLTllYzUtNmQyM2I3OTlkM2FhIiBzdEV2dDp3aGVuPSIyMDI1LTA0LTI2VDE3OjM4OjQwKzA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBlMGI5NGE3LTM1OGQtYTE0OS1iMGU0LWEzOTg5ODIwOTkwMCIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0yNlQxNzozODo1NiswNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmZWZlNjdiZS05MzAxLWYyNDMtYjg3YS1kYzhhOGY1NTUyZTQiIHN0RXZ0OndoZW49IjIwMjUtMDQtMjZUMTc6Mzg6NTYrMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MGUwYjk0YTctMzU4ZC1hMTQ5LWIwZTQtYTM5ODk4MjA5OTAwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFkNzZmOTY4LTE1MjgtOTk0Yi04MGNiLTBhYjA2YmRmYmU1MiIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjFkNzZmOTY4LTE1MjgtOTk0Yi04MGNiLTBhYjA2YmRmYmU1MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoixVhgAAARfSURBVGiB7Zvbdas6EIa/2Ws3oBZICZwSSAmkBFyCKSEuwSkhlGBKCCWEEkIJcx4kMEYC450LWiv+85LASBr0S6O5KKLc8RvxZ2sF7tgGd+J/Kf5uOHZCDiCHa4JqyElIAehoqKX510G1wEweNTTSLcg2UnutX0ItdA908nKDNutFvxq63U+mqqpXvl2N7vVDpzhpttBmr6qqH8F3J68v218xK7sPtH4O9q2qegq+SXV/MfKr7jXdcvYjJ14Tfbug5330V4Aq16pfKPlq4m3vJigbIl5DCy9MvKazY75uN/tRn/FqeHUGvuRBRB7lQYQnrOk9hqnXHAN0wOzSoBQH/mPn+st4n1K/gOCeD2hT8Ea/SCpKSkpa9/cNh8KXI+Ydr0dVVf3QdPZNEmj1qqof+qyq6r/3dzGAZs5KvC3LuifvoT5CO14Lt7ffp4tUC93fTX0QmswbbHBHwNF7bpwRzWbICRIPmjrqiyVZ9yQPL7sp8cMXBM992HL2Yzb1lvBGquDbw0hmDEtcLfUVYz+BNK5Hb0kEZCsqwOAtuwlsX608rtXi5xAz8fZkDNOOVHSA8ZysYmhVAcmS9z+BHSkJHR8ednRAFrZGFmqcLrvVGvwg4id+PmK3by7Of81IgEo6eiIXqLmEtK7HFUtFOmcfjgvuoO2nPWcBYkK0xPcTujBtoSVhaa5cyxYobvDUbVJmlbwcqAGz4N2nZ13iQ7TE43nyHixNo/2phhzoBq/Ahkurz3lW7k3tQ0yAYvYwMSMto0O8xP8LbEL1HB1bIlcb+9UwANI46pddvAvip6mcL9dsNeIlfu1OaUe/jww9gDQ0QOrnAWawVq7HCy2Q+MHhCOsPmh/FlkWaRUhjt4Mm0s6IWJqGt5q6J9nI+Nrlky+4iGPcSJJ0uuMEPGsV0DLkMVTDcbIy8/ddiJZ4oCUBUuaIt2HX2TL0Jt2f0kIP4frbGGqcv3CDFy61VuTAET9W93wQOFfuwmWen0O8pp4hgx6E9mVaR9MQNYdgVp3zVqa7seTbR/S+ubeapavyAj+O+InPZ8IxS1M9mFhbmqllAueAXSVejcuzXb0dcAnp3Aj7qZ7Ow9jcqIcRMfFS0TKTGNXUTefZg584dgOsRLa879RwIgG62ytm8uIiel9Pl1ZedP42QsTE0yc7c53kxzTDlj3qPmLXhAzofOKlp3IpuVrw5g6O3XVfYF5Pb+zK6fOsr7EZ/Aicu8B+cD6y1LrjCBTkWtHSYEjIHUkNT0MLt9+DtFUUQHFhxDMXQhvSwYvoKGcKQlcgrZZhgy5PeiIDcnLtBg3Sb8gt3Irty7IBjLNxReDilS28jqyAk5mJw139PIeFGzinNbV79yR0+6a/G+TfwNnPfqfey7KzkBceRndWwBr0R3k6725356aZ9ceXjH1LTcmDPM7mC9ZhtgYnBxHKie9QUVKKfGrET0G2yxre9tVq+oTNJwmKChvO/v0/aX4nojf1d3wP7sT/UvwPXSea4V6ecFwAAAAASUVORK5CYII=";

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
        if (bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    // background-color: #283538
    // progress-bar-container: #1d292c
    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #005166;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #005166;', 
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 28px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
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
            '    background-color: #407583;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #f60;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
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