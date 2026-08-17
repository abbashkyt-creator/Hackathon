import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseOwnedAdConfig, selectOwnedAdCampaign } from "../src/ad-pipeline";

const root = process.cwd();

describe("owned ad pipeline", () => {
  const rawConfig = JSON.parse(readFileSync(join(root, "public/ads/config.json"), "utf8"));
  const config = parseOwnedAdConfig(rawConfig, "https://tip.test");

  it("ships disabled with a valid same-origin house campaign", () => {
    expect(config.enabled).toBe(false);
    expect(config.campaigns).toHaveLength(1);
    expect(config.campaigns[0].media.src).toBe("/ads/tiptap-creator-house.svg");
  });

  it("fails closed for invalid or cross-origin creative manifests", () => {
    expect(parseOwnedAdConfig({}, "https://tip.test").enabled).toBe(false);
    const unsafe = structuredClone(rawConfig);
    unsafe.enabled = true;
    unsafe.campaigns[0].media.src = "https://ads.example/creative.png";
    expect(parseOwnedAdConfig(unsafe, "https://tip.test").campaigns).toHaveLength(0);
  });

  it("honors enablement, placement kind, session caps, and minimum intervals", () => {
    const request = { kind: "rewarded" as const, placement: "source-rewarded", gameSlug: "city-cab-rush" };
    expect(selectOwnedAdCampaign(config, request, {}, 10_000)).toBeNull();
    expect(selectOwnedAdCampaign(config, request, {}, 10_000, true)?.id).toBe("tiptap-creator-house");
    expect(
      selectOwnedAdCampaign(
        config,
        request,
        { "tiptap-creator-house": { count: 1, lastShownAt: 9_999 } },
        10_000,
        true,
      ),
    ).toBeNull();
  });

  it("loads the shared client directly after the network lock in every copied game", () => {
    const gamesRoot = join(root, "public/games");
    const indexes = readdirSync(gamesRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(gamesRoot, entry.name, "index.html"))
      .filter((path) => {
        try {
          return readFileSync(path, "utf8").includes("/games/_shared/network-lock.js");
        } catch {
          return false;
        }
      });
    expect(indexes).toHaveLength(readdirSync(join(root, "public", "games"), { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== "_shared").length);
    for (const path of indexes) {
      const html = readFileSync(path, "utf8");
      const lock = html.indexOf('/games/_shared/network-lock.js');
      const ads = html.indexOf('/games/_shared/ad-client.js');
      expect(lock).toBeGreaterThan(-1);
      expect(ads).toBeGreaterThan(lock);
      expect(html).toMatch(
        /<script\b[^>]*src=["']\/games\/_shared\/network-lock\.js["'][^>]*><\/script>\s*<script\b[^>]*src=["']\/games\/_shared\/ad-client\.js["'][^>]*><\/script>/i,
      );
    }
  });

  it("routes every copied game's source ad surface through TipTapAds", () => {
    const adapters = [
      "67-game/js/tiptap-platform-bridge.js",
      "archery-king/js/tiptap-platform-bridge.js",
      "arithmetica/js/tiptap-platform-bridge.js",
      "city-cab-rush/tiptap-platform-bridge.js",
      "count-control-legends/tiptap-platform-bridge.js",
      "dig-out-of-prison/tiptap-platform-bridge.js",
      "dino-game/js/tiptap-platform-bridge.js",
      "fruit-ninja/js/tiptap-platform-bridge.js",
      "johnny-trigger-sniper/tiptap-platform-bridge.js",
      "kitty-loves-birds-2/scripts/tiptap-poki-sdk.js",
      "ping-pong-go/js/tiptap-platform-bridge.js",
      "plonky/scripts/tiptap-poki-sdk.js",
      "rocket-soccer-derby/tiptap-platform-bridge.js",
      "smash-room/tiptap-platform-bridge.js",
      "stickman-fury/js/tiptap-platform-bridge.js",
      "subway-surfers/js/tiptap-platform-bridge.js",
      "supercar-legends/js/tiptap-platform-bridge.js",
      "temple-run-2-frozen-shadows/poki-sdk-local.js",
      "theft-city/tiptap-platform-bridge.js",
    ];
    expect(adapters).toHaveLength(19);
    for (const adapter of adapters) {
      expect(readFileSync(join(root, "public/games", adapter), "utf8"), adapter).toContain("TipTapAds");
    }
  });

  it("keeps the VEU acceptance trigger localhost-only and child-originated", () => {
    const client = readFileSync(join(root, "public/games/_shared/ad-client.js"), "utf8");
    expect(client).toContain('event.data.type === "preview-owned-ad-request"');
    expect(client).toContain('event.data.source === HOST_SOURCE');
    expect(client).toContain('window.__TIPTAP_AD_CLIENT_VERSION__ = "owned-v1"');
    expect(client).toContain('location.hostname === "127.0.0.1"');
    expect(client).toContain("request(previewKind, event.data.placement");
    expect(client).toContain("var parentOrigin = window.location.origin");
    expect(client).not.toContain("new URL(document.referrer)");
  });
});
