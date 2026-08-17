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
  "Dusting the carrom board...",
  "Chalking the striker...",
  "Racking up the pucks...",
  "Polishing the coins...",
  "Placing the queen...",
  "Aligning the striker...",
  "Leveling the board...",
  "Testing perfect rebound angles...",
  "Strategizing the break shot...",
  "Calculating pocket paths...",
  "Preparing the flick...",
  "Lining up the center circle...",
  "Fine-tuning striker aim...",
  "Warming up fingers...",
  "Practicing bank shots...",
  "Visualizing the perfect pocket...",
  "Planning carrommen combos...",
  "Getting ready for the queen cover...",
  "Setting up smooth rebounds...",
  "Ready to break the formation!",
];


let loadingIndex = 0;

setInterval(() => {
  loadingText.textContent = loadingMessages[loadingIndex];
  loadingIndex = (loadingIndex + 1) % loadingMessages.length;
}, 2000);
