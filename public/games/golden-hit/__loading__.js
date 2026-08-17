pc.script.createLoadingScreen((app) => {
    const div = document.createElement('div');
    div.id = 'loading-screen';
    Object.assign(div.style, {
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', sans-serif",
        color: "#f0f0f0",
        overflow: "hidden",
        zIndex: "9999"
    });
    document.body.appendChild(div);

    const backgroundDiv = document.createElement('div');
    Object.assign(backgroundDiv.style, {
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        width: "100%",
        backgroundImage: 'url("https://cdn.delta-games.net/bg-2.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(5px)', // Apply blur here
        zIndex: "-1" // Place it behind other content
    });
    div.appendChild(backgroundDiv);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #content-box {
            animation: fadeIn 1s ease-out forwards;
            animation-delay: 0.1s;
        }
        #game-title {
            animation: fadeIn 1s ease-out forwards;
            animation-delay: 0.3s;
        }
        #progress-bar-container {
            animation: fadeIn 1s ease-out forwards;
            animation-delay: 0.5s;
        }
    `;
    document.head.appendChild(style);

    const contentBox = document.createElement('div');
    contentBox.id = 'content-box';
    Object.assign(contentBox.style, {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        padding: "clamp(20px, 3vw, 40px)",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.5), inset 0 0 8px rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: "0",
        maxWidth: "clamp(300px, 60%, 700px)",
        boxSizing: "border-box"
    });
    div.appendChild(contentBox);

    const gameTitle = document.createElement('h1');
    gameTitle.id = 'game-title';
    gameTitle.textContent = "GOLDEN HIT";
    Object.assign(gameTitle.style, {
        fontSize: "clamp(1.5em, 6vw, 3.5em)",
        fontWeight: "800",
        color: "#FFD700",
        textShadow: "0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.4)",
        marginBottom: "50px",
        letterSpacing: "3px",
        opacity: "0"
    });
    contentBox.appendChild(gameTitle);

    const progressBarContainer = document.createElement('div');
    progressBarContainer.id = 'progress-bar-container';
    Object.assign(progressBarContainer.style, {
        width: "clamp(150px, 50vw, 400px)",
        height: "30px",
        backgroundColor: "#333333",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 0 8px rgba(0,0,0,0.5), inset 0 0 4px rgba(0,0,0,0.3)",
        opacity: "0",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    });
    contentBox.appendChild(progressBarContainer);

    const progressFiller = document.createElement('div');
    progressFiller.id = 'progress-filler';
    Object.assign(progressFiller.style, {
        height: "100%",
        width: "0%",
        borderRadius: "15px",
        background: "linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite linear",
        transition: "width 0.3s ease-out",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "1"
    });
    progressBarContainer.appendChild(progressFiller);

    const progressText = document.createElement('span');
    progressText.id = 'progress-text';
    progressText.textContent = "0%";
    Object.assign(progressText.style, {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "clamp(0.8em, 2vw, 1.3em)",
        textShadow: " -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
        zIndex: "2"
    });
    progressBarContainer.appendChild(progressText);

    let actualProgress = 0;
    let fakeProgress = 0;
    let animationFrameId = null;
    const maxFakeProgress = 0.95;
    const fakeProgressSpeed = 0.003;

    function updateProgressBar() {
        fakeProgress = Math.min(Math.max(fakeProgress, actualProgress), maxFakeProgress);

        const displayedProgress = Math.max(fakeProgress, actualProgress);
        progressFiller.style.width = (displayedProgress * 100) + '%';
        progressText.textContent = Math.round(displayedProgress * 100) + '%';

        if (displayedProgress < 1) {
            fakeProgress += fakeProgressSpeed;
            animationFrameId = requestAnimationFrame(updateProgressBar);
        }
    }

    animationFrameId = requestAnimationFrame(updateProgressBar);

    app.on('preload:progress', (value) => {
        actualProgress = value;
    });

    app.once('preload:end', () => {
        app.off('preload:progress');
        cancelAnimationFrame(animationFrameId);
        progressFiller.style.width = '100%';
        progressText.textContent = '100%';
    });

    app.once('start', () => {
        div.style.transition = "opacity 0.5s ease-out";
        div.style.opacity = "0";
        setTimeout(() => {
            if (div.parentNode) {
                document.body.removeChild(div);
            }
            if (style.parentNode) {
                document.head.removeChild(style);
            }
        }, 500);
    });
});