

const scriptsInEvents = {

	async EventSheet1_Event63_Act3(runtime, localVars)
	{
		const loc = runtime.objects.localization.getFirstInstance();
		
		for (let y = 0; y < loc.height; y++) {
		    for (let x = 0; x < loc.width; x++) {
		        const val = loc.getAt(x, y);
		        if (val.includes("\\n")) {
		            loc.setAt(val.replace(/\\n/g, "\n"), x, y);
		        }
		    }
		}
	},

	async EventSheet1_Event1625_Act1(runtime, localVars)
	{
		window.addEventListener("keydown", () => 
		  runtime.callFunction("set_player_device", "pc")
		);
		
		window.addEventListener("mousedown", (e) => {
		  if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
		  runtime.callFunction("set_player_device", "pc");
		});
		
		window.addEventListener("touchstart", () => 
		  runtime.callFunction("set_player_device", "mobile")
		);
	},

	async EventSheet1_Event1609_Act5(runtime, localVars)
	{
		navigator.sendBeacon('https://leveldata.poki.io/traps', '96882849-3562-4a55-9f31-a7005ea6afe9')
	},

	async EventSheet1_Event1046_Act1(runtime, localVars)
	{
		navigator.sendBeacon('https://leveldata.poki.io/traps', '96882849-3562-4a55-9f31-a7005ea6afe9')
	},

	async EventSheet1_Event986_Act1(runtime, localVars)
	{
		navigator.sendBeacon('https://leveldata.poki.io/traps', '96882849-3562-4a55-9f31-a7005ea6afe9')
	},

	async EventSheet1_Event915_Act1(runtime, localVars)
	{
		navigator.sendBeacon('https://leveldata.poki.io/traps', '96882849-3562-4a55-9f31-a7005ea6afe9')
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
