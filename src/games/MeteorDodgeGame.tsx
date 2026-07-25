import { useCallback, useEffect, useRef, useState } from "react";
import { tone, vibrate } from "../game-utils";
import type { GameProps } from "../types";

interface Meteor {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export function MeteorDodgeGame({
  active,
  runKey,
  soundEnabled,
  hapticsEnabled,
  onFinish,
}: GameProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef({ x: 50, y: 80 });
  const meteorsRef = useRef<Meteor[]>([]);
  const frameRef = useRef(0);
  const lastRef = useRef(0);
  const spawnRef = useRef(0);
  const scoreRef = useRef(0);
  const endedRef = useRef(false);
  const [player, setPlayer] = useState(playerRef.current);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    playerRef.current = { x: 50, y: 80 };
    meteorsRef.current = [];
    scoreRef.current = 0;
    spawnRef.current = 0;
    endedRef.current = false;
    setPlayer(playerRef.current);
    setMeteors([]);
    setScore(0);
  }, [runKey]);

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    vibrate(hapticsEnabled, [40, 30, 80]);
    tone(soundEnabled, 110, 0.2);
    onFinish(Math.floor(scoreRef.current));
  }, [hapticsEnabled, onFinish, soundEnabled]);

  useEffect(() => {
    if (!active) return;
    lastRef.current = performance.now();
    const step = (now: number) => {
      const delta = Math.min(34, now - lastRef.current);
      lastRef.current = now;
      spawnRef.current += delta;
      scoreRef.current += delta * 0.12;
      if (spawnRef.current > Math.max(280, 740 - scoreRef.current * 0.03)) {
        spawnRef.current = 0;
        meteorsRef.current.push({
          id: now + Math.random(),
          x: 5 + Math.random() * 84,
          y: -12,
          size: 6 + Math.random() * 7,
          speed: 0.018 + Math.random() * 0.02 + scoreRef.current * 0.000003,
        });
      }
      meteorsRef.current = meteorsRef.current
        .map((meteor) => ({ ...meteor, y: meteor.y + meteor.speed * delta }))
        .filter((meteor) => meteor.y < 112);

      const hit = meteorsRef.current.some((meteor) => {
        const dx = meteor.x + meteor.size / 2 - playerRef.current.x;
        const dy = meteor.y + meteor.size / 2 - playerRef.current.y;
        return Math.hypot(dx, dy) < meteor.size / 2 + 3.4;
      });
      if (hit) {
        finish();
        return;
      }
      setMeteors([...meteorsRef.current]);
      setScore(Math.floor(scoreRef.current));
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, finish, runKey]);

  const moveSideways = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!active || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const next = {
      x: Math.max(5, Math.min(95, ((event.clientX - rect.left) / rect.width) * 100)),
      y: 80,
    };
    playerRef.current = next;
    setPlayer(next);
  };

  return (
    <div
      ref={arenaRef}
      className="game-arena meteor-dodge"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        moveSideways(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) moveSideways(event);
      }}
      role="application"
      aria-label="Drag the spark sideways to dodge the falling meteors"
    >
      <div className="star-field" />
      <div className="dodge-score">
        <span>SURVIVE</span>
        <strong>{score.toLocaleString()}</strong>
      </div>
      {meteors.map((meteor) => (
        <i
          className="meteor"
          key={meteor.id}
          style={{
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            width: `${meteor.size}%`,
            aspectRatio: "1",
          }}
        />
      ))}
      <div className="spark-player" style={{ left: `${player.x}%`, top: `${player.y}%` }}>
        <span />
      </div>
      <span className="drag-callout">DRAG ANYWHERE</span>
    </div>
  );
}
