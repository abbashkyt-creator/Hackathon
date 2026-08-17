PokiSDK.init().then(() => {
		console.log("Poki SDK successfully initialized");
		// fire your function to continue to game
		loadLang("en");
	}).catch(() => {
		console.log("Initialized, something went wrong, load you game anyway");
		// fire your function to continue to game
		loadLang("en");
	});
