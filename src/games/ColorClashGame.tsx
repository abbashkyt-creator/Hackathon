import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shuffle, tone, vibrate } from "../game-utils";
import type { GameProps } from "../types";

const COLORS = [
  { name: "LIME", value: "#c8ff00" },
  { name: "CYAN", value: "#21d4fd" },
  { name: "VIOLET", value: "#a855f7" },
  { name: "PINK", value: "#ff4fd8" },
] as const;

export function ColorClashGame({
  active,
  runKey,
  soundEnabled,
  hapticsEnabled,
  onFinish,
}: GameProps) {
  const [target, setTarget] = useState(0);
  const [ink, setInk] = useState(1);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const scoreRef = useRef(0);
  const roundRef = useRef(1);

  const nextRound = useCallback(() => {
    const nextTarget = Math.floor(Math.random() * COLORS.length);
    let nextInk = Math.floor(Math.random() * COLORS.length);
    if (nextInk === nextTarget) nextInk = (nextInk + 1) % COLORS.length;
    setTarget(nextTarget);
    setInk(nextInk);
    setOrder(shuffle([0, 1, 2, 3]));
  }, []);

  useEffect(() => {
    scoreRef.current = 0;
    roundRef.current = 1;
    setScore(0);
    setRound(1);
    nextRound();
  }, [nextRound, runKey]);

  const choose = (index: number) => {
    if (!active) return;
    if (index !== target) {
      vibrate(hapticsEnabled, [40, 30, 70]);
      tone(soundEnabled, 130, 0.16);
      window.setTimeout(() => onFinish(scoreRef.current), 220);
      return;
    }
    scoreRef.current += 300 + roundRef.current * 55;
    roundRef.current += 1;
    setScore(scoreRef.current);
    setRound(roundRef.current);
    vibrate(hapticsEnabled, 16);
    tone(soundEnabled, 620 + roundRef.current * 18);
    nextRound();
  };

  const choices = useMemo(() => order.map((index) => COLORS[index]), [order]);

  return (
    <div className="game-arena color-clash">
      <div className="color-score">
        <span>STREAK {round - 1}</span>
        <strong>{score.toLocaleString()}</strong>
      </div>
      <div className="color-prompt">
        <small>TAP THE COLOR NAMED</small>
        <strong style={{ color: COLORS[ink].value }}>{COLORS[target].name}</strong>
      </div>
      <div className="color-grid">
        {choices.map((color) => {
          const index = COLORS.findIndex((item) => item.name === color.name);
          return (
            <button
              key={color.name}
              style={{ "--tile-color": color.value } as React.CSSProperties}
              onPointerDown={() => choose(index)}
              aria-label={color.name}
            >
              <span />
            </button>
          );
        })}
      </div>
    </div>
  );
}
