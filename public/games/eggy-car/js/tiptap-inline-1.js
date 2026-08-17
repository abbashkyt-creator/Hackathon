var isOnMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
	    var preLoadingProgress = 0;
		var isSDKReady = true; 
		var isGameLoaded = false;
		var adBlockerEnabled = false;
		var isRewardedAdPreloaded = true;
		var adRequested = "";
		var skipFirstAd = false;
		var adRequestsCount = 0;
		var isLoadingStarted = false;

		PokiSDK.init().then(
			() => {
				isSDKReady = true;
			    PokiSDK.setDebug(false);
			    console.log("PokiSDK initialized");
			    PokiSDK.gameLoadingStart();
			}   
			).catch(
			() => {
			    console.log("Adblock enabled");
			    isSDKReady = true;
			    adBlockerEnabled = true;
			    PokiSDK.setDebug(false);
			    PokiSDK.gameLoadingStart();
			}   
		);

		function onPageReady()
		{
			console.log("Page Loaded");
			if(!isLoadingStarted)
				isLoadingStarted = true;
		}

		function Update_LoadingProgress(progress)
		{
			if(preLoadingProgress == progress)
				return;
			preLoadingProgress = progress;
			if(!isSDKReady)
				return;
			var data = {};
			data.percentageDone = progress;
			PokiSDK.gameLoadingProgress(data);
		}

		function On_GameStarted()
		{
			console.log("Game Loaded");
			isGameLoaded = true;
			if(isSDKReady)
			{
				PokiSDK.gameLoadingFinished();	
			}
		}

		function On_MatchStart() {
			console.log("Match Started");
			if(isSDKReady)
				PokiSDK.gameplayStart();
		}

		function On_MatchEnd() {
			console.log("Match Ended");
			if(isSDKReady)
				PokiSDK.gameplayStop();
		}

		function On_LevelFailed()
		{
			if(isSDKReady)
				PokiSDK.measure('custom', 'level-failed');
		}

		function On_ScoreUpdate(score)
		{
			console.log("Save Score Event",score);
			if(isSDKReady)
				PokiSDK.measure('custom', 'distance', score);
		}

		function Show_Ads()
		{
			console.log("<Poki> Show Ads Called");
			if(isSDKReady)
			{
				PokiSDK.commercialBreak()
			.then(
			    () => { //you can also use a normal function here
			        console.log('End of commercial break');
			        goToGame();
			    }
			)
			.catch(
			    () => {
			        goToGame();
			    }   
			);
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
			if(isSDKReady)
				PokiSDK.happyTime(intensity);	
		}

		function isAdBlockerEnabled()
		{
			if(adBlockerEnabled)
				return 1;
			else
				return 0;
		}

		function PreloadRewarededAd()
		{
			if(!isSDKReady)
				return;
			isRewardedAdPreloaded = true;
		}

		function WatchRewardedVideoAd()
		{
			if(!isSDKReady)
			{
				c2_callFunction("On_RewardedAd_Closed");
				return;
			}
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
