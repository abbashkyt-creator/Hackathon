import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    sourcemap: true,
  },
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
