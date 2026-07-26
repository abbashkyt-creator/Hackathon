import { useCallback, useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

const GAME_SOURCE = "tiptap-supercar-legends";
const PARENT_SOURCE = "tiptap-parent";

/**
 * Locally mirrored Supercar Legends (Unity 2021.3 WebGL, by Jungle Tavern).
 * The captured build exposes no score/leaderboard callback, so this card is
 * intentionally UNRANKED — it never calls onFinish, and no score is invented.
 * The local bridge auto-skips ads and synthesizes the canvas tap needed to
 * enter the run, stopping as soon as the real gameplay-start event fires.
 */
export function SupercarLegendsGame({ active, runKey, soundEnabled }: GameProps) {
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
    return `/games/supercar-legends/index.html?${params}`;
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
        console.warn("Supercar Legends local runtime error:", event.data.detail);
      }
    };
    window.addEventListener("message", receiveGameEvent);
    return () => window.removeEventListener("message", receiveGameEvent);
  }, [active]);

  useEffect(() => {
    if (active) syncFrameState();
  }, [active, syncFrameState]);

  if (!active) {
    return <div className="game-arena supercar-legends-placeholder" aria-hidden="true" />;
  }

  return (
    <iframe
      ref={frameRef}
      className="game-arena supercar-legends-game"
      src={gameUrl}
      title="Play Supercar Legends"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      onLoad={syncFrameState}
    />
  );
}
