import { MAT, BH, PROPS } from './Materials.js';

const MAT_COUNT = PROPS.length;

// Precomputed lookup arrays for speed
const MAT_BEHAVIOR = new Uint8Array(MAT_COUNT);
const MAT_DENSITY = new Uint8Array(MAT_COUNT);
const MAT_FLAMMABLE = new Uint8Array(MAT_COUNT);
const MAT_DISP = new Uint8Array(MAT_COUNT);
const MAT_LIFE = new Int16Array(MAT_COUNT);
const MAT_DEATH = new Uint8Array(MAT_COUNT);

for (let i = 0; i < MAT_COUNT; i++) {
  const p = PROPS[i];
  MAT_BEHAVIOR[i] = p.b;
  MAT_DENSITY[i] = p.d;
  MAT_FLAMMABLE[i] = p.fl ? 1 : 0;
  MAT_DISP[i] = p.disp;
  MAT_LIFE[i] = p.life;
  MAT_DEATH[i] = p.death;
}

const IS_HOT = new Uint8Array(MAT_COUNT);
IS_HOT[MAT.FIRE] = IS_HOT[MAT.LAVA] = IS_HOT[MAT.EMBER] = 1;
IS_HOT[MAT.SPARK] = IS_HOT[MAT.SPARK_CU] = 1;
IS_HOT[MAT.PLASMA] = IS_HOT[MAT.TORCH] = IS_HOT[MAT.HEATER] = 1;

const IS_COLD = new Uint8Array(MAT_COUNT);
IS_COLD[MAT.ICE] = IS_COLD[MAT.SNOW] = IS_COLD[MAT.FROST] = IS_COLD[MAT.ICE_CREAM] = 1;

const IS_LIQUID = new Uint8Array(MAT_COUNT);
IS_LIQUID[MAT.WATER] = IS_LIQUID[MAT.LAVA] = IS_LIQUID[MAT.CARAMEL] = 1;
IS_LIQUID[MAT.HONEY] = IS_LIQUID[MAT.MILK] = IS_LIQUID[MAT.POTION] = 1;
IS_LIQUID[MAT.FROST] = IS_LIQUID[MAT.MUD] = 1;
IS_LIQUID[MAT.ACID] = IS_LIQUID[MAT.ALKALI] = IS_LIQUID[MAT.OIL] = 1;
IS_LIQUID[MAT.MERCURY] = IS_LIQUID[MAT.NITRO] = IS_LIQUID[MAT.NAPALM] = 1;
IS_LIQUID[MAT.SLIME] = 1;
// ANTIMATTER is a static solid so it annihilates reliably on contact (iteration order quirk)

const IS_EXPLOSIVE = new Uint8Array(MAT_COUNT);
IS_EXPLOSIVE[MAT.GUNPOWDER] = IS_EXPLOSIVE[MAT.DYNAMITE] = IS_EXPLOSIVE[MAT.C4] = 1;
IS_EXPLOSIVE[MAT.NITRO] = IS_EXPLOSIVE[MAT.GAS] = IS_EXPLOSIVE[MAT.DUST] = 1;
IS_EXPLOSIVE[MAT.CRACKER] = IS_EXPLOSIVE[MAT.STARDUST] = 1;

const IS_CREATURE = new Uint8Array(MAT_COUNT);
IS_CREATURE[MAT.BUTTERFLY] = IS_CREATURE[MAT.BEE] = IS_CREATURE[MAT.LADYBUG] = 1;
IS_CREATURE[MAT.FISH] = IS_CREATURE[MAT.BUNNY] = IS_CREATURE[MAT.FIREFLY] = IS_CREATURE[MAT.UNICORN] = 1;

const IS_PLANT = new Uint8Array(MAT_COUNT);
IS_PLANT[MAT.FLOWER] = IS_PLANT[MAT.GRASS] = IS_PLANT[MAT.VINE] = IS_PLANT[MAT.MUSHROOM] = 1;

// Brush spacing — prevents sprite overlap when dragging.
// Creatures get the widest spacing since they have big sprites and move freely.
// Static sprites (flowers, mushrooms, machines) get medium spacing so gardens/machines
// stay readable. Everything else fills normally (powders, liquids, etc.).
const SPACING = new Uint8Array(MAT_COUNT);
for (const m of [MAT.BUTTERFLY, MAT.BEE, MAT.LADYBUG, MAT.FISH,
                 MAT.BUNNY, MAT.FIREFLY, MAT.UNICORN]) SPACING[m] = 6;
for (const m of [MAT.FLOWER, MAT.MUSHROOM]) SPACING[m] = 4;
for (const m of [MAT.HEATER, MAT.COOLER, MAT.CONVEYOR_L, MAT.CONVEYOR_R,
                 MAT.BOUNCY, MAT.LAMP, MAT.GLUE, MAT.PORTAL, MAT.CLONE]) SPACING[m] = 3;

// Materials that acid dissolves
const ACID_DISSOLVES = new Uint8Array(MAT_COUNT);
ACID_DISSOLVES[MAT.WOOD] = ACID_DISSOLVES[MAT.SEED] = ACID_DISSOLVES[MAT.FLOWER] = 1;
ACID_DISSOLVES[MAT.GRASS] = ACID_DISSOLVES[MAT.VINE] = ACID_DISSOLVES[MAT.MUSHROOM] = 1;
ACID_DISSOLVES[MAT.SOIL] = ACID_DISSOLVES[MAT.MUD] = 1;
ACID_DISSOLVES[MAT.CANDY] = ACID_DISSOLVES[MAT.CHOCOLATE] = ACID_DISSOLVES[MAT.JELLY] = 1;
ACID_DISSOLVES[MAT.MARSHMALLOW] = ACID_DISSOLVES[MAT.COTTON_CANDY] = 1;
ACID_DISSOLVES[MAT.ASH] = ACID_DISSOLVES[MAT.SAND] = ACID_DISSOLVES[MAT.SALT] = 1;
ACID_DISSOLVES[MAT.GUNPOWDER] = ACID_DISSOLVES[MAT.DUST] = 1;

// Plasma melts (super hot, not stone/diamond/obsidian/uranium)
const PLASMA_MELTS = new Uint8Array(MAT_COUNT);
for (let i = 1; i < MAT_COUNT; i++) {
  if (i === MAT.STONE || i === MAT.OBSIDIAN || i === MAT.DIAMOND ||
      i === MAT.URANIUM || i === MAT.ANTIMATTER || i === MAT.PORTAL ||
      i === MAT.CLONE || i === MAT.PLASMA) continue;
  if (PROPS[i].b === BH.SOLID && PROPS[i].d >= 8 && i !== MAT.METAL && i !== MAT.GOLD) continue;
  PLASMA_MELTS[i] = 1;
}
PLASMA_MELTS[MAT.METAL] = PLASMA_MELTS[MAT.GOLD] = PLASMA_MELTS[MAT.RUST] = 1;

// Direction offsets (hoisted to module scope to avoid per-iteration allocations)
const DIR4_X = new Int8Array([0, 0, -1, 1]); // up, down, left, right
const DIR4_Y = new Int8Array([-1, 1, 0, 0]);
const FISH_DX = new Int8Array([0, -1, 1, 0, 0]);
const FISH_DY = new Int8Array([0, 0, 0, -1, 1]);

export class Simulation {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.grid = new Uint8Array(this.size);
    this.life = new Int16Array(this.size);
    this.updated = new Uint32Array(this.size);
    this.frame = 0;
    this.paused = false;
    this.particleCount = 0;

    this.events = {
      explosions: 0, hiss: 0, sparks: 0, zap: 0, xp: 0,
      obsidian: 0, steamCreated: 0, potionTransform: 0, plantGrow: 0,
      fireSpread: 0, iceCreated: 0, sparkle: 0, rainbowCreated: 0,
      // Recipe-specific triggers
      glassMade: 0, chocoFromLava: 0, stoneFromLava: 0,
      acidNeutralized: 0, rustMade: 0, soapMade: 0,
      nuclearBoom: 0, thermiteBurn: 0, plasmaBurn: 0,
      iceCreamMade: 0, candyMade: 0, caramelMade: 0,
      honeyMade: 0, antimatterAnni: 0, cloneUsed: 0,
      portalEat: 0, unicornTrail: 0, fireWood: 0,
      saltMelt: 0, rainbowFromPotion: 0,
      // Cosmic
      stormLightning: 0, meteorHit: 0, blackHolePull: 0,
      slimeFreeze: 0, slimeBurn: 0
    };
  }

  reset() {
    this.grid.fill(0);
    this.life.fill(0);
    this.updated.fill(0);
    this.frame = 0;
    this.particleCount = 0;
  }

  resize(newW, newH) {
    const oldGrid = this.grid;
    const oldLife = this.life;
    const oldW = this.width;
    const oldH = this.height;
    this.width = newW;
    this.height = newH;
    this.size = newW * newH;
    this.grid = new Uint8Array(this.size);
    this.life = new Int16Array(this.size);
    this.updated = new Uint32Array(this.size);
    const copyW = Math.min(oldW, newW);
    const copyH = Math.min(oldH, newH);
    let count = 0;
    for (let y = 0; y < copyH; y++) {
      for (let x = 0; x < copyW; x++) {
        const m = oldGrid[y * oldW + x];
        this.grid[y * newW + x] = m;
        this.life[y * newW + x] = oldLife[y * oldW + x];
        if (m !== MAT.EMPTY) count++;
      }
    }
    this.particleCount = count;
  }

  idx(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    return y * this.width + x;
  }

  get(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    return this.grid[y * this.width + x];
  }

  setCell(x, y, mat) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const i = y * this.width + x;
    const old = this.grid[i];
    this.grid[i] = mat;
    if (mat !== 0 && MAT_LIFE[mat] > 0) {
      this.life[i] = MAT_LIFE[mat] + (Math.random() * 20 | 0);
    }
    if (old === MAT.EMPTY && mat !== MAT.EMPTY) this.particleCount++;
    if (old !== MAT.EMPTY && mat === MAT.EMPTY) this.particleCount--;
  }

  setIdx(i, mat) {
    const old = this.grid[i];
    this.grid[i] = mat;
    if (mat !== 0 && MAT_LIFE[mat] > 0) {
      this.life[i] = MAT_LIFE[mat] + (Math.random() * 20 | 0);
    }
    if (old === MAT.EMPTY && mat !== MAT.EMPTY) this.particleCount++;
    if (old !== MAT.EMPTY && mat === MAT.EMPTY) this.particleCount--;
  }

  paint(cx, cy, mat, radius) {
    const isSolid = mat !== 0 && MAT_BEHAVIOR[mat] === BH.SOLID;
    const spacing = mat !== 0 ? SPACING[mat] : 0;

    // Sprite materials: single placement per paint() call, with a minimum-distance check
    // to prevent piles of overlapping sprites when the user drags the brush.
    if (spacing > 0 && mat !== MAT.EMPTY) {
      if (cx < 0 || cx >= this.width || cy < 0 || cy >= this.height) return;
      if (this.hasNearby(cx, cy, mat, spacing)) return;
      const i = cy * this.width + cx;
      if (this.grid[i] === MAT.EMPTY) this.setCell(cx, cy, mat);
      return;
    }

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;
        const i = y * this.width + x;
        if (mat === MAT.EMPTY || this.grid[i] === MAT.EMPTY) {
          if (!isSolid && mat !== MAT.EMPTY && Math.random() < 0.12) continue;
          this.setCell(x, y, mat);
        }
      }
    }
  }

  swap(a, b) {
    const tg = this.grid[a]; const tl = this.life[a];
    this.grid[a] = this.grid[b]; this.life[a] = this.life[b];
    this.grid[b] = tg; this.life[b] = tl;
    this.updated[b] = this.frame;
  }

  move(from, to) {
    this.grid[to] = this.grid[from];
    this.life[to] = this.life[from];
    this.grid[from] = MAT.EMPTY;
    this.life[from] = 0;
    this.updated[to] = this.frame;
  }

  canDisplace(srcMat, dstIdx) {
    if (dstIdx === -1) return false;
    const dst = this.grid[dstIdx];
    if (dst === 0) return true;
    const dstB = MAT_BEHAVIOR[dst];
    if ((dstB === BH.LIQUID || dstB === BH.GAS) && MAT_DENSITY[srcMat] > MAT_DENSITY[dst]) return true;
    return false;
  }

  hasNearby(x, y, mat, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (this.get(x + dx, y + dy) === mat) return true;
      }
    }
    return false;
  }

  countNearby(x, y, mat, radius) {
    let c = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx === 0 && dy === 0) continue;
        if (this.get(x + dx, y + dy) === mat) c++;
      }
    }
    return c;
  }

  // Lightning strike — magic version that sparkles without destruction
  lightning() {
    this.events.zap++;
    const x = (Math.random() * this.width) | 0;
    for (let y = 0; y < this.height; y++) {
      const xx = x + ((Math.random() * 3 - 1) | 0);
      if (xx < 0 || xx >= this.width) continue;
      const i = y * this.width + xx;
      if (this.grid[i] === MAT.EMPTY) this.setIdx(i, MAT.SPARK);
      else break;
    }
  }

  spawnWeather(type) {
    // Spawn a few particles at top
    const w = this.width;
    const count = Math.max(1, (w / 40) | 0);
    for (let k = 0; k < count; k++) {
      const x = (Math.random() * w) | 0;
      const i = x; // row 0
      if (this.grid[i] !== MAT.EMPTY) continue;
      if (type === 'rain') this.setIdx(i, MAT.WATER);
      else if (type === 'snow') this.setIdx(i, MAT.SNOW);
    }
  }

  // ===== UPDATE LOOP =====
  update() {
    if (this.paused) return;
    this.frame++;
    // Reset events
    const ev = this.events;
    for (const k in ev) ev[k] = 0;

    const w = this.width, h = this.height;
    const grid = this.grid;
    const leftToRight = (this.frame & 1) === 0;

    // Update bottom-up (so falling things don't double-step)
    for (let y = h - 1; y >= 0; y--) {
      if (leftToRight) {
        for (let x = 0; x < w; x++) this.step(x, y);
      } else {
        for (let x = w - 1; x >= 0; x--) this.step(x, y);
      }
    }
  }

  step(x, y) {
    const w = this.width;
    const i = y * w + x;
    const m = this.grid[i];
    if (m === MAT.EMPTY) return;
    if (this.updated[i] === this.frame) return;
    this.updated[i] = this.frame;

    const b = MAT_BEHAVIOR[m];

    // Life countdown
    if (MAT_LIFE[m] > 0) {
      this.life[i]--;
      if (this.life[i] <= 0) {
        this.setIdx(i, MAT_DEATH[m]);
        return;
      }
    }

    // Reactions BEFORE movement — many reactions supersede motion
    if (this.react(x, y, i, m)) return;

    // Movement based on behavior
    if (b === BH.POWDER) this.movePowder(x, y, i, m);
    else if (b === BH.LIQUID) this.moveLiquid(x, y, i, m);
    else if (b === BH.GAS) this.moveGas(x, y, i, m);
    else if (b === BH.FIRE) this.moveFire(x, y, i, m);
    else if (b === BH.SOLID) this.solidBehavior(x, y, i, m);
  }

  // ===== REACTIONS =====
  react(x, y, i, m) {
    const w = this.width, h = this.height;
    const g = this.grid;

    // ---- Portal: eats adjacent non-portal particles ----
    if (m === MAT.PORTAL) {
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm !== MAT.EMPTY && nm !== MAT.PORTAL) {
          this.setIdx(ni, MAT.EMPTY);
          this.events.portalEat = 1;
          break;
        }
      }
      return false; // portal does not move
    }

    // ---- Clone: copies a neighbor once chosen ----
    if (m === MAT.CLONE) {
      // Pick copied material from 8-conn neighbors if life==0 (not set)
      if (this.life[i] === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ni = this.idx(x + dx, y + dy);
            if (ni === -1) continue;
            const nm = g[ni];
            // Clone any material except clone/portal/empty/antimatter
            if (nm !== MAT.EMPTY && nm !== MAT.CLONE && nm !== MAT.PORTAL && nm !== MAT.ANTIMATTER) {
              this.life[i] = nm;
              break;
            }
          }
          if (this.life[i] !== 0) break;
        }
      } else {
        // Emit stored material to empty neighbors
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.EMPTY && Math.random() < 0.15) {
            this.setIdx(ni, this.life[i]);
            this.events.cloneUsed = 1;
          }
        }
      }
      return false;
    }

    // ---- Cracker (firecracker) — explodes when near hot ----
    if (m === MAT.CRACKER) {
      if (this.anyNearbyHot(x, y)) {
        this.explode(x, y, 3, false);
        this.events.explosions++;
        return true;
      }
    }

    // ---- Stardust — burns into sparkle cascade when near fire/spark ----
    if (m === MAT.STARDUST) {
      if (this.anyNearbyHot(x, y)) {
        // Emit sparkles and rainbow gas
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ni = this.idx(x + dx, y + dy);
            if (ni === -1) continue;
            if (g[ni] === MAT.EMPTY && Math.random() < 0.6) this.setIdx(ni, MAT.RAINBOW);
            else if (g[ni] === MAT.EMPTY && Math.random() < 0.3) this.setIdx(ni, MAT.SPARK);
          }
        }
        this.setIdx(i, MAT.FIRE);
        this.events.sparks++;
        this.events.sparkle++;
        return true;
      }
    }

    // ---- Rainbow core: chain reaction with other cores ----
    if (m === MAT.RAINBOW_CORE) {
      if (this.anyNearbyHot(x, y) || this.countNearby(x, y, MAT.RAINBOW_CORE, 1) >= 1 &&
          this.countNearby(x, y, MAT.FIRE, 2) >= 1) {
        // trigger when near hot
        // Big rainbow burst
        this.explodeRainbow(x, y, 6);
        this.events.explosions++;
        this.events.rainbowCreated++;
        return true;
      }
    }

    // ---- Magic Fire — transforms flammable to RAINBOW gas and FLOWER ----
    if (m === MAT.MAGIC_FIRE) {
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm !== MAT.EMPTY && nm !== MAT.MAGIC_FIRE && MAT_FLAMMABLE[nm]) {
          if (Math.random() < 0.4) this.setIdx(ni, MAT.FLOWER);
          else this.setIdx(ni, MAT.RAINBOW);
          this.events.sparkle++;
        }
      }
    }

    // ---- FIRE interactions ----
    if (m === MAT.FIRE) {
      // Water/milk extinguish fire immediately → steam
      if (this.hasNearby(x, y, MAT.WATER, 1) || this.hasNearby(x, y, MAT.MILK, 1)) {
        this.setIdx(i, MAT.STEAM);
        this.events.steamCreated++;
        this.events.hiss++;
        return true;
      }
      // Foam smothers fire
      if (this.hasNearby(x, y, MAT.FOAM, 1)) {
        this.setIdx(i, MAT.SMOKE);
        return true;
      }
      // NOTE: ICE/SNOW do NOT extinguish — they melt via their own reactions,
      // which then produce water, which will extinguish fire next step.
      // Ignite flammable neighbors (8-connected) — but not explosives (self-detonate)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (IS_EXPLOSIVE[nm]) continue;
          if (nm !== MAT.EMPTY && MAT_FLAMMABLE[nm] && Math.random() < 0.45) {
            if (nm === MAT.CHOCOLATE) this.setIdx(ni, MAT.CARAMEL);
            else if (nm === MAT.COTTON_CANDY) this.setIdx(ni, MAT.FIRE);
            else if (nm === MAT.MARSHMALLOW) this.setIdx(ni, MAT.EMBER);
            else if (nm === MAT.JELLY) this.setIdx(ni, MAT.CARAMEL);
            else if (nm === MAT.CARAMEL) this.setIdx(ni, MAT.FIRE);
            else if (nm === MAT.HONEY) this.setIdx(ni, MAT.CARAMEL);
            else if (nm === MAT.WOOD) { this.setIdx(ni, MAT.FIRE); this.events.fireWood = 1; }
            else if (nm === MAT.SEED || nm === MAT.FLOWER || nm === MAT.GRASS ||
                     nm === MAT.VINE || nm === MAT.MUSHROOM) this.setIdx(ni, MAT.FIRE);
            else if (nm === MAT.GLITTER) this.setIdx(ni, MAT.FIRE);
            else if (nm === MAT.BALLOON) { this.setIdx(ni, MAT.RAINBOW); this.events.explosions++; }
            else if (nm === MAT.FUSE) this.setIdx(ni, MAT.EMBER);
            else if (nm === MAT.NAPALM) this.setIdx(ni, MAT.FIRE);
            else if (nm === MAT.OIL) this.setIdx(ni, MAT.FIRE);
            else this.setIdx(ni, MAT.FIRE);
            this.events.fireSpread++;
          }
        }
      }
    }

    // ---- LAVA interactions ----
    if (m === MAT.LAVA) {
      if (this.hasNearby(x, y, MAT.WATER, 1)) {
        this.setIdx(i, MAT.OBSIDIAN);
        // Convert one water neighbor to steam
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.WATER) { this.setIdx(ni, MAT.STEAM); break; }
        }
        this.events.obsidian++;
        this.events.steamCreated++;
        this.events.hiss++;
        return true;
      }
      if (this.hasNearby(x, y, MAT.MILK, 1)) {
        // Fun reaction: lava + milk → chocolate!
        this.setIdx(i, MAT.CHOCOLATE);
        this.events.chocoFromLava = 1;
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.MILK) { this.setIdx(ni, MAT.STEAM); break; }
        }
        this.events.hiss++;
        this.events.steamCreated++;
        return true;
      }
      if (this.hasNearby(x, y, MAT.ICE, 1) || this.hasNearby(x, y, MAT.SNOW, 1) ||
          this.hasNearby(x, y, MAT.FROST, 1)) {
        this.setIdx(i, MAT.STONE);
        this.events.steamCreated++;
        this.events.stoneFromLava = 1;
        return true;
      }
      // Ignite flammable neighbors (8-conn, skip explosives — they self-detonate)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (IS_EXPLOSIVE[nm]) continue;
          if (MAT_FLAMMABLE[nm] && Math.random() < 0.35) {
            this.setIdx(ni, MAT.FIRE);
            this.events.fireSpread++;
          }
        }
      }
      // Melt chocolate into caramel
      if (this.hasNearby(x, y, MAT.CHOCOLATE, 1)) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.CHOCOLATE) { this.setIdx(ni, MAT.CARAMEL); break; }
        }
      }
      // Sand + lava → glass
      if (this.hasNearby(x, y, MAT.SAND, 1) && Math.random() < 0.03) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.SAND) {
            this.setIdx(ni, MAT.GLASS);
            this.events.glassMade = 1;
            break;
          }
        }
      }
    }

    // ---- WATER: freezes near cold, soaks soil ----
    if (m === MAT.WATER) {
      if (this.hasNearby(x, y, MAT.FROST, 1) && Math.random() < 0.6) {
        this.setIdx(i, MAT.ICE);
        this.events.iceCreated++;
        return true;
      }
      if ((this.hasNearby(x, y, MAT.ICE, 1) || this.hasNearby(x, y, MAT.SNOW, 1)) && Math.random() < 0.01) {
        this.setIdx(i, MAT.ICE);
        this.events.iceCreated++;
        return true;
      }
      if (this.hasNearby(x, y, MAT.SOIL, 1) && Math.random() < 0.05) {
        // find a soil neighbor, turn into mud
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.SOIL) {
            this.setIdx(ni, MAT.MUD); this.setIdx(i, MAT.EMPTY);
            return true;
          }
        }
      }
      if (this.hasNearby(x, y, MAT.SOAP, 1) && Math.random() < 0.15) {
        this.setIdx(i, MAT.FOAM);
        return true;
      }
    }

    // ---- FROST: freezes liquids ----
    if (m === MAT.FROST) {
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm === MAT.WATER || nm === MAT.MILK) {
          this.setIdx(ni, MAT.ICE); this.events.iceCreated++;
        } else if (nm === MAT.LAVA) {
          this.setIdx(ni, MAT.STONE);
        } else if (nm === MAT.CARAMEL || nm === MAT.HONEY) {
          this.setIdx(ni, MAT.CANDY);
        } else if (nm === MAT.FIRE || nm === MAT.EMBER) {
          this.setIdx(ni, MAT.SMOKE);
        }
      }
    }

    // ---- POTION: transforms neighbors into glitter/rainbow ----
    if (m === MAT.POTION) {
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm === MAT.EMPTY || nm === MAT.POTION) continue;
        // Seeds transform instantly — too cute to miss
        if (nm === MAT.SEED) { this.setIdx(ni, MAT.FLOWER); this.events.potionTransform++; continue; }
        if (Math.random() < 0.08) {
          // Transformation rules
          if (nm === MAT.WATER) { this.setIdx(ni, MAT.RAINBOW); this.events.rainbowFromPotion = 1; }
          else if (nm === MAT.FIRE) this.setIdx(ni, MAT.MAGIC_FIRE);
          else if (nm === MAT.SAND) this.setIdx(ni, MAT.STARDUST);
          else if (nm === MAT.STONE) this.setIdx(ni, MAT.EMERALD);
          else if (nm === MAT.WOOD) this.setIdx(ni, MAT.CANDY);
          else if (nm === MAT.SOIL) this.setIdx(ni, MAT.FAIRY_DUST);
          else if (MAT_BEHAVIOR[nm] === BH.SOLID && Math.random() < 0.5) this.setIdx(ni, MAT.GLITTER);
          else if (Math.random() < 0.5) this.setIdx(ni, MAT.GLITTER);
          this.events.potionTransform++;
        }
      }
    }

    // ---- FAIRY_DUST: grows seeds and makes sparkles ----
    if (m === MAT.FAIRY_DUST) {
      // Grow any neighboring seed
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        if (g[ni] === MAT.SEED) {
          // grow to flower
          this.setIdx(ni, MAT.FLOWER);
          this.events.plantGrow++;
        }
        // Transforms mud to grass
        if (g[ni] === MAT.MUD && Math.random() < 0.05) {
          this.setIdx(ni, MAT.GRASS);
          this.events.plantGrow++;
        }
      }
    }

    // ---- SEED: grows on soil/mud/grass with water or fairy dust ----
    if (m === MAT.SEED) {
      const hasWater = this.hasNearby(x, y, MAT.WATER, 1);
      const hasSoil = this.hasNearby(x, y, MAT.SOIL, 1) ||
                      this.hasNearby(x, y, MAT.MUD, 1) ||
                      this.hasNearby(x, y, MAT.GRASS, 1);
      const hasFairy = this.hasNearby(x, y, MAT.FAIRY_DUST, 1);
      if ((hasWater && hasSoil && Math.random() < 0.02) || (hasFairy && Math.random() < 0.5)) {
        // Grow upward
        const above = this.idx(x, y - 1);
        if (above !== -1 && g[above] === MAT.EMPTY) {
          this.setIdx(i, MAT.VINE);
          this.setIdx(above, MAT.FLOWER);
          this.events.plantGrow++;
          this.events.xp++;
          return true;
        } else {
          this.setIdx(i, MAT.FLOWER);
          this.events.plantGrow++;
          return true;
        }
      }
    }

    // ---- VINE: grows upward if has flower head and water nearby ----
    if (m === MAT.VINE) {
      if (Math.random() < 0.005 && this.hasNearby(x, y, MAT.WATER, 2)) {
        const above2 = this.idx(x, y - 1);
        if (above2 !== -1 && g[above2] === MAT.EMPTY) {
          this.setIdx(above2, MAT.VINE);
          const above3 = this.idx(x, y - 2);
          if (above3 !== -1 && g[above3] === MAT.EMPTY && Math.random() < 0.3)
            this.setIdx(above3, MAT.FLOWER);
          this.events.plantGrow++;
        }
      }
    }

    // ---- GRASS spreads like moss on soil/mud/wood ----
    if (m === MAT.GRASS) {
      if (Math.random() < 0.008) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if ((nm === MAT.SOIL || nm === MAT.MUD || nm === MAT.STONE) && this.hasNearby(x, y, MAT.WATER, 3)) {
            this.setIdx(ni, MAT.GRASS);
            this.events.plantGrow++;
            break;
          }
        }
      }
    }

    // ---- MUSHROOM spreads on wood/soil ----
    if (m === MAT.MUSHROOM) {
      if (Math.random() < 0.004) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm === MAT.WOOD || nm === MAT.MUD) {
            this.setIdx(ni, MAT.MUSHROOM);
            this.events.plantGrow++;
            break;
          }
        }
      }
    }

    // ---- WIRE: conducts SPARK ----
    if (m === MAT.WIRE) {
      if (this.hasNearby(x, y, MAT.BATTERY, 1) && Math.random() < 0.15) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.EMPTY) { this.setIdx(ni, MAT.SPARK); break; }
        }
      }
    }

    // ---- SPARK spreads along wire, lights lamps, ignites stardust ----
    if (m === MAT.SPARK) {
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm === MAT.WIRE && this.life[ni] === 0 && Math.random() < 0.6) {
          // Create spark on wire briefly by converting wire temporarily? We'll spawn spark in empty neighbor of that wire
          // Simpler: spark "jumps" to adjacent empty cell to continue chain
        }
        if (nm === MAT.LAMP) {
          this.life[ni] = 60; // glow life
        }
        if (nm === MAT.STARDUST) {
          this.setIdx(ni, MAT.FIRE);
          this.events.sparks++;
        }
        if (nm === MAT.CRACKER) {
          this.setIdx(ni, MAT.FIRE);
          this.events.sparks++;
        }
      }
      this.events.sparks++;
    }

    // ---- MAGNET attracts METAL/GOLD ----
    if (m === MAT.MAGNET) {
      if ((this.frame & 3) === 0) {
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ni = this.idx(x + dx, y + dy);
            if (ni === -1) continue;
            const nm = g[ni];
            if (nm === MAT.METAL || nm === MAT.GOLD) {
              // move one step closer
              const sx = Math.sign(-dx), sy = Math.sign(-dy);
              const tx = x + dx + sx, ty = y + dy + sy;
              const tIdx = this.idx(tx, ty);
              if (tIdx !== -1 && g[tIdx] === MAT.EMPTY) {
                this.setIdx(tIdx, nm);
                this.setIdx(ni, MAT.EMPTY);
              }
            }
          }
        }
      }
    }

    // ---- LAMP stays bright near spark ----
    if (m === MAT.LAMP) {
      if (this.life[i] > 0) this.life[i]--;
      if (this.hasNearby(x, y, MAT.SPARK, 1)) this.life[i] = 60;
    }

    // ---- BUBBLE rises and pops ----
    if (m === MAT.BUBBLE) {
      if (this.hasNearby(x, y, MAT.FIRE, 1) || this.hasNearby(x, y, MAT.LAVA, 1) ||
          this.hasNearby(x, y, MAT.EMBER, 1)) {
        this.setIdx(i, MAT.EMPTY);
        return true;
      }
    }

    // ---- SOAP + WATER creates bubbles ----
    if (m === MAT.SOAP) {
      if (this.hasNearby(x, y, MAT.WATER, 1) && Math.random() < 0.04) {
        const above = this.idx(x, y - 1);
        if (above !== -1 && g[above] === MAT.EMPTY) this.setIdx(above, MAT.BUBBLE);
      }
    }

    // ---- HONEY + COLD → ICE_CREAM ----
    if (m === MAT.HONEY) {
      if (this.hasNearby(x, y, MAT.SNOW, 1) || this.hasNearby(x, y, MAT.ICE, 1) ||
          this.hasNearby(x, y, MAT.FROST, 1)) {
        if (Math.random() < 0.3) {
          this.setIdx(i, MAT.ICE_CREAM);
          this.events.iceCreamMade = 1;
          return true;
        }
      }
      // Honey + fire → caramel
      if (this.hasNearby(x, y, MAT.FIRE, 1) && Math.random() < 0.15) {
        this.setIdx(i, MAT.CARAMEL);
        this.events.caramelMade = 1;
      }
    }

    // ---- MILK + CANDY → ICE_CREAM ----
    if (m === MAT.MILK) {
      if (this.hasNearby(x, y, MAT.CANDY, 1) && Math.random() < 0.04) {
        this.setIdx(i, MAT.ICE_CREAM);
        this.events.iceCreamMade = 1;
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.CANDY) { this.setIdx(ni, MAT.ICE_CREAM); break; }
        }
      }
    }

    // ---- CARAMEL + COLD → CANDY ----
    if (m === MAT.CARAMEL) {
      if ((this.hasNearby(x, y, MAT.ICE, 1) || this.hasNearby(x, y, MAT.FROST, 1) ||
           this.hasNearby(x, y, MAT.SNOW, 1)) && Math.random() < 0.25) {
        this.setIdx(i, MAT.CANDY);
        this.events.candyMade = 1;
        return true;
      }
    }

    // ---- CHOCOLATE melts near heat ----
    if (m === MAT.CHOCOLATE) {
      if (this.hasNearby(x, y, MAT.FIRE, 1) && Math.random() < 0.1) {
        this.setIdx(i, MAT.CARAMEL);
        this.events.caramelMade = 1;
        return true;
      }
    }

    // ---- CANDY dissolves slowly in water/milk ----
    if (m === MAT.CANDY) {
      if ((this.hasNearby(x, y, MAT.WATER, 1) || this.hasNearby(x, y, MAT.MILK, 1)) && Math.random() < 0.002) {
        this.setIdx(i, MAT.EMPTY);
        return true;
      }
    }

    // ---- ICE melts near heat ----
    if (m === MAT.ICE) {
      if (this.hasNearby(x, y, MAT.FIRE, 1) || this.hasNearby(x, y, MAT.LAVA, 1) ||
          this.hasNearby(x, y, MAT.EMBER, 1)) {
        if (Math.random() < 0.3) {
          this.setIdx(i, MAT.WATER);
          return true;
        }
      }
    }

    // ---- SNOW melts near heat ----
    if (m === MAT.SNOW) {
      if (this.hasNearby(x, y, MAT.FIRE, 1) || this.hasNearby(x, y, MAT.LAVA, 1)) {
        this.setIdx(i, MAT.WATER);
        return true;
      }
    }

    // ---- ICE_CREAM melts near heat ----
    if (m === MAT.ICE_CREAM) {
      if (this.hasNearby(x, y, MAT.FIRE, 1) || this.hasNearby(x, y, MAT.LAVA, 1)) {
        if (Math.random() < 0.2) { this.setIdx(i, MAT.MILK); return true; }
      }
    }

    // ---- COTTON_CANDY dissolves in water ----
    if (m === MAT.COTTON_CANDY) {
      if (this.hasNearby(x, y, MAT.WATER, 1) && Math.random() < 0.3) {
        this.setIdx(i, MAT.EMPTY);
        return true;
      }
    }

    // ---- UNICORN leaves rainbow trail when moving ----
    // handled in movement

    // ---- BEE produces HONEY near FLOWER ----
    if (m === MAT.BEE) {
      if (this.hasNearby(x, y, MAT.FLOWER, 2) && Math.random() < 0.02) {
        const below = this.idx(x, y + 1);
        if (below !== -1 && this.grid[below] === MAT.EMPTY) {
          this.setIdx(below, MAT.HONEY);
          this.events.honeyMade = 1;
        }
      }
    }

    // ===== EXPLOSIVES =====

    // GUNPOWDER — small explosion
    if (m === MAT.GUNPOWDER) {
      if (this.anyNearbyHot(x, y)) {
        this.explode(x, y, 3, false);
        return true;
      }
    }

    // DYNAMITE — bigger explosion
    if (m === MAT.DYNAMITE) {
      if (this.anyNearbyHot(x, y)) {
        this.explode(x, y, 6, true);
        return true;
      }
    }

    // C4 — huge explosion, only by spark/fire (not lava alone)
    if (m === MAT.C4) {
      if (this.hasNearby(x, y, MAT.SPARK, 1) || this.hasNearby(x, y, MAT.FIRE, 1) ||
          this.hasNearby(x, y, MAT.EMBER, 1)) {
        this.explode(x, y, 9, true);
        return true;
      }
    }

    // NITRO — volatile, detonates on heat or impact
    if (m === MAT.NITRO) {
      if (this.anyNearbyHot(x, y)) {
        this.explode(x, y, 7, true);
        return true;
      }
      // Detonate on high-density solid impact below (impact simulation)
      const below = this.idx(x, y + 1);
      if (below !== -1 && g[below] !== MAT.EMPTY && MAT_DENSITY[g[below]] >= 10 &&
          g[below] !== MAT.NITRO && Math.random() < 0.005) {
        this.explode(x, y, 6, true);
        return true;
      }
    }

    // GAS — explodes on fire, drifts up
    if (m === MAT.GAS) {
      if (this.anyNearbyHot(x, y)) {
        this.explode(x, y, 4, false);
        return true;
      }
    }

    // DUST — deflagrates when concentrated and touched by fire
    if (m === MAT.DUST) {
      if (this.anyNearbyHot(x, y)) {
        // Mini explosion only if surrounded by dust (concentrated)
        const density = this.countNearby(x, y, MAT.DUST, 2);
        if (density >= 4) {
          this.explode(x, y, 3, false);
          return true;
        } else {
          this.setIdx(i, MAT.FIRE);
          return true;
        }
      }
    }

    // THERMITE — burns intensely, melts metal to lava, creates lots of smoke
    if (m === MAT.THERMITE) {
      if (this.anyNearbyHot(x, y)) {
        this.setIdx(i, MAT.LAVA);
        // Convert nearby metals to lava
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm === MAT.METAL || nm === MAT.RUST || nm === MAT.GOLD) {
            this.setIdx(ni, MAT.LAVA);
            this.events.thermiteBurn = 1;
          } else if (nm === MAT.STONE) {
            if (Math.random() < 0.3) this.setIdx(ni, MAT.LAVA);
          } else if (nm === MAT.EMPTY && Math.random() < 0.3) {
            this.setIdx(ni, MAT.SMOKE);
          }
        }
        this.events.explosions++;
        return true;
      }
    }

    // NAPALM — sticky, burns long
    if (m === MAT.NAPALM) {
      if (this.anyNearbyHot(x, y)) {
        this.setIdx(i, MAT.FIRE);
        this.events.fireSpread++;
        return true;
      }
    }

    // FUSE — slow fire propagation
    if (m === MAT.FUSE) {
      if (this.anyNearbyHot(x, y) && Math.random() < 0.3) {
        // Light adjacent fuse
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.FUSE && Math.random() < 0.4) {
            this.setIdx(ni, MAT.EMBER);
            break;
          }
        }
        this.setIdx(i, MAT.FIRE);
        return true;
      }
    }

    // FIREWORK — launches up and bursts
    if (m === MAT.FIREWORK) {
      if (this.anyNearbyHot(x, y) || this.life[i] > 0) {
        // If already lit, move up and leave trail
        if (this.life[i] === 0) this.life[i] = 30;
        const up = this.idx(x, y - 1);
        if (up !== -1 && g[up] === MAT.EMPTY && this.life[i] > 5) {
          this.move(i, up);
          // Leave fire trail where we were
          this.setIdx(i, MAT.FIRE);
          return true;
        }
        // Burst
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            if (dx * dx + dy * dy > 9) continue;
            const ni = this.idx(x + dx, y + dy);
            if (ni !== -1 && g[ni] === MAT.EMPTY && Math.random() < 0.5) {
              this.setIdx(ni, MAT.SPARK);
            }
          }
        }
        this.setIdx(i, MAT.EMPTY);
        this.events.sparks++;
        this.events.sparkle++;
        return true;
      }
    }

    // ===== CHEMISTRY =====

    // ACID — dissolves wood, organic, soft stuff
    if (m === MAT.ACID) {
      // Neutralize with alkali → salt + steam
      if (this.hasNearby(x, y, MAT.ALKALI, 1)) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.ALKALI) {
            this.setIdx(ni, MAT.STEAM);
            this.setIdx(i, MAT.SALT);
            this.events.steamCreated++;
            this.events.hiss++;
            this.events.acidNeutralized = 1;
            return true;
          }
        }
      }
      // Dissolve adjacent materials
      if (Math.random() < 0.1) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm === MAT.METAL) {
            this.setIdx(ni, MAT.RUST);
            this.setIdx(i, MAT.EMPTY);
            this.events.potionTransform++;
            this.events.rustMade = 1;
            return true;
          }
          if (ACID_DISSOLVES[nm]) {
            this.setIdx(ni, MAT.EMPTY);
            this.setIdx(i, MAT.EMPTY);
            this.events.potionTransform++;
            return true;
          }
        }
      }
    }

    // ALKALI — neutralizes acid (handled above), also dissolves oil to soap-like
    if (m === MAT.ALKALI) {
      if (this.hasNearby(x, y, MAT.OIL, 1) && Math.random() < 0.1) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.OIL) {
            this.setIdx(ni, MAT.SOAP);
            this.setIdx(i, MAT.SOAP);
            this.events.soapMade = 1;
            return true;
          }
        }
      }
    }

    // SALT — dissolves in water/milk, melts ice
    if (m === MAT.SALT) {
      if (this.hasNearby(x, y, MAT.ICE, 1) && Math.random() < 0.15) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.ICE) {
            this.setIdx(ni, MAT.WATER);
            this.setIdx(i, MAT.EMPTY);
            this.events.saltMelt = 1;
            return true;
          }
        }
      }
      if (this.hasNearby(x, y, MAT.WATER, 1) && Math.random() < 0.004) {
        this.setIdx(i, MAT.EMPTY);
        return true;
      }
    }

    // OIL — burns easily (flammable flag already handles this for FIRE interaction)
    if (m === MAT.OIL) {
      if (this.anyNearbyHot(x, y) && Math.random() < 0.3) {
        this.setIdx(i, MAT.FIRE);
        this.events.fireSpread++;
        return true;
      }
    }

    // MERCURY — stays dense, has no special reaction (its density handles displacement)

    // ===== ATOMIC =====

    // URANIUM — critical mass causes nuclear explosion
    if (m === MAT.URANIUM) {
      const neighCount = this.countNearby(x, y, MAT.URANIUM, 1);
      if (neighCount >= 3 && this.anyNearbyHot(x, y)) {
        this.explodeNuclear(x, y);
        this.events.nuclearBoom = 1;
        return true;
      }
      // Emit radiation slowly
      if (Math.random() < 0.04) {
        for (let d = 0; d < 4; d++) {
          const dx = DIR4_X[d];
          const dy = DIR4_Y[d];
          const ni = this.idx(x + dx, y + dy);
          if (ni !== -1 && g[ni] === MAT.EMPTY) {
            this.setIdx(ni, MAT.RADIATION);
            break;
          }
        }
      }
    }

    // RADIATION — kills/transforms organics (8-conn)
    if (m === MAT.RADIATION) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (IS_PLANT[nm] && Math.random() < 0.15) this.setIdx(ni, MAT.ASH);
          else if (IS_CREATURE[nm] && Math.random() < 0.05) this.setIdx(ni, MAT.EMPTY);
        }
      }
    }

    // ANTIMATTER — annihilates on contact; uses radius 2 to catch falling particles
    // that would otherwise fall "through" due to bottom-up iteration order
    if (m === MAT.ANTIMATTER) {
      // Find nearest non-empty, non-antimatter neighbor in 5x5 box
      let tgtI = -1, bestDist = 99;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm !== MAT.EMPTY && nm !== MAT.ANTIMATTER && nm !== MAT.STONE &&
              nm !== MAT.DIAMOND && nm !== MAT.OBSIDIAN) {
            const dist = Math.max(Math.abs(dx), Math.abs(dy));
            if (dist < bestDist) { bestDist = dist; tgtI = ni; }
          }
        }
      }
      if (tgtI !== -1) {
        // Flash
        for (let ddy = -2; ddy <= 2; ddy++) {
          for (let ddx = -2; ddx <= 2; ddx++) {
            const fi = this.idx(x + ddx, y + ddy);
            if (fi !== -1 && g[fi] === MAT.EMPTY && Math.random() < 0.35)
              this.setIdx(fi, MAT.SPARK);
          }
        }
        this.setIdx(tgtI, MAT.EMPTY);
        this.setIdx(i, MAT.EMPTY);
        this.events.sparkle++;
        this.events.explosions++;
        this.events.antimatterAnni = 1;
        return true;
      }
    }

    // PLASMA — melts most things
    if (m === MAT.PLASMA) {
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm === MAT.EMPTY) continue;
        if (PLASMA_MELTS[nm]) {
          if (nm === MAT.METAL || nm === MAT.GOLD || nm === MAT.RUST) {
            this.setIdx(ni, MAT.LAVA);
            this.events.plasmaBurn = 1;
          } else if (MAT_FLAMMABLE[nm]) {
            this.setIdx(ni, MAT.FIRE);
            this.events.fireSpread++;
          } else if (Math.random() < 0.3) {
            this.setIdx(ni, MAT.SMOKE);
          }
        }
      }
    }

    // ===== MACHINES =====

    // HEATER — permanent heat source. Ignites flammable neighbors, melts ice/snow, evaporates water
    if (m === MAT.HEATER) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm === MAT.EMPTY) continue;
          if (nm === MAT.ICE) this.setIdx(ni, MAT.WATER);
          else if (nm === MAT.SNOW) this.setIdx(ni, MAT.WATER);
          else if (nm === MAT.WATER && Math.random() < 0.2) this.setIdx(ni, MAT.STEAM);
          else if (nm === MAT.MILK && Math.random() < 0.2) this.setIdx(ni, MAT.STEAM);
          else if (nm === MAT.FROST) this.setIdx(ni, MAT.WATER);
          else if (nm === MAT.CHOCOLATE && Math.random() < 0.12) this.setIdx(ni, MAT.CARAMEL);
          else if (nm === MAT.ICE_CREAM && Math.random() < 0.2) this.setIdx(ni, MAT.MILK);
          else if (MAT_FLAMMABLE[nm] && !IS_EXPLOSIVE[nm] && Math.random() < 0.08) {
            this.setIdx(ni, MAT.FIRE);
            this.events.fireSpread++;
          }
        }
      }
    }

    // COOLER — permanent cold source. Freezes water, solidifies caramel, dampens fire
    if (m === MAT.COOLER) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ni = this.idx(x + dx, y + dy);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm === MAT.EMPTY) continue;
          if (nm === MAT.WATER && Math.random() < 0.35) { this.setIdx(ni, MAT.ICE); this.events.iceCreated++; }
          else if (nm === MAT.MILK && Math.random() < 0.15) this.setIdx(ni, MAT.ICE_CREAM);
          else if (nm === MAT.LAVA) this.setIdx(ni, MAT.STONE);
          else if (nm === MAT.CARAMEL && Math.random() < 0.25) this.setIdx(ni, MAT.CANDY);
          else if (nm === MAT.HONEY && Math.random() < 0.25) this.setIdx(ni, MAT.ICE_CREAM);
          else if (nm === MAT.STEAM) this.setIdx(ni, MAT.WATER);
          else if (nm === MAT.FIRE || nm === MAT.EMBER) this.setIdx(ni, MAT.SMOKE);
        }
      }
    }

    // GLUE — solid sticky block that paralyzes adjacent non-solid particles
    if (m === MAT.GLUE) {
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm !== MAT.EMPTY && nm !== MAT.GLUE && MAT_BEHAVIOR[nm] !== BH.SOLID) {
          this.updated[ni] = this.frame; // pin in place this tick
        }
      }
    }

    // BOUNCY — solid trampoline that flings particles above it several cells up
    // Checks (x-1, x, x+1) at y-1 to catch diagonal fallers
    if (m === MAT.BOUNCY) {
      for (let dx = -1; dx <= 1; dx++) {
        const ax = x + dx, ay = y - 1;
        const above = this.idx(ax, ay);
        if (above === -1) continue;
        const am = g[above];
        if (am === MAT.EMPTY || am === MAT.BOUNCY) continue;
        if (MAT_BEHAVIOR[am] === BH.SOLID) continue;
        // Find highest empty cell within bounce range (3 cells) above
        let destY = ay - 3;
        for (let k = 1; k <= 3; k++) {
          const testY = ay - k;
          const testI = this.idx(ax, testY);
          if (testI === -1 || g[testI] !== MAT.EMPTY) { destY = testY + 1; break; }
          destY = testY;
        }
        if (destY < ay && Math.random() < 0.9) {
          const destI = this.idx(ax, destY);
          if (destI !== -1 && g[destI] === MAT.EMPTY) {
            this.move(above, destI);
            this.events.sparks++;
          }
        }
      }
    }

    // CONVEYOR_L — pushes particle above it to the left
    if (m === MAT.CONVEYOR_L) {
      const above = this.idx(x, y - 1);
      if (above !== -1 && g[above] !== MAT.EMPTY && MAT_BEHAVIOR[g[above]] !== BH.SOLID) {
        const left = this.idx(x - 1, y - 1);
        if (left !== -1 && g[left] === MAT.EMPTY) {
          this.move(above, left);
        }
      }
    }

    // CONVEYOR_R — pushes particle above it to the right
    if (m === MAT.CONVEYOR_R) {
      const above = this.idx(x, y - 1);
      if (above !== -1 && g[above] !== MAT.EMPTY && MAT_BEHAVIOR[g[above]] !== BH.SOLID) {
        const right = this.idx(x + 1, y - 1);
        if (right !== -1 && g[right] === MAT.EMPTY) {
          this.move(above, right);
        }
      }
    }

    // TORCH — emits fire upward constantly
    if (m === MAT.TORCH) {
      if ((this.frame & 3) === 0) {
        const above = this.idx(x, y - 1);
        if (above !== -1 && g[above] === MAT.EMPTY && Math.random() < 0.5) {
          this.setIdx(above, MAT.FIRE);
        }
      }
      // Ignite flammable neighbors
      for (let d = 0; d < 4; d++) {
        const dx = DIR4_X[d];
        const dy = DIR4_Y[d];
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = g[ni];
        if (nm !== MAT.EMPTY && MAT_FLAMMABLE[nm] && Math.random() < 0.15) {
          this.setIdx(ni, MAT.FIRE);
          this.events.fireSpread++;
        }
      }
    }

    // ===== COSMIC & EXOTIC =====

    // STORM_CLOUD — static, spawns rain below + occasional lightning
    if (m === MAT.STORM_CLOUD) {
      // Rain: each cloud drops water occasionally
      if ((this.frame & 7) === (x & 7) && Math.random() < 0.4) {
        const below = this.idx(x, y + 1);
        if (below !== -1 && g[below] === MAT.EMPTY) this.setIdx(below, MAT.WATER);
      }
      // Lightning bolt ~2-3 times per second per cloud
      if ((this.frame & 127) === (x & 127) && Math.random() < 0.35) {
        let didStrike = false;
        for (let dy = 1; dy < 30; dy++) {
          const ni = this.idx(x + ((Math.random() * 3 - 1) | 0), y + dy);
          if (ni === -1) break;
          const nm = g[ni];
          if (nm === MAT.EMPTY) {
            this.setIdx(ni, MAT.SPARK);
            didStrike = true;
          } else {
            // Hit: ignite flammable, else stop
            if (MAT_FLAMMABLE[nm] && !IS_EXPLOSIVE[nm]) {
              this.setIdx(ni, MAT.FIRE);
              this.events.fireSpread++;
            }
            didStrike = true;
            break;
          }
        }
        if (didStrike) {
          this.events.stormLightning = 1;
          this.events.zap = 1;
        }
      }
    }

    // METEOR — burning powder, leaves ember trail, detonates on solid impact
    if (m === MAT.METEOR) {
      // Ember trail above (flight path)
      if (Math.random() < 0.25) {
        const above = this.idx(x, y - 1);
        if (above !== -1 && g[above] === MAT.EMPTY) this.setIdx(above, MAT.EMBER);
      }
      // Ignite flammable horizontal/diagonal neighbors
      for (let dy2 = -1; dy2 <= 1; dy2++) {
        for (let dx2 = -1; dx2 <= 1; dx2++) {
          if (dx2 === 0 && dy2 === 0) continue;
          const ni = this.idx(x + dx2, y + dy2);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm !== MAT.EMPTY && !IS_EXPLOSIVE[nm] && MAT_FLAMMABLE[nm] && Math.random() < 0.2) {
            this.setIdx(ni, MAT.FIRE);
            this.events.fireSpread++;
          }
        }
      }
      // Detonate when resting on solid
      const below = this.idx(x, y + 1);
      if (below !== -1) {
        const bm = g[below];
        const bb = MAT_BEHAVIOR[bm];
        if (bm !== MAT.EMPTY && bm !== MAT.METEOR && bb === BH.SOLID) {
          this.explode(x, y, 5, true);
          this.events.meteorHit = 1;
          return true;
        }
      }
    }

    // BLACK_HOLE — pulls particles in radius 4, absorbs on contact
    if (m === MAT.BLACK_HOLE) {
      let pulled = false;
      for (let dy2 = -4; dy2 <= 4; dy2++) {
        for (let dx2 = -4; dx2 <= 4; dx2++) {
          if (dx2 === 0 && dy2 === 0) continue;
          const d2 = dx2 * dx2 + dy2 * dy2;
          if (d2 > 16) continue;
          const ni = this.idx(x + dx2, y + dy2);
          if (ni === -1) continue;
          const nm = g[ni];
          if (nm === MAT.EMPTY || nm === MAT.BLACK_HOLE) continue;
          // Diamond resists
          if (nm === MAT.DIAMOND) continue;
          // Antimatter causes catastrophic explosion
          if (nm === MAT.ANTIMATTER && d2 <= 4) {
            this.explodeNuclear(x, y);
            this.setIdx(i, MAT.EMPTY);
            this.setIdx(ni, MAT.EMPTY);
            this.events.blackHolePull = 1;
            return true;
          }
          // Pull strength: stronger when closer
          const pullProb = 0.4 / d2;
          if (Math.random() >= pullProb) continue;
          // Adjacent (distance ≤ √2): absorb directly
          if (d2 <= 2) {
            this.setIdx(ni, MAT.EMPTY);
            pulled = true;
            continue;
          }
          // Otherwise move 1 cell toward center
          const sx = dx2 === 0 ? 0 : (dx2 > 0 ? -1 : 1);
          const sy = dy2 === 0 ? 0 : (dy2 > 0 ? -1 : 1);
          const tIdx = this.idx(x + dx2 + sx, y + dy2 + sy);
          if (tIdx !== -1 && tIdx !== i && g[tIdx] === MAT.EMPTY) {
            this.move(ni, tIdx);
            pulled = true;
          }
        }
      }
      if (pulled) this.events.blackHolePull = 1;
    }

    // SLIME — viscous liquid with temperature reactions (not flammable — fire's ignite loop skips it)
    if (m === MAT.SLIME) {
      // Cold → jelly (it solidifies)
      if ((this.hasNearby(x, y, MAT.ICE, 1) || this.hasNearby(x, y, MAT.FROST, 1) ||
           this.hasNearby(x, y, MAT.SNOW, 1) || this.hasNearby(x, y, MAT.COOLER, 1)) &&
          Math.random() < 0.25) {
        this.setIdx(i, MAT.JELLY);
        this.events.slimeFreeze = 1;
        return true;
      }
      // Fire/lava/heater → turns into foam (burns off)
      if (this.anyNearbyHot(x, y) && Math.random() < 0.3) {
        this.setIdx(i, MAT.FOAM);
        this.events.slimeBurn = 1;
        return true;
      }
      // Acid melts slime (faster than water)
      if (this.hasNearby(x, y, MAT.ACID, 1) && Math.random() < 0.2) {
        this.setIdx(i, MAT.EMPTY);
        return true;
      }
    }

    return false;
  }

  anyNearbyHot(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const m = this.get(x + dx, y + dy);
        if (m !== -1 && IS_HOT[m]) return true;
      }
    }
    return false;
  }

  // ===== MOVEMENT =====
  movePowder(x, y, i, m) {
    const w = this.width;
    const down = this.idx(x, y + 1);
    if (down !== -1 && this.canDisplace(m, down)) {
      this.grid[down] === MAT.EMPTY ? this.move(i, down) : this.swap(i, down);
      return;
    }
    const dl = this.idx(x - 1, y + 1);
    const dr = this.idx(x + 1, y + 1);
    const leftFirst = Math.random() < 0.5;
    const first = leftFirst ? dl : dr;
    const second = leftFirst ? dr : dl;
    if (first !== -1 && this.canDisplace(m, first)) {
      this.grid[first] === MAT.EMPTY ? this.move(i, first) : this.swap(i, first);
      return;
    }
    if (second !== -1 && this.canDisplace(m, second)) {
      this.grid[second] === MAT.EMPTY ? this.move(i, second) : this.swap(i, second);
    }
  }

  moveLiquid(x, y, i, m) {
    const disp = MAT_DISP[m] || 3;
    const down = this.idx(x, y + 1);
    if (down !== -1 && this.canDisplace(m, down)) {
      this.grid[down] === MAT.EMPTY ? this.move(i, down) : this.swap(i, down);
      return;
    }
    const dl = this.idx(x - 1, y + 1);
    const dr = this.idx(x + 1, y + 1);
    const leftFirst = Math.random() < 0.5;
    let first = leftFirst ? dl : dr;
    let second = leftFirst ? dr : dl;
    if (first !== -1 && this.canDisplace(m, first)) {
      this.grid[first] === MAT.EMPTY ? this.move(i, first) : this.swap(i, first);
      return;
    }
    if (second !== -1 && this.canDisplace(m, second)) {
      this.grid[second] === MAT.EMPTY ? this.move(i, second) : this.swap(i, second);
      return;
    }
    // Horizontal spread up to dispersion
    const dir = leftFirst ? -1 : 1;
    for (let k = 1; k <= disp; k++) {
      const ni = this.idx(x + dir * k, y);
      if (ni === -1) break;
      if (this.canDisplace(m, ni)) {
        this.grid[ni] === MAT.EMPTY ? this.move(i, ni) : this.swap(i, ni);
        return;
      }
      if (this.grid[ni] !== MAT.EMPTY && !this.canDisplace(m, ni)) break;
    }
    // Try other direction
    for (let k = 1; k <= disp; k++) {
      const ni = this.idx(x - dir * k, y);
      if (ni === -1) break;
      if (this.canDisplace(m, ni)) {
        this.grid[ni] === MAT.EMPTY ? this.move(i, ni) : this.swap(i, ni);
        return;
      }
      if (this.grid[ni] !== MAT.EMPTY && !this.canDisplace(m, ni)) break;
    }
  }

  moveGas(x, y, i, m) {
    const disp = MAT_DISP[m] || 2;
    const up = this.idx(x, y - 1);
    // Rise
    if (up !== -1 && (this.grid[up] === MAT.EMPTY)) {
      if (Math.random() < 0.85) { this.move(i, up); return; }
    }
    // Random drift
    const dx = (Math.random() * 3 - 1) | 0;
    const dy = (Math.random() < 0.55 ? -1 : 0);
    const ni = this.idx(x + dx, y + dy);
    if (ni !== -1 && this.grid[ni] === MAT.EMPTY) {
      this.move(i, ni); return;
    }
  }

  moveFire(x, y, i, m) {
    // Fire rises slightly
    const up = this.idx(x, y - 1);
    if (up !== -1 && this.grid[up] === MAT.EMPTY && Math.random() < 0.35) {
      this.move(i, up); return;
    }
    const dx = (Math.random() * 3 - 1) | 0;
    const ni = this.idx(x + dx, y - (Math.random() < 0.5 ? 1 : 0));
    if (ni !== -1 && this.grid[ni] === MAT.EMPTY && Math.random() < 0.35) {
      this.move(i, ni);
    }
  }

  solidBehavior(x, y, i, m) {
    // Creatures move
    if (IS_CREATURE[m]) this.moveCreature(x, y, i, m);
    // Lamp: stays
  }

  moveCreature(x, y, i, m) {
    // Fish: gravity every frame (when not in water), swimming throttled
    if (m === MAT.FISH) {
      const hasWater = this.hasNearby(x, y, MAT.WATER, 1);
      if (!hasWater) {
        // Out of water — fall like gravity every tick
        const below = this.idx(x, y + 1);
        if (below !== -1 && this.grid[below] === MAT.EMPTY) this.move(i, below);
        return;
      }
      // Swim — throttled so the fish drifts rather than teleports
      if ((this.frame & 3) !== (x & 3)) return;
      const d = (Math.random() * 5) | 0;
      const ni = this.idx(x + FISH_DX[d], y + FISH_DY[d]);
      if (ni !== -1 && this.grid[ni] === MAT.WATER) this.swap(i, ni);
      return;
    }

    // Flying creatures: slower throttle (every 8 frames ≈ 7.5 Hz, under flicker threshold)
    // with a high chance of hovering in place — gives air-y floating feel instead of zigzag.
    if (m === MAT.BUTTERFLY || m === MAT.BEE || m === MAT.FIREFLY) {
      if ((this.frame & 7) !== (x & 7)) return;
      if (Math.random() < 0.35) return; // hover pause
      const dx = (Math.random() * 3 - 1) | 0;
      const dy = (Math.random() * 3 - 1) | 0;
      if (dx === 0 && dy === 0) return;
      const ni = this.idx(x + dx, y + dy);
      if (ni !== -1 && this.grid[ni] === MAT.EMPTY) this.move(i, ni);
      return;
    }

    // Ground creatures: throttled slow movement
    if ((this.frame & 3) !== (x & 3)) return;

    // Ground creatures: walk on surfaces (ladybug, bunny, unicorn)
    if (m === MAT.LADYBUG || m === MAT.BUNNY || m === MAT.UNICORN) {
      const below = this.idx(x, y + 1);
      if (below === -1 || this.grid[below] === MAT.EMPTY) {
        // Fall
        if (below !== -1) this.move(i, below);
        return;
      }
      // On ground — try side step
      const dir = Math.random() < 0.5 ? -1 : 1;
      const side = this.idx(x + dir, y);
      const sideUp = this.idx(x + dir, y - 1);
      const sideDown = this.idx(x + dir, y + 1);
      if (side !== -1 && this.grid[side] === MAT.EMPTY && sideDown !== -1 && this.grid[sideDown] !== MAT.EMPTY) {
        // Leave rainbow trail if unicorn
        if (m === MAT.UNICORN && Math.random() < 0.3) {
          this.grid[i] = MAT.RAINBOW;
          this.life[i] = MAT_LIFE[MAT.RAINBOW] + 10;
          this.setIdx(side, MAT.UNICORN);
          this.updated[side] = this.frame; // prevent double-step this frame
          this.events.unicornTrail = 1;
          return;
        }
        // Bunny hops sometimes
        if (m === MAT.BUNNY && Math.random() < 0.3 && sideUp !== -1 && this.grid[sideUp] === MAT.EMPTY) {
          this.move(i, sideUp);
        } else {
          this.move(i, side);
        }
      }
    }
  }

  // Generic explosion — damage area, leave embers & smoke, ignite flammables
  explode(x, y, radius, intense) {
    const w = this.width;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dd = dx * dx + dy * dy;
        if (dd > radius * radius) continue;
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = this.grid[ni];
        if (nm === MAT.STONE || nm === MAT.OBSIDIAN || nm === MAT.METAL ||
            nm === MAT.DIAMOND || nm === MAT.GOLD) continue;
        if (dd < radius * 0.4) {
          this.setIdx(ni, MAT.FIRE);
        } else if (dd < radius * 0.7) {
          if (Math.random() < 0.5) this.setIdx(ni, MAT.FIRE);
          else this.setIdx(ni, MAT.EMBER);
        } else {
          if (Math.random() < 0.4) this.setIdx(ni, MAT.SMOKE);
          else if (MAT_FLAMMABLE[nm] && Math.random() < 0.6) this.setIdx(ni, MAT.FIRE);
          else if (nm !== MAT.EMPTY && intense && Math.random() < 0.3) this.setIdx(ni, MAT.EMPTY);
        }
      }
    }
    this.events.explosions++;
  }

  // Nuclear explosion — massive radius, leaves radiation
  explodeNuclear(x, y) {
    const radius = 14;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dd = dx * dx + dy * dy;
        if (dd > radius * radius) continue;
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = this.grid[ni];
        if (nm === MAT.STONE || nm === MAT.DIAMOND || nm === MAT.OBSIDIAN) {
          if (dd < radius * 2) this.setIdx(ni, MAT.LAVA);
          continue;
        }
        if (dd < radius * 2) this.setIdx(ni, MAT.PLASMA);
        else if (dd < radius * 4) this.setIdx(ni, MAT.FIRE);
        else if (dd < radius * 8) {
          if (Math.random() < 0.5) this.setIdx(ni, MAT.SMOKE);
          else this.setIdx(ni, MAT.EMPTY);
        } else {
          if (Math.random() < 0.3) this.setIdx(ni, MAT.RADIATION);
          else if (MAT_FLAMMABLE[nm] && Math.random() < 0.5) this.setIdx(ni, MAT.FIRE);
        }
      }
    }
    this.events.explosions++;
    this.events.zap++;
  }

  // Rainbow explosion — all sparkles no destruction beyond radius
  explodeRainbow(x, y, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dd = dx * dx + dy * dy;
        if (dd > radius * radius) continue;
        const ni = this.idx(x + dx, y + dy);
        if (ni === -1) continue;
        const nm = this.grid[ni];
        if (nm === MAT.STONE || nm === MAT.METAL || nm === MAT.GOLD ||
            nm === MAT.DIAMOND || nm === MAT.OBSIDIAN) continue;
        if (dd < radius * 0.5) this.setIdx(ni, MAT.RAINBOW);
        else if (Math.random() < 0.7) this.setIdx(ni, MAT.SPARK);
        else if (Math.random() < 0.5) this.setIdx(ni, MAT.GLITTER);
      }
    }
    this.events.explosions++;
  }
}
