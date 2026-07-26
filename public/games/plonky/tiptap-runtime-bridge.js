(() => {
  "use strict";

  const PARENT_SOURCE = "tiptap-parent";

  const setMuted = (muted) => {
    for (const audio of document.querySelectorAll("audio")) audio.muted = muted;
    document.documentElement.dataset.tiptapMuted = String(Boolean(muted));
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.source !== PARENT_SOURCE) return;
    if (event.data.type === "set-muted") setMuted(Boolean(event.data.muted));
    if (event.data.type === "auto-start") window.focus();
  });

  window.addEventListener("error", (event) => {
    window.parent.postMessage(
      { source: "tiptap-plonky", type: "runtime-error", detail: event.message || "unknown runtime error" },
      window.location.origin,
    );
  });
})();
