import { MAT, COLORS, CATEGORIES, MAT_NAMES, CAT_NAMES, LOCKED_MATS } from '../core/Materials.js';

export class UI {
  constructor(lang) {
    this.lang = lang || 'ru';
    this.selectedMat = MAT.SAND;
    this.brushSize = 3;
    this.shape = 'free'; // 'free' | 'line' | 'rect' | 'circle'
    this.currentCat = 'basic';
    this.onClear = null;
    this.onPause = null;
    this.onRequestUnlock = null;
    this.onWeather = null;
    this.onLightning = null;
    this.onSoundToggle = null;
    this.onSave = null;
    this.onLoad = null;
    this.onRequestSlotUnlock = null;
    this.onShowQuests = null;
    this.onShowRecipes = null;
    this.onCategoryChange = null; // fired when the player switches element category
    this.onMenuOpen = null;       // fired when an overlay menu is shown
    this.onMenuClose = null;      // fired when an overlay menu is dismissed
    this.weather = 'none';
    this.soundEnabled = true;
    this.isPaused = false;
    this.root = document.getElementById('ui-root');

    this.unlockedMats = new Set();
    this.unlockedSlots = new Set([1, 2]);
    this.loadUnlocks();

    this.build();
  }

  loadUnlocks() {
    try {
      const raw = localStorage.getItem('ms_unlocked');
      if (raw) JSON.parse(raw).forEach(id => this.unlockedMats.add(id));
    } catch (e) {}
    try {
      const raw = localStorage.getItem('ms_unlocked_slots');
      if (raw) JSON.parse(raw).forEach(id => this.unlockedSlots.add(id));
    } catch (e) {}
  }

  saveUnlocks() {
    try {
      localStorage.setItem('ms_unlocked', JSON.stringify([...this.unlockedMats]));
      localStorage.setItem('ms_unlocked_slots', JSON.stringify([...this.unlockedSlots]));
    } catch (e) {}
  }

  setUnlockedFromCloud(arr, slots) {
    let changed = false;
    if (arr && arr.length) { arr.forEach(id => this.unlockedMats.add(id)); changed = true; }
    if (slots && slots.length) { slots.forEach(id => this.unlockedSlots.add(id)); changed = true; }
    if (changed) { this.saveUnlocks(); this.renderMaterials(); }
  }

  getUnlockedArray() { return [...this.unlockedMats]; }
  getUnlockedSlotsArray() { return [...this.unlockedSlots]; }

  isSlotLocked(slot) { return !this.unlockedSlots.has(slot); }
  unlockSlot(slot) { this.unlockedSlots.add(slot); this.saveUnlocks(); }

  isLocked(matId) { return LOCKED_MATS.has(matId) && !this.unlockedMats.has(matId); }
  unlockMaterial(matId) {
    this.unlockedMats.add(matId);
    this.saveUnlocks();
    this.renderMaterials();
  }

  // Prominent "watch video" icon — an unmistakable 🎬 clapperboard (striped hinged
  // top + slate + a small play triangle) shown on EVERY rewardedBreak() trigger.
  // Poki review requires a clearly prominent clapper marker, not a generic play
  // arrow, so the diagonal stripes are bold and high-contrast.
  videoIcon(size = 18) {
    return `<svg class="video-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">`
      + `<rect x="2.2" y="8.8" width="19.6" height="12.4" rx="2.4" fill="currentColor"/>`
      + `<path d="M2.6 9 3.5 5.5a1.4 1.4 0 0 1 1.72-.99l13.9 3.72a1.4 1.4 0 0 1 .99 1.72l-.24 1.01H2.6Z" fill="currentColor"/>`
      + `<path d="M6.5 5.15 7.5 8.6M10.5 6.2 11.5 8.6M14.5 7.3 15.5 8.6" stroke="rgba(38,8,46,0.7)" stroke-width="1.7" stroke-linecap="round"/>`
      + `<path d="M9.9 12.4v6l5.1-3Z" fill="rgba(38,8,46,0.62)"/>`
      + `</svg>`;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.updatePauseButton();
    if (this.onPause) this.onPause(this.isPaused);
  }

  // Reflect the EFFECTIVE frozen state on the pause button. Driven by the gameplay
  // state machine (syncGameplay) so the icon ALWAYS matches whether the materials
  // are really paused — whether that pause came from the button, a hidden tab, or
  // an ad. Poki review flagged the button being left "unchanged" while the sim was
  // paused; routing every freeze/resume through here makes that impossible.
  setPausedVisual(frozen) {
    if (this.isPaused === frozen) return;
    this.isPaused = frozen;
    this.updatePauseButton();
  }

  // True while any overlay menu (Quests / Discoveries / My Worlds / unlock) is on
  // screen. Used to stop keyboard shortcuts from driving the game — and firing a
  // commercialBreak via category switch — while the player sits inside a menu.
  isMenuOpen() {
    return !!this.root.querySelector('.unlock-popup');
  }

  build() {
    const l = this.lang;
    const catNames = CAT_NAMES[l] || CAT_NAMES.en;

    this.root.innerHTML = `
      <div class="top-bar">
        <div class="level-info">
          <span class="level-badge" id="level-badge">${l === 'ru' ? 'Ур' : 'Lv'}.1</span>
          <div class="level-bar">
            <div class="level-bar-fill" id="level-fill"></div>
          </div>
        </div>
        <div class="top-controls">
          <button class="btn-icon btn-sm" id="btn-rain" title="${l === 'ru' ? 'Дождик' : 'Rain'}">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2C5.5 2 3.5 4 3.5 6.5c-1.5.5-2.5 2-2.5 3.5 0 2 1.5 3 3 3h8c2 0 3.5-1.5 3.5-3.5S14 6 12 5.5C11.5 3.5 10 2 8 2z" fill="currentColor" opacity="0.7"/><path d="M5 14v2M8 13v2M11 14v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-icon btn-sm" id="btn-snow" title="${l === 'ru' ? 'Снежок' : 'Snow'}">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-icon btn-sm" id="btn-lightning" title="${l === 'ru' ? 'Молния' : 'Lightning'}">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M9 1L4 9h4l-1 6 5-8H8l1-6z" fill="currentColor"/></svg>
          </button>
          <span class="control-divider"></span>
          <button class="btn-icon btn-sm" id="btn-sound" title="${l === 'ru' ? 'Звук' : 'Sound'}">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 5.5h2.5L8 2v12L4.5 10.5H2a1 1 0 01-1-1v-3a1 1 0 011-1z" fill="currentColor"/><path d="M11 5.5c1 1 1 4 0 5M13 3.5c2 2 2 7 0 9" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" class="sound-waves"/></svg>
          </button>
          <button class="btn-icon btn-sm" id="btn-quests" title="${l === 'ru' ? 'Задания' : 'Quests'}">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M5 6h6M5 8.5h6M5 11h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="3.5" r="1.8" fill="currentColor" opacity="0.55"/></svg>
          </button>
          <button class="btn-icon btn-sm" id="btn-recipes" title="${l === 'ru' ? 'Открытия' : 'Recipes'}">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 2h7a3 3 0 013 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V2z" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M3 2v12M5 5h5M5 7.5h5M5 10h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-icon btn-sm" id="btn-save" title="${l === 'ru' ? 'Сохранить' : 'Save'}">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 2h9l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2z" stroke="currentColor" stroke-width="1.4" fill="none"/><rect x="5" y="1.5" width="5" height="4" rx="0.5" fill="currentColor" opacity="0.55"/><rect x="4" y="9" width="8" height="5" rx="1" fill="currentColor" opacity="0.45"/></svg>
          </button>
          <span class="control-divider"></span>
          <button class="btn-icon" id="btn-pause" title="${l === 'ru' ? 'Пауза' : 'Pause'}">
            <svg width="20" height="20" viewBox="0 0 20 20"><rect x="5" y="3" width="3.5" height="14" rx="1" fill="currentColor"/><rect x="11.5" y="3" width="3.5" height="14" rx="1" fill="currentColor"/></svg>
          </button>
          <button class="btn-icon" id="btn-clear" title="${l === 'ru' ? 'Очистить' : 'Clear'}">
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 6h10l-1 11H6L5 6zm3-3h4v2H8V3zm-3 3h10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
      <div class="bottom-panel">
        <div class="categories scrollable-container scroll-x" id="categories"></div>
        <div class="materials scrollable-container scroll-x" id="materials"></div>
        <div class="brush-controls">
          <div class="shape-group" id="shape-group">
            <button class="shape-btn active" data-shape="free" title="${l === 'ru' ? 'Свободно' : 'Freehand'}">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 13c2-2 4-6 6-6s4 4 6 2" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
            </button>
            <button class="shape-btn" data-shape="line" title="${l === 'ru' ? 'Линия' : 'Line'}">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 13L13 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            </button>
            <button class="shape-btn" data-shape="rect" title="${l === 'ru' ? 'Прямоуг.' : 'Rect'}">
              <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>
            </button>
            <button class="shape-btn" data-shape="circle" title="${l === 'ru' ? 'Круг' : 'Circle'}">
              <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>
            </button>
          </div>
          <div class="brush-sizes" id="brush-sizes"></div>
          <button class="eraser-btn" id="btn-eraser" title="${l === 'ru' ? 'Ластик' : 'Eraser'}">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 16h14M5.5 13l7-7 2.5 2.5-7 7H5.5v-2.5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    `;

    const catContainer = document.getElementById('categories');
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn' + (cat.id === this.currentCat ? ' active' : '');
      btn.dataset.cat = cat.id;
      btn.textContent = catNames[cat.id];
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCategory(cat.id);
      });
      catContainer.appendChild(btn);
    });

    this.renderMaterials();

    // Convert vertical wheel to horizontal scroll on the category & material rows
    // so desktop users (no trackpad) can reach off-screen items. Also toggle
    // .can-scroll-left / .can-scroll-right so the CSS fade affordances only
    // appear on the side with hidden content.
    const matsEl = document.getElementById('materials');
    const updateScrollHints = (el) => {
      const overflow = el.scrollWidth - el.clientWidth;
      el.classList.toggle('can-scroll-left', el.scrollLeft > 1);
      el.classList.toggle('can-scroll-right', overflow > 1 && el.scrollLeft < overflow - 1);
    };
    const wireScrollable = (el) => {
      el.addEventListener('wheel', (e) => {
        if (el.scrollWidth <= el.clientWidth) return;
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (delta === 0) return;
        e.preventDefault();
        el.scrollLeft += delta;
      }, { passive: false });
      el.addEventListener('scroll', () => updateScrollHints(el), { passive: true });
    };
    wireScrollable(catContainer);
    wireScrollable(matsEl);
    // Initial state + on resize
    const refreshScrollHints = () => { updateScrollHints(catContainer); updateScrollHints(matsEl); };
    requestAnimationFrame(refreshScrollHints);
    window.addEventListener('resize', refreshScrollHints);
    this._refreshScrollHints = refreshScrollHints;

    const sizes = [1, 3, 5, 10, 20];
    const sizeContainer = document.getElementById('brush-sizes');
    sizes.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'brush-btn' + (s === this.brushSize ? ' active' : '');
      btn.dataset.size = s;
      btn.textContent = s;
      btn.addEventListener('click', (e) => { e.stopPropagation(); this.selectBrush(s); });
      sizeContainer.appendChild(btn);
    });

    document.getElementById('btn-eraser').addEventListener('click', (e) => {
      e.stopPropagation(); this.selectMaterial(MAT.EMPTY);
    });

    // Shape buttons
    document.querySelectorAll('.shape-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectShape(b.dataset.shape);
      });
    });

    document.getElementById('btn-pause').addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    document.getElementById('btn-clear').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.onClear) this.onClear();
    });

    document.getElementById('btn-rain').addEventListener('click', (e) => {
      e.stopPropagation();
      this.weather = this.weather === 'rain' ? 'none' : 'rain';
      this.updateWeatherButtons();
      if (this.onWeather) this.onWeather(this.weather);
    });

    document.getElementById('btn-snow').addEventListener('click', (e) => {
      e.stopPropagation();
      this.weather = this.weather === 'snow' ? 'none' : 'snow';
      this.updateWeatherButtons();
      if (this.onWeather) this.onWeather(this.weather);
    });

    document.getElementById('btn-lightning').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.onLightning) this.onLightning();
    });

    document.getElementById('btn-sound').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.onSoundToggle) this.soundEnabled = this.onSoundToggle();
      this.updateSoundButton();
    });

    document.getElementById('btn-quests').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.onShowQuests) this.onShowQuests();
    });

    document.getElementById('btn-recipes').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.onShowRecipes) this.onShowRecipes();
    });

    document.getElementById('btn-save').addEventListener('click', (e) => {
      e.stopPropagation();
      this.showSavePanel();
    });
  }

  updateWeatherButtons() {
    document.getElementById('btn-rain').classList.toggle('active', this.weather === 'rain');
    document.getElementById('btn-snow').classList.toggle('active', this.weather === 'snow');
  }

  updateSoundButton() {
    const btn = document.getElementById('btn-sound');
    btn.classList.toggle('muted', !this.soundEnabled);
  }

  showSavePanel() {
    const old = document.getElementById('save-popup');
    if (old) old.remove();

    if (this.onMenuOpen) this.onMenuOpen();

    const l = this.lang;
    const popup = document.createElement('div');
    popup.id = 'save-popup';
    popup.className = 'unlock-popup';
    popup.innerHTML = `
      <div class="unlock-popup-bg"></div>
      <div class="unlock-popup-card save-card">
        <div class="unlock-popup-title">${l === 'ru' ? 'Мои миры' : 'My Worlds'}</div>
        <div class="save-slots"></div>
        <button class="unlock-popup-btn unlock-popup-cancel" id="save-close">${l === 'ru' ? 'Закрыть' : 'Close'}</button>
      </div>
    `;

    this.root.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('visible'));

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      if (this.onMenuClose) this.onMenuClose();
      popup.classList.remove('visible');
      setTimeout(() => popup.remove(), 200);
    };

    popup.querySelector('.unlock-popup-bg').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    document.getElementById('save-close').addEventListener('click', (e) => { e.stopPropagation(); close(); });

    this.renderSaveSlots(popup, close);
  }

  // Renders (and re-renders) the five world slots inside an already-open save
  // panel. Kept separate so a rewarded slot unlock can refresh the list in
  // place instead of closing and re-opening the whole panel.
  renderSaveSlots(popup, close) {
    const l = this.lang;
    let slotsHtml = '';
    for (let i = 1; i <= 5; i++) {
      const locked = this.isSlotLocked(i);
      const data = this.getSaveSlotInfo(i);
      const hasData = !!data;
      const info = hasData
        ? new Date(data.ts).toLocaleString(l === 'ru' ? 'ru-RU' : 'en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
        : (l === 'ru' ? 'Пусто' : 'Empty');

      if (locked) {
        slotsHtml += `
        <div class="save-slot save-slot-locked">
          <div class="save-slot-info">
            <span class="save-slot-num">${l === 'ru' ? 'Мир' : 'World'} ${i}</span>
            <span class="save-slot-date">${l === 'ru' ? 'Закрыт' : 'Locked'}</span>
          </div>
          <div class="save-slot-actions">
            <button class="save-slot-btn slot-unlock-btn" data-slot="${i}">
              ${this.videoIcon(18)}
              ${l === 'ru' ? 'Открыть' : 'Unlock'}
            </button>
          </div>
        </div>`;
      } else {
        slotsHtml += `
        <div class="save-slot">
          <div class="save-slot-info">
            <span class="save-slot-num">${l === 'ru' ? 'Мир' : 'World'} ${i}</span>
            <span class="save-slot-date">${info}</span>
          </div>
          <div class="save-slot-actions">
            <button class="save-slot-btn save-action" data-slot="${i}">${l === 'ru' ? 'Сохр.' : 'Save'}</button>
            <button class="save-slot-btn load-action" data-slot="${i}" ${hasData ? '' : 'disabled'}>${l === 'ru' ? 'Загр.' : 'Load'}</button>
          </div>
        </div>`;
      }
    }

    const slotsEl = popup.querySelector('.save-slots');
    slotsEl.innerHTML = slotsHtml;

    slotsEl.querySelectorAll('.save-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slot = parseInt(btn.dataset.slot);
        if (this.onSave) this.onSave(slot);
        close();
      });
    });

    slotsEl.querySelectorAll('.load-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slot = parseInt(btn.dataset.slot);
        // Poki: loading a saved world returns the player to gameplay, so the
        // commercialBreak is fired by the menu-close callback below.
        if (this.onLoad) this.onLoad(slot);
        close();
      });
    });

    slotsEl.querySelectorAll('.slot-unlock-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const slot = parseInt(btn.dataset.slot);
        btn.disabled = true;
        btn.innerHTML = `${this.videoIcon(18)} ${l === 'ru' ? 'Загрузка...' : 'Loading...'}`;
        if (this.onRequestSlotUnlock) {
          const ok = await this.onRequestSlotUnlock(slot);
          // Refresh the slots in place; re-opening the panel would fire a
          // spurious menu-close/open (and commercialBreak) on top of the
          // rewarded ad that just played.
          if (ok) { this.unlockSlot(slot); this.renderSaveSlots(popup, close); return; }
        }
        btn.disabled = false;
        btn.innerHTML = `${this.videoIcon(18)} ${l === 'ru' ? 'Открыть' : 'Unlock'}`;
      });
    });
  }

  getSaveSlotInfo(slot) {
    try {
      const raw = localStorage.getItem('ms_save_' + slot);
      if (raw) {
        const data = JSON.parse(raw);
        return { ts: data.ts };
      }
    } catch (e) {}
    return null;
  }

  renderMaterials() {
    const matNames = MAT_NAMES[this.lang] || MAT_NAMES.en;
    const container = document.getElementById('materials');
    container.innerHTML = '';

    const cat = CATEGORIES.find(c => c.id === this.currentCat);
    if (!cat) return;

    cat.materials.forEach(matId => {
      const locked = this.isLocked(matId);
      const btn = document.createElement('button');
      btn.className = 'mat-btn' + (matId === this.selectedMat && !locked ? ' active' : '') +
                      (locked ? ' locked' : '');
      btn.dataset.mat = matId;

      const color = COLORS[matId][0];
      const swatch = document.createElement('span');
      swatch.className = 'mat-swatch';
      if (locked) {
        const gray = Math.round(color[0] * 0.3 + color[1] * 0.59 + color[2] * 0.11);
        swatch.style.background = `rgb(${gray},${gray},${gray})`;
      } else {
        swatch.style.background = `rgb(${color[0]},${color[1]},${color[2]})`;
      }
      const luma = color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114;
      if (luma < 40) swatch.style.border = '1px solid rgba(255,255,255,0.3)';
      if (luma > 220) swatch.style.border = '1px solid rgba(0,0,0,0.15)';

      const name = document.createElement('span');
      name.className = 'mat-name';
      name.textContent = matNames[matId];

      btn.appendChild(swatch);
      btn.appendChild(name);

      if (locked) {
        const adBadge = document.createElement('span');
        adBadge.className = 'mat-ad-badge';
        adBadge.innerHTML = this.videoIcon(16);
        btn.appendChild(adBadge);
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (locked) this.showUnlockPopup(matId);
        else this.selectMaterial(matId);
      });

      container.appendChild(btn);
    });

    // Material list changed — reset scroll and recompute fade affordances.
    container.scrollLeft = 0;
    if (this._refreshScrollHints) requestAnimationFrame(this._refreshScrollHints);
  }

  showUnlockPopup(matId) {
    const old = document.getElementById('unlock-popup');
    if (old) old.remove();

    // Full-screen modal → bracket gameplay with gameplayStop (Poki req. #1).
    if (this.onMenuOpen) this.onMenuOpen();

    const l = this.lang;
    const matNames = MAT_NAMES[l] || MAT_NAMES.en;
    const matName = matNames[matId];
    const color = COLORS[matId][0];

    const popup = document.createElement('div');
    popup.id = 'unlock-popup';
    popup.className = 'unlock-popup';
    popup.innerHTML = `
      <div class="unlock-popup-bg"></div>
      <div class="unlock-popup-card">
        <div class="unlock-popup-swatch" style="background:rgb(${color[0]},${color[1]},${color[2]})"></div>
        <div class="unlock-popup-title">${matName}</div>
        <div class="unlock-popup-desc">
          ${l === 'ru'
            ? 'Посмотри короткое видео и получи этот элемент навсегда!'
            : 'Watch a short video to unlock this element forever!'}
        </div>
        <div class="unlock-popup-buttons">
          <button class="unlock-popup-btn unlock-popup-watch" id="unlock-watch">
            ${this.videoIcon(22)}
            ${l === 'ru' ? 'Смотреть' : 'Watch'}
          </button>
          <button class="unlock-popup-btn unlock-popup-cancel" id="unlock-cancel">
            ${l === 'ru' ? 'Отмена' : 'Cancel'}
          </button>
        </div>
      </div>
    `;

    this.root.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('visible'));

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      // Resume gameplay (gameplayStart) but DON'T fire a commercialBreak — this
      // confirm dialog isn't one of the four ad moments, and the rewarded-video
      // success path would otherwise stack an interstitial onto the reward ad.
      if (this.onMenuClose) this.onMenuClose(false);
      popup.classList.remove('visible');
      setTimeout(() => popup.remove(), 200);
    };

    document.getElementById('unlock-cancel').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    popup.querySelector('.unlock-popup-bg').addEventListener('click', (e) => { e.stopPropagation(); close(); });

    document.getElementById('unlock-watch').addEventListener('click', async (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.innerHTML = `${this.videoIcon(22)} ${l === 'ru' ? 'Загрузка...' : 'Loading...'}`;

      if (this.onRequestUnlock) {
        const ok = await this.onRequestUnlock(matId);
        if (ok) {
          this.unlockMaterial(matId);
          this.selectMaterial(matId);
          close();
          return;
        }
      }
      btn.disabled = false;
      btn.innerHTML = `${this.videoIcon(22)} ${l === 'ru' ? 'Смотреть' : 'Watch'}`;
    });
  }

  selectCategory(catId) {
    const changed = catId !== this.currentCat;
    this.currentCat = catId;
    document.querySelectorAll('.cat-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === catId);
    });
    this.renderMaterials();
    // Poki: fire a commercialBreak when switching between element categories — but
    // never while a menu overlay is open (defensive: the backdrop already blocks
    // clicks and the keyboard path early-returns on isMenuOpen()).
    if (changed && !this.isMenuOpen() && this.onCategoryChange) this.onCategoryChange(catId);
  }

  selectMaterial(matId) {
    this.selectedMat = matId;
    document.querySelectorAll('.mat-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.mat) === matId);
    });
    document.getElementById('btn-eraser').classList.toggle('active', matId === MAT.EMPTY);
  }

  selectBrush(size) {
    this.brushSize = size;
    document.querySelectorAll('.brush-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.size) === size);
    });
  }

  selectShape(shape) {
    this.shape = shape;
    document.querySelectorAll('.shape-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.shape === shape);
    });
  }

  updatePauseButton() {
    const btn = document.getElementById('btn-pause');
    if (this.isPaused) {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20"><polygon points="6,3 17,10 6,17" fill="currentColor"/></svg>';
    } else {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="5" y="3" width="3.5" height="14" rx="1" fill="currentColor"/><rect x="11.5" y="3" width="3.5" height="14" rx="1" fill="currentColor"/></svg>';
    }
  }

  updateLevel(level, progress) {
    const l = this.lang;
    const badge = document.getElementById('level-badge');
    const fill = document.getElementById('level-fill');
    if (badge) badge.textContent = `${l === 'ru' ? 'Ур' : 'Lv'}.${level}`;
    if (fill) fill.style.width = Math.min(100, progress * 100) + '%';
  }

  showQuestPanel(activeQuests, progress, completed, daily, dailyState) {
    const old = document.getElementById('quest-popup');
    if (old) old.remove();

    if (this.onMenuOpen) this.onMenuOpen();

    const l = this.lang;
    const popup = document.createElement('div');
    popup.id = 'quest-popup';
    popup.className = 'unlock-popup';

    // Daily quest block
    let dailyHtml = '';
    if (daily) {
      const name = daily.name[l] || daily.name.en;
      const desc = daily.desc[l] || daily.desc.en;
      const cur = Math.min(dailyState.progress || 0, daily.target);
      const pct = Math.min(100, (cur / daily.target) * 100);
      const doneMark = dailyState.completed
        ? `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9l4 4 8-9" stroke="#96ffbe" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : '';
      dailyHtml = `
        <div class="daily-quest-section">
          <div class="daily-quest-label">⭐ ${l === 'ru' ? 'Ежедневный квест' : 'Daily Quest'} ${doneMark}</div>
          <div class="quest-item daily-item">
            <div class="quest-swatch" style="background:${daily.icon}"></div>
            <div class="quest-info">
              <div class="quest-name">${name} <span class="quest-xp">+${daily.xp} XP</span></div>
              <div class="quest-desc">${desc}</div>
              <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
              <div class="quest-count">${cur} / ${daily.target}</div>
            </div>
          </div>
        </div>`;
    }

    let questsHtml = '';
    if (activeQuests.length === 0) {
      questsHtml = `<div class="quest-empty">${l === 'ru' ? 'Все задания выполнены!' : 'All quests completed!'}</div>`;
    } else {
      activeQuests.forEach(q => {
        const name = q.name[l] || q.name.en;
        const desc = q.desc[l] || q.desc.en;
        const cur = Math.min(progress[q.id] || 0, q.target);
        const pct = Math.min(100, (cur / q.target) * 100);
        questsHtml += `
          <div class="quest-item">
            <div class="quest-swatch" style="background:${q.icon}"></div>
            <div class="quest-info">
              <div class="quest-name">${name} <span class="quest-xp">+${q.xp} XP</span></div>
              <div class="quest-desc">${desc}</div>
              <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
              <div class="quest-count">${cur} / ${q.target}</div>
            </div>
          </div>`;
      });
    }

    popup.innerHTML = `
      <div class="unlock-popup-bg"></div>
      <div class="unlock-popup-card quest-card">
        <div class="unlock-popup-title">${l === 'ru' ? 'Задания' : 'Quests'}</div>
        <div class="quest-list">
          ${dailyHtml}
          ${questsHtml}
        </div>
        <button class="unlock-popup-btn unlock-popup-cancel" id="quest-close">${l === 'ru' ? 'Закрыть' : 'Close'}</button>
      </div>
    `;

    this.root.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('visible'));

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      if (this.onMenuClose) this.onMenuClose();
      popup.classList.remove('visible');
      setTimeout(() => popup.remove(), 200);
    };
    popup.querySelector('.unlock-popup-bg').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    document.getElementById('quest-close').addEventListener('click', (e) => { e.stopPropagation(); close(); });
  }

  showRecipeBook(recipes, discovered) {
    const old = document.getElementById('recipe-popup');
    if (old) old.remove();

    if (this.onMenuOpen) this.onMenuOpen();

    const l = this.lang;
    const popup = document.createElement('div');
    popup.id = 'recipe-popup';
    popup.className = 'unlock-popup';

    const total = recipes.length;
    const found = discovered.size;

    let list = '';
    for (const r of recipes) {
      const hasIt = discovered.has(r.id);
      const name = r.name[l] || r.name.en;
      const desc = r.desc[l] || r.desc.en;
      if (hasIt) {
        list += `
          <div class="recipe-item">
            <div class="recipe-swatch" style="background:${r.icon}"></div>
            <div class="recipe-info">
              <div class="recipe-name">${name} <span class="recipe-xp">+${r.xp} XP</span></div>
              <div class="recipe-desc">${desc}</div>
            </div>
            <div class="recipe-check">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7" stroke="#96ffbe" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>`;
      } else {
        list += `
          <div class="recipe-item recipe-locked">
            <div class="recipe-swatch" style="background:#33224a"></div>
            <div class="recipe-info">
              <div class="recipe-name">???</div>
              <div class="recipe-desc">${l === 'ru' ? 'Не открыто' : 'Not discovered'}</div>
            </div>
          </div>`;
      }
    }

    popup.innerHTML = `
      <div class="unlock-popup-bg"></div>
      <div class="unlock-popup-card recipe-card">
        <div class="unlock-popup-title">${l === 'ru' ? 'Открытия' : 'Discoveries'}</div>
        <div class="recipe-counter">${found} / ${total} ${l === 'ru' ? 'открыто' : 'found'}</div>
        <div class="recipe-bar"><div class="recipe-bar-fill" style="width:${(found/total)*100}%"></div></div>
        <div class="recipe-list">${list}</div>
        <button class="unlock-popup-btn unlock-popup-cancel" id="recipe-close">${l === 'ru' ? 'Закрыть' : 'Close'}</button>
      </div>
    `;

    this.root.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('visible'));
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      if (this.onMenuClose) this.onMenuClose();
      popup.classList.remove('visible');
      setTimeout(() => popup.remove(), 200);
    };
    popup.querySelector('.unlock-popup-bg').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    document.getElementById('recipe-close').addEventListener('click', (e) => { e.stopPropagation(); close(); });
  }

  showRecipeDiscovered(name, xp, iconColor) {
    const old = document.getElementById('recipe-toast');
    if (old) old.remove();
    const l = this.lang;
    const toast = document.createElement('div');
    toast.id = 'recipe-toast';
    toast.className = 'recipe-toast';
    toast.innerHTML = `
      <div class="recipe-toast-icon" style="background:${iconColor}"></div>
      <div class="recipe-toast-text">
        <div class="recipe-toast-label">${l === 'ru' ? 'Открыто!' : 'Discovered!'}</div>
        <div class="recipe-toast-title">${name}</div>
        <div class="recipe-toast-xp">+${xp} XP</div>
      </div>
    `;
    this.root.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  showQuestComplete(questName, xp) {
    const old = document.getElementById('quest-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.id = 'quest-toast';
    toast.className = 'quest-toast';
    toast.innerHTML = `
      <div class="quest-toast-icon">
        <svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 10l4 4 8-8" stroke="#96ffbe" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="quest-toast-text">
        <div class="quest-toast-title">${questName}</div>
        <div class="quest-toast-xp">+${xp} XP</div>
      </div>
    `;

    this.root.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  getCanvasRect() {
    const topBar = this.root.querySelector('.top-bar');
    const bottomPanel = this.root.querySelector('.bottom-panel');
    const topH = topBar ? topBar.offsetHeight : 0;
    const bottomH = bottomPanel ? bottomPanel.offsetHeight : 0;
    return {
      top: topH,
      bottom: bottomH,
      width: window.innerWidth,
      height: window.innerHeight - topH - bottomH
    };
  }
}
