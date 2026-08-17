'use strict';

var unityFirebaseGameOjbectName = 'JavascriptMessageReceiver';

var firstLoad = true;
var pokiSigninStarted = false;
var pokiSignInComplete = false;
var isNewUser = -1; // -1 = not ready, 0 = returning user, 1 = new user
var firstVisitEventSent = false; // Guard: only ever send once per new anon user
var onAuthStateChangedCallCount = 0;

function onAuthStateChanged(user) {
  onAuthStateChangedCallCount++;

  if(!user)
  {
    if(firstLoad)
    {
      isNewUser = 1;
      signInAnonymously();
    }
  }
  else
  {
    if(firstLoad)
    {
      isNewUser = 0;
    }
    else if(isNewUser === 1)
    {
      if(!firstVisitEventSent)
      {
        firstVisitEventSent = true;
        sfve();
      }
    }

    if(!pokiSigninStarted)
    {
      pokiSigninStarted = true;
      autoLoginPoki();
    }
    else if(pokiSignInComplete)
    {
      sendAuthDataToUnity();
    }
  }

  firstLoad = false;
}

// Called from Unity to check if isNewUser status is already known
// Returns: -1 = not ready, 0 = returning user, 1 = new user
function getIsNewUser()
{
  if (!pokiSignInComplete) return -1;
  return isNewUser;
}


// Helper to ensure errors are logged with full details for Poki QA
function logErrorWithDetails(context, error) {
  const errorInfo = {
    context: context,
    message: error?.message || 'Unknown error',
    code: error?.code || 'N/A',
    name: error?.name || 'Error',
    stack: error?.stack || 'No stack trace'
  };
  console.error(context + ': ' + errorInfo.message, errorInfo);
}

function signInAnonymously(setPokiSignInComplete = false)
{
  firebase.auth().signInAnonymously().then(function(userCredential) {
    if (setPokiSignInComplete) {
      pokiSignInComplete = true;
      onAuthStateChanged(firebase.auth().currentUser);
    }
  }).catch(function(error) {
    var errorCode = error.code;
    console.log("error logging in " + errorCode);
    logErrorWithDetails('signInAnonymously', error);
  });
}

function signInWithEmail(email, password)
{
  firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
      })
      .catch(function(error)
      {
        console.log("error logging in " + error.code);
        logErrorWithDetails('signInWithEmail', error);
        window.unityGame.SendMessage(unityFirebaseGameOjbectName, "firebaseSignInWithEmailFailed", error.message);
      });
}

function linkUserWithEmail(email, password)
{
  if(firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous)
  {
    var credential = firebase.auth.EmailAuthProvider.credential(email, password);
    firebase.auth().currentUser.linkWithCredential(credential).then(function(user) {
      sendAuthDataToUnity();
    }, function(error) {
      console.log("Error upgrading anonymous account", error);
      logErrorWithDetails('linkUserWithEmail', error);
      window.unityGame.SendMessage(unityFirebaseGameOjbectName, "firebaseLinkUserWithEmailFailed", error.message);
    });
  }
}


function linkOrSignInWithGoogle()
{
  var provider = new firebase.auth.GoogleAuthProvider();

  if(firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous)
  {
    firebase.auth().currentUser.linkWithPopup(provider).then((result) =>
    {
      sendAuthDataToUnity();
    }).catch((error) =>
    {
      if(error.code == "auth/credential-already-in-use")
      {
        firebase.auth().signInWithCredential(error.credential).catch(function(error)
        {
          console.log("signInWithCredential:: Error logging in " + error.code);
          logErrorWithDetails('signInWithCredential-Google', error);
          window.unityGame.SendMessage(unityFirebaseGameOjbectName, "firebaseSignInWithEmailFailed", error.message);
        });
      }
      else
      {
        console.log("linkOrSignInWithGoogle:: Error logging in " + error.code);
        logErrorWithDetails('linkOrSignInWithGoogle', error);
        window.unityGame.SendMessage(unityFirebaseGameOjbectName, "firebaseLinkUserWithEmailFailed", error.message);
      }
    });
  }
}

function linkOrSignInWithApple()
{
  var provider = new firebase.auth.OAuthProvider('apple.com');

  if(firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous)
  {
    firebase.auth().currentUser.linkWithPopup(provider).then((result) =>
    {
      sendAuthDataToUnity();
    }).catch((error) =>
    {
      if(error.code == "auth/credential-already-in-use")
      {
        firebase.auth().signInWithCredential(error.credential).catch(function(error)
        {
          console.log("signInWithCredential:: Error logging in " + error.code);
          logErrorWithDetails('signInWithCredential-Apple', error);
          window.unityGame.SendMessage(unityFirebaseGameOjbectName, "firebaseSignInWithEmailFailed", error.message);
        });
      }
      else
      {
        console.log("linkOrSignInWithApple:: Error logging in " + error.code);
        logErrorWithDetails('linkOrSignInWithApple', error);
        window.unityGame.SendMessage(unityFirebaseGameOjbectName, "firebaseLinkUserWithEmailFailed", error.message);
      }
    });
  }
}

function signOut(setPokiSignInComplete = false)
{
  firebase.auth().signOut().then(function() {
    console.log("signOut:: Success");
    firstVisitEventSent = false; //this will trigger a new user event once the new user authenticates in onAuthStateChanged
    signInAnonymously(setPokiSignInComplete);
  }).catch(function(error) {
    console.log("signOut:: Failed ");
    logErrorWithDetails('signOut', error);
  });
}

async function checkAndRestoreUserArchive()
{
  try
  {
    if (firebase.auth().currentUser == null) return;
    console.log("checkAndRestoreUserArchive: checking");
    const fn = firebase.app().functions("us-central1").httpsCallable("checkAndRestoreArchiveMulti");
    await fn({});
    console.log("checkAndRestoreUserArchive: complete");
  }
  catch (error)
  {
    console.log("checkAndRestoreUserArchive: error (non-fatal):", error?.message);
  }
}

async function sendAuthDataToUnity()
{
  if(window.unityGame != null && firebase.auth().currentUser != null)
  {
    if(pokiSignInComplete)
    {
      await checkAndRestoreUserArchive();
      console.log("Poki sign in complete, sending auth data to Unity");
      var firebaseUid = firebase.auth().currentUser.uid;
      var isAnon = firebase.auth().currentUser.isAnonymous;
      var data = {authToken:"",uid:firebaseUid,isAnonymous:isAnon};
      var dataJson = JSON.stringify(data);
      window.unityGame.SendMessage(unityFirebaseGameOjbectName, 'SetAuthToken', dataJson);
    }
    else
    {
      console.log("Poki sign in not complete, not sending auth data to Unity");
    }
  }
}

function sendPasswordResetEmail(emailAddress)
{
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    console.log("sendPasswordResetEmail:: Success");
    window.unityGame.SendMessage(unityFirebaseGameOjbectName, "SendPasswordResetEmailSuccess");
  }).catch(function(error) {
    console.log("sendPasswordResetEmail:: Failed ");
    window.unityGame.SendMessage(unityFirebaseGameOjbectName, "SendPasswordResetEmailFailed", error.message);
    logErrorWithDetails('sendPasswordResetEmail', error);
  });
}

function getValueTT(nodeKey) 
{
  const dbRef = firebase.database().ref();
  dbRef.child(nodeKey).once('value').then((snapshot) => {
    if (snapshot.exists()) 
    {
      var valJsonStr = JSON.stringify(snapshot.val());
      SendDataToUnity("OnGetValueSuccess", nodeKey, valJsonStr);
    } 
    else 
    {
      window.unityGame.SendMessage(unityFirebaseGameOjbectName, "OnGetValueEmptySuccess", nodeKey);
    }
  }).catch((error) => 
  {
    console.log("getValueTT " + nodeKey + " Error");
    SendDataToUnity("OnGetValueError", nodeKey, error.message);
    logErrorWithDetails('getValueTT', error);
  });
}

function SendDataToUnity(functionName, nk, ds)
{
  var obj =
      {
        nodeKey: nk,
        dataStr: ds
      }

  window.unityGame.SendMessage(unityFirebaseGameOjbectName, functionName, JSON.stringify(obj));
}


function SendResponseToUnity(functionName, k, resonseData)
{
  resonseData["key"] = k;

  window.unityGame.SendMessage(unityFirebaseGameOjbectName, functionName, JSON.stringify(resonseData));
}

function setValueTT(nodeKey, jsonData)
{
  if(firebase.auth().currentUser != null)
  {
    const dbRef = firebase.database().ref();
    var jsonObj = JSON.parse(jsonData);
    dbRef.child(nodeKey).set(jsonObj, (error) => {
      if (error) {
        console.log("auth.js::setValue - Error " + nodeKey);
        SendDataToUnity("OnSetValueError", nodeKey, error.message);
      } else {
        window.unityGame.SendMessage(unityFirebaseGameOjbectName, "OnSetValueSuccess", nodeKey);
      }
    });
  }
}

function removeValueTT(nodeKey)
{
  if(firebase.auth().currentUser != null)
  {
    const dbRef = firebase.database().ref();
    dbRef.child(nodeKey).remove()
        .then(function(){
          window.unityGame.SendMessage(unityFirebaseGameOjbectName, "OnRemoveValueSuccess", nodeKey);
        })
        .catch(function(error){
          console.log("auth.js::removeValueTT error");
          SendDataToUnity("OnRemoveValueError", nodeKey, error.message);
        });
  }
}

function updateValueTT(nodeKey, jsonData)
{
  if(firebase.auth().currentUser != null)
  {
    const dbRef = firebase.database().ref();
    var jsonObj = JSON.parse(jsonData);
    dbRef.child(nodeKey).update(jsonObj, (error) => {
      if (error) {
        console.log("auth.js::updateValue Error " + nodeKey);
        SendDataToUnity( "OnUpdateValueError", nodeKey, error.message);
      } else {
        window.unityGame.SendMessage(unityFirebaseGameOjbectName, "OnUpdateValueSuccess", nodeKey);
      }
    });
  }
}

var cloudFunctionSuccess = 0;
var cloudFunctionFail = 0;

//var regions = ["us-central1", "us-east1", "europe-west1"];
var regions = ["us-central1"];
var lastError = "internal";

async function callCloudFunction(functionId, jsonData, key, onSuccess, onError, sendResponseToUnity = true)
{
  var success = false;
  for (var i = 0; i < regions.length; i++)
  {
    success = await callCloudFunctionNew(functionId, jsonData, key, regions[i], i, onSuccess, onError, sendResponseToUnity);
    if (success)
    {
      break;
    }
  }

  if (!success && sendResponseToUnity)
  {
    SendDataToUnity("OnFunctionError", key, lastError);
  }
}

async function callCloudFunctionNew(functionId, jsonData, key, region, count, onSuccess, onError, sendResponseToUnity = true)
{
  if (firebase.auth().currentUser != null)
  {
    try
    {
      const dataObject = JSON.parse(jsonData);
      var functionRef = firebase.app().functions(region).httpsCallable(functionId + "Multi");
      var fbResponse = await functionRef(dataObject);
      if (fbResponse != null)
      {
        var gameResponse = fbResponse.data;

        if (gameResponse != null)
        {
          cloudFunctionSuccess++;

          if (sendResponseToUnity)
          {
            SendResponseToUnity("OnFunctionComplete", key, gameResponse);
          }

          if (!gameResponse.result)
          {
            if (typeof onError === 'function') 
            {
              onError(gameResponse.message);
            }
            
            logCloudFunctionError("v5-" + count + "-f", jsonData, gameResponse.debugMessage, functionId);
          }
          else if (typeof onSuccess === 'function')
          {
            onSuccess(gameResponse);
          }
          
          return true;
        }
        else
        {
          if (typeof onError === 'function')
          {
            onError("null game response");
          }
          logCloudFunctionError("v5-" + count + "-r", "null game response", functionId);
          return false;
        }
      }
      else
      {
        if (typeof onError === 'function')
        {
          onError("null FB response");
        }
        logCloudFunctionError("v5-" + count + "-n", jsonData, "null FB response", functionId);
        return false;
      }
    }
    catch (error)
    {
      cloudFunctionFail++;
      if (typeof onError === 'function')
      {
        onError(error.message);
      }
      logCloudFunctionError("v5-" + count + "-e", jsonData, error.message, functionId);
      lastError = error.message;
      return false;
    }
  }
}

function logCloudFunctionError(debugErrorRootNode, jsonData, message, functionId)
{
  var firebaseUid = firebase.auth().currentUser.uid;
  var currentTime = new Date().getTime();
  var debugErrorNode = "cferror/" + debugErrorRootNode + "/" + firebaseUid + "/" + functionId + "/" + currentTime;
  const dbRef = firebase.database().ref();
  dbRef.child(debugErrorNode).set({
    errorData: jsonData,
    os: getOS(),
    time: currentTime,
    successCount: cloudFunctionSuccess,
    failCound: cloudFunctionFail,
    errorMessage: message
  }, (setValueError) =>
  {
    if (setValueError)
    {
      console.log("logCloudFunctionError setValueError:: " + setValueError.message);
    } else
    {
      var debugErrorWriteSuccessNode = "cferror/" + debugErrorRootNode + "/" + firebaseUid + "/" + functionId + "/" + currentTime + "/successTime";
      var successTime = new Date().getTime();
      dbRef.child(debugErrorWriteSuccessNode).set(successTime);
      //console.log("logCloudFunctionError Success");
    }
  });
}

function logCloudFunctionSuccess(debugErrorRootNode, jsonData, functionId)
{
  var firebaseUid = firebase.auth().currentUser.uid;
  var currentTime = new Date().getTime();
  var debugErrorNode = "cferror/" + debugErrorRootNode + "/" + firebaseUid + "/" + functionId + "/" + currentTime;
  const dbRef = firebase.database().ref();

  dbRef.child(debugErrorNode).set({
        errorData: jsonData,
        os: getOS(),
        time : currentTime,
        successCount : cloudFunctionSuccess,
        failCount : cloudFunctionFail,
      }, (setValueError) => {
        if (setValueError) {
          console.log("logCloudFunctionSuccess setValueError:: " + setValueError.message);

        } else {
          console.log("logCloudFunctionSuccess Success ");
        }
      }
  );
}

function getCurrentUserId()
{
  if(firebase.auth().currentUser != null && pokiSignInComplete)
  {
    return firebase.auth().currentUser.uid;
  }
  return "";
}

function getCurrentUserIsAnon()
{
  if(firebase.auth().currentUser != null)
  {
    return firebase.auth().currentUser.isAnonymous;
  }
  return true;
}

async function signInWithPoki(userName)
{
  try 
  {
    console.log("signInWithPoki: " + userName);
    const token = await PokiSDK.getToken();
    if (token) 
    {
      const jsonDataStr = JSON.stringify({
        "pokiUserToken": token,
        "userName": userName
      });
      callCloudFunction("signInWithPoki", jsonDataStr, `signInWithPoki_${Date.now()}`, (gameResponse) =>
      {
        const authTokenId = gameResponse.data.authTokenId;
        const isCorrectUser = firebase.auth().currentUser.uid === authTokenId;
        console.log(`signInWithPoki: isCorrectUser = ${isCorrectUser}`);
        if(isCorrectUser && !firebase.auth().currentUser.isAnonymous)
        {
          // Already linked to this Poki account - returning user
          isNewUser = 0;
          pokiSignInComplete = true;
          console.log("Poki sign-in complete - returning user");
          onAuthStateChanged(firebase.auth().currentUser);
        }
        else
        {
          // Need to switch to the Poki-linked account
          // If isCorrectUser is false, we're switching to an existing account = returning user
          // If isCorrectUser is true but anonymous, the cloud function is linking/creating
          // Check gameResponse.data.isNewUser if available, otherwise assume returning if switching
          if(!isCorrectUser)
          {
            isNewUser = 0; // Switching to existing Poki account = returning user
          }
          // else isNewUser stays as 1 (new user getting their anon account linked)
          console.log(`Signing in with custom token, isNewUser = ${isNewUser}`);
          signInWithCustomToken(gameResponse.data.authToken, true);
        }

      }, (errMsg) =>
      {
        console.log(`signInWithPoki2: ${errMsg}`);
      }, 
      false);
    } else {
      console.log("signInWithPoki3: No authentication token available");
    }
  } catch (error) {
    console.log("signInWithPoki3:", error.message);
  }
}

async function autoLoginPoki()
{
  try 
  {
    console.log("autoLoginPoki");
    const user = await PokiSDK.getUser();
    if (user) 
    {
      await signInWithPoki(user.username);
    } 
    else 
    {
      if(!firebase.auth().currentUser.isAnonymous)
      {
        console.log("Signing out user");
        signOut(true);
      }
      else
      {
        console.log("User is anonymous");
        pokiSignInComplete = true;
        onAuthStateChanged(firebase.auth().currentUser);
      }
    }
  } 
  catch (error) 
  {
    console.log("signInWithPoki1:", error.message);
  }
}


function signInWithCustomToken(token, callSendAuthDataToUnity = false)
{
  console.log("signInWithCustomToken");
  firebase.auth().signInWithCustomToken(token)
  .then((userCredential) => {
    pokiSignInComplete = true;
    console.log("signInWithCustomToken: Success");
    if(callSendAuthDataToUnity)
    {
      console.log("Sending auth data to Unity");
      sendAuthDataToUnity();
    }
  })
  .catch(function(error)
  {
    console.log("error logging in " + error.code);
    logErrorWithDetails('signInWithCustomToken', error);
    window.unityGame.SendMessage(unityFirebaseGameOjbectName, "firebaseSignInWithEmailFailed", error.message);
  });
}

async function showPokiLoginPrompt()
{
  console.log("showPokiLoginPrompt");

  try {
    await PokiSDK.login();
    const user = await PokiSDK.getUser();
    console.log("User logged in:", user.username);
    } catch (error) {
    console.log("Login failed:", error.message);
    }
}

function getUserProviders()
{
  const user = firebase.auth().currentUser;

  let providers = "";
  
  if (user) 
  {
    providers = user.providerData.map(p => p.providerId).join("-"); //wont include custom auth eg discord or cg
  } 
  
  console.log(`getUserProviders: ${providers}`);
  
  return providers; 
}

function getPokiShareLinkJS(roomName) {
  const params = {
    room: roomName
  }

  PokiSDK.shareableURL(params).then(url => {
    console.log(url);
    window.unityGame.SendMessage(unityFirebaseGameOjbectName, "PokiShareLinkCreated", url);
  });

}

window.addEventListener('load', function() {
  console.log('Init Auth');
  if (typeof firebase !== 'undefined' && firebase.auth() != null)
  {
    console.log('onAuthStateChanged listener added');
    firebase.auth().onAuthStateChanged(onAuthStateChanged);
  }
}, false);

async function sfve()
{
  try
  {
    // Always poki in this template — source_id is always 'poki'
    var sourceId = 'poki';

    // Resolve platformId — mirrors AnalyticsHelpers.GetPlatformId() logic
    var platformId = 'undefined';
    if (isMobile())
    {
      platformId = isIos() ? 'webgl_ios' : 'webgl_android';
    }
    else
    {
      platformId = 'webgl_desktop';
    }

    var data = {
      event_name: 'new_user',
      build_ver: '',      // not known until Unity loads
      source_id: sourceId,
      platformId: platformId,
      photon_region: '',  // not available this early
      analytics_ver: 3
    };

    console.log('sfve: calling fvEventMulti');
    const fvEventMulti = firebase.app().functions('us-central1').httpsCallable('fvEventMulti');
    const result = await fvEventMulti(data);
    console.log('sfve: success', result.data);
  }
  catch(e)
  {
    console.error('sfve: error', e);
    logErrorWithDetails('sfve', e);
  }
}
