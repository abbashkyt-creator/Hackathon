///~
function poki_init_raw() {
	if (window.PokiSDK) PokiSDK.gameLoadingFinished();
	console.log("Poki wrapper ready!");
	return 0;
}

///~
function poki_create_closure_raw(self, other, script, custom) {
	var f = function(result) {
		var args = [self, other, script, result, custom];
		window.gml_Script_gmcallback_poki_closure.apply(self, args);
	}
	f.gmlSelf = self;
	f.gmlOther = other;
	return f;
}

function poki_is_available() {
	return window.PokiSDK_OK ? 1 : 0;
}

function poki_gameplay_start() {
    if (PokiSDK) PokiSDK.gameplayStart();
    return true;
}

function poki_gameplay_stop() {
	if (PokiSDK) PokiSDK.gameplayStop();
	return true;
}

function poki_open_external_link(url) {
    if (PokiSDK) PokiSDK.openExternalLink(url);
    return true;
}

///~
function poki_get_url_param_raw(name) {
	return PokiSDK && PokiSDK.getURLParam(name);
}

///~
function poki_get_shareable_url_raw(params, then) {
	if (PokiSDK) {
		if (params) try {
			params = JSON.parse(params);
		} catch (_) {
			params = undefined;
		} else params = undefined;
		PokiSDK.shareableURL(params).then(function(url) {
			then(url);
		}).catch(function(e) {
			console.error(e);
			then("");
		});
	} else setTimeout(function() { then(""); });
	return true;
}

///~
function poki_commercial_break_raw(fn) {
	if (PokiSDK) {
		var gmlSelf = fn.gmlSelf, gmlOther = fn.gmlOther;
		var gains = window.gml_Script_gmcallback_poki_get_gains(gmlSelf, gmlOther);
		PokiSDK.commercialBreak().then(function() {
			window.gml_Script_gmcallback_poki_set_gains(gmlSelf, gmlOther, gains);
			fn(true);
		}).catch(function() {
			window.gml_Script_gmcallback_poki_set_gains(gmlSelf, gmlOther, gains);
			fn(false);
		});
	} else setTimeout(function() { fn(false); });
	return true;
}

///~
function poki_rewarded_break_raw(fn) {
	if (PokiSDK) {
		var gmlSelf = fn.gmlSelf, gmlOther = fn.gmlOther;
		var gains = window.gml_Script_gmcallback_poki_get_gains(gmlSelf, gmlOther);
		PokiSDK.rewardedBreak().then(function(result) {
			window.gml_Script_gmcallback_poki_set_gains(gmlSelf, gmlOther, gains);
			fn(result);
		}).catch(function() {
			window.gml_Script_gmcallback_poki_set_gains(gmlSelf, gmlOther, gains);
			fn(false);
		});
	} else setTimeout(function() { fn(false); });
	return true;
}

///~
function poki_measure_raw(category, action, label) {
	if (PokiSDK) {
		PokiSDK.measure(category, action, label);
		return true;
	} else return false;
}