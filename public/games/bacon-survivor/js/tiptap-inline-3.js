var proc		= document.getElementById("proc");
		var fakeCent	= 1;			
		var fakeCentTarget 	= 10;
		var fails			= 0;
		var lerpSpd 		= 0.02;
		var bodyLoad	= false;
		var fill 		= document.getElementById("fill");

        /// smooth things out 
        function loading_lerp (start, end, amt){
            return (1 - amt) * start + amt * end;
        }
		
		function bar_update(progress) {
			progress = Math.max(fakeCent, progress);
			fill.style.width = progress + "%";
			proc.innerHTML = Math.floor(progress) + "%"
		}			

		var fakeLoading = setInterval(function() {
			if (fakeCentTarget - fakeCent > 1) {
				fakeCent = loading_lerp(fakeCent, fakeCentTarget, lerpSpd);
			} else {
				if (fakeCentTarget < 70) {
					fakeCentTarget += 0.15;
				} else if (fakeCentTarget <= 98) {
					fakeCentTarget += 0.015;
				}
			}
			bar_update(fakeCent);
		}, 10);
