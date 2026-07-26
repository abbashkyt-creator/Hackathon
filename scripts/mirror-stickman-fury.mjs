import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sourceBase =
  "https://1c81968d-62d5-42e2-901c-5df3fd23e03d.gdn.poki.com/06116df0-0824-481c-aba4-8ad57713116b/";
const outputRoot = join(process.cwd(), "public", "games", "stickman-fury");
const manifestOnly = process.argv.includes("--manifest-only");

const assets = [
  "planck.min.js",
  "gsap.min.js",
  "Howler.min.js",
  "VisibilityManager.js",
  "app.js",
  "fonts/Fredoka_SemiCondensed-SemiBold.ttf",
  "audio/sound.mp3",
  "audio/music.mp3",
  "images/loader.png",
  "images/loadSpinner.png",
  "images/preloaderBg.jpg",
  ...Array.from({ length: 4 }, (_, index) => `images/bg${index}.jpg`),
  ...Array.from({ length: 4 }, (_, index) => `images/groundTexture${index}.jpg`),
  "images/platformTexture.jpg",
  "images/structureTexture.jpg",
  "images/uiButs.png",
  "images/uiElements.png",
  "images/bear.png",
  "images/tRex.png",
  "images/human.png",
  "images/shark.png",
  "images/giraffe.png",
  "images/triceratops.png",
  "images/penguin.png",
  "images/gorilla.png",
  "images/chicken.png",
  "images/flamingo.png",
  "images/alpaca.png",
  "images/kangaroo.png",
  "images/monsterTruck.png",
  "images/weapons.png",
  "json/text.json",
  "json/animalParts.json",
  ...Array.from({ length: 56 }, (_, index) => `json/level${index}.json`),
  "json/weapons.json",
  "json/tuning.json",
];

let files = [];
if (manifestOnly) {
  const current = JSON.parse(await readFile(join(outputRoot, "MIRROR-MANIFEST.json"), "utf8"));
  files = current.files;
} else {
  for (const assetPath of assets) {
    const response = await fetch(new URL(assetPath, sourceBase), {
      headers: { Referer: "https://poki.com/" },
    });
    if (!response.ok) throw new Error(`${assetPath}: HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const target = join(outputRoot, ...assetPath.split("/"));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
    files.push({
      assetPath,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
    process.stdout.write(`mirrored ${assetPath} (${bytes.length} bytes)\n`);
  }
}

const integrationFiles = [];
for (const assetPath of [
  "index.html",
  "js/tiptap-platform-bridge.js",
  "js/tiptap-bootstrap.js",
  "preload-manifest.json",
  "NOTICE.txt",
]) {
  const bytes = await readFile(join(outputRoot, ...assetPath.split("/")));
  integrationFiles.push({
    assetPath,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}

await writeFile(
  join(outputRoot, "MIRROR-MANIFEST.json"),
  `${JSON.stringify(
    {
      game: "Stickman Fury",
      sourcePage: "https://poki.com/en/g/stickman-fury",
      sourceBase,
      mirroredAt: new Date().toISOString(),
      files,
      integrationFiles,
    },
    null,
    2,
  )}\n`,
);

console.log(
  manifestOnly
    ? `Refreshed Stickman Fury integration provenance for ${integrationFiles.length} files`
    : `Mirrored ${files.length} source assets into ${outputRoot}`,
);
