'use strict';

function setV(val2)
{
    if(window.unityGame != null)
    {
      window.unityGame.SendMessage(unityFirebaseGameOjbectName, "V2", val2);
    }
}

function getReferrerUrl()
{
  var url = (window.location != window.parent.location)
    ? document.referrer
    : document.location.href;
    return url;
}

function isMobile()
{
  var isMobile = RegExp(/Android|webOS|iPhone|iPod|iPad/i).test(navigator.userAgent);
  return isMobile || isIpad();
}

function isTablet()
{
  var userAgent = navigator.userAgent.toLowerCase();
  var isAndroidTablet = ((userAgent.search("android") > -1) && !(userAgent.search("mobile") > -1));

  return isAndroidTablet || isIpad();
}

function isIpad()
{
  var isIpad = RegExp(/iPad/i).test(navigator.userAgent);

  if (!isIpad) 
  {
    const isMac = RegExp(/Macintosh/i).test(navigator.userAgent);

    if (isMac && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) 
    {
      isIpad = true;
    }
  }
  return isIpad;
}

function getOS()
{
  var detectedOS = "Unknown";
  if (window.navigator.userAgent.indexOf("Windows") != -1) {  detectedOS = "Windows";}
  else if (window.navigator.userAgent.indexOf("CrOS") != -1) { detectedOS = "Chrome";}
  else if (window.navigator.userAgent.indexOf("Mac")            != -1) detectedOS="Mac/iOS";
  else if (window.navigator.userAgent.indexOf("X11")            != -1) detectedOS="UNIX";
  else if (window.navigator.userAgent.indexOf("Linux")          != -1) detectedOS="Linux";
  
  return detectedOS;
}

function isIos()
{
  var isIos = (/iPhone|iPad|iPod/i.test(navigator.userAgent));
  return isIos || isIpad();
}


function copyTextToClipboard(text) 
{
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.warn('Unable to copy text');
  }
  document.body.removeChild(textArea);
}

window.copyText = function (text) {
  var listener = function () {

    copyTextToClipboard(text);
    if(isMobile())
    {
      document.removeEventListener('touchend', listener);
    }
    else
    {
      document.removeEventListener('mouseup', listener);
    }
    
  };

  if(isMobile())
  {
    document.addEventListener('touchend', listener);
  }
  else
  {
    document.addEventListener('mouseup', listener);
  }
};

function firebaseLogEvent(eventName)
{
  if(firebase.analytics != null) firebase.analytics().logEvent(eventName);
}

function firebaseSetScreen(screenName)
{
  if(firebase.analytics != null) firebase.analytics().setCurrentScreen(screenName);  
  if(firebase.analytics != null) firebase.analytics().logEvent("screen_view", { "screen_name": screenName})
}

function firebaseLogEventWithParam(eventName, p, v)
{
  if(firebase.analytics != null) firebase.analytics().logEvent(eventName, { [p]: v});
}

function firebaseLogEventWithParamDict(eventName, paramsDict)
{
  if(firebase.analytics != null) firebase.analytics().logEvent(eventName, paramsDict);
}

var fs = false;
function toggleFullscreen()
{
  if(fs)
  {
    console.log("exitFullScreen");
    exitFullScreen();
  }
  else
  {
    console.log("setElementFullScreen");    
    var elem = document.getElementById("mainContainer");
    setElementFullScreen(elem);
  }
  fs = !fs;
}

function isFullscreen()
{
  return fs;
}


  function onNextMouseUp(a)
  {
    var listenerName = isMobile() ? 'touchend' : 'mouseup';
    var listener = function () {
          a();
          document.removeEventListener(listenerName, listener);
        };
        document.addEventListener(listenerName, listener);
  }

  function reloadPage()
  {
    location.reload();
  }

  function openUrl(url)
  {
    onNextMouseUp(function () {
      console.log("openUrl onNextMouseUp");
      window.open(url, "_blank");
    });
  }

  function setElementFullScreen(el) {
		onNextMouseUp(function () {
      var request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
			request.call(el);
		});
	}

	function exitFullScreen() {
		onNextMouseUp(function () {
			var exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
			exitFS.call(document);
		});
  }
   
  function handleKeyDown(keycode) 
  {
    if(window.unityGame) window.unityGame.SendMessage(unityFirebaseGameOjbectName, "HandleKeyDown", keycode);
  }

  function handleKeyUp(keycode) 
  {
    if(window.unityGame) window.unityGame.SendMessage(unityFirebaseGameOjbectName, "HandleKeyUp", keycode);
  }
  
  var source = "notset";
  function setUrlSource(src)
  {
    source = src;
    console.log("setUrlSource " + src);
  }
  // Clipboard functionality
  var clipboardState = {
    operationInProgress: false,
    inputElement: null,
    currentGameObject: null,
    currentMethod: null,
    isInitialized: false,
    pasteHandled: false
  };

  function initCopyPaste() {
    if(clipboardState.isInitialized) {
      clipboardState.inputElement.focus();
      clipboardState.inputElement.select();
    }
  }

  function initClipboardSystem() {    
    // Create the invisible input element and keep it ready
    var input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.top = '-1000px';
    input.style.left = '-1000px';
    input.style.opacity = '0';
    input.style.pointerEvents = 'auto';
    input.style.zIndex = '-1';
    input.id = 'clipboard-helper-input';
    input.setAttribute('readonly', 'true');
    
    document.body.appendChild(input);
    
    clipboardState.inputElement = input;
    clipboardState.isInitialized = true;
    clipboardState.currentGameObject = "JavascriptMessageReceiver";
    clipboardState.currentMethod = "Paste";

    // Set up paste event listener
    input.addEventListener('paste', function(e) {
      if (clipboardState.pasteHandled) {
        console.log("[ClipboardJS] Paste already handled, ignoring");
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      var pastedText = (e.clipboardData || window.clipboardData).getData('text');
      
      clipboardState.pasteHandled = true;
      clipboardState.operationInProgress = false;
      
      // Send to Unity
      if (window.unityGame && clipboardState.currentGameObject && clipboardState.currentMethod) {
        window.unityGame.SendMessage(clipboardState.currentGameObject, clipboardState.currentMethod, pastedText);
      }
      
      // Reset pasteHandled after a short delay to allow for future pastes
      setTimeout(function() {
        clipboardState.pasteHandled = false;
      }, 100);
    });
  }

  initClipboardSystem();

  function checkWebGL2Support() {
    // Allow forcing WebGL2 failure for testing via ?forceNoWebGL2=1
    var params = new URLSearchParams(window.location.search);
    if (params.get("forceNoWebGL2") === "1") {
      console.warn("[TEST] Forcing WebGL2 support check to fail via URL param forceNoWebGL2=1");
    }
    var testCanvas = document.createElement("canvas");
    var webgl2Context = (params.get("forceNoWebGL2") === "1") ? null : testCanvas.getContext("webgl2");
    if (!webgl2Context) {
      console.error("Your browser does not support WebGL 2 which is required for this content.");
      var errorDiv = document.createElement("div");
      errorDiv.style.cssText = "position:fixed;left:0;top:0;z-index:10000;width:100vw;height:100vh;background:#1b70f0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:Arial,Helvetica,sans-serif;color:#fff;";
      errorDiv.innerHTML = '<div style="font-size:64px;margin-bottom:20px;">⚠️</div>'
        + '<h1 style="font-size:28px;margin:0 0 12px 0;">WebGL 2 Not Supported</h1>'
        + '<p style="font-size:16px;max-width:500px;margin:0 20px 16px 20px;line-height:1.5;opacity:0.9;">Your browser does not support WebGL 2, which is required to play Obby Roads.</p>'
        + '<div style="font-size:14px;max-width:460px;margin:8px 20px;line-height:1.6;opacity:0.75;text-align:left;">'
        + 'Try the following:<br>'
        + '• Update your browser to the latest version<br>'
        + '• Try a different browser (Chrome, Firefox, Edge)<br>'
        + '• Make sure hardware acceleration is enabled in your browser settings<br>'
        + '• Update your graphics drivers</div>';
      document.body.appendChild(errorDiv);
      return false;
    }
    return true;
  }

  window.checkWebGL2Support = checkWebGL2Support;




