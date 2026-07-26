import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameProps } from "../types";

const GAME_SOURCE = "tiptap-stickman-fury";
const PARENT_SOURCE = "tiptap-parent";
const SAVE_KEY = "stickmanfuryv4";
const PARENT_SAVE_KEY = "tiptap:stickman-fury:save";

export function StickmanFuryGame({
  active,
  preparing = false,
  runKey,
  soundEnabled,
}: GameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);
  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({
      embedded: "tiptap",
      autoplay: "1",
      muted: soundEnabled ? "0" : "1",
      run: String(runKey),
    });
    try {
      const saved = window.localStorage.getItem(PARENT_SAVE_KEY);
      if (saved) params.set("save", saved);
    } catch {
      // Persistence is optional when a browser or WebView disables storage.
    }
    return `/games/stickman-fury/index.html?${params}`;
  }, [runKey]);

  const sendState = useCallback(() => {
    const target = frameRef.current?.contentWindow;
    if (!target) return;
    target.postMessage(
      { source: PARENT_SOURCE, type: "set-muted", muted: !soundEnabled },
      "*",
    );
    target.postMessage(
      { source: PARENT_SOURCE, type: active ? "resume" : "pause" },
      "*",
    );
    if (active) frameRef.current?.focus({ preventScroll: true });
  }, [active, soundEnabled]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source !== frameRef.current?.contentWindow ||
        event.data?.source !== GAME_SOURCE
      ) return;
      if (event.data.type === "ready") {
        setReady(true);
        sendState();
      }
      if (event.data.type === "storage-set" && event.data.key === SAVE_KEY) {
        try {
          window.localStorage.setItem(PARENT_SAVE_KEY, String(event.data.value ?? ""));
        } catch {
          // Gameplay remains available if parent persistence is denied.
        }
      }
      if (event.data.type === "storage-remove" && event.data.key === SAVE_KEY) {
        try {
          window.localStorage.removeItem(PARENT_SAVE_KEY);
        } catch {
          // Ignore storage denial.
        }
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [sendState]);

  useEffect(sendState, [sendState]);
  useEffect(() => setReady(false), [runKey]);

  if (!active && !preparing) {
    return <div className="game-arena stickman-fury-placeholder" aria-hidden="true" />;
  }

  return (
    <>
      {!ready && active && (
        <div className="game-arena stickman-fury-loading" role="status">
          <strong>STICKMAN FURY</strong>
          <span>ENTERING THE ARENA…</span>
        </div>
      )}
      <iframe
        ref={frameRef}
        className={`game-arena stickman-fury-game${ready ? " is-ready" : ""}`}
        src={gameUrl}
        title="Play Stickman Fury"
        aria-hidden={!active}
        tabIndex={active ? 0 : -1}
        allow="autoplay; fullscreen; gamepad"
        sandbox="allow-scripts allow-pointer-lock"
        onLoad={sendState}
      />
    </>
  );
}
