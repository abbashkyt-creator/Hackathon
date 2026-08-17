import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: [],
    // Exclude game directories from dependency scanning
  },
  server: {
    fs: {
      allow: ["."],
    },
  },
  // Prevent Vite from scanning game directories (binary JS breaks the scanner)
  assetsInclude: [],
  test: {
    environment: "node",
    exclude: [
      ...configDefaults.exclude,
      "**/.claude/worktrees/**",
      "**/.codex-runtime/**",
      "**/dist/**",
    ],
    coverage: {
      reporter: ["text", "json-summary"],
    },
  },
});
