export type OwnedAdKind = "interstitial" | "rewarded";

export interface OwnedAdRequest {
  kind: OwnedAdKind;
  placement: string;
  gameSlug: string;
}

export interface OwnedAdCampaign {
  id: string;
  enabled: boolean;
  kinds: OwnedAdKind[];
  placements: string[];
  title: string;
  body: string;
  media: {
    type: "image" | "video";
    src: string;
    alt: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  skipAfterMs: number;
  rewardAfterMs: number;
  frequency: {
    maxPerSession: number;
    minIntervalMs: number;
  };
}

export interface OwnedAdConfig {
  version: 1;
  enabled: boolean;
  campaigns: OwnedAdCampaign[];
}

export interface OwnedAdFrequency {
  count: number;
  lastShownAt: number;
}

export const DISABLED_AD_CONFIG: OwnedAdConfig = {
  version: 1,
  enabled: false,
  campaigns: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function boundedInteger(value: unknown, fallback: number, minimum: number, maximum: number): number {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(number)));
}

function stringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 32);
}

function safeMediaPath(value: unknown, baseOrigin: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, baseOrigin);
    if (url.origin !== baseOrigin || !url.pathname.startsWith("/ads/")) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function safeClickUrl(value: unknown, baseOrigin: string): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, baseOrigin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin === baseOrigin ? `${url.pathname}${url.search}${url.hash}` : url.toString();
  } catch {
    return null;
  }
}

function parseCampaign(value: unknown, baseOrigin: string): OwnedAdCampaign | null {
  if (!isRecord(value)) return null;
  const id = typeof value.id === "string" ? value.id.trim() : "";
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const body = typeof value.body === "string" ? value.body.trim() : "";
  if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(id) || !title || !body) return null;

  const kinds = stringArray(value.kinds).filter(
    (kind): kind is OwnedAdKind => kind === "interstitial" || kind === "rewarded",
  );
  const placements = stringArray(value.placements, ["*"]);
  if (!kinds.length || !placements.length || !isRecord(value.media)) return null;

  const mediaType = value.media.type;
  const mediaSrc = safeMediaPath(value.media.src, baseOrigin);
  const mediaAlt = typeof value.media.alt === "string" ? value.media.alt.trim() : "";
  if ((mediaType !== "image" && mediaType !== "video") || !mediaSrc || !mediaAlt) return null;

  let cta: OwnedAdCampaign["cta"];
  if (isRecord(value.cta)) {
    const label = typeof value.cta.label === "string" ? value.cta.label.trim() : "";
    const href = safeClickUrl(value.cta.href, baseOrigin);
    if (label && href) cta = { label, href };
  }

  const frequency = isRecord(value.frequency) ? value.frequency : {};
  return {
    id,
    enabled: value.enabled === true,
    kinds: [...new Set(kinds)],
    placements: [...new Set(placements)],
    title: title.slice(0, 90),
    body: body.slice(0, 280),
    media: {
      type: mediaType,
      src: mediaSrc,
      alt: mediaAlt.slice(0, 180),
    },
    cta,
    skipAfterMs: boundedInteger(value.skipAfterMs, 2_000, 0, 30_000),
    rewardAfterMs: boundedInteger(value.rewardAfterMs, 5_000, 1_000, 120_000),
    frequency: {
      maxPerSession: boundedInteger(frequency.maxPerSession, 3, 1, 50),
      minIntervalMs: boundedInteger(frequency.minIntervalMs, 120_000, 0, 86_400_000),
    },
  };
}

/**
 * Validate the static ad manifest fail-closed. Invalid campaigns disappear;
 * an invalid root disables the entire pipeline instead of guessing.
 */
export function parseOwnedAdConfig(value: unknown, baseOrigin: string): OwnedAdConfig {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.campaigns)) {
    return DISABLED_AD_CONFIG;
  }
  return {
    version: 1,
    enabled: value.enabled === true,
    campaigns: value.campaigns
      .map((campaign) => parseCampaign(campaign, baseOrigin))
      .filter((campaign): campaign is OwnedAdCampaign => Boolean(campaign)),
  };
}

export function selectOwnedAdCampaign(
  config: OwnedAdConfig,
  request: OwnedAdRequest,
  frequency: Record<string, OwnedAdFrequency>,
  now: number,
  forceEnabled = false,
): OwnedAdCampaign | null {
  if (!config.enabled && !forceEnabled) return null;
  return config.campaigns.find((campaign) => {
    if (!campaign.enabled || !campaign.kinds.includes(request.kind)) return false;
    if (!campaign.placements.includes("*") && !campaign.placements.includes(request.placement)) {
      return false;
    }
    const seen = frequency[campaign.id];
    if (!seen) return true;
    if (seen.count >= campaign.frequency.maxPerSession) return false;
    return now - seen.lastShownAt >= campaign.frequency.minIntervalMs;
  }) ?? null;
}
