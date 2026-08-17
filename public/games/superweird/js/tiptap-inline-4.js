var runningFromFileWarning = document.getElementById("running-from-file-warning");
		if (window.location.href.startsWith("file://")) {
			runningFromFileWarning.style.display = "block";
		}
		else {
			EngineLoader.load("canvas", "SuperWEIRD");
			runningFromFileWarning.parentNode.removeChild(runningFromFileWarning);
		}
