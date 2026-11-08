"use client";

import { useEffect, useRef } from "react";
import { WORLD_SECTIONS, worldAsset } from "./config";
import { sfx } from "@/lib/sound";

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

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let world: { end: () => number; progress: (i: number) => number; destroy: () => void } | null = null;
    let disposed = false;
    let onScroll = () => {};

    (async () => {
      const { mountScrollWorld } = await import("@/lib/scroll-world/engine.js");
      if (disposed) return;
      world = mountScrollWorld(el, {
        topbar: false,
        atmosphere: false,
        hint: "Défilez pour entrer",
        diveScroll: 1.7,
        crossfade: 0.08,
        sections: WORLD_SECTIONS.map((s, i) => ({
          id: s.id,
          label: s.label,
          still: worldAsset(`still_${i}.webp`),
          stillMobile: worldAsset(`still_${i}-m.webp`),
          clip: worldAsset(`vid/leg_${i}.mp4`),
          clipMobile: worldAsset(`vid/leg_${i}-m.mp4`),
          accent: s.accent,
          scroll: s.scroll,
          linger: s.linger,
          copyAt: s.copyAt,
          eyebrow: s.eyebrow,
          title: s.title,
          body: s.body,
          tags: s.tags,
          cta: s.cta,
        })),
        connectors: [],
      });
      // Une fois le vol terminé, le monde (couches fixes) s'efface derrière la suite de la page.
      // Et si le son est activé : un souffle à chaque nouvelle scène, la porte à l'arrivée sur l'arche.
      // Chaque scène est atteinte dans la seconde moitié de son segment : le son part à ce moment-là
      // (la porte sonne quand la caméra arrive devant l'arche, pas au départ du couloir).
      const arrived = new Set<number>();
      onScroll = () => {
        if (!world) return;
        const past = window.scrollY > world.end() - window.innerHeight * 0.4;
        el.dataset.past = past ? "true" : "false";
        WORLD_SECTIONS.forEach((s, i) => {
          if (i === 0) return;
          const p = world!.progress(i);
          const at = s.id === "jeux" ? 0.62 : 0.5;
          if (p >= at && p < 0.98 && !arrived.has(i)) {
            arrived.add(i);
            sfx(s.id === "jeux" ? "door" : "step");
          } else if (p < at - 0.2 && arrived.has(i)) arrived.delete(i); // on remonte : réarmé
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    })();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      world?.destroy();
    };
  }, []);

  return <div ref={host} className="world" aria-hidden />;
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
