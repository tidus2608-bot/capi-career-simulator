/* Simple WebAudio engine — per-scene ambient pad + SFX */

class CapiAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = typeof localStorage !== "undefined" && localStorage.getItem("capi_muted") === "1";
    this.currentPad = null;
  }

  _ensure() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.22;
      this.master.connect(this.ctx.destination);
    } catch (e) {}
  }

  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem("capi_muted", m ? "1" : "0"); } catch (e) {}
    if (this.master) this.master.gain.linearRampToValueAtTime(m ? 0 : 0.22, this.ctx.currentTime + 0.2);
  }

  toggle() { this.setMuted(!this.muted); return this.muted; }

  /* A simple ambient pad built from detuned oscillators */
  pad(freqs = [110, 164.8, 220], color = "warm") {
    this._ensure();
    if (!this.ctx) return;
    this.stopPad();
    const nodes = [];
    const out = this.ctx.createGain();
    out.gain.value = 0;
    out.connect(this.master);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = color === "cold" ? 1400 : 900;
    filter.Q.value = 4;
    filter.connect(out);

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sawtooth" : "sine";
      osc.frequency.value = f;
      osc.detune.value = (Math.random() - 0.5) * 14;
      const g = this.ctx.createGain();
      g.gain.value = 0.14 / freqs.length;
      osc.connect(g).connect(filter);
      osc.start();

      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.08 + Math.random() * 0.1;
      const lfoG = this.ctx.createGain();
      lfoG.gain.value = 6;
      lfo.connect(lfoG).connect(osc.detune);
      lfo.start();
      nodes.push(osc, lfo);
    });

    out.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 2);
    this.currentPad = { out, nodes };
  }

  stopPad() {
    if (!this.currentPad) return;
    try {
      const { out, nodes } = this.currentPad;
      out.gain.cancelScheduledValues(this.ctx.currentTime);
      out.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop(); } catch (e) {} });
        try { out.disconnect(); } catch (e) {}
      }, 800);
    } catch (e) {}
    this.currentPad = null;
  }

  sfx(kind = "click") {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.connect(this.master);
    g.gain.value = 0;

    if (kind === "click") {
      const osc = this.ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
      g.gain.linearRampToValueAtTime(0.18, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.connect(g);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (kind === "confirm") {
      [523, 784, 1046].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const ng = this.ctx.createGain();
        ng.gain.value = 0;
        ng.gain.linearRampToValueAtTime(0.14, t + 0.01 + i * 0.05);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.4 + i * 0.05);
        osc.connect(ng).connect(this.master);
        osc.start(t + i * 0.05);
        osc.stop(t + 0.5 + i * 0.05);
      });
    } else if (kind === "scan") {
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(1760, t + 1.4);
      g.gain.linearRampToValueAtTime(0.12, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      osc.connect(g);
      osc.start(t);
      osc.stop(t + 1.6);
    } else if (kind === "whoosh") {
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.6, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 800;
      bp.frequency.linearRampToValueAtTime(3000, t + 0.5);
      bp.Q.value = 1.2;
      g.gain.linearRampToValueAtTime(0.3, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      src.connect(bp).connect(g);
      src.start(t);
    } else if (kind === "success") {
      [523, 659, 784, 1046, 1318].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = f;
        const ng = this.ctx.createGain();
        ng.gain.value = 0;
        ng.gain.linearRampToValueAtTime(0.15, t + 0.01 + i * 0.08);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.6 + i * 0.08);
        osc.connect(ng).connect(this.master);
        osc.start(t + i * 0.08);
        osc.stop(t + 0.7 + i * 0.08);
      });
    }
  }
}

export const capiAudio = new CapiAudio();
