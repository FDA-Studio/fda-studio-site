"use client";

import { useEffect, useRef } from "react";
import { reducedMotion, setupGsap } from "@/lib/motion";

const words = ["Sites web", "Intelligence artificielle", "Applications", "Jeux vidéo", "Automatisation", "3D temps réel"];

/** Bandeau infini : son sens et sa vitesse suivent le défilement. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || reducedMotion()) return;
    const { gsap, ScrollTrigger } = setupGsap();
    const tween = gsap.to(el, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 300);
        gsap.to(tween, { timeScale: (self.direction || 1) * (1 + Math.abs(v)), duration: 0.3, overwrite: true });
        gsap.to(tween, { timeScale: self.direction || 1, duration: 1.2, delay: 0.3 });
      },
    });
    return () => {
      st.kill();
      tween.kill();
    };
  }, []);
  const line = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {words.map((w) => (
        <span key={w} className="flex items-center gap-10">
          <span className="marquee-word text-[clamp(3rem,9vw,8.5rem)]">{w}</span>
          <svg viewBox="0 0 134 124" className="h-[clamp(1.4rem,3vw,2.6rem)] w-auto shrink-0 fill-accent" aria-hidden>
            <path fillRule="evenodd" d="M98 28L112 80H84Z" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label="Nos domaines" className="overflow-hidden border-y border-line py-10 md:py-14">
      <div ref={track} className="flex w-max">
        {line}
        {line}
      </div>
    </section>
  );
}
