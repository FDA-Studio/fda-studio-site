"use client";

import { useEffect, useRef, useState } from "react";
import { Gate } from "./Gate";
import { WORLD_SECTIONS, worldAsset } from "./config";
import motion from "./motion.json";
import motionM from "./motion-m.json";
import { getSound, sfx } from "@/lib/sound";
import { frTypo } from "@/lib/typo";

/**
 * Le monde FDA Studio : un vol de caméra continu, pré-rendu, piloté par le scroll.
 * Six segments de 8 s enchaînés image à image (le dernier photogramme d'un segment est
 * la première image du suivant), joués par le moteur scroll-world (lecture par position).
 * Téléphone : une seconde chaîne rendue en 9:16, composée pour le portrait (pas un recadrage).
 * Le texte SEO/accessibilité est rendu côté serveur (voir WorldCopy) ; le moteur
 * reconstruit la mise en scène côté client.
 */
export function World() {
  const host = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let world: { end: () => number; progress: (i: number) => number; time: (i: number) => number; preload: (cb?: (p: number) => void) => Promise<void>; destroy: () => void } | null = null;
    let disposed = false;
    let onScroll = () => {};
    let lastPct = -1;

    (async () => {
      const { mountScrollWorld } = await import("@/lib/scroll-world/engine.js");
      if (disposed) return;
      world = mountScrollWorld(el, {
        topbar: false,
        atmosphere: false,
        hint: "Défilez pour entrer",
        diveScroll: 1.9,
        crossfade: 0.08,
        sections: WORLD_SECTIONS.map((s, i) => ({
          id: s.id,
          label: s.label,
          still: worldAsset(`still_${i}.webp`),
          stillMobile: worldAsset(`still_${i}-m.webp`),
          frames: { base: worldAsset(`frames/d${i}/`), count: 193 },
          framesMobile: { base: worldAsset(`frames/m${i}/`), count: 193 },
          accent: s.accent,
          copyAt: s.copyAt,
          remap: (motion as Record<string, number[]>)[String(i)],
          remapMobile: (motionM as Record<string, number[]>)[String(i)],
          eyebrow: s.eyebrow,
          title: frTypo(s.title),
          body: frTypo(s.body),
          tags: s.tags,
          cta: s.cta,
        })),
        connectors: [],
      });
      // Titres découpés en mots : chaque mot monte de sous sa ligne quand la scène apparaît
      const copies = Array.from(el.querySelectorAll<HTMLElement>(".sw-copy"));
      el.querySelectorAll<HTMLElement>(".sw-copy__title").forEach((t) => {
        const words = (t.textContent ?? "").split(" ").filter(Boolean);
        t.textContent = "";
        words.forEach((w, i) => {
          const mask = document.createElement("span");
          mask.className = "sw-word";
          const inner = document.createElement("span");
          inner.style.setProperty("--i", String(i));
          inner.textContent = w;
          mask.appendChild(inner);
          t.appendChild(mask);
          if (i < words.length - 1) t.appendChild(document.createTextNode(" "));
        });
      });
      // Une fois le vol terminé, le monde (couches fixes) s'efface derrière la suite de la page.
      // Et si le son est activé : un souffle à chaque nouvelle scène, la porte à l'arrivée sur l'arche.
      // Les déclenchements suivent le temps du film réellement affiché (pas la position de scroll) :
      // la porte sonne quand elle s'ouvre à l'image, et ce moment diffère entre le film 16:9
      // (image 106 sur 193) et le film portrait du téléphone (image 62).
      const arrived = new Set<number>();
      const mobile = window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 860px)").matches;
      const DOOR_AT = mobile ? 62 / 192 : 106 / 192;
      const SCENE_AT = 0.45;
      onScroll = () => {
        if (!world) return;
        // Sortie du monde pilotée par le scroll : sur le dernier écran, la caméra continue
        // d'avancer (léger zoom) pendant que l'image s'assombrit et que la section suivante
        // monte par-dessus avec un dégradé. --out va de 0 (film plein) à 1 (noir).
        const vh = window.innerHeight;
        const out = Math.min(1, Math.max(0, (window.scrollY - (world.end() - vh)) / vh));
        el.style.setProperty("--out", out.toFixed(3));
        el.dataset.past = out >= 1 ? "true" : "false";
        copies.forEach((c) => {
          // Rien ne se révèle derrière l'écran d'arrivée : la première scène attend l'entrée
          const shown = el.dataset.entered === "true" && parseFloat(c.style.opacity || "0") > 0.3 ? "true" : "false";
          if (c.dataset.shown !== shown) c.dataset.shown = shown;
        });
        WORLD_SECTIONS.forEach((s, i) => {
          if (i === 0) return;
          const t = world!.time(i);
          const at = s.id === "jeux" ? DOOR_AT : SCENE_AT;
          if (t >= at && t < 0.98 && !arrived.has(i)) {
            arrived.add(i);
            sfx(s.id === "jeux" ? "door" : "step");
          } else if (t < at - 0.15 && arrived.has(i)) arrived.delete(i); // on remonte : réarmé
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      // Le temps du film continue d'évoluer après le dernier événement de scroll (lissage) :
      // on relit l'état à chaque image tant que le vol est à l'écran.
      const tick = () => {
        if (disposed) return;
        if (el.dataset.past !== "true") onScroll();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      // Tous les films et tous les sons en mémoire avant d'ouvrir les portes :
      // la musique démarre à l'instant du clic « Entrer avec le son ».
      Promise.all([
        world.preload((p) => {
          // ~1 200 fichiers : on ne redessine l'écran d'arrivée qu'à chaque pour cent gagné
          const pct = Math.floor(p * 100) / 100;
          if (!disposed && pct !== lastPct) { lastPct = pct; setProgress(pct); }
        }),
        getSound().prefetch(),
      ]).then(() => { if (!disposed) { setProgress(1); setReady(true); } });
    })();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      world?.destroy();
    };
  }, []);

  return (
    <>
      {/* L’écran reste monté pendant sa sortie (explosion des particules), puis se retire de lui-même */}
      <Gate progress={progress} ready={ready} onEnter={() => setEntered(true)} />
      <div ref={host} className="world" data-entered={entered ? "true" : "false"} aria-hidden />
    </>
  );
}

/** Contenu du monde rendu côté serveur : lu par Google et les lecteurs d'écran. */
export function WorldCopy() {
  return (
    <div className="sr-only">
      <h1>{WORLD_SECTIONS[0].title}</h1>
      <p>{WORLD_SECTIONS[0].body}</p>
      {WORLD_SECTIONS.slice(1).map((s) => (
        <section key={s.id} aria-labelledby={`world-${s.id}`}>
          <h2 id={`world-${s.id}`}>{s.title}</h2>
          <p>{s.body}</p>
          {s.cta && (
            <p>
              <a href={s.cta.primary.href}>{s.cta.primary.label}</a>
              {s.cta.secondary && <a href={s.cta.secondary.href}>{s.cta.secondary.label}</a>}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
