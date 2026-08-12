import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseOwnedAdConfig, DISABLED_AD_CONFIG, type OwnedAdConfig } from "../src/ad-pipeline.js";

/**
 * Runtime ad control.
 *
 * The static `public/ads/config.json` is the default. An operator can override it
 * at runtime through PUT /api/ads/admin/config (writes data/ads-override.json),
 * which the embedded client fetches on page load. Default is OFF (no ads of any
 * kind — games stay ad-free until the operator turns the channel on).
 */

const ROOT = process.cwd();
const DEFAULT_CONFIG_PATH = join(ROOT, "public", "ads", "config.json");
const OVERRIDE_PATH = join(ROOT, "data", "ads-override.json");

function loadJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

export function loadAdsConfig(): OwnedAdConfig {
  const fromOverride = loadJson(OVERRIDE_PATH);
  if (fromOverride !== null) return parseOwnedAdConfig(fromOverride, "http://localhost");
  const fromDefault = loadJson(DEFAULT_CONFIG_PATH);
  if (fromDefault !== null) return parseOwnedAdConfig(fromDefault, "http://localhost");
  return DISABLED_AD_CONFIG;
}

export function saveAdsConfigOverride(value: unknown): OwnedAdConfig {
  const parsed = parseOwnedAdConfig(value, "http://localhost");
  mkdirSync(dirname(OVERRIDE_PATH), { recursive: true });
  writeFileSync(OVERRIDE_PATH, JSON.stringify(parsed, null, 2), "utf8");
  return parsed;
}

export function resetAdsConfigOverride(): OwnedAdConfig {
  try {
    if (existsSync(OVERRIDE_PATH)) writeFileSync(OVERRIDE_PATH, "", "utf8");
  } catch {
    // Best effort reset; the default config still applies.
  }
  return loadAdsConfig();
}

export const ADS_OVERRIDE_PATH = () => OVERRIDE_PATH;
