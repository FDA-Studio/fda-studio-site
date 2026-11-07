/**
 * Moteur sonore du site (Web Audio).
 *
 * - Coupé par défaut : rien ne joue tant que le visiteur n'a pas activé le son lui-même
 *   (règles d'autoplay des navigateurs et critère WCAG 1.4.2).
 * - Sons générés avec ElevenLabs Sound Effects puis retravaillés (public/sounds) :
 *   power-on.mp3 (activation), ambient.mp3 (nappe en boucle), door.mp3 (portes), tick.mp3 (interface).
 * - Les fichiers ne sont téléchargés qu'à l'activation : aucun impact sur le chargement de la page.
 */

type Sfx = "tick" | "door";
type Listener = (on: boolean) => void;

import { asset } from "./site";

const FILES = {
  power: asset("/sounds/power-on.mp3"),
  ambient: asset("/sounds/ambient.mp3"),
  door: asset("/sounds/door.mp3"),
  tick: asset("/sounds/tick.mp3"),
} as const;

const AMBIENT_LEVEL = 0.32;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private buffers = new Map<keyof typeof FILES, AudioBuffer>();
  private loading: Promise<void> | null = null;
  private listeners = new Set<Listener>();
  private lastTick = 0;
  enabled = false;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.enabled));
  }

  private setup() {
    if (this.ctx) return;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    // Compresseur léger : évite toute crête désagréable sur haut-parleurs de téléphone
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(this.ctx.destination);

    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) this.ctx.suspend();
      else if (this.enabled) this.ctx.resume();
    });
  }

  private load(): Promise<void> {
    if (this.loading) return this.loading;
    const ctx = this.ctx!;
    this.loading = Promise.all(
      (Object.keys(FILES) as (keyof typeof FILES)[]).map(async (key) => {
        const res = await fetch(FILES[key]);
        if (!res.ok) throw new Error(`sound ${key}: ${res.status}`);
        const data = await res.arrayBuffer();
        this.buffers.set(key, await ctx.decodeAudioData(data));
      }),
    ).then(() => undefined);
    this.loading.catch(() => {
      this.loading = null;
    });
    return this.loading;
  }

  private shot(key: keyof typeof FILES, gain = 1, rate = 1) {
    const ctx = this.ctx;
    const buf = this.buffers.get(key);
    if (!ctx || !buf || !this.master) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g).connect(this.master);
    src.start();
  }

  private startAmbient() {
    const ctx = this.ctx!;
    const buf = this.buffers.get("ambient");
    if (!buf || this.ambientSource) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    // Le MP3 ajoute quelques millisecondes de silence aux extrémités : on boucle à l'intérieur
    src.loopStart = 0.06;
    src.loopEnd = buf.duration - 0.06;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    // Ouverture progressive : la nappe « s'allume » derrière l'impact
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(AMBIENT_LEVEL, now + 3.5);
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(5200, now + 4);

    src.connect(filter).connect(gain).connect(this.master!);
    src.start(now, 0.06);
    this.ambientSource = src;
    this.ambientGain = gain;
    this.ambientFilter = filter;
  }

  private stopAmbient() {
    const ctx = this.ctx;
    if (!ctx || !this.ambientSource || !this.ambientGain) return;
    const now = ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    this.ambientSource.stop(now + 0.65);
    this.ambientSource = null;
    this.ambientGain = null;
    this.ambientFilter = null;
  }

  /** À appeler uniquement depuis un geste de l'utilisateur (clic, tap, touche). */
  async enable() {
    this.setup();
    await this.ctx!.resume();
    this.enabled = true;
    this.emit();
    try {
      await this.load();
    } catch {
      this.enabled = false;
      this.emit();
      return;
    }
    if (!this.enabled) return;
    // Impact grave + sa version octaviée très douce, puis ouverture de la nappe
    this.shot("power", 1);
    this.shot("power", 0.25, 0.5);
    this.startAmbient();
  }

  disable() {
    this.enabled = false;
    this.stopAmbient();
    this.emit();
    window.setTimeout(() => {
      if (!this.enabled) this.ctx?.suspend();
    }, 800);
  }

  toggle() {
    return this.enabled ? this.disable() : this.enable();
  }

  /** Effet ponctuel ; sans effet si le son est coupé. */
  play(name: Sfx) {
    if (!this.enabled) return;
    if (name === "tick") {
      const t = performance.now();
      if (t - this.lastTick < 60) return; // anti-mitraillage
      this.lastTick = t;
      this.shot("tick", 0.55, 0.96 + Math.random() * 0.08);
    } else {
      this.shot("door", 0.9);
    }
  }

  /** Atténue la nappe hors du haut de page (0 = haut, 1 = loin). */
  setDepth(depth: number) {
    if (!this.ctx || !this.ambientGain || !this.ambientFilter) return;
    const d = Math.min(1, Math.max(0, depth));
    const now = this.ctx.currentTime;
    this.ambientGain.gain.setTargetAtTime(AMBIENT_LEVEL * (1 - d * 0.55), now, 0.4);
    this.ambientFilter.frequency.setTargetAtTime(5200 - d * 3800, now, 0.4);
  }
}

let engine: SoundEngine | null = null;
export function getSound(): SoundEngine {
  if (!engine) engine = new SoundEngine();
  return engine;
}

/** Raccourci pour les composants : joue un effet si le son est activé. */
export function sfx(name: Sfx) {
  if (typeof window === "undefined" || !engine) return;
  engine.play(name);
}
