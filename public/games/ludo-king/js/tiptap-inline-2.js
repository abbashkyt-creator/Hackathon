function onClickPokiLogin() {
      console.log("Logging into Poki");
      PokiSDK.login().then(async () => {
        const user = await PokiSDK.getUser();
        if (!user) {
          console.log("Poki: User did not signed in!")
          return;
        }
 	console.log("Got Poki data: " + JSON.stringify(user));
        window.isUserGLoggedIn = true;
        window.dispatchEvent(new CustomEvent("plogin", { detail: user }));
      }).catch((err) => {
        // if it throws, the user cancelled (closed the auth panel) or timed out.
        console.log("Poki: Login error: " + err.message);
      });
    }
    function onClickLoginCloseBtn() {
      console.log("Clicking close button");
      document.getElementById("glogincont").style.display = "none";
    }
