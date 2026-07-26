const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "public", "games", "temple-run-2-frozen-shadows");
const manifestPath = path.join(root, "MIRROR-MANIFEST.json");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (entry.name === "MIRROR-MANIFEST.json") return [];
    const bytes = fs.readFileSync(fullPath);
    return [{
      path: path.relative(root, fullPath).replaceAll("\\", "/"),
      bytes: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    }];
  });
}

const files = walk(root).sort((left, right) => left.path.localeCompare(right.path));
const manifest = {
  game: "temple-run-2-frozen-shadows",
  title: "Temple Run 2: Frozen Shadows",
  source: {
    page: "https://poki.com/en/g/temple-run-2-frozen-shadows",
    runtime: "Imangi Studios Babylon/WebGL source captured into this local mirror",
  },
  runtimePolicy: {
    externalRequests: false,
    ads: false,
    leaderboards: false,
    start: "The source PLAY control is clicked once when autoplay=1.",
  },
  files,
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), manifestPath)} with ${files.length} files.`);
