// Sprite overlay rendering. Each sprite draws a small picture of an entity
// centered on its grid cell, on top of the base pixel layer.
import { MAT } from '../core/Materials.js';

// Materials that get sprite overlays (logical cells are still 1 pixel)
export const SPRITE_MATS = [
  MAT.BUTTERFLY, MAT.BEE, MAT.LADYBUG, MAT.FISH,
  MAT.BUNNY, MAT.FIREFLY, MAT.UNICORN,
  MAT.FLOWER, MAT.MUSHROOM,
  MAT.HEATER, MAT.COOLER, MAT.CONVEYOR_L, MAT.CONVEYOR_R,
  MAT.BOUNCY, MAT.LAMP, MAT.GLUE,
  MAT.PORTAL, MAT.CLONE,
  // Cosmic
  MAT.STORM_CLOUD, MAT.BLACK_HOLE
];

export function drawSprite(ctx, m, cx, cy, cellW, cellH, frame, viewportW) {
  // Sprite size: scales with viewport so it's readable on both mobile (~20px)
  // and desktop (~36px) without being a tiny dot on big screens.
  const s = viewportW
    ? Math.max(20, Math.min(44, viewportW / 25))
    : Math.max(Math.min(cellW, cellH) * 5, 20);
  switch (m) {
    case MAT.BUTTERFLY: return drawButterfly(ctx, cx, cy, s, frame);
    case MAT.BEE: return drawBee(ctx, cx, cy, s, frame);
    case MAT.LADYBUG: return drawLadybug(ctx, cx, cy, s, frame);
    case MAT.FISH: return drawFish(ctx, cx, cy, s, frame);
    case MAT.BUNNY: return drawBunny(ctx, cx, cy, s, frame);
    case MAT.FIREFLY: return drawFirefly(ctx, cx, cy, s, frame);
    case MAT.UNICORN: return drawUnicorn(ctx, cx, cy, s, frame);
    case MAT.FLOWER: return drawFlower(ctx, cx, cy, s, frame);
    case MAT.MUSHROOM: return drawMushroom(ctx, cx, cy, s);
    case MAT.HEATER: return drawHeater(ctx, cx, cy, s, frame);
    case MAT.COOLER: return drawCooler(ctx, cx, cy, s, frame);
    case MAT.CONVEYOR_L: return drawConveyor(ctx, cx, cy, s, frame, -1);
    case MAT.CONVEYOR_R: return drawConveyor(ctx, cx, cy, s, frame, 1);
    case MAT.BOUNCY: return drawBouncy(ctx, cx, cy, s, frame);
    case MAT.LAMP: return drawLamp(ctx, cx, cy, s, frame);
    case MAT.GLUE: return drawGlue(ctx, cx, cy, s);
    case MAT.PORTAL: return drawPortal(ctx, cx, cy, s, frame);
    case MAT.CLONE: return drawClone(ctx, cx, cy, s, frame);
    case MAT.STORM_CLOUD: return drawStormCloud(ctx, cx, cy, s, frame);
    case MAT.BLACK_HOLE: return drawBlackHole(ctx, cx, cy, s, frame);
  }
}

// ============ CREATURES ============

function drawButterfly(ctx, cx, cy, s, frame) {
  // Wings alternating between open and slight fold
  const flap = ((frame >> 1) & 3) < 2 ? 1 : 0.55;
  const wingR = s * 0.38 * flap;

  // Back wings (smaller, blue)
  ctx.fillStyle = 'rgba(140, 180, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(cx - s * 0.2, cy + s * 0.12, wingR * 0.75, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.2, cy + s * 0.12, wingR * 0.75, 0, Math.PI * 2);
  ctx.fill();

  // Front wings (pink)
  ctx.fillStyle = 'rgba(255, 140, 220, 0.9)';
  ctx.beginPath();
  ctx.arc(cx - s * 0.26, cy - s * 0.12, wingR, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.26, cy - s * 0.12, wingR, 0, Math.PI * 2);
  ctx.fill();

  // Wing spots
  ctx.fillStyle = 'rgba(255, 230, 120, 0.9)';
  ctx.beginPath();
  ctx.arc(cx - s * 0.28, cy - s * 0.12, wingR * 0.22, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.28, cy - s * 0.12, wingR * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = '#2a1842';
  const bodyW = Math.max(1, s * 0.08);
  ctx.fillRect(cx - bodyW / 2, cy - s * 0.25, bodyW, s * 0.5);
}

function drawBee(ctx, cx, cy, s, frame) {
  const flap = ((frame >> 1) & 1) ? 1 : 0.7;

  // Translucent wings
  ctx.fillStyle = 'rgba(230, 245, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.2, cy - s * 0.2, s * 0.22 * flap, s * 0.16, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + s * 0.2, cy - s * 0.2, s * 0.22 * flap, s * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body oval (yellow)
  ctx.fillStyle = '#ffd448';
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.05, s * 0.3, s * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stripes
  ctx.fillStyle = '#2a1820';
  const stripeW = s * 0.1;
  ctx.fillRect(cx - s * 0.08, cy - s * 0.12, stripeW, s * 0.35);
  ctx.fillRect(cx + s * 0.14 - stripeW, cy - s * 0.12, stripeW, s * 0.35);

  // Eye dot
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(cx - s * 0.22, cy, Math.max(1, s * 0.05), 0, Math.PI * 2);
  ctx.fill();
}

function drawLadybug(ctx, cx, cy, s) {
  // Red dome body
  ctx.fillStyle = '#e83a48';
  ctx.beginPath();
  ctx.arc(cx, cy + s * 0.05, s * 0.32, 0, Math.PI * 2);
  ctx.fill();

  // Black head
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(cx, cy - s * 0.22, s * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Center line
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 0.1);
  ctx.lineTo(cx, cy + s * 0.32);
  ctx.stroke();

  // Spots
  ctx.fillStyle = '#1a1a1a';
  const dotR = s * 0.06;
  for (const [dx, dy] of [[-0.18, -0.05], [0.18, -0.05], [-0.15, 0.18], [0.15, 0.18]]) {
    ctx.beginPath();
    ctx.arc(cx + s * dx, cy + s * dy, dotR, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFish(ctx, cx, cy, s, frame) {
  const wiggle = Math.sin(frame * 0.3) * s * 0.08;

  // Body (orange teardrop)
  ctx.fillStyle = '#ff9a3c';
  ctx.beginPath();
  ctx.ellipse(cx, cy, s * 0.32, s * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(cx + s * 0.28, cy);
  ctx.lineTo(cx + s * 0.5, cy - s * 0.15 + wiggle);
  ctx.lineTo(cx + s * 0.5, cy + s * 0.15 + wiggle);
  ctx.closePath();
  ctx.fill();

  // Stripes
  ctx.fillStyle = '#ffd476';
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.08, cy, s * 0.05, s * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx - s * 0.18, cy - s * 0.05, s * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(cx - s * 0.17, cy - s * 0.05, s * 0.04, 0, Math.PI * 2);
  ctx.fill();
}

function drawBunny(ctx, cx, cy, s, frame) {
  const hop = ((frame >> 2) & 3) === 0 ? -s * 0.1 : 0;

  // Ears (tall)
  ctx.fillStyle = '#fff3f5';
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.12, cy - s * 0.3 + hop, s * 0.08, s * 0.22, -0.3, 0, Math.PI * 2);
  ctx.ellipse(cx + s * 0.12, cy - s * 0.3 + hop, s * 0.08, s * 0.22, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffcfd8';
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.12, cy - s * 0.3 + hop, s * 0.04, s * 0.14, -0.3, 0, Math.PI * 2);
  ctx.ellipse(cx + s * 0.12, cy - s * 0.3 + hop, s * 0.04, s * 0.14, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#fff3f5';
  ctx.beginPath();
  ctx.arc(cx, cy + hop, s * 0.26, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#221';
  ctx.beginPath();
  ctx.arc(cx - s * 0.1, cy - s * 0.04 + hop, s * 0.05, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.1, cy - s * 0.04 + hop, s * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = '#ff8ba4';
  ctx.beginPath();
  ctx.arc(cx, cy + s * 0.08 + hop, s * 0.04, 0, Math.PI * 2);
  ctx.fill();
}

function drawFirefly(ctx, cx, cy, s, frame) {
  // Pulsing glow
  const pulse = 0.6 + Math.sin(frame * 0.2) * 0.4;
  const glowR = s * 0.5 * pulse;

  // Radial glow
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  grad.addColorStop(0, 'rgba(255, 255, 180, 0.9)');
  grad.addColorStop(0.4, 'rgba(255, 240, 120, 0.5)');
  grad.addColorStop(1, 'rgba(255, 240, 120, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
  ctx.fill();

  // Core
  ctx.fillStyle = '#fffba8';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

function drawUnicorn(ctx, cx, cy, s, frame) {
  // Head (white/pink)
  ctx.fillStyle = '#fdeaf2';
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.05, s * 0.32, s * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mane (rainbow)
  const maneColors = ['#ff88c8', '#ffc878', '#b4d878', '#88bcff', '#c8a0ff'];
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = maneColors[(i + frame / 6 | 0) % 5];
    ctx.fillRect(cx + s * 0.2, cy - s * 0.2 + i * s * 0.09, s * 0.12, s * 0.08);
  }

  // Horn
  ctx.fillStyle = '#ffd766';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.06, cy - s * 0.18);
  ctx.lineTo(cx + s * 0.02, cy - s * 0.18);
  ctx.lineTo(cx - s * 0.02, cy - s * 0.42);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#221';
  ctx.beginPath();
  ctx.arc(cx - s * 0.12, cy - s * 0.02, s * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Cheek blush
  ctx.fillStyle = 'rgba(255, 150, 190, 0.6)';
  ctx.beginPath();
  ctx.arc(cx - s * 0.18, cy + s * 0.12, s * 0.05, 0, Math.PI * 2);
  ctx.fill();
}

// ============ PLANTS ============

function drawFlower(ctx, cx, cy, s, frame) {
  const sway = Math.sin(frame * 0.04 + cx * 0.01) * s * 0.04;

  // Petals
  const petalColors = ['#ff88c8', '#ffc878', '#b898ff'];
  const color = petalColors[(cx | 0) % 3];
  ctx.fillStyle = color;
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const px = cx + sway + Math.cos(ang) * s * 0.2;
    const py = cy + Math.sin(ang) * s * 0.2;
    ctx.beginPath();
    ctx.arc(px, py, s * 0.13, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center
  ctx.fillStyle = '#ffd864';
  ctx.beginPath();
  ctx.arc(cx + sway, cy, s * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

function drawMushroom(ctx, cx, cy, s) {
  // Stem
  ctx.fillStyle = '#f8ece0';
  ctx.fillRect(cx - s * 0.1, cy + s * 0.05, s * 0.2, s * 0.3);

  // Cap (red with spots)
  ctx.fillStyle = '#e85068';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.3, Math.PI, 0);
  ctx.closePath();
  ctx.fill();

  // White spots
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx - s * 0.1, cy - s * 0.08, s * 0.05, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.08, cy - s * 0.05, s * 0.045, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.14, cy - s * 0.15, s * 0.03, 0, Math.PI * 2);
  ctx.fill();
}

// ============ MACHINES ============

function drawHeater(ctx, cx, cy, s, frame) {
  // Base plate
  ctx.fillStyle = '#3a2020';
  ctx.fillRect(cx - s * 0.4, cy - s * 0.35, s * 0.8, s * 0.7);

  // Hot coils (red-orange pulsing)
  const pulse = 0.7 + Math.sin(frame * 0.2) * 0.3;
  ctx.fillStyle = `rgba(255, ${120 + 60 * pulse | 0}, ${40 + 30 * pulse | 0}, 0.95)`;
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx - s * 0.3, cy - s * 0.25 + i * s * 0.22, s * 0.6, s * 0.1);
  }

  // Warning border
  ctx.strokeStyle = '#ffd466';
  ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.strokeRect(cx - s * 0.4, cy - s * 0.35, s * 0.8, s * 0.7);
}

function drawCooler(ctx, cx, cy, s, frame) {
  // Frosted base
  ctx.fillStyle = '#1a3050';
  ctx.fillRect(cx - s * 0.4, cy - s * 0.35, s * 0.8, s * 0.7);

  // Ice crystal pattern (snowflake-like)
  ctx.strokeStyle = '#b0e4ff';
  ctx.lineWidth = Math.max(1, s * 0.04);
  const r = s * 0.25;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.stroke();

  // Center
  ctx.fillStyle = '#dcf0ff';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.07, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = '#6ab4ff';
  ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.strokeRect(cx - s * 0.4, cy - s * 0.35, s * 0.8, s * 0.7);
}

function drawConveyor(ctx, cx, cy, s, frame, dir) {
  // Belt base
  const color = dir > 0 ? '#5a7a5a' : '#5a5a7a';
  ctx.fillStyle = color;
  ctx.fillRect(cx - s * 0.45, cy - s * 0.3, s * 0.9, s * 0.6);

  // Moving stripes (animated)
  ctx.fillStyle = dir > 0 ? '#b4e8a4' : '#a4b4e8';
  const offset = (frame * dir * 0.5) % (s * 0.25);
  for (let i = -2; i < 5; i++) {
    const x0 = cx - s * 0.45 + i * s * 0.25 + offset;
    ctx.fillRect(x0, cy - s * 0.25, s * 0.1, s * 0.5);
  }

  // Arrow
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  if (dir > 0) {
    ctx.moveTo(cx + s * 0.2, cy - s * 0.12);
    ctx.lineTo(cx + s * 0.35, cy);
    ctx.lineTo(cx + s * 0.2, cy + s * 0.12);
  } else {
    ctx.moveTo(cx - s * 0.2, cy - s * 0.12);
    ctx.lineTo(cx - s * 0.35, cy);
    ctx.lineTo(cx - s * 0.2, cy + s * 0.12);
  }
  ctx.closePath();
  ctx.fill();
}

function drawBouncy(ctx, cx, cy, s, frame) {
  // Base
  ctx.fillStyle = '#58d0d0';
  ctx.fillRect(cx - s * 0.4, cy - s * 0.2, s * 0.8, s * 0.4);

  // Spring coils (animated compression)
  const compress = ((frame >> 1) & 3) === 0 ? 0.7 : 1;
  ctx.strokeStyle = '#88ffff';
  ctx.lineWidth = Math.max(1, s * 0.05);
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const y = cy - s * 0.1 * compress + i * s * 0.1 * compress;
    ctx.moveTo(cx - s * 0.3, y);
    ctx.bezierCurveTo(cx - s * 0.15, y - s * 0.04, cx + s * 0.15, y + s * 0.04, cx + s * 0.3, y);
  }
  ctx.stroke();
}

function drawLamp(ctx, cx, cy, s, frame) {
  // Lamp base
  ctx.fillStyle = '#4a4030';
  ctx.fillRect(cx - s * 0.15, cy + s * 0.2, s * 0.3, s * 0.2);

  // Bulb
  ctx.fillStyle = '#fff4c8';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Glow (sometimes lit)
  const glow = ((frame >> 2) & 7) < 6; // mostly lit
  if (glow) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.5);
    grad.addColorStop(0, 'rgba(255, 240, 140, 0.6)');
    grad.addColorStop(1, 'rgba(255, 240, 140, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Filament X
  ctx.strokeStyle = '#c8a030';
  ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.1, cy - s * 0.05);
  ctx.lineTo(cx + s * 0.1, cy + s * 0.05);
  ctx.moveTo(cx + s * 0.1, cy - s * 0.05);
  ctx.lineTo(cx - s * 0.1, cy + s * 0.05);
  ctx.stroke();
}

function drawGlue(ctx, cx, cy, s) {
  // Sticky drop shape
  ctx.fillStyle = '#fff0c0';
  ctx.beginPath();
  ctx.arc(cx, cy + s * 0.05, s * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Shine highlights
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(cx - s * 0.1, cy - s * 0.08, s * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Border for definition
  ctx.strokeStyle = '#d8c080';
  ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath();
  ctx.arc(cx, cy + s * 0.05, s * 0.3, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPortal(ctx, cx, cy, s, frame) {
  // Spinning vortex
  const rotation = frame * 0.12;

  // Outer dark ring
  ctx.fillStyle = '#1a0a2a';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Swirling arms
  for (let i = 0; i < 3; i++) {
    const a = rotation + i * ((Math.PI * 2) / 3);
    const grad = ctx.createLinearGradient(
      cx + Math.cos(a) * s * 0.1, cy + Math.sin(a) * s * 0.1,
      cx + Math.cos(a) * s * 0.35, cy + Math.sin(a) * s * 0.35
    );
    grad.addColorStop(0, 'rgba(200, 140, 255, 0.9)');
    grad.addColorStop(1, 'rgba(100, 40, 160, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(
      cx + Math.cos(a + 0.5) * s * 0.2, cy + Math.sin(a + 0.5) * s * 0.2,
      cx + Math.cos(a) * s * 0.35, cy + Math.sin(a) * s * 0.35
    );
    ctx.stroke();
  }

  // Core
  ctx.fillStyle = '#dcb0ff';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawClone(ctx, cx, cy, s, frame) {
  // Rainbow cube with copy icon
  const hue = (frame * 5) % 360;
  ctx.fillStyle = `hsl(${hue}, 70%, 65%)`;
  ctx.fillRect(cx - s * 0.3, cy - s * 0.3, s * 0.6, s * 0.6);

  // Copy icon (2 overlapping squares)
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = Math.max(1, s * 0.05);
  ctx.strokeRect(cx - s * 0.18, cy - s * 0.18, s * 0.22, s * 0.22);
  ctx.strokeRect(cx - s * 0.05, cy - s * 0.05, s * 0.22, s * 0.22);
}

function drawStormCloud(ctx, cx, cy, s, frame) {
  // Three overlapping dark cloud blobs
  ctx.fillStyle = '#4a4a5e';
  ctx.beginPath();
  ctx.arc(cx - s * 0.2, cy - s * 0.05, s * 0.22, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.2, cy - s * 0.05, s * 0.22, 0, Math.PI * 2);
  ctx.arc(cx, cy - s * 0.15, s * 0.26, 0, Math.PI * 2);
  ctx.fill();

  // Darker underbelly
  ctx.fillStyle = '#2a2a3a';
  ctx.beginPath();
  ctx.arc(cx - s * 0.15, cy + s * 0.08, s * 0.18, 0, Math.PI * 2);
  ctx.arc(cx + s * 0.15, cy + s * 0.08, s * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // Flashing lightning bolt inside the cloud
  const flash = ((frame >> 2) & 7) === 0;
  if (flash) {
    ctx.fillStyle = '#fff8a8';
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.05, cy - s * 0.1);
    ctx.lineTo(cx + s * 0.04, cy - s * 0.02);
    ctx.lineTo(cx - s * 0.02, cy + s * 0.02);
    ctx.lineTo(cx + s * 0.06, cy + s * 0.12);
    ctx.lineTo(cx - s * 0.02, cy + s * 0.04);
    ctx.lineTo(cx + s * 0.02, cy - s * 0.04);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBlackHole(ctx, cx, cy, s, frame) {
  const rotation = frame * 0.08;

  // Outer accretion disk glow (purple/pink)
  const outerGrad = ctx.createRadialGradient(cx, cy, s * 0.25, cx, cy, s * 0.55);
  outerGrad.addColorStop(0, 'rgba(180, 80, 220, 0.6)');
  outerGrad.addColorStop(1, 'rgba(60, 20, 100, 0)');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Event horizon (absolute black)
  ctx.fillStyle = '#050010';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Swirling inward arms
  for (let i = 0; i < 4; i++) {
    const a = rotation + i * (Math.PI / 2);
    ctx.strokeStyle = `rgba(220, 150, 255, ${0.6 - i * 0.1})`;
    ctx.lineWidth = Math.max(1, s * 0.04);
    ctx.beginPath();
    const r0 = s * 0.32, r1 = s * 0.5;
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.quadraticCurveTo(
      cx + Math.cos(a + 0.6) * (r0 + r1) * 0.5,
      cy + Math.sin(a + 0.6) * (r0 + r1) * 0.5,
      cx + Math.cos(a + 1.2) * r1,
      cy + Math.sin(a + 1.2) * r1
    );
    ctx.stroke();
  }
}
