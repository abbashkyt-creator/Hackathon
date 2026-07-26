import { createPortal } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { vibrate } from "../game-utils";
import type { GameProps } from "../types";

const GAME_SOURCE = "tiptap-fruit-ninja";
const PARENT_SOURCE = "tiptap-parent";

export function FruitNinjaGame({
  active,
  preparing = false,
  runKey,
  soundEnabled,
  hapticsEnabled,
  onFinish,
}: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [frameBounds, setFrameBounds] = useState<DOMRect | null>(null);

  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({
      embedded: "tiptap",
      autoplay: "0",
      muted: "1",
      run: String(runKey),
    });
    return `/games/fruit-ninja/index.html?${params}`;
  }, [runKey]);

  const syncFrameState = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      { source: PARENT_SOURCE, type: "set-muted", muted: !soundEnabled },
      window.location.origin,
    );
    if (active) {
      frameRef.current?.contentWindow?.postMessage(
        { source: PARENT_SOURCE, type: "auto-start" },
        window.location.origin,
      );
    }
  }, [active, soundEnabled]);

  useEffect(() => {
    const receiveGameEvent = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.source !== GAME_SOURCE
      ) return;
      if (event.data.type === "ready") {
        setReady(true);
        if (active) syncFrameState();
        return;
      }
      if (!active || event.data.type !== "score") return;
      const score = Number(event.data.score);
      if (!Number.isSafeInteger(score) || score < 0) return;
      vibrate(hapticsEnabled, [40, 30, 80]);
      onFinish(score);
    };
    window.addEventListener("message", receiveGameEvent);
    return () => window.removeEventListener("message", receiveGameEvent);
  }, [active, hapticsEnabled, onFinish, syncFrameState]);

  useEffect(() => {
    if (active) syncFrameState();
  }, [active, syncFrameState]);

  useEffect(() => {
    if ((!active && !preparing) || ready) return;
    const check = () =>
      frameRef.current?.contentWindow?.postMessage(
        { source: PARENT_SOURCE, type: "ready-check" },
        window.location.origin,
      );
    check();
    const timer = window.setInterval(check, 750);
    return () => window.clearInterval(timer);
  }, [active, preparing, ready]);

  useEffect(() => {
    setReady(false);
  }, [runKey]);

  useLayoutEffect(() => {
    if (!active) {
      setFrameBounds(null);
      return;
    }
    const updateBounds = () => {
      const frame = anchorRef.current?.closest(".game-frame");
      if (frame instanceof HTMLElement) setFrameBounds(frame.getBoundingClientRect());
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    document.querySelector(".feed")?.addEventListener("scroll", updateBounds, { passive: true });
    return () => {
      window.removeEventListener("resize", updateBounds);
      document.querySelector(".feed")?.removeEventListener("scroll", updateBounds);
    };
  }, [active]);

  if (!active && !preparing) {
    return <div ref={anchorRef} className="game-arena fruit-ninja-placeholder" aria-hidden="true" />;
  }

  return (
    <>
      {createPortal(
        <iframe
          ref={frameRef}
          className={`fruit-ninja-game${active && ready ? " is-ready" : ""}`}
          src={gameUrl}
          title="Play Fruit Ninja"
          aria-hidden={!active}
          tabIndex={active ? 0 : -1}
          allow="autoplay; fullscreen; gamepad"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          onLoad={syncFrameState}
          style={{
            position: "fixed",
            left: active && frameBounds ? frameBounds.left : 0,
            top: active && frameBounds ? frameBounds.top : 0,
            width: active && frameBounds ? frameBounds.width : 390,
            height: active && frameBounds ? frameBounds.height : 700,
            zIndex: active && ready ? 2 : 0,
            opacity: active && ready ? 1 : 0.001,
          }}
        />,
        document.body,
      )}
      <div ref={anchorRef} className="game-arena fruit-ninja-placeholder" aria-hidden="true" />
      {active && !ready && (
        <div className="game-arena fruit-ninja-original-cover" aria-label="Fruit Ninja is starting">
          <img
            src="/games/fruit-ninja/assets/splash/splash%20screen.png"
            alt="Fruit Ninja by Halfbrick and Storms"
          />
          <div className="fruit-ninja-starting">
            <i />
            <span>STARTING FRUIT NINJA</span>
          </div>
        </div>
      )}
    </>
  );
}
