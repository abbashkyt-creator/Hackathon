window.createLoadingTextP = function(text) {
                var loadingText = document.createElement("P");
                loadingText.className = "loaderP";
                loadingText.innerHTML = "<span class=\"loader\"></span>";
                document.body.appendChild(loadingText);
                loadingText.style.position = "absolute";
                loadingText.style.left = "50%";
                loadingText.style.top = "50%";
                loadingText.style.color = "#e0e0e0";
                loadingText.style.margin = "0";
                loadingText.style.opacity = 1;

                return loadingText;
            }

            window.removeLoadingTextP = function() {
                if (window.loadingTextP != undefined)
                    document.body.removeChild(window.loadingTextP);
                window.loadingTextP = undefined;    
            }

            window.loadingTextP = window.createLoadingTextP("Loading...");
