"use client";

import { useEffect, useRef } from "react";
import { WebVisual } from "@/components/visuals/WebVisual";
import { AIVisual } from "@/components/visuals/AIVisual";
import { AppVisual } from "@/components/visuals/AppVisual";
import { reducedMotion, setupGsap } from "@/lib/motion";

const panels = [
  { title: ["Sites", "& expériences web"], line: "Des sites premium, rapides, pensés pour convertir.", Visual: WebVisual, bg: "bg-ink" },
  { title: ["Intelligence", "artificielle"], line: "Des agents qui traitent vos demandes. Un humain qui valide.", Visual: AIVisual, bg: "bg-graphite" },
  { title: ["Applications", "& produits"], line: "Web, iOS, Android, SaaS : de l’idée au produit utilisé.", Visual: AppVisual, bg: "bg-ink" },
] as const;

/**
 * Les expertises en plein écran, en défilement horizontal épinglé (ordinateur et mobile).
 * Sans animation (réglage système), les panneaux s'empilent simplement.
 */
export function ExpertiseRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const rail = track.current;
    if (!root || !rail || reducedMotion()) return;
    const { gsap } = setupGsap();
    root.dataset.rail = "on";
    const ctx = gsap.context(() => {
      const distance = () => rail.scrollWidth - window.innerWidth;
      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
        },
      });
      rail.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel, i) => {
        if (i === 0) return;
        gsap.fromTo(
          panel.querySelectorAll("[data-parallax]"),
          { xPercent: 25, opacity: 0.15 },
          { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 95%", end: "left 35%", scrub: true } },
        );
        gsap.fromTo(
          panel.querySelector("[data-visual]"),
          { xPercent: 40, rotate: 4, scale: 0.85 },
          { xPercent: 0, rotate: 0, scale: 1, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 100%", end: "left 20%", scrub: true } },
        );
      });
    }, root);
    return () => {
      ctx.revert();
      delete root.dataset.rail;
    };
  }, []);

  return (
    <section ref={section} id="expertises" aria-labelledby="expertises-title" className="group/rail relative overflow-hidden">
      <h2 id="expertises-title" className="sr-only">Nos expertises</h2>
      <div ref={track} className="flex flex-col group-data-[rail=on]/rail:h-[100svh] group-data-[rail=on]/rail:w-max group-data-[rail=on]/rail:flex-row">
        {panels.map(({ title, line, Visual, bg }, i) => (
          <article
            key={i}
            data-panel
            className={`relative flex min-h-[100svh] w-full items-center ${bg} group-data-[rail=on]/rail:h-full group-data-[rail=on]/rail:w-[100vw] group-data-[rail=on]/rail:shrink-0`}
          >
            <div className="wrap grid items-center gap-6 py-20 md:grid-cols-12 md:gap-10 md:py-0">
              <div data-parallax className="md:col-span-6">
                <p className="font-mono text-xs text-accent-bright">0{i + 1} / 03</p>
                <h3 className="mt-4 text-[clamp(2.4rem,5.6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                  <span className="block">{title[0]}</span>
                  <span className="block text-muted">{title[1]}</span>
                </h3>
                <p className="mt-5 max-w-md text-base text-soft md:mt-8 md:text-xl">{line}</p>
              </div>
              <div data-visual className="mx-auto w-full max-w-[22rem] min-w-0 md:col-span-6 md:max-w-none">
                <Visual />
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 hidden h-px bg-line group-data-[rail=on]/rail:block" aria-hidden>
        <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
