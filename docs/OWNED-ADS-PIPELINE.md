# Tip Tap owned-ad pipeline

Tip Tap ships with **no ads enabled**. `public/ads/config.json` is the single
switch and campaign manifest; its root `enabled` value is `false` in source.
No copied game can load Poki, CrazyGames, GameDistribution, AdSense, or another
third-party ad stack because the local CSP and `network-lock.js` remain in
front of every copied runtime.

## What was replaced

The copied games contain source calls for commercial/interstitial, rewarded,
and display ad methods. They used to be handled by separate local no-op shims.
All 19 copied-game entry pages now load `/games/_shared/ad-client.js` immediately
after the network lock, and their compatibility bridges route commercial and
rewarded requests to the same parent-owned pipeline. Disabled, unavailable,
busy, invalid, and timed-out requests resolve fail-closed so gameplay resumes.
Rewarded requests return `false` unless the owned placement actually reaches
its configured completion time.

Covered source surfaces include:

- Poki `commercialBreak`, `rewardedBreak`, and `displayAd` shims;
- GameDistribution `showAd` compatibility;
- 67 Game's `comercial` and `rewarded` ExternalInterface signals;
- Unity global commercial/reward completion callbacks;
- Construct and Phaser optional platform SDK surfaces.

The original ads, tracking, account services, and remote analytics remain
absent. Source notices and creator attribution remain unchanged.

## Enabling an owned campaign

1. Put image or video creative under `public/ads/`.
2. Add a campaign to `public/ads/config.json`. Media must stay under `/ads/`;
   invalid media paths are rejected. Click URLs may be a same-origin path or an
   explicit HTTP(S) destination.
3. Choose `kinds` (`interstitial`, `rewarded`) and placements (`*` or the named
   source placement), then set frequency and minimum interval values.
4. Set the root `enabled` value to `true`, run `npm run check`, and complete the
   VEU verification below before publishing.

The game is muted and sent a pause message while a placement is open, then is
always resumed. Interstitials cannot continue before `skipAfterMs`. Rewarded
placements always offer a no-thanks path and grant only after `rewardAfterMs`.
Video creatives autoplay muted and inline to respect browser autoplay rules.

## Local preview and verification

The committed house campaign stays disabled for normal users. On localhost
only, append `?adPreview=1`, then send the active copied-game iframe a
same-origin `{ source: "tiptap-parent", type: "preview-owned-ad-request" }`
message. The child originates the normal request, so parent Window/origin checks
are exercised. This bypasses only the root enable switch; it does not bypass
campaign validation. The result is exposed in that child as
`window.__TIPTAP_AD_PREVIEW_RESULT__` for VEU acceptance.

Verify all of the following in an isolated VEU session:

1. without `adPreview=1`, a source request resolves with `shown=false` and no
   overlay appears;
2. with `adPreview=1`, the labelled Tip Tap owned-ad dialog appears;
3. early rewarded dismissal returns no reward;
4. completion resumes and restores the active game's sound state;
5. VEU `xray endpoints` shows only the Tip Tap origin for the local runtime;
6. frequency caps prevent repeated placements according to the manifest.

Production enablement is a release decision. The pipeline does not fetch
campaigns from an ad network and does not include impression/click tracking.
