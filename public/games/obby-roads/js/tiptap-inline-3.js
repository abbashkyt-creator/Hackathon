var firebaseConfig = {
			apiKey: "AIzaSyD45Qa6FRZsTo-psgoGXjj-pyi3Te-kVMA",
			authDomain: "obbyroads-c7683.firebaseapp.com",
			databaseURL: "https://obbyroads-gamedata.firebaseio.com",
			projectId: "obbyroads-c7683",
			storageBucket: "obbyroads-c7683.appspot.com",
			messagingSenderId: "78403186269",
			appId: "1:78403186269:web:e82031a7831baeec0b67b4",
			measurementId: "G-LPE2TB5TPW"
		};
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
		var firebaseSupported = false;
		if(firebase.analytics != null)
		{
			firebase.analytics.isSupported().then((isSupported) => 
			{
				if (isSupported) 
				{
				analytics = firebase.analytics();
				firebaseSupported = true;
				}
				else 
				{
				console.log("firebase.analytics() not supported ");
				}
			})
		}
