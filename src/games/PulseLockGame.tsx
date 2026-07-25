import { useCallback, useEffect, useRef, useState } from "react";
import { tone, vibrate } from "../game-utils";
import type { GameProps } from "../types";

export function PulseLockGame({
  active,
  runKey,
  soundEnabled,
  hapticsEnabled,
  onFinish,
}: GameProps) {
  const [position, setPosition] = useState(0);
  const [target, setTarget] = useState(66);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const positionRef = useRef(0);
  const scoreRef = useRef(0);
  const roundRef = useRef(1);
  const frameRef = useRef(0);
  const lastRef = useRef(0);
  const directionRef = useRef(1);

  useEffect(() => {
    setPosition(0);
    setTarget(55 + Math.random() * 30);
    setScore(0);
    setRound(1);
    setFlash(null);
    positionRef.current = 0;
    scoreRef.current = 0;
    roundRef.current = 1;
    directionRef.current = 1;
  }, [runKey]);

  useEffect(() => {
    if (!active) return;
    lastRef.current = performance.now();
    const step = (now: number) => {
      const delta = Math.min(32, now - lastRef.current);
      lastRef.current = now;
      const speed = 0.045 + roundRef.current * 0.004;
      let next = positionRef.current + directionRef.current * delta * speed;
      if (next >= 100) {
        next = 100;
        directionRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        directionRef.current = 1;
      }
      positionRef.current = next;
      setPosition(next);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, runKey]);

  const tap = useCallback(() => {
    if (!active || flash) return;
    const distance = Math.abs(positionRef.current - target);
    if (distance > 15) {
      setFlash("bad");
      vibrate(hapticsEnabled, [35, 35, 60]);
      tone(soundEnabled, 120, 0.16);
      window.setTimeout(() => onFinish(scoreRef.current), 380);
      return;
    }
    const gain = Math.round(500 + (15 - distance) * 70 + roundRef.current * 35);
    scoreRef.current += gain;
    roundRef.current += 1;
    setScore(scoreRef.current);
    setRound(roundRef.current);
    setFlash("good");
    vibrate(hapticsEnabled, 18);
    tone(soundEnabled, 540 + roundRef.current * 22);
    setTarget(18 + Math.random() * 64);
    window.setTimeout(() => setFlash(null), 170);
  }, [active, flash, hapticsEnabled, onFinish, soundEnabled, target]);

  return (
    <button
      className={`game-arena pulse-lock ${flash ? `is-${flash}` : ""}`}
      onPointerDown={tap}
      aria-label="Tap the arena when the pulse reaches the green target"
    >
      <div className="ambient-ring ring-one" />
      <div className="ambient-ring ring-two" />
      <div className="pulse-track">
        <div className="pulse-target" style={{ left: `${target}%` }} />
        <div className="pulse-runner" style={{ left: `${position}%` }} />
      </div>
      <div className="game-center-copy">
        <span>ROUND {round}</span>
        <strong>{score.toLocaleString()}</strong>
        <small>{flash === "good" ? "LOCKED" : "TAP THE LIVE ZONE"}</small>
      </div>
    </button>
  );
}
