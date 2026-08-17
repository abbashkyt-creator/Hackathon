window.config = {
		loader: 'unity',
		debug: false,
		maxRatio: 16 / 9,
		minRatio: 9 / 16,

		title: 'Jelly Sokoban',
		thumbnail: 'https:\/\/img.poki.com\/88abacab02ab9e9027d605fb7bce6e99.png',
		numScreenshots:  0 ,

		unityVersion: '2019.1.8f1',
		unityWebglBuildUrl: 'Build\/JellySokoban.json',

		fileSize:  25 ,
		cachedDecompressedFileSizes: {
			'JellySokoban.data.unityweb':  10554591 ,
			'JellySokoban.wasm.code.unityweb':  14700985 ,
			'JellySokoban.wasm.framework.unityweb':  472108 ,
		},
	};
	var showAdsCalled = false;
	function On_GameStarted()
	{
		if (!window.hasOwnProperty('PokiSDK'))
			return;
	}
	function On_MatchStarted() {
		if (!window.hasOwnProperty('PokiSDK'))
			return;
        console.log("Match Started");
        PokiSDK.gameplayStart();
      }
      function On_MatchEnd() {
        if (!window.hasOwnProperty('PokiSDK'))
			return;
		PokiSDK.gameplayStop();
      }
       function ShowAds()
      {
        showAdsCalled = true;
        console.log("<Poki> Show Ads Called");
        if (!window.hasOwnProperty('PokiSDK'))
			return;
		PokiSDK.commercialBreak()
		.then(() => { //you can also use a normal function here
			console.log('End of commercial break');
			goToGame();
		})
		.catch(() => {
			goToGame();
		});
      
      }
      function goToGame()
      {
        if(showAdsCalled)
        {
          showAdsCalled = false;
          unityGame.SendMessage('AdsManager', 'onAdServed');
          document.querySelector("canvas").focus();
        }
      }
      function HappyTime(intensity)
      {
      	if (!window.hasOwnProperty('PokiSDK'))
			return;
        console.log("Happy Time <" +intensity + ">");
        PokiSDK.happyTime(intensity);
      }
