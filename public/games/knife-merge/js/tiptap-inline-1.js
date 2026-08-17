function addJavaScript(src, type) {
		return new Promise(function(resolve, reject) {
			var script = document.createElement("script");
			script.src = src;
			if (type) {
				script.type = type;
			}
			script.addEventListener("load", resolve);
			script.addEventListener("error", reject);
			document.head.appendChild(script);
		});
	}

	function Timer(seconds) {
		var self = this;
		self.seconds = seconds;
		self.isCompleted = false;
		self._timer = setInterval(function() {
			self.seconds -= 1;
			if (self.seconds <= 0) {
				self.seconds = 0;
				self.isCompleted = true;
				clearInterval(self._timer);
			}
		}, 1000);
	}

	function isMobileDevice() {
		return (typeof window.orientation !== "undefined") || /Android|iPhone|iPad|iPod|Mobile|IEMobile/i.test(navigator.userAgent);
	}

	var isMobile = {
		Android: function() { return /Android/i.test(navigator.userAgent); },
		BlackBerry: function() { return /BlackBerry/i.test(navigator.userAgent); },
		iOS: function() { return /iPhone|iPad|iPod/i.test(navigator.userAgent); },
		Opera: function() { return /Opera Mini/i.test(navigator.userAgent); },
		Windows: function() { return /IEMobile/i.test(navigator.userAgent); },
		Kindle: function() { return /Silk/i.test(navigator.userAgent); },
		any: function() {
			return isMobile.Kindle() || isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
		}
	};
