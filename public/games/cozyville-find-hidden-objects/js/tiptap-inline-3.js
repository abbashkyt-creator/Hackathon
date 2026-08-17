var runningFromFileWarning = document.getElementById("running-from-file-warning");
		if (window.location.href.startsWith("file://")) {
			runningFromFileWarning.style.display = "block";
		}
		else {
			EngineLoader.load("canvas", "HiddenObjectGame");
			runningFromFileWarning.parentNode.removeChild(runningFromFileWarning);
		}
