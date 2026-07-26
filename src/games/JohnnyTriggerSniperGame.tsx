import { useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

export function JohnnyTriggerSniperGame({ active, preparing, runKey, soundEnabled }: GameProps) {
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
    return `/games/johnny-trigger-sniper/index.html?${parameters}`;
  }, [runKey]);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage(
      {
        source: "tiptap-parent",
        type: "set-state",
        active,
        muted: !soundEnabled || !active,
      },
      window.location.origin,
    );
  }, [active, soundEnabled]);

  // Keep an upcoming Unity instance booting while it is still outside the
  // viewport. The card is made invisible, not display:none, in styles.css so
  // the Unity canvas receives a real layout and is ready on swipe-in.
  const mounted = active || preparing;
  return mounted ? (
    <iframe
      ref={frameRef}
      className="game-arena johnny-trigger-sniper-game"
      src={src}
      title="Play Johnny Trigger - Sniper Game"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      onLoad={() =>
        frameRef.current?.contentWindow?.postMessage(
          {
            source: "tiptap-parent",
            type: "set-state",
            active,
            muted: !soundEnabled || !active,
          },
          window.location.origin,
        )
      }
    />
  ) : (
    <div className="game-arena johnny-trigger-sniper-placeholder" aria-hidden="true" />
  );
}
