import { Simulation } from './core/Simulation.js';
import { Renderer } from './render/Renderer.js';
import { UI } from './ui/UI.js';
import { SoundEngine } from './audio/SoundEngine.js';
import { MAT, COLORS, CATEGORIES, PROPS } from './core/Materials.js';
import { QUESTS, VISIBLE_QUESTS, DAILY_QUESTS, getTodaysDailyIndex, getTodaysDateKey } from './core/Quests.js';
import { RECIPES } from './core/Recipes.js';
import { t } from './i18n/ru.js';

export class Game {
  constructor(lang) {
    this.lang = lang;
    this.canvas = document.getElementById('game-canvas');
    this.ui = new UI(lang);
    this.cellSize = 3;

    const rect = this.ui.getCanvasRect();
    this.canvasRect = rect;
    const gridW = Math.floor(rect.width / this.cellSize);
    const gridH = Math.floor(rect.height / this.cellSize);

    this.sim = new Simulation(gridW, gridH);
    this.positionCanvas();
    this.renderer = new Renderer(this.canvas, this.sim);
    this.sound = new SoundEngine();

    this.drawing = false;
    this.lastDrawPos = null;
    this.shapeStart = null; // grid coords where shape drawing started
    this.shapeCurrent = null;
    this.frame = 0;
    this.weather = 'none';

    // Fired on the first genuine GAMEPLAY gesture (drawing, weather, lightning,
    // loading a world). main.js uses it to start/resume the Poki gameplay session.
    // Deliberately NOT fired for menus / pause / settings / tool-picking.
    this.onGameplayAction = null;

    this.level = 1;
    this.xp = 0;
    this.loadLevel();

    this.questProgress = {};
    this.completedQuests = new Set();
    this.loadQuests();

    this.discoveredRecipes = new Set();
    this.loadRecipes();

    this.daily = { date: '', progress: 0, completed: false };
    this.loadDaily();

    this.cursorX = -1;
    this.cursorY = -1;
    this.showCursor = false;

    this.setupInput();
    this.setupUI();
    this.setupResize();
    this.setupKeyboard();
    this.createStartHint();
  }

  createStartHint() {
    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const text = t(isCoarse ? 'hintTap' : 'hintClick');
    const el = document.createElement('div');
    el.id = 'start-hint';
    el.textContent = text;
    document.body.appendChild(el);
    this.startHintEl = el;
  }

  removeStartHint() {
    if (!this.startHintEl) return;
    const el = this.startHintEl;
    this.startHintEl = null;
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 300);
  }

  positionCanvas() {
    const rect = this.ui.getCanvasRect();
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = rect.top + 'px';
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.canvasRect = rect;
  }

  setupInput() {
    const canvas = this.canvas;

    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.updateCursor(e);
      // Input lock: while the game is frozen (paused / tab hidden / a live ad) the
      // canvas must be inert. This is what guarantees the player can never paint —
      // i.e. interact with the game — while Poki's gameplay session is stopped.
      if (this.sim.paused) return;
      // A canvas press is the start/continuation of active play → open (or keep)
      // the Poki gameplay session BEFORE the first material is placed.
      if (this.onGameplayAction) this.onGameplayAction();
      this.drawing = true;
      if (this.ui.shape === 'free') {
        this.drawAt(e);
      } else {
        // Record shape start
        this.shapeStart = [this.cursorX, this.cursorY];
        this.shapeCurrent = [this.cursorX, this.cursorY];
      }
    });

    canvas.addEventListener('pointermove', (e) => {
      e.preventDefault();
      this.updateCursor(e);
      if (this.drawing && !this.sim.paused) {
        if (this.ui.shape === 'free') this.drawAt(e);
        else if (this.shapeStart) this.shapeCurrent = [this.cursorX, this.cursorY];
      }
    });

    const stopDraw = (e) => {
      // Don't commit a shape if the game froze mid-drag (pause / hidden / ad) —
      // input stays inert while stopped, consistent with the pointerdown lock.
      if (this.drawing && !this.sim.paused && this.ui.shape !== 'free' && this.shapeStart && this.shapeCurrent) {
        this.commitShape();
      }
      this.drawing = false;
      this.lastDrawPos = null;
      this.shapeStart = null;
      this.shapeCurrent = null;
      if (e && e.type === 'pointerleave') this.showCursor = false;
    };
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointercancel', stopDraw);
    canvas.addEventListener('pointerleave', stopDraw);

    canvas.addEventListener('pointerenter', () => { this.showCursor = true; });
  }

  updateCursor(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    [this.cursorX, this.cursorY] = this.renderer.cssToGrid(cssX, cssY);
    this.showCursor = true;
  }

  drawAt(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    const [gx, gy] = this.renderer.cssToGrid(cssX, cssY);
    const mat = this.ui.selectedMat;
    const brushRadius = Math.max(0, Math.floor(this.ui.brushSize / 2));

    if (this.lastDrawPos) {
      const [lx, ly] = this.lastDrawPos;
      const dx = gx - lx;
      const dy = gy - ly;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        const steps = Math.ceil(dist);
        for (let s = 0; s < steps; s++) {
          const t = s / steps;
          const ix = Math.round(lx + dx * t);
          const iy = Math.round(ly + dy * t);
          this.sim.paint(ix, iy, mat, brushRadius);
        }
      }
    }

    this.sim.paint(gx, gy, mat, brushRadius);
    this.lastDrawPos = [gx, gy];
    if (mat !== MAT.EMPTY) {
      this.addXP(1);
      this.trackQuestPlace(mat, 1);
      this.removeStartHint();
    }
  }

  commitShape() {
    const [sx, sy] = this.shapeStart;
    const [cx, cy] = this.shapeCurrent;
    const mat = this.ui.selectedMat;
    const brushRadius = Math.max(0, Math.floor(this.ui.brushSize / 2));
    const shape = this.ui.shape;
    let placed = 0;

    if (shape === 'line') {
      placed = this.paintLine(sx, sy, cx, cy, mat, brushRadius);
    } else if (shape === 'rect') {
      placed = this.paintRect(sx, sy, cx, cy, mat, brushRadius);
    } else if (shape === 'circle') {
      placed = this.paintCircle(sx, sy, cx, cy, mat, brushRadius);
    }
    if (mat !== MAT.EMPTY && placed > 0) {
      this.addXP(Math.min(20, Math.floor(placed / 4)));
      this.trackQuestPlace(mat, placed);
      this.removeStartHint();
    }
  }

  paintLine(x0, y0, x1, y1, mat, r) {
    // Bresenham-ish: interpolate along longest axis
    const dx = x1 - x0, dy = y1 - y0;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
    let count = 0;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const ix = Math.round(x0 + dx * t);
      const iy = Math.round(y0 + dy * t);
      this.sim.paint(ix, iy, mat, r);
      count++;
    }
    return count;
  }

  paintRect(x0, y0, x1, y1, mat, r) {
    const xs = Math.min(x0, x1), xe = Math.max(x0, x1);
    const ys = Math.min(y0, y1), ye = Math.max(y0, y1);
    let count = 0;
    // Top + bottom edges
    for (let x = xs; x <= xe; x++) {
      this.sim.paint(x, ys, mat, r);
      this.sim.paint(x, ye, mat, r);
      count += 2;
    }
    // Side edges
    for (let y = ys + 1; y < ye; y++) {
      this.sim.paint(xs, y, mat, r);
      this.sim.paint(xe, y, mat, r);
      count += 2;
    }
    return count;
  }

  paintCircle(x0, y0, x1, y1, mat, r) {
    const dx = x1 - x0, dy = y1 - y0;
    const rad = Math.round(Math.sqrt(dx * dx + dy * dy));
    if (rad < 1) { this.sim.paint(x0, y0, mat, r); return 1; }
    let count = 0;
    // Midpoint circle algorithm (outline)
    let x = rad, y = 0;
    let err = 0;
    while (x >= y) {
      const pts = [
        [x0 + x, y0 + y], [x0 + y, y0 + x],
        [x0 - y, y0 + x], [x0 - x, y0 + y],
        [x0 - x, y0 - y], [x0 - y, y0 - x],
        [x0 + y, y0 - x], [x0 + x, y0 - y]
      ];
      for (const [px, py] of pts) {
        this.sim.paint(px, py, mat, r);
        count++;
      }
      y++;
      err += 1 + 2 * y;
      if (2 * (err - x) + 1 > 0) { x--; err += 1 - 2 * x; }
    }
    return count;
  }

  setupUI() {
    this.ui.onClear = () => {
      if (this.sim.paused) return;                          // inert while frozen (paused / hidden / ad)
      if (this.onGameplayAction) this.onGameplayAction();   // wiping the world is a sim mutation → gameplay
      this.sim.reset();
      if (this.onClear) this.onClear();
    };
    // onPause is owned by main.js (it drives the Poki gameplayStop/commercialBreak
    // state machine and re-derives sim.paused via syncGameplay), so we deliberately
    // do NOT wire ui.onPause here — it would just be clobbered.
    this.ui.onWeather = (type) => {
      this.weather = type;
      if (type !== 'none') {
        this.trackQuestAction(type, 1);
        if (this.onGameplayAction) this.onGameplayAction(); // weather affects the world → gameplay
      }
    };
    this.ui.onLightning = () => {
      if (this.sim.paused) return;                          // inert while frozen (paused / hidden / ad)
      if (this.onGameplayAction) this.onGameplayAction();
      this.sim.lightning();
      this.trackQuestAction('lightning', 1);
    };
    this.ui.onSoundToggle = () => this.sound.toggle();
    this.ui.onSave = (slot) => this.saveToSlot(slot);
    this.ui.onLoad = (slot) => this.loadFromSlot(slot);
    this.ui.onShowQuests = () => {
      this.ui.showQuestPanel(this.getActiveQuests(), this.questProgress, this.completedQuests,
        this.getTodaysDaily(), this.daily);
    };
    this.ui.onShowRecipes = () => {
      this.ui.showRecipeBook(RECIPES, this.discoveredRecipes);
    };
  }

  checkRecipeDiscoveries() {
    const ev = this.sim.events;
    for (const r of RECIPES) {
      if (!this.discoveredRecipes.has(r.id) && ev[r.event]) {
        this.discoveredRecipes.add(r.id);
        this.addXP(r.xp);
        const name = r.name[this.lang] || r.name.en;
        this.ui.showRecipeDiscovered(name, r.xp, r.icon);
        this.saveRecipes();
      }
    }
  }

  loadRecipes() {
    try {
      const raw = localStorage.getItem('ms_recipes');
      if (raw) JSON.parse(raw).forEach(id => this.discoveredRecipes.add(id));
    } catch (e) {}
  }

  saveRecipes() {
    try {
      localStorage.setItem('ms_recipes', JSON.stringify([...this.discoveredRecipes]));
    } catch (e) {}
  }

  getRecipeSaveData() {
    return [...this.discoveredRecipes];
  }

  loadRecipesFromCloud(data) {
    if (!data || !Array.isArray(data)) return;
    data.forEach(id => this.discoveredRecipes.add(id));
    this.saveRecipes();
  }

  getTodaysDaily() {
    return DAILY_QUESTS[getTodaysDailyIndex()];
  }

  loadDaily() {
    try {
      const raw = localStorage.getItem('ms_daily');
      if (raw) this.daily = JSON.parse(raw);
    } catch (e) {}
    // Reset if date changed
    const today = getTodaysDateKey();
    if (this.daily.date !== today) {
      this.daily = { date: today, progress: 0, completed: false };
      this.saveDaily();
      return;
    }
    // If progress already meets target but flag not set (e.g. cloud-merge edge case),
    // silently mark completed (XP assumed already awarded on the device that triggered it).
    const q = this.getTodaysDaily();
    if (!this.daily.completed && this.daily.progress >= q.target) {
      this.daily.completed = true;
      this.saveDaily();
    }
  }

  saveDaily() {
    try {
      localStorage.setItem('ms_daily', JSON.stringify(this.daily));
    } catch (e) {}
  }

  trackDailyProgress(kind, key, amount) {
    if (this.daily.completed) return;
    const q = this.getTodaysDaily();
    if (q.type !== kind) return;
    if (kind === 'place' && q.mat !== key) return;
    if (kind === 'event' && q.event !== key) return;
    if (kind === 'action' && q.action !== key) return;
    this.daily.progress += amount;
    if (this.daily.progress >= q.target && !this.daily.completed) {
      this.daily.completed = true;
      this.addXP(q.xp);
      const name = q.name[this.lang] || q.name.en;
      this.ui.showQuestComplete(`⭐ ${name}`, q.xp);
    }
    this.saveDaily();
  }

  saveToSlot(slot) {
    const { width, height, grid } = this.sim;
    const rle = [];
    let i = 0;
    const len = width * height;
    while (i < len) {
      const val = grid[i];
      let count = 1;
      while (i + count < len && grid[i + count] === val && count < 255) count++;
      rle.push(val, count);
      i += count;
    }
    const bytes = new Uint8Array(rle);
    let binary = '';
    for (let j = 0; j < bytes.length; j += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(j, j + 8192));
    }
    const data = { ts: Date.now(), w: width, h: height, rle: btoa(binary) };
    try { localStorage.setItem('ms_save_' + slot, JSON.stringify(data)); } catch (e) {}
  }

  loadFromSlot(slot) {
    try {
      const raw = localStorage.getItem('ms_save_' + slot);
      if (!raw) return;
      // Loading a world means the player is entering active play with it → mark the
      // gameplay gesture (the actual gameplayStart fires when the menu closes).
      if (this.onGameplayAction) this.onGameplayAction();
      const data = JSON.parse(raw);
      const bytes = Uint8Array.from(atob(data.rle), c => c.charCodeAt(0));
      const { w, h } = data;
      if (w !== this.sim.width || h !== this.sim.height) {
        this.sim.resize(w, h);
        this.renderer.resize();
      }
      const grid = this.sim.grid;
      let pos = 0;
      for (let i = 0; i < bytes.length; i += 2) {
        const val = bytes[i];
        const cnt = bytes[i + 1];
        for (let j = 0; j < cnt && pos < grid.length; j++) grid[pos++] = val;
      }
      this.sim.particleCount = 0;
      for (let i = 0; i < grid.length; i++) {
        const m = grid[i];
        if (m !== MAT.EMPTY) {
          this.sim.particleCount++;
          if (PROPS[m].life > 0) {
            this.sim.life[i] = PROPS[m].life + Math.floor(Math.random() * 10);
          }
        }
      }
    } catch (e) {}
  }

  xpForLevel(lvl) { return lvl * 80; }

  addXP(amount) {
    this.xp += amount;
    let needed = this.xpForLevel(this.level);
    while (this.xp >= needed) {
      this.xp -= needed;
      this.level++;
      needed = this.xpForLevel(this.level);
    }
  }

  loadLevel() {
    try {
      const raw = localStorage.getItem('ms_level');
      if (raw) {
        const d = JSON.parse(raw);
        this.level = d.level || 1;
        this.xp = d.xp || 0;
      }
    } catch (e) {}
    this.ui.updateLevel(this.level, this.xp / this.xpForLevel(this.level));
  }

  saveLevel() {
    try {
      localStorage.setItem('ms_level', JSON.stringify({ level: this.level, xp: this.xp }));
    } catch (e) {}
  }

  // Quest system
  getActiveQuests() {
    const active = [];
    for (const q of QUESTS) {
      if (this.completedQuests.has(q.id)) continue;
      active.push(q);
      if (active.length >= VISIBLE_QUESTS) break;
    }
    return active;
  }

  trackQuestPlace(mat, amount) {
    for (const q of this.getActiveQuests()) {
      if (q.type === 'place' && q.mat === mat) {
        this.questProgress[q.id] = (this.questProgress[q.id] || 0) + amount;
        this.checkQuestComplete(q);
      }
    }
    this.trackDailyProgress('place', mat, amount);
  }

  trackQuestEvent(key, amount) {
    for (const q of this.getActiveQuests()) {
      if (q.type === 'event' && q.event === key) {
        this.questProgress[q.id] = (this.questProgress[q.id] || 0) + amount;
        this.checkQuestComplete(q);
      }
    }
    this.trackDailyProgress('event', key, amount);
  }

  trackQuestAction(key, amount) {
    for (const q of this.getActiveQuests()) {
      if (q.type === 'action' && q.action === key) {
        this.questProgress[q.id] = (this.questProgress[q.id] || 0) + amount;
        this.checkQuestComplete(q);
      }
    }
    this.trackDailyProgress('action', key, amount);
  }

  checkQuestComplete(q) {
    const prog = this.questProgress[q.id] || 0;
    if (prog >= q.target && !this.completedQuests.has(q.id)) {
      this.completedQuests.add(q.id);
      this.addXP(q.xp);
      this.saveQuests();
      const l = this.lang;
      const name = q.name[l] || q.name.en;
      this.ui.showQuestComplete(name, q.xp);
    }
  }

  processSimEvents() {
    const ev = this.sim.events;
    if (ev.explosions > 0) this.trackQuestEvent('explosions', ev.explosions);
    if (ev.obsidian > 0) this.trackQuestEvent('obsidian', ev.obsidian);
    if (ev.steamCreated > 0) this.trackQuestEvent('steamCreated', ev.steamCreated);
    if (ev.potionTransform > 0) this.trackQuestEvent('potionTransform', ev.potionTransform);
    if (ev.plantGrow > 0) this.trackQuestEvent('plantGrow', ev.plantGrow);
    if (ev.fireSpread > 0) this.trackQuestEvent('fireSpread', ev.fireSpread);
    if (ev.iceCreated > 0) this.trackQuestEvent('iceCreated', ev.iceCreated);
    if (ev.sparkle > 0) this.trackQuestEvent('sparkle', ev.sparkle);
    if (ev.rainbowCreated > 0) this.trackQuestEvent('rainbowCreated', ev.rainbowCreated);
  }

  loadQuests() {
    try {
      const raw = localStorage.getItem('ms_quests');
      if (raw) {
        const d = JSON.parse(raw);
        this.questProgress = d.progress || {};
        (d.completed || []).forEach(id => this.completedQuests.add(id));
      }
    } catch (e) {}
  }

  saveQuests() {
    try {
      localStorage.setItem('ms_quests', JSON.stringify({
        progress: this.questProgress,
        completed: [...this.completedQuests]
      }));
    } catch (e) {}
  }

  getQuestSaveData() {
    return { progress: this.questProgress, completed: [...this.completedQuests] };
  }

  loadQuestsFromCloud(data) {
    if (!data) return;
    if (data.completed) data.completed.forEach(id => this.completedQuests.add(id));
    if (data.progress) {
      for (const [k, v] of Object.entries(data.progress)) {
        this.questProgress[k] = Math.max(this.questProgress[k] || 0, v);
      }
    }
    this.saveQuests();
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      // While a menu overlay is open, keyboard shortcuts must not drive the game
      // — a category key would otherwise fire a commercialBreak mid-menu, and
      // space would toggle pause behind the panel.
      if (this.ui.isMenuOpen()) {
        if (e.key === ' ') e.preventDefault();
        return;
      }
      const key = e.key;
      const brushMap = { 'q': 1, 'w': 3, 'e': 5, 'r': 10, 't': 20 };
      if (brushMap[key]) { this.ui.selectBrush(brushMap[key]); return; }
      let catIdx = -1;
      if (key === '0') catIdx = 9;
      else if (key >= '1' && key <= '9') catIdx = parseInt(key) - 1;
      if (catIdx >= 0 && catIdx < CATEGORIES.length) {
        this.ui.selectCategory(CATEGORIES[catIdx].id);
        return;
      }
      if (key === ' ') {
        e.preventDefault();
        // Route through the UI so pause/resume fires the same SDK events and
        // commercialBreak as the on-screen pause button.
        this.ui.togglePause();
        return;
      }
      if (key === 'x') this.ui.selectMaterial(MAT.EMPTY);
    });
  }

  setupResize() {
    let t = 0;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const rect = this.ui.getCanvasRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        this.positionCanvas();
        this.renderer.resize(rect.width, rect.height);
      }, 100);
    });
  }

  start() {
    const loop = () => {
      // While frozen (pause / tab hidden / a live ad — main.js sets sim.paused for
      // all three) we must NOT advance the sim or consume its event counters.
      // Simulation.update() early-returns BEFORE zeroing sim.events when paused, so
      // the last unpaused frame's counts persist; consuming them every frame would
      // inflate XP / quest / daily progress ~60x/sec — including while a commercial
      // or rewarded ad is on screen (Poki: no gameplay activity during ads).
      // Rendering + cursor keep running so the frozen frame stays clean.
      if (!this.sim.paused) {
        if (this.weather !== 'none') this.sim.spawnWeather(this.weather);
        this.sim.update();
        this.frame++;

        this.sound.processEvents(this.sim.events);
        if (this.sim.events.xp > 0) this.addXP(this.sim.events.xp);
        this.processSimEvents();
        this.checkRecipeDiscoveries();

        if (this.frame % 30 === 0) {
          this.ui.updateLevel(this.level, this.xp / this.xpForLevel(this.level));
        }
        if (this.frame % 300 === 0) {
          this.saveLevel();
          this.saveQuests();
        }
        if (this.frame % 3600 === 0 && this.frame > 0) {
          if (this.onLevelSave) this.onLevelSave();
        }
      }

      this.renderer.render(this.frame);
      if (this.showCursor && this.cursorX >= 0) this.drawCursor();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  drawCursor() {
    const ctx = this.renderer.ctx;
    const r = Math.max(0, Math.floor(this.ui.brushSize / 2));
    const mat = this.ui.selectedMat;
    const cellW = this.renderer.cssW / this.sim.width;
    const cellH = this.renderer.cssH / this.sim.height;
    const cx = this.cursorX * cellW + cellW / 2;
    const cy = this.cursorY * cellH + cellH / 2;
    const rPx = (r + 0.5) * cellW;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 220, 250, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (mat > 0) {
      const c = COLORS[mat][0];
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.45)`;
      ctx.fill();
    }
    ctx.restore();

    // Shape preview while drawing
    if (this.drawing && this.ui.shape !== 'free' && this.shapeStart && this.shapeCurrent) {
      const [sx, sy] = this.shapeStart;
      const [ex, ey] = this.shapeCurrent;
      const sPxX = sx * cellW + cellW / 2;
      const sPxY = sy * cellH + cellH / 2;
      const ePxX = ex * cellW + cellW / 2;
      const ePxY = ey * cellH + cellH / 2;
      ctx.save();
      ctx.strokeStyle = mat > 0
        ? `rgba(${COLORS[mat][0][0]},${COLORS[mat][0][1]},${COLORS[mat][0][2]},0.85)`
        : 'rgba(255, 220, 250, 0.7)';
      ctx.lineWidth = Math.max(1, cellW);
      ctx.setLineDash([cellW * 2, cellW * 2]);
      ctx.beginPath();
      if (this.ui.shape === 'line') {
        ctx.moveTo(sPxX, sPxY);
        ctx.lineTo(ePxX, ePxY);
      } else if (this.ui.shape === 'rect') {
        const xs = Math.min(sPxX, ePxX), xe = Math.max(sPxX, ePxX);
        const ys = Math.min(sPxY, ePxY), ye = Math.max(sPxY, ePxY);
        ctx.rect(xs, ys, xe - xs, ye - ys);
      } else if (this.ui.shape === 'circle') {
        const dx = ex - sx, dy = ey - sy;
        const radius = Math.sqrt(dx * dx + dy * dy) * cellW;
        ctx.arc(sPxX, sPxY, radius, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();
    }
  }
}
