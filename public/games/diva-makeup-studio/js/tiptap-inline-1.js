const langs = navigator.languages || [navigator.language]
		const browserLang = (langs[0] || "en").slice(0, 2)

		const supported = ["en", "fr", "de", "pt", "es"]
		const tempLang = supported.includes(browserLang) ? browserLang : "en"
		
		
		PokiSDK.init().then(() => {
			console.log("Poki SDK successfully initialized");
			// fire your function to continue to game
			loadLang(tempLang);
		}).catch(() => {
			console.log("Initialized, something went wrong, load you game anyway");
			// fire your function to continue to game
			loadLang(tempLang);
		});
