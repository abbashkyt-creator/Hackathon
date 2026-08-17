// Poki Unity SDK Bridge Functions
var unityInstance = null;
var unityInstanceName = null;

window.initPokiBridge = function(instanceName) {
  console.log('[PokiBridge] Initializing bridge, saving instance name:', instanceName);
  unityInstanceName = instanceName;
  unityInstance = window.unityInstance || window.gameInstance || null;
  var checkPokiSDK = setInterval(function() {
    if (typeof PokiSDK !== 'undefined') {
      clearInterval(checkPokiSDK);
      console.log('[PokiBridge] PokiSDK is ready!');
      if (!unityInstance) unityInstance = window.unityInstance || window.gameInstance;
      if (unityInstance && unityInstance.SendMessage) {
        unityInstance.SendMessage(unityInstanceName, 'ready');
      } else {
        console.warn('[PokiBridge] Unity instance not found, cannot send ready message');
      }
    }
  }, 100);
};

window.commercialBreak = function() {
  if (!unityInstance) unityInstance = window.unityInstance || window.gameInstance;
  if (typeof PokiSDK === 'undefined') {
    console.warn('[PokiBridge] PokiSDK not ready for commercial break');
    if (unityInstance && unityInstanceName) unityInstance.SendMessage(unityInstanceName, 'commercialBreakCompleted');
    return;
  }
  PokiSDK.commercialBreak().then(function() {
    console.log('[PokiBridge] Commercial break completed');
    if (unityInstance && unityInstanceName) unityInstance.SendMessage(unityInstanceName, 'commercialBreakCompleted');
  });
};

window.rewardedBreak = function(options) {
  if (!unityInstance) unityInstance = window.unityInstance || window.gameInstance;
  if (typeof PokiSDK === 'undefined') {
    console.warn('[PokiBridge] PokiSDK not ready for rewarded break');
    if (unityInstance && unityInstanceName) unityInstance.SendMessage(unityInstanceName, 'rewardedBreakCompleted', 'false');
    return;
  }
  PokiSDK.rewardedBreak(options).then(function(withReward) {
    console.log('[PokiBridge] Rewarded break completed, reward:', withReward);
    if (unityInstance && unityInstanceName) unityInstance.SendMessage(unityInstanceName, 'rewardedBreakCompleted', withReward ? 'true' : 'false');
  });
};

window.shareableURL = function(params) {
  if (!unityInstance) unityInstance = window.unityInstance || window.gameInstance;
  if (typeof PokiSDK === 'undefined') {
    console.warn('[PokiBridge] PokiSDK not ready for shareable URL');
    if (unityInstance && unityInstanceName) unityInstance.SendMessage(unityInstanceName, 'shareableURLRejected');
    return;
  }
  PokiSDK.shareableURL(params).then(function(url) {
    console.log('[PokiBridge] Shareable URL resolved:', url);
    if (unityInstance && unityInstanceName) unityInstance.SendMessage(unityInstanceName, 'shareableURLResolved', url);
  }).catch(function() {
    console.log('[PokiBridge] Shareable URL rejected');
    if (unityInstance && unityInstanceName) unityInstance.SendMessage(unityInstanceName, 'shareableURLRejected');
  });
};
