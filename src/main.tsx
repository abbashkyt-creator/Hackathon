import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Auto-update: register the build-versioned service worker, then reload the page
// exactly once when a newly deployed worker takes control. This is what lets a
// deploy reach returning users automatically — no incognito, no manual cache
// clearing. The reload only fires on an UPDATE (a controller was already active),
// never on the first-ever install, and the flag prevents any reload loop.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloading = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading || !hadController) return;
      reloading = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.update().catch(() => {});
        // Re-check for a new deploy whenever the tab is brought back to the front.
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") registration.update().catch(() => {});
        });
      })
      .catch(() => {});
  });
}
