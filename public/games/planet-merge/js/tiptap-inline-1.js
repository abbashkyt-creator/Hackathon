PokiSDK.init()
        .then(() => {
          console.log("Poki SDK successfully initialized");
        })
        .catch(() => {
          console.log(
            "Initialized, something went wrong, load you game anyway"
          );
        });
