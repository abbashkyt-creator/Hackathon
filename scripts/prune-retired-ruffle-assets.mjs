import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

// The public source directory retains earlier experiments for provenance and
// recovery. The source-compatible Poki 2023-12-16 runtime is the only runtime
// referenced by the launcher, so omit the unreferenced generated directory
// from Replit/APK output.
const legacyRuntime = resolve(import.meta.dirname, "..", "dist", "games", "67-game", "ruffle");
if (existsSync(legacyRuntime)) rmSync(legacyRuntime, { recursive: true, force: true });

console.log("Pruned the unreferenced Ruffle runtime from the generated deployment.");
