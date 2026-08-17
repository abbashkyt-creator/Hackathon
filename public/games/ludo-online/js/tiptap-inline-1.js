PokiSDK.init()
            .then(() => {
                console.log("Poki SDK successfully initialized");
            })
            .catch(() => {
                console.log("Initialized, but the user likely has adblock");
            });

        window.addEventListener("keydown", (ev) => {
            if (["ArrowDown", "ArrowUp", " "].includes(ev.key)) {
                ev.preventDefault();
            }
        });
        window.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false });

        let progressBar = document.getElementById("progress-bar");
        let progress = 0;
        let loadingInterval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(loadingInterval);
                clearInterval(loadingTextInterval);
            } else {
                progress += 3;
                progressBar.style.width = progress + "%";
            }
        }, 2000);

        const loadingText = document.getElementById("loading-text");
        const loadingMessages = [
            "Rolling the dice…",
            "Setting up the Ludo board…",
            "Placing your tokens on the base…",
            "Strategizing your next move…",
            "Getting ready to race to the finish…",
            "Calculating the best move…",
            "Planning your token’s journey…",
            "Optimizing your dice rolls…",
            "Perfecting your token strategy…",
            "Positioning your tokens on the board…",
            "Loading the Ludo challenge…",
            "Getting ready for your first roll…",
            "Arranging the board for the ultimate race…",
            "Strategizing to capture your opponent’s token…",
            "Analyzing the board state…",
        ];
        let loadingIndex = 0;

        let loadingTextInterval = setInterval(() => {
            loadingText.textContent = loadingMessages[loadingIndex];
            loadingIndex = (loadingIndex + 1) % loadingMessages.length;
        }, 2000);
