var isOnMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
	    var preLoadingProgress = 0;
		var iSDKReady = false; 
		var isGameLoaded = false;
		var adBlockerEnabled = false;
		var isSpinnerDisplaying = true;
		var USER_INTERACTED = false;

		const SDK_EVENTs = {
			GAME_START : "game_start",
			GAME_STOP :  "game_stop",
			LOADING_FINISHED : "loading_finished"
		}
		var SDK_EVENTs_PENDING = {};

		//-----------------------------
		var loadingBar = {};
		loadingBar.isDisplaying = false;
		var progressionBar = {};
		progressionBar.isDisplaying = false;

		function FetchDomElements()
		{
			loadingBar.parent = document.getElementById("loading_bar");
			loadingBar.bar = loadingBar.parent.querySelector(".bar");
			loadingBar.text = loadingBar.parent.querySelector(".text");
			progressionBar.parent = document.getElementById("progression_bar");
			progressionBar.bar = progressionBar.parent.querySelector(".bar");
		}

		function onPageReady()
		{
			console.log("Page Loaded");
			Resize();
		}
		PokiSDK.init().then(() => {
		    console.log("Poki SDK successfully initialized");
		    PokiSDK.setDebug(false);
	        PokiSDK.gameLoadingStart();
	        iSDKReady = true;
	        Dispose_PendingSDKEvents();
		    // fire your function to continue to game
		}).catch(() => {
	        adBlockerEnabled = true;
	        PokiSDK.setDebug(false);
	        PokiSDK.gameLoadingStart();
	        if(isGameLoaded)
	        {
	        	if(adBlockerEnabled)
	        	{
	        		console.log("Disable Reawred Ads");
	        		c2_callFunction("onRewardedAD_Disabled");
	        	}
	        }
	        iSDKReady = true;
	        Dispose_PendingSDKEvents();
		});

		function Dispose_PendingSDKEvents()
		{
			if(SDK_EVENTs_PENDING[SDK_EVENTs.LOADING_FINISHED])
			{
				console.log("---- PENDING EVENT DISPOSE -- ",SDK_EVENTs.LOADING_FINISHED);
				SDK_EVENTs_PENDING[SDK_EVENTs.LOADING_FINISHED] = false;
				PokiSDK.gameLoadingFinished();	
			}
			if(SDK_EVENTs_PENDING[SDK_EVENTs.GAME_START])
			{
				SDK_EVENTs_PENDING[SDK_EVENTs.GAME_START] = false;
				PokiSDK.gameplayStart();
			}
		}

		function onLoadingStarted()
		{
			if(isSpinnerDisplaying)
			{
				isSpinnerDisplaying = false;
				document.getElementById("spinner").innertHTML = '';
				document.getElementById("spinner").style.display = "none";
				//document.getElementById("logo").style.display = "none";
			}
			if(!loadingBar.isDisplaying)
			{
				loadingBar.isDisplaying = true;
				loadingBar.parent.style.display = "block";
			}
		}

		function onLoadingEnded()
		{
			if(loadingBar.isDisplaying)
			{
				loadingBar.isDisplaying = false;
				loadingBar.parent.style.display = "none";
			}
			if(!progressionBar.isDisplaying)
			{
				progressionBar.isDisplaying = true;
				progressionBar.parent.style.display = "block";
			}
		}

		function Update_ProgressionBar(progress)
		{
			if(progressionBar.bar){
				progressionBar.bar.style.width = progress*100+"%";
			}
		}

		function Update_LoadingProgress(progress)
		{
			if(preLoadingProgress == progress)
				return;
			preLoadingProgress = progress;
			if(loadingBar.bar){
				loadingBar.bar.style.width = parseInt(progress*100)+"%";
				loadingBar.text.innerHTML  = parseInt(progress*100)+"%";
			}
			if(!iSDKReady)
				return;
			var data = {};
			data.percentageDone = progress;
			if(typeof PokiSDK !== 'undefined')
			{
				PokiSDK.gameLoadingProgress(data);
			}
		}

		function onGameStarted()
		{
			console.log("Game Loaded");
			isGameLoaded = true;
			onLoadingEnded();
			if(iSDKReady)
			{
				PokiSDK.gameLoadingFinished();	
				if(adBlockerEnabled)
				{
					c2_callFunction("onRewardedAD_Disabled");
				}
			}
			else
			{
				SDK_EVENTs_PENDING[SDK_EVENTs.LOADING_FINISHED] = true;
			}
			if (navigator.userActivation.hasBeenActive)
			{
				USER_INTERACTED = true;
				c2_callFunction("User_Interacted");
			}
		}

		function onMatchStarted() {
			console.log("Match Started");
			if(iSDKReady)
			{
				PokiSDK.gameplayStart();
			}
			else
			{
				SDK_EVENTs_PENDING[SDK_EVENTs.GAME_START] = true;
			}
			if(!progressionBar.isDisplaying)
			{
				progressionBar.isDisplaying = true;
				progressionBar.parent.style.display = "block";
			}
		}

		function onMatchEnded() {
			console.log("Match Ended");
			if(iSDKReady)
			{
				PokiSDK.gameplayStop();
			}
			else
			{
				SDK_EVENTs_PENDING[SDK_EVENTs.GAME_STOP] = true;
			}
			if(progressionBar.isDisplaying)
			{
				progressionBar.isDisplaying = false;
				progressionBar.parent.style.display = "none";
			}
		}

		function Show_Ads()
		{
			console.log("<Poki> Show Ads Called");
			if(iSDKReady)
		  	{
		  		PokiSDK.commercialBreak().then(() => { //you can also use a normal function here
			        console.log('End of commercial break');
			        goToGame();
			    }).catch(() => {
			    	goToGame();
			    });
		  	}
		  	else
		  	{
		  		goToGame();
		  	}
		}
		function goToGame()
		{
			console.log('Go To Game');
			c2_callFunction("On_Ad_Served");
		}
		function HappyTime(intensity)
		{
			console.log("Happy Time <" +intensity + ">");
			if(typeof PokiSDK !== 'undefined')
			{
				PokiSDK.happyTime(intensity);
			}
		}
		function isAdBlockerEnabled()
		{
			if(adBlockerEnabled)
				return 1;
			else
				return 0;
		}

		function WatchRewardedVideoAd()
		{
			if(!iSDKReady)
				return;
			if(!adBlockerEnabled)
			{
				PokiSDK.rewardedBreak().then((success) => {
				    if(success) {
				        c2_callFunction("On_RewardedAd_Served");
			  			console.log("Video Ad Finished");
				    } else {
				        // video not displayed, should not give reward
				        c2_callFunction("On_RewardedAd_Closed");
				    }
				});
			}
			else
			{
				c2_callFunction("On_RewardedAd_Closed");
			}
		}
