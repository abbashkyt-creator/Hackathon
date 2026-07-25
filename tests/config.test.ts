import { describe, expect, it } from "vitest";
import { loadConfig } from "../server/config";

describe("production configuration", () => {
  it("fails closed without persistent storage", () => {
    expect(() =>
      loadConfig({
        NODE_ENV: "production",
        DATABASE_URL: "",
        SESSION_SECRET: "a-production-secret-that-is-long-enough",
      }),
    ).toThrow(/DATABASE_URL is required/);
  });

  it("fails closed with the development session secret", () => {
    expect(() =>
      loadConfig({
        NODE_ENV: "production",
        DATABASE_URL: "postgres://example:example@example.com/example",
        SESSION_SECRET: "development-only-session-secret-change-me",
      }),
    ).toThrow(/SESSION_SECRET/);
  });
});
