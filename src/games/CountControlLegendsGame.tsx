import { useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

export function CountControlLegendsGame({ active, preparing, runKey, soundEnabled }: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({ embedded: "tiptap", autoplay: "1", muted: soundEnabled ? "0" : "1", run: String(runKey) });
    return `/games/count-control-legends/index.html?${params}`;
  }, [runKey, soundEnabled]);

  useEffect(() => {
    if (!active) return;
    frameRef.current?.contentWindow?.postMessage({ source: "tiptap-parent", type: "auto-start" }, window.location.origin);
  }, [active]);

  // Unity initialisation is the expensive part. Keep exactly the feed's
  // prepared Count Control card mounted while it is off-screen so that moving
  // onto it reveals an already-booted source game rather than a fresh loader.
  const mounted = active || preparing;
  return mounted ? <iframe ref={frameRef} className="game-arena count-control-legends-game" src={gameUrl} title="Play Count Control Legends" allow="autoplay; fullscreen; gamepad" sandbox="allow-scripts allow-same-origin allow-pointer-lock" /> : <div className="game-arena count-control-legends-placeholder" aria-hidden="true" />;
}
