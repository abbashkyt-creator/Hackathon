import { useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

export function KittyLovesBirds2Game({ active, runKey, soundEnabled }: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({ embedded: "tiptap", autoplay: "1", muted: soundEnabled ? "0" : "1", run: String(runKey) });
    return `/games/kitty-loves-birds-2/index.html?${params}`;
  }, [runKey, soundEnabled]);

  useEffect(() => {
    if (!active) return;
    frameRef.current?.contentWindow?.focus();
  }, [active]);

  if (!active) return <div className="game-arena kitty-loves-birds-2-placeholder" aria-hidden="true" />;
  return <iframe ref={frameRef} className="game-arena kitty-loves-birds-2-game" src={gameUrl} title="Play Kitty Loves Birds 2" allow="autoplay; fullscreen; gamepad" sandbox="allow-scripts allow-same-origin allow-pointer-lock" />;
}
