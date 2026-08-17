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
        logo.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA3CAYAAABKB8k/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGj2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTA3LTE3VDE1OjI4OjA1LTAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI1LTA3LTE3VDE1OjI4OjA1LTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wNy0xN1QxNToyODowNS0wMzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiNGQwNmE4MS1jZDZhLTM5NDEtYTFiNC0xNzUxMjI0YmUxZWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3ZjM2NTMzYS1kMjNjLTc0NDAtOTMyMy0zZjlhZTAwMDgyYzUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1ODZmOWMyYy0xZmM4LTE4NDQtOTlkOC05ZjgwY2MzNzcwMWIiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU4NmY5YzJjLTFmYzgtMTg0NC05OWQ4LTlmODBjYzM3NzAxYiIgc3RFdnQ6d2hlbj0iMjAyNS0wNy0xN1QxNToyODowNS0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNGQwNmE4MS1jZDZhLTM5NDEtYTFiNC0xNzUxMjI0YmUxZWMiIHN0RXZ0OndoZW49IjIwMjUtMDctMTdUMTU6Mjg6MDUtMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjFkNjA3N2I5LTc0NjAtMzA0Ny1hNWM4LWM4YzgxNzhlNDBmODwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqhiTQAAAAShSURBVGje3ZptiFRVGMfvndnd2WlFy9fNQtdCCV9ao00tUno1yCKJKCVSkLCCwg9r7EISUhgFgmzMkiRJtDTIQhBiCCKL0ZcIMSIkDIk+RDhISMiyiCy/vvwvHU7n3L0zd+7MbR+4MMy95zznf87z/pwACDJ6bgPeAt4A5mXFJ6vFF4AD/EtDQPh/AtABjBkAjgHFPAIIgU4PgE8NABUPgM60J5Nm8SVgrxa6RWITvStaAEYtAEXgEX2zB+hqB4AnjQVeB/YBZUMHbAARwB5gEJg03j/cDgBP81/6ElikHT5s/P+hACwBxh3jHs0SQCiT2GP93w0cBKatxZwDnhOYiD4HtgPfWd/elLXqtua+RaY3TAsgBLYCPwOngGUOZX0RuOLY1eue3xH9CTyvOcw5+4CTwHlgc1oAZeBbg+mgY1dCoB+YIDmdAe71zDVsfHdaxiIVgLPGhIdj7PkC4OMEiz8CzI/xH+Yc36QFUASOGhMe99j96OmSWbzqWPgVYFeC8abujFjm2QtgIfC45C+0jvRda0fKCfTmIeCyMe4SsCmBUvZYojjsWM/dwGPRKQbAXMnaNPA78Lr+iwa9akz4U8zx2yd3zBj3ScJQYpHARrTLeHcr8Cbwh6zXSWBOIEQ2TQAbxNR0WDVgecJgbrQeUdBzF/CX5R+KwIMyzzatiOx5xfFyUnb+kBAD3ADWJjyBuFDC96w3eN0E3gfeE1+XMSiZjuMV2XsXmc5qU4YAtnh4YonxzkgXbeVbJrf/d4wZ3JYhgO0xfK9JGu40FdvHfKM8oYvGgdszAHAH8JWH5/fAA645Ak+Mfp8jbjHponar1AQA3cALwC8x/M5JPzp9AEKgF3hJJrXmURybqlLqQgMACgonxhPwuaE1ndYaeyMxChT1DQG/xSjwhOTPZcquAvst/1CMyQeisGNYcu0y4REvnyJfBt4G5gYyVS6qaYe3CmRBixz0RJ8/6NsOfTtivPtIO9ahPOK8Jzrdp9A9lON6Cjhh+QaTDgRWrIMmHwZWe2S8ILGpeiY9BNwPfGH89xkwICCuEx4Tv4JHR9YA7wAXrLEjAbBSAVQV2AEsTug1y1LkHz2BW806TdepXQCedSQ0Pu++RD7ghDZohZmglxpM63rlsafqyAemFCQubrASUooKAc2qzxSV1ByfwXpNSZz6E55yywtb91hhtE2XgFV5rMzVewLrmn0CrdaByRQ6EFmmUgRgpcxYVV4u71Zoh6xQFVgVKFtqth8YaJEfOBooYcibJy4k9MQH2xkLDXkWVk8sNG9WRKN5yQcupskHbOYbJNO+jGxpBhnZ0hkysoGZMrIsc+JK1jlxXqoSmy2e056qxMtmVSJPdaH+RupCvsrcxiZW5o5kVJnrc9VGX7Ma082ojSY9gXproz2zojqd5/7AjKKX9w7NqWa0mEyPvN/T11rfQI9sXSt6ZCHwDPCrmPZ5upQ1h99otEu5HPhakUDqLmUEYgEwx3E6cX3isRR94rKsY0iGOfG2Ojr1H7SzU+97nqjjrkQlj3cluuTkktxWqcTcVtndrtsq9dwXGs3jfaFZcWNr1t6Za9mtxX8A4pMvUX6bERAAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg=='
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
            '    top: calc(50% - 40px);',
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