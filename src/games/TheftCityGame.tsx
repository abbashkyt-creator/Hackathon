import { useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

export function TheftCityGame({ active, preparing, runKey, soundEnabled }: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({
      embedded: "tiptap",
      autoplay: "1",
      muted: soundEnabled ? "0" : "1",
      run: String(runKey),
    });
    return `/games/theft-city/index.html?${params}`;
  }, [runKey, soundEnabled]);

  useEffect(() => {
    if (!active) return;
    frameRef.current?.contentWindow?.postMessage(
      { source: "tiptap-parent", type: "auto-start" },
      window.location.origin,
    );
    frameRef.current?.focus();
  }, [active]);

  if (!active && !preparing) {
    return <div className="game-arena theft-city-placeholder" aria-hidden="true" />;
  }

  return (
    <iframe
      ref={frameRef}
      className="game-arena theft-city-game"
      src={gameUrl}
      title="Play Theft City"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
    />
  );
}
