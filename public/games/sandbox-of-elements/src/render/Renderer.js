import { MAT, COLORS } from '../core/Materials.js';
import { drawSprite, SPRITE_MATS } from './Sprites.js';

const RM_OPAQUE = 0;
const RM_SEMI = 1;
const RM_GLOW = 2;
const RM_GLASS = 3;
const RM_LIQUID = 4;
const RM_LIQUID85 = 5;

const MAT_COUNT = COLORS.length;
const RENDER_MODE = new Uint8Array(MAT_COUNT);
const RENDER_ALPHA = new Float32Array(MAT_COUNT);
const ANIMATED = new Uint8Array(MAT_COUNT);
const IS_SPRITE = new Uint8Array(MAT_COUNT);
for (const m of SPRITE_MATS) IS_SPRITE[m] = 1;

function initLookups() {
  for (let i = 0; i < MAT_COUNT; i++) {
    RENDER_MODE[i] = RM_OPAQUE;
    RENDER_ALPHA[i] = 1.0;
  }
  // Semi-transparent
  RENDER_MODE[MAT.STEAM] = RM_SEMI; RENDER_ALPHA[MAT.STEAM] = 0.5;
  RENDER_MODE[MAT.SMOKE] = RM_SEMI; RENDER_ALPHA[MAT.SMOKE] = 0.7;
  RENDER_MODE[MAT.FOAM] = RM_SEMI; RENDER_ALPHA[MAT.FOAM] = 0.55;
  RENDER_MODE[MAT.BUBBLE] = RM_SEMI; RENDER_ALPHA[MAT.BUBBLE] = 0.45;
  RENDER_MODE[MAT.BALLOON] = RM_SEMI; RENDER_ALPHA[MAT.BALLOON] = 0.55;
  RENDER_MODE[MAT.CLOUD] = RM_SEMI; RENDER_ALPHA[MAT.CLOUD] = 0.85;
  RENDER_MODE[MAT.GAS] = RM_SEMI; RENDER_ALPHA[MAT.GAS] = 0.5;
  RENDER_MODE[MAT.RADIATION] = RM_SEMI; RENDER_ALPHA[MAT.RADIATION] = 0.55;
  RENDER_MODE[MAT.STORM_CLOUD] = RM_SEMI; RENDER_ALPHA[MAT.STORM_CLOUD] = 0.8;

  // Glow
  RENDER_MODE[MAT.RAINBOW] = RM_GLOW;
  RENDER_MODE[MAT.SPARK] = RM_GLOW;
  RENDER_MODE[MAT.SPARK_CU] = RM_GLOW;
  RENDER_MODE[MAT.FIREFLY] = RM_GLOW;
  RENDER_MODE[MAT.RAINBOW_CORE] = RM_GLOW;
  RENDER_MODE[MAT.MAGIC_FIRE] = RM_GLOW;
  RENDER_MODE[MAT.STARDUST] = RM_GLOW; RENDER_ALPHA[MAT.STARDUST] = 0.85;
  RENDER_MODE[MAT.PLASMA] = RM_GLOW;
  RENDER_MODE[MAT.URANIUM] = RM_GLOW;
  RENDER_MODE[MAT.ANTIMATTER] = RM_GLOW;
  RENDER_MODE[MAT.METEOR] = RM_GLOW;

  // Glass
  RENDER_MODE[MAT.GLASS] = RM_GLASS;
  RENDER_MODE[MAT.DIAMOND] = RM_GLASS;

  // Liquids
  const liquids75 = [MAT.WATER, MAT.MILK, MAT.POTION, MAT.MUD, MAT.FROST,
                     MAT.ACID, MAT.ALKALI, MAT.NITRO, MAT.NAPALM, MAT.SLIME];
  for (const m of liquids75) { RENDER_MODE[m] = RM_LIQUID; RENDER_ALPHA[m] = 0.78; }
  RENDER_MODE[MAT.CARAMEL] = RM_LIQUID85; RENDER_ALPHA[MAT.CARAMEL] = 0.9;
  RENDER_MODE[MAT.HONEY] = RM_LIQUID85; RENDER_ALPHA[MAT.HONEY] = 0.9;
  RENDER_MODE[MAT.OIL] = RM_LIQUID85; RENDER_ALPHA[MAT.OIL] = 0.88;
  RENDER_MODE[MAT.MERCURY] = RM_LIQUID85; RENDER_ALPHA[MAT.MERCURY] = 0.9;

  // Animated
  const animFast = [MAT.FIRE, MAT.LAVA, MAT.EMBER, MAT.MAGIC_FIRE, MAT.SPARK, MAT.SPARK_CU,
                    MAT.RAINBOW, MAT.RAINBOW_CORE, MAT.POTION, MAT.STARDUST,
                    MAT.PLASMA, MAT.TORCH, MAT.ANTIMATTER, MAT.URANIUM, MAT.HEATER,
                    MAT.METEOR];
  const animMed = [MAT.CLONE, MAT.FIREFLY, MAT.LAMP, MAT.GLITTER, MAT.UNICORN, MAT.FLOWER,
                   MAT.BUTTERFLY, MAT.PORTAL, MAT.CANDY, MAT.FIREWORK, MAT.RADIATION,
                   MAT.BOUNCY, MAT.CONVEYOR_L, MAT.CONVEYOR_R, MAT.COOLER,
                   MAT.STORM_CLOUD, MAT.BLACK_HOLE, MAT.SLIME];
  const animSlow = [MAT.BEE, MAT.LADYBUG, MAT.FISH, MAT.BUNNY,
                    MAT.MUSHROOM, MAT.GRASS, MAT.FAIRY_DUST];
  for (const m of animFast) ANIMATED[m] = 1;
  for (const m of animMed) ANIMATED[m] = 2;
  for (const m of animSlow) ANIMATED[m] = 3;
}
initLookups();

const FLAT_COLORS = new Uint8Array(MAT_COUNT * 12);
for (let m = 0; m < MAT_COUNT; m++) {
  for (let v = 0; v < 4; v++) {
    const c = COLORS[m][v];
    const off = m * 12 + v * 3;
    FLAT_COLORS[off] = c[0];
    FLAT_COLORS[off + 1] = c[1];
    FLAT_COLORS[off + 2] = c[2];
  }
}

export class Renderer {
  constructor(canvas, simulation) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sim = simulation;

    this.offscreen = document.createElement('canvas');
    this.offCtx = this.offscreen.getContext('2d');
    this.imageData = null;
    this.pixels = null;

    // Sprite positions collected during the pixel pass to avoid a second grid scan
    this.spriteIdx = new Int32Array(1024);
    this.spriteCount = 0;

    // Deep magical night gradient
    this.bgTop = [40, 20, 75];
    this.bgBottom = [20, 12, 48];

    this.resize();
  }

  resize(cssW, cssH) {
    const dpr = window.devicePixelRatio || 1;
    if (cssW === undefined || cssH === undefined) {
      const rect = this.canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
    }
    if (cssW <= 0 || cssH <= 0) return;
    this.cssW = cssW;
    this.cssH = cssH;
    this.canvas.width = cssW * dpr;
    this.canvas.height = cssH * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;

    const w = this.sim.width;
    const h = this.sim.height;

    if (this.offscreen.width === w && this.offscreen.height === h) return;

    this.offscreen.width = w;
    this.offscreen.height = h;
    this.imageData = this.offCtx.createImageData(w, h);
    this.pixels = new Uint32Array(this.imageData.data.buffer);

    this.bgPixels = new Uint32Array(h);
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = this.bgTop[0] + (this.bgBottom[0] - this.bgTop[0]) * t | 0;
      const g = this.bgTop[1] + (this.bgBottom[1] - this.bgTop[1]) * t | 0;
      const b = this.bgTop[2] + (this.bgBottom[2] - this.bgTop[2]) * t | 0;
      this.bgPixels[y] = 0xFF000000 | (b << 16) | (g << 8) | r;
    }

    this.bgR = new Uint8Array(h);
    this.bgG = new Uint8Array(h);
    this.bgB = new Uint8Array(h);
    for (let y = 0; y < h; y++) {
      const t = y / h;
      this.bgR[y] = this.bgTop[0] + (this.bgBottom[0] - this.bgTop[0]) * t | 0;
      this.bgG[y] = this.bgTop[1] + (this.bgBottom[1] - this.bgTop[1]) * t | 0;
      this.bgB[y] = this.bgTop[2] + (this.bgBottom[2] - this.bgTop[2]) * t | 0;
    }
  }

  render(frame) {
    const { width, height, grid, life } = this.sim;
    const pixels = this.pixels;
    const bgPixels = this.bgPixels;
    const bgR = this.bgR;
    const bgG = this.bgG;
    const bgB = this.bgB;

    // Sprite collection buffer (grown on demand in the inner loop below)
    let spriteCount = 0;
    let spriteIdx = this.spriteIdx;

    for (let y = 0; y < height; y++) {
      const rowOff = y * width;
      const bgPx = bgPixels[y];
      const bR = bgR[y]; const bG = bgG[y]; const bB = bgB[y];

      for (let x = 0; x < width; x++) {
        const i = rowOff + x;
        const mat = grid[i];
        if (mat === 0) { pixels[i] = bgPx; continue; }
        if (IS_SPRITE[mat]) {
          if (spriteCount >= spriteIdx.length) {
            const ns = new Int32Array(spriteIdx.length * 2);
            ns.set(spriteIdx);
            spriteIdx = this.spriteIdx = ns;
          }
          spriteIdx[spriteCount++] = i;
        }

        let colorIdx;
        const anim = ANIMATED[mat];
        if (anim === 1) colorIdx = ((x * 31 + y * 17 + frame * 7) & 3);
        else if (anim === 2) colorIdx = ((x + y + frame * 3) & 3);
        else if (anim === 3) colorIdx = ((x * 13 + y * 7 + frame) & 3);
        else colorIdx = ((x * 31 + y * 17) & 3);

        const cOff = mat * 12 + colorIdx * 3;
        let cR = FLAT_COLORS[cOff];
        let cG = FLAT_COLORS[cOff + 1];
        let cB = FLAT_COLORS[cOff + 2];

        // Lamp glow boost
        if (mat === MAT.LAMP && life[i] > 0) {
          const g = Math.min(1.0, life[i] / 50);
          cR = Math.min(255, cR + 60 * g | 0);
          cG = Math.min(255, cG + 55 * g | 0);
          cB = Math.min(255, cB + 40 * g | 0);
        }

        let r, g, b;
        const mode = RENDER_MODE[mat];

        if (mode === RM_OPAQUE) { r = cR; g = cG; b = cB; }
        else if (mode === RM_GLOW) {
          r = bR + cR * 0.85 | 0; if (r > 255) r = 255;
          g = bG + cG * 0.85 | 0; if (g > 255) g = 255;
          b = bB + cB * 0.85 | 0; if (b > 255) b = 255;
        } else if (mode === RM_GLASS) {
          r = bR + (cR - bR) * 0.35 | 0;
          g = bG + (cG - bG) * 0.35 | 0;
          b = bB + (cB - bB) * 0.35 | 0;
        } else {
          const alpha = RENDER_ALPHA[mat];
          r = bR + (cR - bR) * alpha | 0;
          g = bG + (cG - bG) * alpha | 0;
          b = bB + (cB - bB) * alpha | 0;
        }

        pixels[i] = 0xFF000000 | (b << 16) | (g << 8) | r;
      }
    }

    this.offCtx.putImageData(this.imageData, 0, 0);
    this.ctx.drawImage(this.offscreen, 0, 0, this.cssW, this.cssH);

    // === Sprite overlay pass ===
    // Positions were collected during the pixel pass above.
    const cellW = this.cssW / width;
    const cellH = this.cssH / height;
    if (cellW >= 2 && spriteCount > 0) {
      const ctx = this.ctx;
      const vpW = this.cssW;
      for (let k = 0; k < spriteCount; k++) {
        const i = spriteIdx[k];
        const x = i % width;
        const y = (i / width) | 0;
        const cx = (x + 0.5) * cellW;
        const cy = (y + 0.5) * cellH;
        drawSprite(ctx, grid[i], cx, cy, cellW, cellH, frame, vpW);
      }
    }
  }

  cssToGrid(cssX, cssY) {
    const gx = cssX / this.cssW * this.sim.width | 0;
    const gy = cssY / this.cssH * this.sim.height | 0;
    return [
      gx < 0 ? 0 : gx >= this.sim.width ? this.sim.width - 1 : gx,
      gy < 0 ? 0 : gy >= this.sim.height ? this.sim.height - 1 : gy
    ];
  }
}
