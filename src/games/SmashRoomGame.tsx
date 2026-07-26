import { useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

/**
 * The mirrored Happylander source handles the actual game state and input.
 * It has no score callback in its public source API, so this card deliberately
 * remains unranked instead of submitting a fabricated result.
 */
export function SmashRoomGame({ active, runKey, soundEnabled }: GameProps) {
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
    return `/games/smash-room/index.html?${params}`;
  }, [active, runKey]);

  useEffect(() => {
    if (!active) return;
    frameRef.current?.contentWindow?.postMessage(
      { source: "tiptap-parent", type: "set-muted", muted: !soundEnabled },
      window.location.origin,
    );
  }, [active, soundEnabled]);

  if (!active) return <div className="game-arena smash-room-placeholder" aria-hidden="true" />;

  return (
    <iframe
      ref={frameRef}
      className="game-arena smash-room-game"
      src={gameUrl}
      title="Play Smash Room"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
    />
  );
}
