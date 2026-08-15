

const scriptsInEvents = {

	async Emenu_Event25_Act2(runtime, localVars)
	{
		const input = document.getElementById("myinput");
		
		if (input) {
		    const baseWidth = 1024;
		    const baseFont = 25;
		    const scale = window.innerWidth / baseWidth;
		    const fontSize = baseFont * scale;
		
		    input.style.fontSize = fontSize + "px";
		}
		
	},

	async Emenu_Event65_Act1(runtime, localVars)
	{
		document.getElementById("myinput").select();
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
