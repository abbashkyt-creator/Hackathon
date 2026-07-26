import { useCallback, useEffect, useRef, useState } from "react";
import { tone, vibrate } from "../game-utils";
import type { GameProps } from "../types";

export function MemoryGridGame({
  active,
  runKey,
  soundEnabled,
  hapticsEnabled,
  onFinish,
}: GameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [lit, setLit] = useState<number | null>(null);
  const [watching, setWatching] = useState(true);
  const [score, setScore] = useState(0);
  const timers = useRef<number[]>([]);
  const sequenceRef = useRef<number[]>([]);
  const scoreRef = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const showSequence = useCallback(
    (next: number[]) => {
      clearTimers();
      setWatching(true);
      setInputIndex(0);
      next.forEach((cell, index) => {
        timers.current.push(
          window.setTimeout(() => {
            setLit(cell);
            tone(soundEnabled, 360 + cell * 90, 0.08);
          }, 360 + index * 520),
          window.setTimeout(() => setLit(null), 680 + index * 520),
        );
      });
      timers.current.push(
        window.setTimeout(() => setWatching(false), 420 + next.length * 520),
      );
    },
    [clearTimers, soundEnabled],
  );

  useEffect(() => {
    clearTimers();
    const initial = [Math.floor(Math.random() * 9)];
    sequenceRef.current = initial;
    scoreRef.current = 0;
    setSequence(initial);
    setScore(0);
    setInputIndex(0);
    setLit(null);
    if (active) showSequence(initial);
    return () => {
      clearTimers();
    };
  }, [active, clearTimers, runKey, showSequence]);

  const choose = (cell: number) => {
    if (!active || watching) return;
    if (cell !== sequenceRef.current[inputIndex]) {
      vibrate(hapticsEnabled, [40, 35, 70]);
      tone(soundEnabled, 120, 0.18);
      onFinish(scoreRef.current);
      return;
    }
    tone(soundEnabled, 360 + cell * 90);
    vibrate(hapticsEnabled, 14);
    const nextIndex = inputIndex + 1;
    if (nextIndex < sequenceRef.current.length) {
      setInputIndex(nextIndex);
      return;
    }
    scoreRef.current += 500 + sequenceRef.current.length * 220;
    setScore(scoreRef.current);
    const next = [...sequenceRef.current, Math.floor(Math.random() * 9)];
    sequenceRef.current = next;
    setSequence(next);
    window.setTimeout(() => showSequence(next), 450);
  };

  return (
    <div className="game-arena memory-grid">
      <div className="memory-copy">
        <span>{watching ? "WATCH" : `YOUR TURN · ${inputIndex + 1}/${sequence.length}`}</span>
        <strong>{score.toLocaleString()}</strong>
      </div>
      <div className="memory-board">
        {Array.from({ length: 9 }, (_, cell) => (
          <button
            key={cell}
            className={lit === cell ? "is-lit" : ""}
            disabled={watching}
            onPointerDown={() => choose(cell)}
            aria-label={`Memory tile ${cell + 1}`}
          />
        ))}
      </div>
      <span className="memory-level">SIGNAL {sequence.length}</span>
    </div>
  );
}
