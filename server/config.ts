import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: optionalUrl,
  SQLITE_PATH: z.string().default("./data/tip-tap.db"),
  SESSION_SECRET: z.string().min(32).default("development-only-session-secret-change-me"),
  PUBLIC_BASE_URL: optionalUrl,
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  // Android TWA (installable APK) Digital Asset Links. Set these AFTER building
  // the APK with PWABuilder/Bubblewrap to hide the browser URL bar. Leaving them
  // empty serves an empty (valid) assetlinks.json — the app still works, the URL
  // bar just stays visible. ANDROID_CERT_FINGERPRINTS is a comma-separated list
  // of SHA-256 fingerprints (colon-separated hex, e.g. "AA:BB:...").
  ANDROID_PACKAGE_NAME: z.string().optional(),
  ANDROID_CERT_FINGERPRINTS: z.string().optional(),
});

export type Config = z.infer<typeof envSchema>;

export function loadConfig(overrides: Partial<NodeJS.ProcessEnv> = {}): Config {
  const parsed = envSchema.parse({ ...process.env, ...overrides });
  if (parsed.NODE_ENV === "production" && parsed.SESSION_SECRET.startsWith("development-only")) {
    throw new Error("SESSION_SECRET must be set to a unique 32+ character value in production.");
  }
  if (parsed.NODE_ENV === "production" && !parsed.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required in production. Refusing to store scores on an ephemeral local filesystem.",
    );
  }
  return parsed;
}
