import { useCallback, useEffect, useMemo, useRef } from "react";
import { vibrate } from "../game-utils";
import type { GameProps } from "../types";

const GAME_SOURCE = "tiptap-arithmetica";
const PARENT_SOURCE = "tiptap-parent";

export function ArithmeticaGame({
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
      muted: initialSoundRef.current ? "0" : "1",
      run: String(runKey),
    });
    return `/games/arithmetica/index.html?${params}`;
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
    return <div className="game-arena arithmetica-placeholder" aria-hidden="true" />;
  }

  return (
    <iframe
      ref={frameRef}
      className="game-arena arithmetica-game"
      src={gameUrl}
      title="Play ArithmeticA"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      onLoad={syncFrameState}
    />
  );
}
