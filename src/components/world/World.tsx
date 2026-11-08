"use client";

import { useEffect, useRef } from "react";
import { WORLD_SECTIONS, worldAsset } from "./config";

/**
 * Le monde FDA Studio : un vol de caméra continu, pré-rendu, piloté par le scroll.
 * Six segments de 8 s enchaînés image à image (le dernier photogramme d'un segment est
 * la première image du suivant), joués par le moteur scroll-world (lecture par position).
 * Le texte SEO/accessibilité est rendu côté serveur (voir WorldCopy) ; le moteur
 * reconstruit la mise en scène côté client.
 */
export function World() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let world: { end: () => number; destroy: () => void } | null = null;
    let disposed = false;
    let onScroll = () => {};

    (async () => {
      const { mountScrollWorld } = await import("@/lib/scroll-world/engine.js");
      if (disposed) return;
      world = mountScrollWorld(el, {
        topbar: false,
        atmosphere: false,
        hint: "Défilez pour entrer",
        diveScroll: 1.5,
        crossfade: 0.08,
        sections: WORLD_SECTIONS.map((s, i) => ({
          id: s.id,
          label: s.label,
          still: worldAsset(`still_${i}.webp`),
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
      // Une fois le vol terminé, le monde (couches fixes) s'efface derrière la suite de la page
      onScroll = () => {
        if (!world) return;
        const past = window.scrollY > world.end() - window.innerHeight * 0.4;
        el.dataset.past = past ? "true" : "false";
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
