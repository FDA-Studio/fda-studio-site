"use client";

import { useEffect, useRef } from "react";
import { LOGO_SYMBOL_PATH } from "@/components/brand/Logo";

/**
 * Champ de particules de l'écran d'arrivée.
 * Pendant le chargement, une poussière de lumière qui gravite autour de l'écran se rassemble
 * dans la forme du symbole FD : plus le monde est chargé, plus le symbole est formé.
 * Une fois prêt, le vrai logo (vectoriel, intact) apparaît par-dessus et les particules
 * scintillent doucement. À l'entrée, elles explosent vers le visiteur.
 * Le logo officiel n'est jamais déformé : les particules ne font que l'annoncer.
 */

type Particle = {
  ang: number; // angle d'orbite de départ
  rad: number; // rayon d'orbite (fraction de la diagonale)
  spin: number; // vitesse d'orbite
  tx: number; // cible dans le symbole (0..1, repère du symbole)
  ty: number;
  delay: number; // moment d'arrivée dans le chargement
  size: number;
  alpha: number;
  blue: boolean;
  phase: number;
  bx: number; // direction de l'explosion
  by: number;
  burst: number;
};

const VB_W = 134;
const VB_H = 124;

/** Points tirés au hasard à l'intérieur du symbole, en coordonnées 0..1. */
function sampleSymbol(count: number): { x: number; y: number }[] {
  const scale = 3;
  const c = document.createElement("canvas");
  c.width = VB_W * scale;
  c.height = VB_H * scale;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.scale(scale, scale);
  ctx.translate(0, 2); // la vue du symbole commence à y = -2
  ctx.fill(new Path2D(LOGO_SYMBOL_PATH), "evenodd");
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const inside: { x: number; y: number }[] = [];
  for (let y = 0; y < c.height; y += 2) {
    for (let x = 0; x < c.width; x += 2) {
      if (data[(y * c.width + x) * 4 + 3] > 128) inside.push({ x: x / c.width, y: y / c.height });
    }
  }
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count && inside.length; i++) {
    const p = inside[Math.floor(Math.random() * inside.length)];
    out.push({ x: p.x + (Math.random() - 0.5) * 0.006, y: p.y + (Math.random() - 0.5) * 0.006 });
  }
  return out;
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp = (x: number) => Math.min(1, Math.max(0, x));

export function GateField({
  progress,
  ready,
  leaving,
  target,
}: {
  progress: number;
  ready: boolean;
  leaving: boolean;
  /** Emplacement du logo à l'écran : les particules s'y rassemblent. */
  target: React.RefObject<HTMLElement | null>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ progress, ready, leaving, leftAt: 0 });

  useEffect(() => {
    const s = state.current;
    s.progress = progress;
    s.ready = ready;
    if (leaving && !s.leaving) s.leftAt = performance.now();
    s.leaving = leaving;
  }, [progress, ready, leaving]);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const small = window.innerWidth < 700;
    const N = small ? 700 : 1400;
    const points = sampleSymbol(N);
    const parts: Particle[] = points.map((p) => {
      const a = Math.random() * Math.PI * 2;
      return {
        ang: Math.random() * Math.PI * 2,
        rad: 0.18 + Math.pow(Math.random(), 0.7) * 0.55,
        spin: (0.04 + Math.random() * 0.08) * (Math.random() < 0.5 ? -1 : 1),
        tx: p.x,
        ty: p.y,
        delay: Math.random() * 0.62,
        size: 0.7 + Math.random() * 1.4,
        alpha: 0.45 + Math.random() * 0.55,
        blue: Math.random() < 0.16,
        phase: Math.random() * Math.PI * 2,
        bx: Math.cos(a),
        by: Math.sin(a),
        burst: 0.6 + Math.random() * 1.4,
      };
    });

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    let shown = 0; // progression affichée, lissée vers la vraie
    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      const s = state.current;
      const t = (now - t0) / 1000;
      // Le symbole se forme un peu en avance sur le chargement réel, puis attend la fin
      const goal = s.ready ? 1 : Math.min(0.94, 0.08 + s.progress * 0.9);
      shown += (goal - shown) * 0.045;

      const r = target.current?.getBoundingClientRect();
      const box = r && r.width > 0 ? r : { left: w / 2 - 60, top: h * 0.3, width: 120, height: 111 };
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const diag = Math.hypot(w, h);

      const out = s.leaving ? clamp((now - s.leftAt) / 900) : 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const p of parts) {
        const k = ease(clamp((shown - p.delay) / 0.38));
        const ang = p.ang + t * p.spin;
        const ox = cx + Math.cos(ang) * p.rad * diag * 0.6;
        const oy = cy + Math.sin(ang) * p.rad * diag * 0.42;
        const tx = box.left + p.tx * box.width;
        const ty = box.top + p.ty * box.height;
        let x = ox + (tx - ox) * k;
        let y = oy + (ty - oy) * k;
        // Une fois en place : un léger frémissement, comme une matière vivante
        if (k > 0.98) {
          x += Math.sin(t * 1.7 + p.phase) * 0.35;
          y += Math.cos(t * 1.3 + p.phase) * 0.35;
        }
        let a = p.alpha * (0.35 + 0.65 * k);
        let size = p.size;
        // Le vrai logo apparaît : les particules s'effacent en scintillant
        if (s.ready) a *= 0.55 + 0.45 * Math.sin(t * 2.2 + p.phase * 3) ** 2 * (1 - shown * 0.6);
        if (out > 0) {
          const e = out * out;
          const d = diag * 0.9 * p.burst * e;
          x += (p.bx * 0.7 + (x - cx) / diag) * d;
          y += (p.by * 0.7 + (y - cy) / diag) * d;
          size *= 1 + e * 5 * p.burst;
          a *= 1 - out;
        }
        if (a <= 0.01) continue;
        ctx.fillStyle = p.blue ? `rgba(111,139,255,${a.toFixed(3)})` : `rgba(244,244,242,${a.toFixed(3)})`;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }

      if (out < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [target]);

  return <canvas ref={canvas} aria-hidden className="gate__field" />;
}
