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
    window.addEventListener("wheel", (ev) => ev.preventDefault(), {passive: false});

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
        "Drawing the grid…",
        "Placing Xs and Os…",
        "Setting up the game board…",
        "Strategizing your next move…",
        "Calculating the best move…",
        "Sharpening your tactics…",
        "Optimizing your strategy…",
        "Perfecting your strategy…",
        "Arranging Xs and Os in sequence…",
        "Loading the grid challenge…",
        "Setting up the game state…",
        "Analyzing the game state…",
        "Getting ready for the first move…",
    ];
    let loadingIndex = 0;

    let loadingTextInterval = setInterval(() => {
        loadingText.textContent = loadingMessages[loadingIndex];
        loadingIndex = (loadingIndex + 1) % loadingMessages.length;
    }, 2000);