import { useCallback, useEffect, useMemo, useRef } from "react";
import type { GameProps } from "../types";

const GAME_SOURCE = "tiptap-plonky";
const PARENT_SOURCE = "tiptap-parent";

/**
 * The original locally hosted Plonky Construct source. Its host integration
 * exposes gameplay and ad lifecycle events only, never a trustworthy score or
 * completion value, so this card remains intentionally unranked.
 */
export function PlonkyGame({ active, runKey, soundEnabled }: GameProps) {
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
    return `/games/plonky/index.html?${params}`;
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

  // The feed normally reserves vertical gestures for scrolling. Plonky is a
  // real-time platformer, so a deliberate tap on its frame must instead hand
  // both keyboard and touch input to the Construct runtime.
  const activateFrame = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    frame.focus({ preventScroll: true });
    syncFrameState();
  }, [syncFrameState]);

  useEffect(() => {
    if (!active) return;
    const receiveGameEvent = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frameRef.current?.contentWindow &&
        event.data?.source === GAME_SOURCE &&
        event.data.type === "runtime-error"
      ) {
        console.warn("Plonky local runtime error:", event.data.detail);
      }
    };
    window.addEventListener("message", receiveGameEvent);
    return () => window.removeEventListener("message", receiveGameEvent);
  }, [active]);

  useEffect(() => {
    if (active) syncFrameState();
  }, [active, syncFrameState]);

  if (!active) return <div className="game-arena plonky-placeholder" aria-hidden="true" />;

  return (
    <iframe
      ref={frameRef}
      className="game-arena plonky-game"
      src={gameUrl}
      title="Play Plonky"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      tabIndex={0}
      onLoad={syncFrameState}
      onPointerDown={activateFrame}
      onFocus={syncFrameState}
    />
  );
}
