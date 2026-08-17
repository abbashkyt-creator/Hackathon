GameMaker_Init = (function(base) {
	function fin(ok) {
		window.PokiSDK_OK = ok;
        base();
	}
	function hook() {
		if (window.PokiSDK) {
			PokiSDK.init().then(function() {
				fin(true);
			}).catch(function() {
				fin(false);
			});
		} else {
			window.PokiSDK = null;
			fin(false);
		}
	}
	if (window.onload == base) window.onload = hook;
	return hook;
})(GameMaker_Init);
