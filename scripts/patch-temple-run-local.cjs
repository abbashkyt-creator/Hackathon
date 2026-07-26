/* Remove the captured bundle's release-only Poki host gate for the authorized
 * local/Replit distribution. The game runtime and assets are otherwise left
 * byte-for-byte as captured. */
const fs = require("node:fs");

const bundlePath = process.argv[2];
if (!bundlePath) throw new Error("Usage: node scripts/patch-temple-run-local.cjs <bundle.js>");

const source = fs.readFileSync(bundlePath, "utf8");
const startMarker = "s.GameConfig.IS_RELEASE&&function(){for(var e=[";
const endMarker = "var qi=";
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);
let patched = source;
if (start >= 0 && end >= 0) {
  patched = `${source.slice(0, start)}/* Local/Replit distribution: no host redirect. */${source.slice(end)}`;
}

const dracoUrls = [
  "https://preview.babylonjs.com/draco_decoder_gltf.wasm",
  "https://cdn.babylonjs.com/draco_decoder_gltf.wasm",
];
for (const url of dracoUrls) patched = patched.replaceAll(url, "./vendor/draco_decoder_gltf.wasm");

// The captured release has a first-run, non-interactive tutorial that waits
// through several dialogue timers before exposing its source-owned PLAY button.
// Tip Tap is an instant-play feed, so shorten those delays while preserving the
// original state machine and its actual startGamePlay handler.
const tutorialStart = "function w(e,t,n){let{uiProps:o}=t";
const tutorialEnd = "class L extends i.a";
const tutorialStartIndex = patched.indexOf(tutorialStart);
const tutorialEndIndex = patched.indexOf(tutorialEnd, tutorialStartIndex);
if (tutorialStartIndex < 0 || tutorialEndIndex < 0) {
  throw new Error("Could not locate the Temple Run first-run tutorial block.");
}

const tutorial = patched.slice(tutorialStartIndex, tutorialEndIndex);
const fasterTutorial = tutorial
  .replace("v=setTimeout(y,3e3)", "v=setTimeout(y,120)")
  .replace("v=setTimeout(y,5900)", "v=setTimeout(y,120)")
  .replace("v=setTimeout(P,2500)", "v=setTimeout(P,120)")
  .replace("v=setTimeout(C,4e3)", "v=setTimeout(C,120)")
  .replace("b=setTimeout(x,50)", "b=setTimeout(x,1)");

if (fasterTutorial === tutorial) {
  // The patch may already have been applied; keep the operation idempotent.
  if (!tutorial.includes("v=setTimeout(y,120)")) {
    throw new Error("Temple Run tutorial timing tokens were not found.");
  }
} else {
  patched = `${patched.slice(0, tutorialStartIndex)}${fasterTutorial}${patched.slice(tutorialEndIndex)}`;
}
fs.writeFileSync(bundlePath, patched);
console.log(JSON.stringify({
  patched: true,
  removedHostGateBytes: start >= 0 ? end - start : 0,
  localDracoUrls: dracoUrls.length,
  instantFirstRunTutorial: true,
}));
