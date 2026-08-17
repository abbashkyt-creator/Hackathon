// Soft, kid-friendly synthesized sounds
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.initialized = false;
    this.enabled = true;
    this.noiseBuffer = null;

    this.cooldowns = { explosion: 0, hiss: 0, spark: 0, zap: 0, sparkle: 0 };
    this.cooldownMs = { explosion: 250, hiss: 160, spark: 90, zap: 500, sparkle: 120 };
    this.userMuted = false;

    try {
      const saved = localStorage.getItem('ms_sound');
      if (saved === 'off') { this.enabled = false; this.userMuted = true; }
    } catch (e) {}
  }

  ensureContext() {
    if (this.initialized) return true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.22;
      this.masterGain.connect(this.ctx.destination);
      const size = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
      this.initialized = true;
      return true;
    } catch (e) { return false; }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.userMuted = !this.enabled;
    try { localStorage.setItem('ms_sound', this.enabled ? 'on' : 'off'); } catch (e) {}
    return this.enabled;
  }

  mute() { this.enabled = false; }
  unmute() { this.enabled = true; }

  canPlay(type) {
    if (!this.enabled) return false;
    const now = performance.now();
    if (now < this.cooldowns[type]) return false;
    this.cooldowns[type] = now + this.cooldownMs[type];
    return true;
  }

  // Soft "poof" explosion — no harsh bang
  playExplosion() {
    if (!this.canPlay('explosion') || !this.ensureContext()) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.3);
    og.gain.setValueAtTime(0.3, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(og); og.connect(this.masterGain);
    osc.start(t); osc.stop(t + 0.3);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(800, t);
    f.frequency.exponentialRampToValueAtTime(200, t + 0.25);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    noise.connect(f); f.connect(g); g.connect(this.masterGain);
    noise.start(t); noise.stop(t + 0.25);
  }

  // Gentle hiss (steam)
  playHiss() {
    if (!this.canPlay('hiss') || !this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const f = this.ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 3000;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    noise.connect(f); f.connect(g); g.connect(this.masterGain);
    noise.start(t); noise.stop(t + 0.12);
  }

  // Bright chime spark
  playSpark() {
    if (!this.canPlay('spark') || !this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + Math.random() * 800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.12);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(g); g.connect(this.masterGain);
    osc.start(t); osc.stop(t + 0.12);
  }

  // Magical sparkle — 2-note chime
  playSparkle() {
    if (!this.canPlay('sparkle') || !this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const notes = [880, 1320];
    notes.forEach((hz, k) => {
      const o = this.ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(hz, t + k * 0.07);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.08, t + k * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, t + k * 0.07 + 0.2);
      o.connect(g); g.connect(this.masterGain);
      o.start(t + k * 0.07); o.stop(t + k * 0.07 + 0.2);
    });
  }

  // Soft thunder (magical)
  playThunder() {
    if (!this.canPlay('zap') || !this.ensureContext()) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.linearRampToValueAtTime(0.15, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(g); g.connect(this.masterGain);
    osc.start(t); osc.stop(t + 0.5);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const nf = this.ctx.createBiquadFilter();
    nf.type = 'lowpass';
    nf.frequency.setValueAtTime(300, t);
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.2, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    noise.connect(nf); nf.connect(ng); ng.connect(this.masterGain);
    noise.start(t); noise.stop(t + 0.6);
  }

  processEvents(events) {
    if (!this.enabled) return;
    if (events.explosions > 0) this.playExplosion();
    if (events.hiss > 0) this.playHiss();
    if (events.sparks > 0) this.playSpark();
    if (events.zap > 0) this.playThunder();
    if (events.sparkle > 0 || events.rainbowCreated > 0) this.playSparkle();
  }
}
