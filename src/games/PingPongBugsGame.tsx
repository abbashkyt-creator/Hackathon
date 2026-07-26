import { useCallback, useEffect, useMemo, useRef } from "react";
import { vibrate } from "../game-utils";
import type { GameProps } from "../types";

// Second Ping Pong Go card: the same authorized mirror bundle, but the bridge is
// told (?mode=bughunt) to auto-start the game's own single-player Bug Hunt mode
// instead of the table-tennis match. It is a distinct game with its own catalog
// entry, score policy, and leaderboard — not combined with Ping Pong Go.
const GAME_SOURCE = "tiptap-ping-pong-go";
const PARENT_SOURCE = "tiptap-parent";

export function PingPongBugsGame({
  active,
  runKey,
  soundEnabled,
  hapticsEnabled,
  onFinish,
}: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const initialSoundRef = useRef(soundEnabled);
  if (!active) initialSoundRef.current = soundEnabled;
  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({
      embedded: "tiptap",
      autoplay: "1",
      mode: "bughunt",
      muted: initialSoundRef.current ? "0" : "1",
      run: String(runKey),
    });
    return `/games/ping-pong-go/index.html?${params}`;
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
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.source !== GAME_SOURCE ||
        event.data.type !== "score"
      ) {
        return;
      }
      const score = Number(event.data.score);
      if (!Number.isSafeInteger(score) || score < 0) return;
      vibrate(hapticsEnabled, [40, 30, 80]);
      onFinish(score);
    };
    window.addEventListener("message", receiveGameEvent);
    return () => window.removeEventListener("message", receiveGameEvent);
  }, [active, hapticsEnabled, onFinish]);

  useEffect(() => {
    if (!active) return;
    syncFrameState();
  }, [active, syncFrameState]);

  if (!active) {
    return <div className="game-arena ping-pong-bugs-placeholder" aria-hidden="true" />;
  }

  return (
    <iframe
      ref={frameRef}
      className="game-arena ping-pong-bugs-game"
      src={gameUrl}
      title="Play Ping Pong Bugs"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      onLoad={syncFrameState}
    />
  );
}
