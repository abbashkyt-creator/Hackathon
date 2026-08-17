let finshFlag = 0;
        PokiSDK.init().then(() => {
            console.log("Poki SDK successfully initialized");
            loadingFinish();
        });

        function loadingFinish(){
            finshFlag++;
            if( finshFlag == 2){
                PokiSDK.gameLoadingFinished();
            }
        }

        (function() {
            let sm = "horizontal";
            let du = parseInt("2400");
            let ss = performance.now();

            function fit() {
                let flag = 0;
                if (sm == "horizontal")
                    flag = window.innerWidth < window.innerHeight ? 1 : 0;
                else if (sm == "vertical")
                    flag = window.innerWidth > window.innerHeight ? 2 : 0;

                if (flag != 0) {
                    splash.style.width = window.innerHeight + "px";
                    splash.style.height = window.innerWidth + "px";

                    if (flag == 1) {
                        splash.style.transform = "rotate(90deg)";
                        splash.style.left = window.innerWidth;
                    }
                    else {
                        splash.style.transform = "rotate(-90deg)";
                        splash.style.top = window.innerHeight;
                    }
                }
                else {
                    splash.style.transform = "";
                    splash.style.width = "100%";
                    splash.style.height = "100%";
                    splash.style.left = "0px";
                    splash.style.top = "0px";
                }
            }

            function hide() {    
                window.removeEventListener("resize", fit);
                delete window.hideSplashScreen;

                let t = du - (performance.now() - ss);
                if (t < 0) t = 0;
                setTimeout(() => {
                    splash.style.opacity = 0;
                    setTimeout(() => {
                        loadingFinish();
                        splash.parentElement.removeChild(splash)}, 300);
                }, t);
            }

            function onProgress(progress) {
            }

            window.addEventListener("resize", fit);
            window.hideSplashScreen = hide;
            window.onSplashProgress = onProgress;

            fit();
        })();
