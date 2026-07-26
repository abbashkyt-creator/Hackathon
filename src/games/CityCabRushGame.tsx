import { useCallback, useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

const PARENT_SOURCE = "tiptap-parent";

/**
 * City Cab Rush is a locally hosted Unity WebGL build.  Keeping the next
 * card mounted while it is being prepared lets the large Unity download start
 * before the player arrives at the card.
 */
export function CityCabRushGame({ active, preparing, runKey, soundEnabled }: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const initialSoundRef = useRef(soundEnabled);
  if (!active) initialSoundRef.current = soundEnabled;

  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({
      embedded: "tiptap",
      autoplay: "1",
      muted: initialSoundRef.current ? "0" : "1",
      run: String(runKey),
    });
    return `/games/city-cab-rush/index.html?${params}`;
  }, [active, runKey]);

  const syncFrameState = useCallback(() => {
    const gameWindow = frameRef.current?.contentWindow;
    if (!gameWindow) return;
    gameWindow.postMessage(
      { source: PARENT_SOURCE, type: "set-muted", muted: !soundEnabled },
      window.location.origin,
    );
    gameWindow.postMessage({ source: PARENT_SOURCE, type: "auto-start" }, window.location.origin);
  }, [soundEnabled]);

  useEffect(() => {
    if (active) syncFrameState();
  }, [active, syncFrameState]);

  const activateFrame = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    frame.focus({ preventScroll: true });
    syncFrameState();
  }, [syncFrameState]);

  const mounted = active || preparing;
  if (!mounted) return <div className="game-arena city-cab-rush-placeholder" aria-hidden="true" />;

  return (
    <iframe
      ref={frameRef}
      className="game-arena city-cab-rush-game"
      src={gameUrl}
      title="Play City Cab Rush"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      tabIndex={0}
      onLoad={syncFrameState}
      onPointerDown={activateFrame}
      onFocus={syncFrameState}
    />
  );
}
