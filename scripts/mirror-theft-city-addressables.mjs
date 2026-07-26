import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, unlinkSync } from "node:fs";
import { request } from "node:https";
import { basename, join } from "node:path";

const catalogPath = "public/games/theft-city/StreamingAssets/aa/catalog.bin";
const outputDir = "public/games/theft-city/StreamingAssets/aa/WebGL";
const remoteBase =
  "https://629eee0a-0c5c-469a-b388-7eb076f7054f.gdn.poki.com/1e5722e5-0d6a-43d7-8fbf-ecff22f44fe5/StreamingAssets/aa/WebGL/";

const catalog = readFileSync(catalogPath).toString("latin1");
const names = [
  ...new Set(
    [...catalog.matchAll(/[A-Za-z0-9_.-]+\.bundle/g)].map((match) =>
      basename(match[0]),
    ),
  ),
].sort();

mkdirSync(outputDir, { recursive: true });

let cursor = 0;
let completed = 0;
let downloaded = 0;
let skipped = 0;
let aliases = 0;
let bytes = 0;
const failures = [];

function fetchBundle(name) {
  return new Promise((resolve) => {
    const destination = join(outputDir, name);
    const partial = `${destination}.partial`;

    if (existsSync(destination) && statSync(destination).size > 0) {
      skipped += 1;
      resolve();
      return;
    }

    const req = request(remoteBase + encodeURIComponent(name), (response) => {
      if (response.statusCode === 404) {
        aliases += 1;
        response.resume();
        resolve();
        return;
      }

      if (response.statusCode !== 200) {
        failures.push(`${response.statusCode} ${name}`);
        response.resume();
        resolve();
        return;
      }

      const file = createWriteStream(partial);
      let received = 0;
      response.on("data", (chunk) => {
        received += chunk.length;
      });
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        renameSync(partial, destination);
        downloaded += 1;
        bytes += received;
        resolve();
      });
      file.on("error", (error) => {
        try {
          unlinkSync(partial);
        } catch {}
        failures.push(`${error.message} ${name}`);
        resolve();
      });
    });

    req.setTimeout(30_000, () => req.destroy(new Error("timeout")));
    req.on("error", (error) => {
      failures.push(`${error.message} ${name}`);
      resolve();
    });
    req.end();
  });
}

async function worker() {
  while (cursor < names.length) {
    const name = names[cursor++];
    await fetchBundle(name);
    completed += 1;
    if (completed % 50 === 0 || completed === names.length) {
      console.log(
        `${completed}/${names.length} downloaded=${downloaded} aliases=${aliases} bytes=${bytes}`,
      );
    }
  }
}

await Promise.all(Array.from({ length: 16 }, () => worker()));

console.log(
  JSON.stringify(
    { candidates: names.length, downloaded, skipped, aliases, bytes, failures },
    null,
    2,
  ),
);

if (failures.length) process.exitCode = 1;
