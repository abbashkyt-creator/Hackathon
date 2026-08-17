


const scriptsInEvents = {

	async Merge_Event33_Act1(runtime, localVars)
	{
		function formatNumber(num) {
		  return new Intl.NumberFormat('de-DE').format(num);
		}
		
		localVars.returnString = formatNumber(localVars.number)
	},

	async Ads_Event5_Act5(runtime, localVars)
	{
		try {
		    PokiSDK.commercialBreak((e) => {
				console.log("Show inter: ", e)
				runtime.globalVars.ShowInterSuccess = 1
				runtime.callFunction("Poki_setState", false);
				runtime.callFunction("setSuspend", true)
				runtime.callFunction("muteAudio")
			}).then((e) => {
				console.log("Show inter finish: ", e)
		        runtime.callFunction("showiInterFinish");
		    }).catch((e) => {
				console.log("Show inter failed: ", e)
		        runtime.callFunction("showiInterFinish");
		    });
		} catch {
		    runtime.callFunction("showiInterFinish");
		}
	},

	async Ads_Event12_Act6(runtime, localVars)
	{
		try {
		    PokiSDK.rewardedBreak(() => {
				runtime.callFunction("Poki_setState", false);
				runtime.callFunction("setSuspend", true)
				runtime.callFunction("muteAudio")
			}).then((success) => {
		        if (success) {
		            runtime.callFunction("showRewardFinish");
		            runtime.callFunction("getReward");
		        } else {
		            runtime.callFunction("showRewardFinish");
		        }
		    }).catch(() => {
		        runtime.callFunction("showRewardFinish");
		    });
		} catch {
		    runtime.callFunction("showRewardFinish");
		}
	},

	async Ads_Event34_Act2(runtime, localVars)
	{
		c3_runtimeInterface._GetLocalRuntime().SetSuspended(true);
	},

	async Ads_Event36_Act2(runtime, localVars)
	{
		c3_runtimeInterface._GetLocalRuntime().SetSuspended(false);
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

