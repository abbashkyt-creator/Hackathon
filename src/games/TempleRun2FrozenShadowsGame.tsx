import { useMemo } from "react";
import type { GameProps } from "../types";

/**
 * Local Imangi source mirror. The game manages its own run state and does not
 * expose a trustworthy score callback, so Tip Tap leaves it unranked.
 */
export function TempleRun2FrozenShadowsGame({ active, runKey }: GameProps) {
  const gameUrl = useMemo(() => {
    const params = new URLSearchParams({ embedded: "tiptap", autoplay: "1", run: String(runKey) });
    return `/games/temple-run-2-frozen-shadows/index.html?${params}`;
  }, [runKey]);

  if (!active) {
    return <div className="game-arena temple-run-2-frozen-shadows-placeholder" aria-hidden="true" />;
  }

  return (
    <iframe
      className="game-arena temple-run-2-frozen-shadows-game"
      src={gameUrl}
      title="Play Temple Run 2: Frozen Shadows"
      allow="autoplay; fullscreen; gamepad"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
    />
  );
}
