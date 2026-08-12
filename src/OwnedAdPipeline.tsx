import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DISABLED_AD_CONFIG,
  parseOwnedAdConfig,
  selectOwnedAdCampaign,
  type OwnedAdCampaign,
  type OwnedAdConfig,
  type OwnedAdFrequency,
  type OwnedAdKind,
  type OwnedAdRequest,
} from "./ad-pipeline";

const CHILD_SOURCE = "tiptap-ad-client";
const PARENT_SOURCE = "tiptap-ad-parent";
const FREQUENCY_KEY = "ttg_owned_ad_frequency_v1";

interface ActiveAd {
  campaign: OwnedAdCampaign;
  request: OwnedAdRequest;
  requestId: string;
  source: Window;
  targetOrigin: string;
}

interface AdRequestMessage {
  source: typeof CHILD_SOURCE;
  type: "request";
  requestId: string;
  kind: OwnedAdKind;
  placement: string;
  gameSlug: string;
}

function readFrequency(): Record<string, OwnedAdFrequency> {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(FREQUENCY_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function writeFrequency(value: Record<string, OwnedAdFrequency>): void {
  try {
    window.sessionStorage.setItem(FREQUENCY_KEY, JSON.stringify(value));
  } catch {
    // A blocked storage surface only loses frequency persistence for this tab.
  }
}

function isAdRequest(value: unknown): value is AdRequestMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<AdRequestMessage>;
  return (
    message.source === CHILD_SOURCE &&
    message.type === "request" &&
    typeof message.requestId === "string" &&
    message.requestId.length <= 120 &&
    (message.kind === "interstitial" || message.kind === "rewarded") &&
    typeof message.placement === "string" &&
    typeof message.gameSlug === "string"
  );
}

function recordDebug(event: Record<string, unknown>): void {
  const debugWindow = window as Window & { __TIPTAP_AD_PIPELINE__?: Record<string, unknown>[] };
  debugWindow.__TIPTAP_AD_PIPELINE__ = [
    ...(debugWindow.__TIPTAP_AD_PIPELINE__ ?? []),
    { at: Date.now(), ...event },
  ].slice(-100);
}

export function OwnedAdPipeline({ soundEnabled }: { soundEnabled: boolean }) {
  const [config, setConfig] = useState<OwnedAdConfig>(DISABLED_AD_CONFIG);
  const [activeAd, setActiveAd] = useState<ActiveAd | null>(null);
  const configRef = useRef(config);
  const activeRef = useRef(activeAd);

  useEffect(() => {
    configRef.current = config;
  }, [config]);
  useEffect(() => {
    activeRef.current = activeAd;
  }, [activeAd]);

  const previewEnabled = useMemo(() => {
    const local = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    return local && new URLSearchParams(window.location.search).get("adPreview") === "1";
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/ads/config", { cache: "no-store", credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("ad config unavailable"))))
      .then((value) => {
        if (!cancelled) setConfig(parseOwnedAdConfig(value, window.location.origin));
      })
      .catch(() => {
        if (!cancelled) setConfig(DISABLED_AD_CONFIG);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const respond = useCallback((ad: ActiveAd, payload: Record<string, unknown>) => {
    ad.source.postMessage(
      { source: PARENT_SOURCE, requestId: ad.requestId, ...payload },
      ad.targetOrigin,
    );
  }, []);

  const finish = useCallback(
    (rewarded: boolean, reason: string) => {
      const ad = activeRef.current;
      if (!ad) return;
      respond(ad, { type: "complete", shown: true, rewarded, reason });
      ad.source.postMessage(
        { source: "tiptap-parent", type: "set-muted", muted: !soundEnabled },
        ad.targetOrigin,
      );
      ad.source.postMessage({ source: "tiptap-parent", type: "resume" }, ad.targetOrigin);
      try {
        fetch("/api/ads/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ campaignId: ad.campaign.id, kind: ad.request.kind, placement: ad.request.placement, gameSlug: ad.request.gameSlug, event: "complete" }),
        }).catch(() => {});
      } catch { /* telemetry is best-effort */ }
      recordDebug({ type: "complete", campaignId: ad.campaign.id, rewarded, reason });
      activeRef.current = null;
      setActiveAd(null);
    },
    [respond, soundEnabled],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isAdRequest(event.data) || !event.source) return;
      const source = event.source as Window;
      if (typeof source.postMessage !== "function") return;
      const frame = [...document.querySelectorAll<HTMLIFrameElement>(".feed iframe")].find(
        (candidate) => candidate.contentWindow === source,
      );
      const frameUrl = frame ? new URL(frame.src, window.location.origin) : null;
      const card = frame?.closest<HTMLElement>(".feed-card");
      const trustedOrigin = event.origin === window.location.origin || event.origin === "null";
      if (
        !frame ||
        !frameUrl ||
        frameUrl.origin !== window.location.origin ||
        !frameUrl.pathname.startsWith("/games/") ||
        card?.dataset.active !== "true" ||
        !trustedOrigin
      ) return;

      const targetOrigin = event.origin === "null" ? "*" : window.location.origin;
      const request: OwnedAdRequest = {
        kind: event.data.kind,
        placement: event.data.placement.slice(0, 80),
        gameSlug: event.data.gameSlug.slice(0, 80),
      };
      const respondDirect = (payload: Record<string, unknown>) => {
        source.postMessage(
          { source: PARENT_SOURCE, requestId: event.data.requestId, ...payload },
          targetOrigin,
        );
      };
      if (activeRef.current) {
        respondDirect({ type: "complete", shown: false, rewarded: false, reason: "busy" });
        return;
      }

      const frequency = readFrequency();
      const campaign = selectOwnedAdCampaign(
        configRef.current,
        request,
        frequency,
        Date.now(),
        previewEnabled,
      );
      if (!campaign) {
        respondDirect({
          type: "complete",
          shown: false,
          rewarded: false,
          reason: configRef.current.enabled || previewEnabled ? "no-fill" : "disabled",
        });
        recordDebug({ type: "skipped", kind: request.kind, reason: "disabled-or-no-fill" });
        return;
      }

      const next: ActiveAd = {
        campaign,
        request,
        requestId: event.data.requestId,
        source,
        targetOrigin,
      };
      const seen = frequency[campaign.id] ?? { count: 0, lastShownAt: 0 };
      frequency[campaign.id] = { count: seen.count + 1, lastShownAt: Date.now() };
      writeFrequency(frequency);
      source.postMessage(
        { source: "tiptap-parent", type: "set-muted", muted: true },
        targetOrigin,
      );
      source.postMessage({ source: "tiptap-parent", type: "pause" }, targetOrigin);
      try {
        fetch("/api/ads/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ campaignId: campaign.id, kind: request.kind, placement: request.placement, gameSlug: request.gameSlug, event: "impression" }),
        }).catch(() => {});
      } catch { /* telemetry is best-effort */ }
      respond(next, { type: "started", campaignId: campaign.id });
      recordDebug({
        type: "started",
        campaignId: campaign.id,
        kind: next.request.kind,
        placement: next.request.placement,
      });
      activeRef.current = next;
      setActiveAd(next);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [previewEnabled, respond]);

  return activeAd ? <OwnedAdDialog ad={activeAd} onFinish={finish} /> : null;
}

function OwnedAdDialog({
  ad,
  onFinish,
}: {
  ad: ActiveAd;
  onFinish: (rewarded: boolean, reason: string) => void;
}) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAt = useRef(Date.now());
  const requiredMs = ad.request.kind === "rewarded"
    ? ad.campaign.rewardAfterMs
    : ad.campaign.skipAfterMs;
  const ready = elapsedMs >= requiredMs;

  useEffect(() => {
    startedAt.current = Date.now();
    setElapsedMs(0);
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAt.current), 100);
    return () => window.clearInterval(timer);
  }, [ad.campaign.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (ad.request.kind === "rewarded") onFinish(false, "dismissed");
      else if (ready) onFinish(false, "continued");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ad.request.kind, onFinish, ready]);

  const seconds = Math.max(1, Math.ceil((requiredMs - elapsedMs) / 1000));
  const openCta = () => {
    if (!ad.campaign.cta) return;
    window.open(ad.campaign.cta.href, "_blank", "noopener,noreferrer");
    recordDebug({ type: "click", campaignId: ad.campaign.id });
  };

  return (
    <div className="owned-ad-backdrop" data-owned-ad={ad.campaign.id}>
      <section
        className="owned-ad-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="owned-ad-title"
        aria-describedby="owned-ad-body"
      >
        <div className="owned-ad-label">TIP TAP OWNED AD</div>
        {ad.campaign.media.type === "video" ? (
          <video
            className="owned-ad-media"
            src={ad.campaign.media.src}
            aria-label={ad.campaign.media.alt}
            autoPlay
            muted
            playsInline
            controls
          />
        ) : (
          <img className="owned-ad-media" src={ad.campaign.media.src} alt={ad.campaign.media.alt} />
        )}
        <div className="owned-ad-copy">
          <h2 id="owned-ad-title">{ad.campaign.title}</h2>
          <p id="owned-ad-body">{ad.campaign.body}</p>
        </div>
        <div className="owned-ad-actions">
          {ad.campaign.cta && (
            <button type="button" className="owned-ad-cta" onClick={openCta}>
              {ad.campaign.cta.label}
            </button>
          )}
          {ad.request.kind === "rewarded" && (
            <button type="button" className="owned-ad-dismiss" onClick={() => onFinish(false, "dismissed")}>
              No thanks
            </button>
          )}
          <button
            type="button"
            className="owned-ad-continue"
            disabled={!ready}
            onClick={() => onFinish(ad.request.kind === "rewarded", ready ? "completed" : "early")}
          >
            {ready
              ? ad.request.kind === "rewarded" ? "Claim reward" : "Continue game"
              : `Continue in ${seconds}s`}
          </button>
        </div>
      </section>
    </div>
  );
}
