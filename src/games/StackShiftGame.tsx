import { useCallback, useEffect, useRef, useState } from "react";
import { tone, vibrate } from "../game-utils";
import type { GameProps } from "../types";

interface Block {
  x: number;
  width: number;
  level: number;
}

export function StackShiftGame({
  active,
  runKey,
  soundEnabled,
  hapticsEnabled,
  onFinish,
}: GameProps) {
  const [blocks, setBlocks] = useState<Block[]>([{ x: 15, width: 70, level: 0 }]);
  const [moving, setMoving] = useState<Block>({ x: 0, width: 70, level: 1 });
  const [score, setScore] = useState(0);
  const movingRef = useRef(moving);
  const blocksRef = useRef(blocks);
  const scoreRef = useRef(0);
  const directionRef = useRef(1);
  const frameRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const base = [{ x: 15, width: 70, level: 0 }];
    const start = { x: 0, width: 70, level: 1 };
    blocksRef.current = base;
    movingRef.current = start;
    scoreRef.current = 0;
    directionRef.current = 1;
    setBlocks(base);
    setMoving(start);
    setScore(0);
  }, [runKey]);

  useEffect(() => {
    if (!active) return;
    lastRef.current = performance.now();
    const step = (now: number) => {
      const delta = Math.min(32, now - lastRef.current);
      lastRef.current = now;
      const speed = 0.028 + movingRef.current.level * 0.0025;
      let x = movingRef.current.x + directionRef.current * speed * delta;
      const limit = 100 - movingRef.current.width;
      if (x >= limit) {
        x = limit;
        directionRef.current = -1;
      } else if (x <= 0) {
        x = 0;
        directionRef.current = 1;
      }
      movingRef.current = { ...movingRef.current, x };
      setMoving(movingRef.current);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, runKey]);

  const place = useCallback(() => {
    if (!active) return;
    const previous = blocksRef.current[blocksRef.current.length - 1];
    const current = movingRef.current;
    const left = Math.max(previous.x, current.x);
    const right = Math.min(previous.x + previous.width, current.x + current.width);
    const overlap = right - left;
    if (overlap <= 1.5) {
      vibrate(hapticsEnabled, [45, 30, 75]);
      tone(soundEnabled, 120, 0.18);
      onFinish(scoreRef.current);
      return;
    }
    const placed = { x: left, width: overlap, level: current.level };
    const trimmed = [...blocksRef.current, placed].slice(-8);
    blocksRef.current = trimmed;
    setBlocks(trimmed);
    scoreRef.current += Math.round(400 + overlap * 8 + current.level * 70);
    setScore(scoreRef.current);
    const next = {
      x: directionRef.current > 0 ? 0 : 100 - overlap,
      width: overlap,
      level: current.level + 1,
    };
    movingRef.current = next;
    setMoving(next);
    vibrate(hapticsEnabled, 18);
    tone(soundEnabled, 440 + current.level * 25);
  }, [active, hapticsEnabled, onFinish, soundEnabled]);

  return (
    <button
      className="game-arena stack-shift"
      onPointerDown={place}
      aria-label="Tap to place the moving block on the stack"
    >
      <div className="stack-score">
        <span>FLOOR {moving.level}</span>
        <strong>{score.toLocaleString()}</strong>
      </div>
      <div className="stack-stage">
        <div
          className="stack-block is-moving"
          style={{
            left: `${moving.x}%`,
            width: `${moving.width}%`,
            bottom: `${Math.min(blocks.length, 8) * 8 + 6}%`,
          }}
        />
        {blocks.map((block, index) => (
          <div
            className="stack-block"
            key={`${block.level}-${index}`}
            style={{
              left: `${block.x}%`,
              width: `${block.width}%`,
              bottom: `${index * 8 + 6}%`,
              filter: `hue-rotate(${index * 14}deg)`,
            }}
          />
        ))}
      </div>
      <span className="tap-callout">TAP TO LOCK</span>
    </button>
  );
}
