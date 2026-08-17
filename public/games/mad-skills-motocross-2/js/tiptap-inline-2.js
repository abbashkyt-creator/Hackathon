var isLoadFinished_bike = false;
		Progress.addListener(function(percentage){
			if (percentage == 100 && !isLoadFinished_bike) {
				document.querySelector('.motorcycle-preloader').remove();
				isLoadFinished_bike = true;
			}
		});
