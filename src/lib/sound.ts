/**
 * Moteur sonore du site (Web Audio).
 *
 * - Coupé par défaut : rien ne joue tant que le visiteur n'a pas activé le son lui-même
 *   (règles d'autoplay des navigateurs et critère WCAG 1.4.2).
 * - Sons générés avec ElevenLabs Sound Effects puis retravaillés (public/sounds) :
 *   power-on.mp3 (activation), ambient.mp3 (nappe en boucle), door.mp3 (portes), tick.mp3 (interface).
 * - Les fichiers ne sont téléchargés qu'à l'activation : aucun impact sur le chargement de la page.
 */

/**
 * tick : appui sur un bouton ou un lien · door : arrivée sur l'univers Door Knight
 * step : changement de chapitre des démos IA · blip : progression dans une démo (hauteur = étape)
 * chime : demande de contact prête ou envoyée
 */
type Sfx = "tick" | "door" | "step" | "blip" | "chime";
type Listener = (on: boolean) => void;

import { asset } from "./site";

const FILES = {
  power: asset("/sounds/power-on.mp3"),
  ambient: asset("/sounds/ambient.mp3"),
  door: asset("/sounds/door.mp3"),
  tick: asset("/sounds/tick.mp3"),
} as const;

/** Piste muette jouée par un élément <audio> : fait passer iOS en mode « lecture ». */
const SILENCE = asset("/sounds/silence.mp3");

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
  private keepAlive: HTMLAudioElement | null = null;
  private ambientLayer: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;
  private noise: AudioBuffer | null = null;
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
      if (document.hidden) {
        this.ctx.suspend();
        this.keepAlive?.pause();
      } else if (this.enabled) {
        this.ctx.resume();
        this.keepAlive?.play().catch(() => {});
      }
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

    // Seconde couche une octave plus bas, décalée et très légèrement désaccordée :
    // les deux boucles ne retombent jamais en phase, la nappe évolue au lieu de se répéter.
    const layer = ctx.createBufferSource();
    layer.buffer = buf;
    layer.loop = true;
    layer.loopStart = 0.06;
    layer.loopEnd = buf.duration - 0.06;
    layer.playbackRate.value = 0.497;
    const layerGain = ctx.createGain();
    layerGain.gain.value = 0.45;
    layer.connect(layerGain).connect(filter);
    layer.start(now + 0.8, buf.duration / 2);

    // Respiration lente du filtre (une oscillation toutes les ~14 s)
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 700;
    lfo.connect(lfoDepth).connect(filter.frequency);
    lfo.start(now + 4);

    this.ambientLayer = layer;
    this.lfo = lfo;
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
    this.ambientLayer?.stop(now + 0.65);
    this.lfo?.stop(now + 0.65);
    this.ambientLayer = null;
    this.lfo = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.ambientFilter = null;
  }

  /** À appeler uniquement depuis un geste de l'utilisateur (clic, tap, touche). */
  async enable() {
    // Tout ce qui suit jusqu'au premier « await » s'exécute dans le geste de l'utilisateur,
    // seule fenêtre où iOS et Android autorisent l'audio.
    this.unlockMobile();
    this.setup();
    this.primeContext();
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

  /**
   * iOS range le Web Audio dans la catégorie « ambiant » : il est coupé par le bouton silencieux
   * de l'iPhone. On demande la catégorie « lecture » (Safari 17+), et pour les versions plus
   * anciennes on joue en boucle une piste muette dans un élément <audio>, ce qui a le même effet.
   */
  private unlockMobile() {
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    try {
      if (nav.audioSession) nav.audioSession.type = "playback";
    } catch {
      /* API absente ou refusée : la piste muette prend le relais */
    }
    if (!this.keepAlive) {
      const el = new Audio(SILENCE);
      el.loop = true;
      el.preload = "auto";
      el.setAttribute("playsinline", "");
      el.volume = 0.01;
      this.keepAlive = el;
    }
    this.keepAlive.play().catch(() => {
      /* sans conséquence : le Web Audio reste utilisable si le téléphone n'est pas en silencieux */
    });
  }

  /** Joue un échantillon vide immédiatement : déverrouille le contexte sur les anciens Safari. */
  private primeContext() {
    const ctx = this.ctx;
    if (!ctx) return;
    const src = ctx.createBufferSource();
    src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    src.connect(ctx.destination);
    src.start(0);
  }

  disable() {
    this.keepAlive?.pause();
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

  /** Note courte synthétisée (sinus + harmonique douce), enveloppe percussive. */
  private tone(freq: number, gain: number, dur = 0.18, delay = 0) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t = ctx.currentTime + delay;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    env.connect(this.master);
    for (const [mult, level, type] of [[1, 1, "sine"], [2, 0.18, "triangle"]] as const) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq * mult;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(env);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    }
  }

  /** Souffle filtré qui balaie l'aigu : transition entre deux démos. */
  private whoosh() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    if (!this.noise) {
      const len = Math.floor(ctx.sampleRate * 0.6);
      this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(420, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.32);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.16, t + 0.09);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    src.connect(bp).connect(env).connect(this.master);
    src.start(t);
    src.stop(t + 0.5);
  }

  /** Effet ponctuel ; sans effet si le son est coupé. `n` règle la hauteur du blip. */
  play(name: Sfx, n = 0) {
    if (!this.enabled || !this.ctx || this.ctx.state !== "running") return;
    const t = performance.now();
    switch (name) {
      case "tick":
        if (t - this.lastTick < 60) return; // anti-mitraillage
        this.lastTick = t;
        this.shot("tick", 0.45, 0.96 + Math.random() * 0.08);
        break;
      case "door":
        this.shot("door", 0.8);
        break;
      case "step":
        this.whoosh();
        this.tone(659.25, 0.05, 0.35, 0.12); // mi, discret
        break;
      case "blip":
        // Gamme pentatonique de la : chaque étape monte d'un degré, jamais de fausse note
        this.tone(440 * Math.pow(2, [0, 2, 4, 7, 9, 12, 14, 16][n % 8] / 12), 0.045, 0.14);
        break;
      case "chime":
        this.tone(659.25, 0.09, 0.5);
        this.tone(987.77, 0.07, 0.7, 0.11);
        break;
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
export function sfx(name: Sfx, n = 0) {
  if (typeof window === "undefined" || !engine) return;
  engine.play(name, n);
}
