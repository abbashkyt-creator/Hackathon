Progress.addListener(function(p)
		  {
			
			document.getElementById("myprogress").innerHTML ="<h1>"+ Math.floor(p)+"%</h1>";
			if (p>99 || isNaN(p)){
				document.getElementById("myprogress").style.display = 'none'; 
			}
		  }
	);
