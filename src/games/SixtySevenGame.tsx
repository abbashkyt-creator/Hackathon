import { useCallback, useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

const GAME_SOURCE = "tiptap-67-game";
const PARENT_SOURCE = "tiptap-parent";

/**
 * The original, locally hosted 67 Game SWF. The source does not publish a
 * trustworthy score/completion callback, so this card intentionally remains
 * unranked rather than manufacturing a Tip Tap score.
 */
export function SixtySevenGame({ active, runKey, soundEnabled }: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const initialSoundRef = useRef(soundEnabled);
  if (!active) initialSoundRef.current = soundEnabled;

  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({
      embedded: "tiptap",
      // Ruffle can resume immediately, but the source SWF owns its own
      // visible start screen and requires one real user tap by browser policy.
      autoplay: "1",
      muted: initialSoundRef.current ? "0" : "1",
      run: String(runKey),
    });
    return `/games/67-game/index.html?${params}`;
  }, [active, runKey]);

  const syncFrameState = useCallback(() => {
    const frameWindow = frameRef.current?.contentWindow;
    if (!frameWindow) return;
    frameWindow.postMessage(
      { source: PARENT_SOURCE, type: "set-muted", muted: !soundEnabled },
      window.location.origin,
    );
    frameWindow.postMessage(
      { source: PARENT_SOURCE, type: "auto-start" },
      window.location.origin,
    );
  }, [soundEnabled]);

  useEffect(() => {
    if (!active) return;
    const receiveGameEvent = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frameRef.current?.contentWindow &&
        event.data?.source === GAME_SOURCE &&
        event.data.type === "runtime-error"
      ) {
        console.warn("67 Game local runtime error:", event.data.detail);
      }
    };
    window.addEventListener("message", receiveGameEvent);
    return () => window.removeEventListener("message", receiveGameEvent);
  }, [active]);

  useEffect(() => {
    if (active) syncFrameState();
  }, [active, syncFrameState]);

  if (!active) {
    return <div className="game-arena sixty-seven-placeholder" aria-hidden="true" />;
  }

  return (
    <iframe
      ref={frameRef}
      className="game-arena sixty-seven-original"
      src={gameUrl}
      title="Play the original 67 Game"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      onLoad={syncFrameState}
    />
  );
}
