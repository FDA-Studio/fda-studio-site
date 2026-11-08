"use client";

import { useEffect, useRef, useState } from "react";
import { motionPause } from "@/lib/motion";
import { sfx } from "@/lib/sound";
import type { Stage as StageHandle } from "./engine";

/**
 * Toile fixe derrière l'accueil : la matière FDA se recompose au fil des chapitres
 * (éléments porteurs de `data-scene`). Le moteur Three.js est chargé à la demande, après
 * le premier affichage, et seulement sur les appareils capables de le rendre.
 */
export function Stage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    // Entrée des chapitres : titre, texte et bouton montent quand le chapitre arrive à l'écran.
    // Indépendant de la 3D (fonctionne aussi en repli) ; sans JavaScript, le texte reste visible.
    document.documentElement.dataset.stage = "1";
    const seen = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).dataset.seen = "true"; seen.unobserve(e.target); } }),
      { threshold: 0.3 },
    );
    document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => seen.observe(el));

    const whenIdle = () =>
      new Promise<void>((resolve) => {
        const go = () => {
          if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => resolve(), { timeout: 1200 });
          else setTimeout(resolve, 250);
        };
        if (document.readyState === "complete") go();
        else window.addEventListener("load", go, { once: true });
      });

    (async () => {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      if (conn?.saveData || (mem !== undefined && mem <= 2)) return setState("fallback");
      await whenIdle();
      if (disposed) return;
      if (!new URLSearchParams(window.location.search).has("force3d")) {
        try {
          const probe = document.createElement("canvas").getContext("webgl2") ?? document.createElement("canvas").getContext("webgl");
          const ext = probe?.getExtension("WEBGL_debug_renderer_info");
          const gpu = probe && ext ? String(probe.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
          probe?.getExtension("WEBGL_lose_context")?.loseContext();
          if (!probe || /swiftshader|llvmpipe|software|basic render/i.test(gpu)) return setState("fallback");
        } catch {
          return setState("fallback");
        }
      }
      let createStage: typeof import("./engine").createStage;
      try {
        ({ createStage } = await import("./engine"));
      } catch {
        return setState("fallback");
      }
      if (disposed) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const lowPower = window.innerWidth < 768 || coarse || (navigator.hardwareConcurrency ?? 8) <= 4;
      let stage: StageHandle;
      try {
        stage = createStage(host, { lowPower, reduced });
      } catch {
        return setState("fallback");
      }
      setState("ready");

      // Ligne du temps : interpolation entre les centres des chapitres successifs
      const chapters = () => Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      let centers: number[] = [];
      let active = true; // la toile est-elle encore derrière un chapitre ?
      const measure = () => {
        const sy = window.scrollY;
        centers = chapters().map((el) => {
          const r = el.getBoundingClientRect();
          return sy + r.top + r.height / 2;
        });
        // Au-delà du dernier chapitre, la matière se retire (scène « calme »)
        if (centers.length) centers.push(centers[centers.length - 1] + window.innerHeight * 0.9);
        // Téléphone : bande libre par chapitre = de l'en-tête jusqu'au haut du texte,
        // mesurée dans le chapitre lui-même (les chapitres font un écran de haut)
        if (window.innerWidth < 768) {
          const vh = window.innerHeight;
          const header = document.querySelector("header")?.getBoundingClientRect().height ?? 64;
          const list = chapters().map((el) => {
            const text = el.querySelector<HTMLElement>("[data-stage-text]") ?? el;
            const sr = el.getBoundingClientRect();
            const tr = text.getBoundingClientRect();
            // Position du texte dans la fenêtre quand le chapitre est centré (il peut être plus haut qu'un écran)
            const shift = Math.max(0, (sr.height - vh) / 2);
            const bottom = Math.min(1, Math.max(0.25, (tr.top - sr.top - shift) / vh));
            return { top: (header + 8) / vh, bottom: bottom - 0.02 };
          });
          list.push({ top: 0.3, bottom: 0.7 }); // scène « calme »
          stage.setBands(list);
        } else stage.setBands(null);
      };
      const timeline = () => {
        if (centers.length < 2) return 0;
        const vc = window.scrollY + window.innerHeight / 2;
        let i = 0;
        while (i < centers.length - 2 && vc >= centers[i + 1]) i++;
        const f = (vc - centers[i]) / (centers[i + 1] - centers[i]);
        return i + Math.max(0, Math.min(1, f));
      };
      const update = () => {
        const t = timeline();
        stage.setTimeline(t);
        const nowActive = t < centers.length - 1.02 || window.scrollY < centers[centers.length - 1];
        if (nowActive !== active) {
          active = nowActive;
          host.dataset.active = active ? "true" : "false";
          if (active) start();
          else setTimeout(() => { if (!active) stage.stop(); }, 900);
        }
      };
      measure();
      update();
      let ticking = false;
      let lastY = window.scrollY, lastT = performance.now();
      const onScroll = () => {
        // Vitesse en écrans par seconde, pour la turbulence de la matière
        const now = performance.now();
        const dtv = Math.max(16, now - lastT) / 1000;
        stage.setVelocity((window.scrollY - lastY) / window.innerHeight / dtv);
        lastY = window.scrollY; lastT = now;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { update(); ticking = false; });
      };
      // Un souffle à chaque changement de scène (si le son est activé)
      stage.onScene(() => sfx("step"));
      const onResize = () => { measure(); update(); };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      // Les chapitres peuvent changer de hauteur après le chargement des polices
      const ro = new ResizeObserver(onResize);
      ro.observe(document.body);

      const onPointer = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        stage.setPointer((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, true);
      };
      const onLeave = () => stage.setPointer(0, 0, false);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("pointerleave", onLeave);

      const start = () => {
        if (document.hidden || motionPause.get() || !active) return;
        stage.start();
      };
      const onVisibility = () => (document.hidden ? stage.stop() : start());
      document.addEventListener("visibilitychange", onVisibility);
      const offPause = motionPause.subscribe((p) => (p ? stage.stop() : start()));
      if (reduced) stage.renderOnce();
      else start();

      cleanup = () => {
        offPause();
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", onVisibility);
        stage.dispose();
      };
    })();

    return () => {
      disposed = true;
      seen.disconnect();
      delete document.documentElement.dataset.stage;
      cleanup();
    };
  }, []);

  return (
    <div ref={hostRef} className="stage" data-state={state} aria-hidden>
      {state === "fallback" && (
        // Sans 3D temps réel : une lumière fixe, même composition
        <div className="stage-fallback">
          <div className="glow-accent" />
        </div>
      )}
    </div>
  );
}
