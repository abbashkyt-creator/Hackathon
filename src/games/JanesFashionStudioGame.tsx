import { useCallback, useEffect, useMemo, useRef } from "react";
import { vibrate } from "../game-utils";
import type { GameProps } from "../types";

const GAME_SOURCE = "tiptap-janes-fashion-studio";
const PARENT_SOURCE = "tiptap-parent";

export function JanesFashionStudioGame({
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
    return `/games/janes-fashion-studio/index.html?${params}`;
  }, [active, runKey]);

  const syncFrameState = useCallback(() => {
    const fw = frameRef.current?.contentWindow;
    if (!fw) return;
    fw.postMessage({ source: PARENT_SOURCE, type: "set-muted", muted: !soundEnabled }, window.location.origin);
    fw.postMessage({ source: PARENT_SOURCE, type: "auto-start" }, window.location.origin);
  }, [soundEnabled]);

  useEffect(() => {
    if (!active) return;
    const onMsg = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin || ev.source !== frameRef.current?.contentWindow || ev.data?.source !== GAME_SOURCE || ev.data.type !== "score" || ev.data.final !== true) return;
      const score = Number(ev.data.score);
      if (!Number.isSafeInteger(score) || score < 0) return;
      vibrate(hapticsEnabled, [40, 30, 80]);
      onFinish(score);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [active, hapticsEnabled, onFinish]);

  useEffect(() => { if (active) syncFrameState(); }, [active, syncFrameState]);

  if (!active) return <div className="game-arena janes-fashion-studio-placeholder" aria-hidden="true" />;

  return (
    <iframe
      ref={frameRef}
      className="game-arena janes-fashion-studio-game"
      src={gameUrl}
      title="Play janes-fashion-studio"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      onLoad={syncFrameState}
    />
  );
}
