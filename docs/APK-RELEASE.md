# Android APK release

## Decision

Use a Trusted Web Activity (TWA) after the Replit deployment is final. This keeps the Replit web app as the one production codebase and gives judges a fullscreen Android installation without shipping a second game runtime. Android verifies that the app and website belong to the same publisher through Digital Asset Links.

Do not build or commit an APK before the final HTTPS hostname and release signing key exist. Both values are part of the verification relationship.

## Prerequisites

- Final working Replit deployment, for example `https://tip-tap-games.replit.app`
- Node.js and a Java Development Kit on the release machine
- Android SDK, installed automatically by Bubblewrap when needed
- Permanent Android application ID; planned default: `games.tiptap.app`
- Permanent release keystore stored outside Git and backed up securely

## Build with Bubblewrap

Install the current Bubblewrap CLI on the release machine:

```bash
npm install --global @bubblewrap/cli
```

Initialize from the deployed manifest:

```bash
bubblewrap init --manifest=https://YOUR_FINAL_REPLIT_DOMAIN/manifest.webmanifest
```

During initialization:

- confirm the final origin and `/` scope,
- set application ID to `games.tiptap.app` unless it is already registered,
- use portrait orientation,
- create or select the permanent release keystore,
- record the SHA-256 certificate fingerprint.

Build:

```bash
bubblewrap build
```

Bubblewrap produces the signed APK (and can also produce an Android App Bundle). Install the APK on the actual judge device:

```bash
bubblewrap install
```

## Link the APK to Replit

Copy `docs/templates/assetlinks.json` to:

```text
public/.well-known/assetlinks.json
```

Replace the fingerprint placeholder with the exact SHA-256 fingerprint from the release key. If the application ID changed, replace that too. Rebuild and redeploy Replit, then verify:

```text
https://YOUR_FINAL_REPLIT_DOMAIN/.well-known/assetlinks.json
```

It must return HTTP 200 with `application/json`, no redirect, and the exact production package/fingerprint pair. Then rebuild the APK so its start URL and deployed association are final.

## Phone acceptance test

1. Fresh-install the APK on a normal Android phone.
2. Launch from the icon and confirm there is no browser address bar.
3. Play the first lightweight game immediately.
4. Swipe to Subway Surfers and Dino Runner; verify immediate gameplay, touch, sound toggle, score completion, and frame rate.
5. Background and foreground the app; only the visible game may resume.
6. Toggle airplane mode after one successful online visit. Cached game assets should replay; new scores must fail honestly until the API is reachable.
7. Reconnect and verify a new real score reaches the Replit leaderboard.
8. Inspect requests and confirm no copied game contacts its source host.

## Release boundary

The current repository is PWA- and TWA-ready. The final APK is intentionally blocked on external release facts: final Replit URL, signing key, certificate fingerprint, and Android device test. Never claim the APK is complete until those steps pass.

References:

- Android TWA overview: https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities
- Chrome Bubblewrap quick start: https://developer.chrome.com/docs/android/trusted-web-activity/quick-start
- Android App Links and Digital Asset Links: https://developer.android.com/training/app-links/about
