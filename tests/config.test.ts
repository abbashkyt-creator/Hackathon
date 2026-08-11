import { describe, expect, it } from "vitest";
import { loadConfig } from "../server/config";

describe("production configuration", () => {
  it("keeps built-client preview explicit and development-safe", () => {
    expect(loadConfig({ NODE_ENV: "development" }).PREVIEW_PRODUCTION_CLIENT).toBe(false);
    expect(
      loadConfig({ NODE_ENV: "development", PREVIEW_PRODUCTION_CLIENT: "1" }).PREVIEW_PRODUCTION_CLIENT,
    ).toBe(true);
  });

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
