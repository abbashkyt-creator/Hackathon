var runningFromFileWarning = document.getElementById("running-from-file-warning");
		if (window.location.href.startsWith("file://")) {
			runningFromFileWarning.style.display = "block";
		}
		else {
			EngineLoader.load("canvas", "TowerMerge");
			runningFromFileWarning.parentNode.removeChild(runningFromFileWarning);
		}
