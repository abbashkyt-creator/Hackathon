import { useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

export function DigOutOfPrisonGame({ active, preparing, runKey, soundEnabled }: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const initialSoundRef = useRef(soundEnabled);
  if (!active && !preparing) initialSoundRef.current = soundEnabled;

  const src = useMemo(() => {
    const parameters = new URLSearchParams({
      embedded: "tiptap",
      autoplay: "1",
      muted: initialSoundRef.current ? "0" : "1",
      run: String(runKey),
    });
    return `/games/dig-out-of-prison/index.html?${parameters}`;
  }, [runKey]);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage(
      { source: "tiptap-parent", type: "set-state", active, muted: !soundEnabled || !active },
      window.location.origin,
    );
  }, [active, soundEnabled]);

  const mounted = active || preparing;
  return mounted ? (
    <iframe ref={frameRef} className="game-arena dig-out-of-prison-game" src={src} title="Play Dig out of Prison" allow="autoplay; fullscreen; gamepad" sandbox="allow-scripts allow-same-origin allow-pointer-lock" aria-hidden={!active} tabIndex={active ? 0 : -1} />
  ) : (
    <div className="game-arena dig-out-of-prison-placeholder" aria-hidden="true" />
  );
}
