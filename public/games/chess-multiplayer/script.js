/* script.js */
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
let progressIcon = document.getElementById("progress-icon");
let progress = 2;
let loadingInterval;

updateProgress = (progress) => {
  if (progress > 100) {
    progress = 100;
  }

  // Update progress bar width
  if (progressBar.style.width == "100%") {
    loadingInterval && clearInterval(loadingInterval);
    return;
  }

  if (progress > parseInt(progressBar.style.width || "0")) {
    progressBar.style.width = progress + "%";
    progressIcon.style.left = `calc(${progress}% - 15px)`;
  }
}

updateProgress(progress); // Increase progress in steps initially 
loadingInterval = setInterval(() => {
  progress += 2;
  updateProgress(progress);
}, 2000);

const loadingText = document.getElementById("loading-text");
const loadingMessages = [
  "Setting up the board...",
  "Placing the pieces...",
  "Preparing the knights...",
  "Strategizing moves...",
  "Arranging pawns...",
  "Analyzing the board...",
  "Thinking like a grandmaster...",
  "Preparing the battlefield...",
  "Positioning rooks and bishops...",
  "Polishing the queen's crown...",
  "Lining up the pawns...",
  "Ready to checkmate...",
  "Calculating best openings...",
  "Sharpening strategies...",
  "Initiating the first move...",
  "Deploying defenses...",
  "Setting traps and tactics...",
  "Visualizing endgames...",
  "Loading chess genius...",
  "Getting ready for battle...",
];
let loadingIndex = 0;

setInterval(() => {
  loadingText.textContent = loadingMessages[loadingIndex];
  loadingIndex = (loadingIndex + 1) % loadingMessages.length;
}, 2000);
