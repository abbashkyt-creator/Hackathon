//The big dump for any JS hacks and such

//IsMobile.js
//CC0
!function(e){var n=/iPhone/i,t=/iPod/i,r=/iPad/i,a=/\bAndroid(?:.+)Mobile\b/i,p=/Android/i,b=/\bAndroid(?:.+)SD4930UR\b/i,l=/\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i,f=/Windows Phone/i,s=/\bWindows(?:.+)ARM\b/i,u=/BlackBerry/i,c=/BB10/i,h=/Opera Mini/i,v=/\b(CriOS|Chrome)(?:.+)Mobile/i,w=/Mobile(?:.+)Firefox\b/i;function m(e,i){return e.test(i)}function i(e){var i=e||("undefined"!=typeof navigator?navigator.userAgent:""),o=i.split("[FBAN");void 0!==o[1]&&(i=o[0]),void 0!==(o=i.split("Twitter"))[1]&&(i=o[0]);var d={apple:{phone:m(n,i)&&!m(f,i),ipod:m(t,i),tablet:!m(n,i)&&m(r,i)&&!m(f,i),device:(m(n,i)||m(t,i)||m(r,i))&&!m(f,i)},amazon:{phone:m(b,i),tablet:!m(b,i)&&m(l,i),device:m(b,i)||m(l,i)},android:{phone:!m(f,i)&&m(b,i)||!m(f,i)&&m(a,i),tablet:!m(f,i)&&!m(b,i)&&!m(a,i)&&(m(l,i)||m(p,i)),device:!m(f,i)&&(m(b,i)||m(l,i)||m(a,i)||m(p,i))||m(/\bokhttp\b/i,i)},windows:{phone:m(f,i),tablet:m(s,i),device:m(f,i)||m(s,i)},other:{blackberry:m(u,i),blackberry10:m(c,i),opera:m(h,i),firefox:m(w,i),chrome:m(v,i),device:m(u,i)||m(c,i)||m(h,i)||m(w,i)||m(v,i)}};return d.any=d.apple.device||d.android.device||d.windows.device||d.other.device,d.phone=d.apple.phone||d.android.phone||d.windows.phone,d.tablet=d.apple.tablet||d.android.tablet||d.windows.tablet,d}"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=i:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?(module.exports=i(),module.exports.isMobile=i):"function"==typeof define&&define.amd?define([],e.isMobile=i()):e.isMobile=i()}(this);

function __gm_isMobile() {
    return isMobile.any;
}

/// https://yal.cc/gamemaker-html5-loading-bar-extended/
var inst = { };
///~
var loadBarImage = null, canUseLoadBarImage = false, setLoadBarSource = false;
try {
var loadBarImage = new Image();
loadBarImage.onload = () => {
    canUseLoadBarImage = true;
};
} catch (e) {

}

function customized_loadbar(ctx, width, height, total, current, image) {

    //Poki code start
    if (window.PokiSDK) {
        if (window.PokiSDK_loadState == 0) {
            window.PokiSDK_loadState = 1;
            PokiSDK.gameLoadingProgress({ percentageDone: current / total });

            if (current >= total && window.PokiSDK_loadState != 2) {
                window.PokiSDK_loadState = 2;
                PokiSDK.gameLoadingFinished();

            }
        }
    }
    //Poki code end

    image = loadBarImage;
    
    function getv(s) {
        if (window.gml_Script_gmcallback_normal_loadbar) {
            return window.gml_Script_gmcallback_normal_loadbar(inst, null,
                s, current, total,
                width, height, image ? image.width : 0, image ? image.height : 0)
        } else return undefined;
    }
    function getf(s, d) {
        var r = getv(s);
        return typeof(r) == "number" ? r : d;
    }
    function getw(s, d) {
        var r = getv(s);
        return r && r.constructor == Array ? r : d;
    }
    function getc(s, d) {
        var r = getv(s);
        if (typeof(r) == "number") {
            r = r.toString(16);
            while (r.length < 6) r = "0" + r;
            return "#" + r;
        } else if (typeof(r) == "string") {
            return r;
        } else return d;
    }

    //Set image of load bar
    if (! setLoadBarSource) {
        loadBarImage.src = getv("loadingImageUrl");
        setLoadBarSource = true;
    }

    // get parameters:
    width = getf("width", width);
    height = getf("height", height);
    var csswidth = getf("csswidth", width);
    var cssheight = getf("cssheight", height);

    //Resize the canvas
    var cnv = document.getElementById("loading_screen");
    if (cnv != null) {
        cnv.style.width = csswidth + "px";
        cnv.style.height = cssheight + "px";

        cnv.width = width;
        cnv.height = height;

        cnv.style.display = "block";
        cnv.style.position = "fixed";
    }
    
    var backgroundColor = getc("background_color", "#FFFFFF");
    var barBackgroundColor = getc("bar_background_color", "#FFFFFF");
    var barForegroundColor = getc("bar_foreground_color", "#242238");
    var barBorderColor = getc("bar_border_color", "#242238");
    var barWidth = getf("bar_width", Math.round(width * 0.8));
    var barHeight = getf("bar_height", 20);
    var barBorderWidth = getf("bar_border_width", 2);
    var barOffset = getf("bar_offset", 10);
    // background:
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    // image:
    var totalHeight, barTop;
    if (image != null && canUseLoadBarImage) {
        var wrh = 1920 / 1080;
        var newWidth = width;
        var newHeight = newWidth / wrh;
        if (newHeight < height) {
            newHeight = height;
            newWidth = newHeight * wrh;
        }

        ctx.drawImage(image, (width - newWidth) / 2, (height - newHeight) / 2, newWidth, newHeight);
    }
    var barTop = Math.max(height - Math.round(width * 0.1) - barHeight, (height - barHeight) >> 1);
    // bar border:
    var barLeft = (width - barWidth) >> 1;
    ctx.fillStyle = barBorderColor;
    ctx.fillRect(barLeft, barTop, barWidth, barHeight);
    //
    var barInnerLeft = barLeft + barBorderWidth;
    var barInnerTop = barTop + barBorderWidth;
    var barInnerWidth = barWidth - barBorderWidth * 2;
    var barInnerHeight = barHeight - barBorderWidth * 2;
    // bar background:
    ctx.fillStyle = barBackgroundColor;
    ctx.fillRect(barInnerLeft, barInnerTop, barInnerWidth, barInnerHeight);
    // bar foreground:
    var barLoadedWidth = Math.round(barInnerWidth * current / total);
    ctx.fillStyle = barForegroundColor;
    ctx.fillRect(barInnerLeft, barInnerTop, barLoadedWidth, barInnerHeight);
}

function __gm_setCanvasCSSSize(width, height) {
    var cnv = document.getElementById("canvas");
    cnv.style.width = width + "px";
    cnv.style.height = height + "px";
}

function __gm_getDevicePixelRatio() {
    return window.devicePixelRatio;
}

var touchXs = [], touchYs = [];

window.addEventListener('touchstart', function(e) {
    for (var i = 0; i < e.touches.length; i++) {
        touchXs[i] = e.touches[i].pageX;
        touchYs[i] = e.touches[i].pageY;
    }
}, false);

window.addEventListener('touchmove', function(e) {
    for (var i = 0; i < e.touches.length; i++) {
        touchXs[i] = e.touches[i].pageX;
        touchYs[i] = e.touches[i].pageY;
    }
}, false);

function html5_js_get_device_x(dvc) {
    if (touchXs.length < dvc) return 0;
    return touchXs[dvc];
}

function html5_js_get_device_y(dvc) {
    if (touchXs.length < dvc) return 0;
    return touchYs[dvc];
}

var failedOrientationLock = false;

// Try to lock the device orientation to the right orientation
function tryLockOrientation() {
    if ("orientation" in screen) {
        if ("lock" in screen.orientation)
            screen.orientation.lock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("lockOrientation" in screen.orientation)
            screen.orientation.lockOrientation("landscape");
        else if ("mozLockOrientation" in screen.orientation)
            screen.orientation.mozLockOrientation("landscape");
    } else if ("mozOrientation" in screen) {
        if ("mozLock" in screen.mozOrientation)
            screen.orientation.mozLock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("mozLockOrientation" in screen.mozOrientation)
            screen.orientation.mozLockOrientation("landscape");
    } else if ("msOrientation" in screen) {
        if ("msLock" in screen.msOrientation)
            screen.orientation.msLock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("msLockOrientation" in screen.msOrientation)
            screen.orientation.msLockOrientation("landscape");
    } else if ("webkitOrientation" in screen) {
        if ("webkitLock" in screen.webkitOrientation)
            screen.orientation.webkitLock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("webkitLockOrientation" in screen.webkitOrientation)
            screen.orientation.webkitLockOrientation("landscape");
    }
}

function toggleHTML5Fullscreen()
{
    if (! isHTML5FullScreen()) {
        try {
            var thePromiseHopefully;

            if (document.documentElement.requestFullscreen) {  
                thePromiseHopefully = document.documentElement.requestFullscreen();  
            } else if (document.documentElement.mozRequestFullScreen) {
                thePromiseHopefully = document.documentElement.mozRequestFullScreen();  
            } else if (document.documentElement.webkitRequestFullScreen) {
                thePromiseHopefully = document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
            } else if (document.documentElement.msRequestFullscreen) {
                thePromiseHopefully = document.documentElement.msRequestFullscreen();  
            }   

            //If the stars are right, .
            if (thePromiseHopefully != undefined)
                thePromiseHopefully.catch(function() {
                    //No catch
                }).then(function() {
                    if (failedOrientationLock)
                        tryLockOrientation();
                });

            tryLockOrientation();
        } catch (err) {

        }
    } else {  
        if (document.cancelFullscreen) {  
            document.cancelFullscreen();  
        } else if (document.mozCancelFullScreen) {  
            document.mozCancelFullScreen();  
        } else if (document.webkitCancelFullScreen) {  
            document.webkitCancelFullScreen();  
        } else if (document.msCancelFullscreen) {  
            document.msCancelFullscreen();  
        }
    } 

    //Firefox bug
    setTimeout(function()
    {
        document.documentElement.style.backgroundColor = "#020202";
        document.body.style.backgroundColor = "#020202";

        setTimeout(function()
        {
            document.documentElement.style.backgroundColor = "black";
            document.body.style.backgroundColor = "black";
        }, 100);
    }, 1000);
}

function isHTML5FullScreen()
{
    return (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreenElement && document.mozFullScreenElement !== null) || (document.msFullscreenElement && document.msFullscreenElement !== null) || (document.webkitFullscreenElement && document.webkitFullscreenElement !== null);
}

function __gm_addTouchscreenHandlerCanvas() {
    document.getElementById("canvas").addEventListener("touchend", function() {
        if (! isHTML5FullScreen())
            toggleHTML5Fullscreen();
    });
}