import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import type { AdStatSummary, OwnedAdConfig } from "./types";

/**
 * AdControlPanel — operator's unified control surface for the Tip Tap owned-ads channel.
 * Default OFF (ad-free). Open with #/ads hash. Flips the server override at runtime.
 */

interface AdStatsProps {
  rows: AdStatSummary[] | null;
  error: string | null;
  onRefresh: () => void;
}

function AdStats({ rows, error, onRefresh }: AdStatsProps) {
  if (error) {
    return (
      <div className="adsctrl-stats">
        <strong>Stats unavailable</strong>
        <span>{error}</span>
        <button type="button" onClick={onRefresh}>Retry</button>
      </div>
    );
  }
  if (!rows) return <div className="adsctrl-stats spin-sm">Loading…</div>;
  if (!rows.length) {
    return (
      <div className="adsctrl-stats">
        <strong>No ad activity yet</strong>
        <span>Impressions, completions and clicks from the owned channel appear here.</span>
      </div>
    );
  }
  return (
    <div className="adsctrl-stats">
      {rows.map((row) => (
        <div className="adsctrl-stat-row" key={`${row.campaignId}-${row.kind}`}>
          <span className="adsctrl-stat-name">
            <strong>{row.campaignId}</strong>
            <small>{row.kind}</small>
          </span>
          <span className="adsctrl-stat-nums">
            <b>{row.impressions}</b> <small>shown</small>
            <b>{row.completions}</b> <small>done</small>
            <b>{row.clicks}</b> <small>clicks</small>
          </span>
        </div>
      ))}
    </div>
  );
}

export function AdControlPanel() {
  const [config, setConfig] = useState<OwnedAdConfig | null>(null);
  const [stats, setStats] = useState<AdStatSummary[] | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refreshConfig = useCallback(async () => {
    try {
      setConfig(await api.adConfig());
    } catch {
      setToast("Could not load the ad channel config.");
    }
  }, []);

  const refreshStats = useCallback(async () => {
    setStatsError(null);
    try {
      setStats(await api.adStats());
    } catch {
      setStatsError("Stats endpoint unavailable (DB offline).");
    }
  }, []);

  useEffect(() => {
    if (open) {
      void refreshConfig();
      void refreshStats();
    }
  }, [open, refreshConfig, refreshStats]);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#/ads") setOpen(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const enableChannel = async (enabled: boolean) => {
    if (!config) return;
    setSaving(true);
    try {
      const next = await api.adAdminSetConfig({ ...config, enabled });
      setConfig(next);
      setToast(enabled ? "Ad channel ON — campaigns will show." : "Ad channel OFF — all games ad-free.");
    } catch {
      setToast("Could not update the ad channel.");
    } finally {
      setSaving(false);
    }
  };

  const resetChannel = async () => {
    setSaving(true);
    try {
      const next = await api.adAdminResetConfig();
      setConfig(next);
      await refreshStats();
      setToast("Reset to default config (ad-free).");
    } catch {
      setToast("Could not reset the ad channel.");
    } finally {
      setSaving(false);
    }
  };

  const openPreview = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("adPreview", "1");
    window.location.href = url.toString();
  };

  if (!open) return null;
  const enabled = config?.enabled === true;
  const campaignCount = config?.campaigns.filter((c) => c.enabled).length ?? 0;

  return (
    <div className="sheet-backdrop adsctrl-backdrop" role="presentation" onPointerDown={() => setOpen(false)}>
      <section
        className="bottom-sheet adsctrl-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Tip Tap ad channel control"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <button type="button" className="sheet-close" onClick={() => setOpen(false)} aria-label="Close ad control">
          ✕
        </button>
        <div className="adsctrl-head">
          <span>AD CHANNEL CONTROL</span>
          <h2>Owned ads pipeline</h2>
          <p>
            Default OFF — zero ads, zero third-party SDKs. Flip the channel on whenever you want
            to run your own campaigns inside breaks.
          </p>
        </div>

        <div className={`adsctrl-toggle ${enabled ? "is-on" : "is-off"}`}>
          <span>
            <strong>{enabled ? "CHANNEL ON" : "CHANNEL OFF"}</strong>
            <small>
              {enabled
                ? `${campaignCount} enabled campaign(s) can serve.`
                : "All games stay completely ad-free."}
            </small>
          </span>
          <button
            type="button"
            className={enabled ? "is-on" : ""}
            onClick={() => void enableChannel(!enabled)}
            disabled={saving}
            aria-pressed={enabled}
          >
            <i />
          </button>
        </div>

        <div className="adsctrl-actions">
          <button type="button" onClick={() => void resetChannel()} disabled={saving}>
            Reset to default
          </button>
          <button type="button" onClick={openPreview}>
            Preview ad dialog
          </button>
        </div>

        <AdStats rows={stats} error={statsError} onRefresh={() => void refreshStats()} />

        {config?.campaigns.length ? (
          <div className="adsctrl-campaigns">
            {config.campaigns.map((campaign) => (
              <div className="adsctrl-campaign" key={campaign.id}>
                <span className={`adsctrl-campaign-dot ${campaign.enabled ? "is-on" : "is-off"}`} />
                <span>
                  <strong>{campaign.title}</strong>
                  <small>
                    {campaign.kinds.join(" / ")} · {campaign.frequency.maxPerSession}/session ·{" "}
                    {campaign.skipAfterMs}ms skip · {campaign.rewardAfterMs}ms reward
                  </small>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="adsctrl-empty">No campaigns configured yet.</p>
        )}
        {toast && <div className="adsctrl-toast">{toast}</div>}
      </section>
    </div>
  );
}
