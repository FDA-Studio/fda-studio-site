"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/icons";
import { WebVisual } from "@/components/visuals/WebVisual";
import { AIVisual } from "@/components/visuals/AIVisual";
import { AppVisual } from "@/components/visuals/AppVisual";
import { GameVisual } from "@/components/visuals/GameVisual";
import { reducedMotion, setupGsap } from "@/lib/motion";

const panels = [
  { slug: "web", title: ["Sites", "& expériences web"], line: "Des sites premium, rapides et pensés pour convertir.", Visual: WebVisual, bg: "bg-ink" },
  { slug: "ia", title: ["Intelligence", "artificielle"], line: "Des agents qui traitent vos demandes. Un humain qui valide.", Visual: AIVisual, bg: "bg-graphite" },
  { slug: "applications", title: ["Applications", "& produits"], line: "Web, iOS, Android, SaaS : de l’idée au produit utilisé.", Visual: AppVisual, bg: "bg-ink" },
  { slug: "gaming", title: ["Gaming", "& interactif"], line: "Nous créons aussi nos propres mondes, à commencer par Door Knight.", Visual: GameVisual, bg: "bg-night" },
] as const;

/**
 * Les quatre expertises en plein écran.
 * Ordinateur : défilement horizontal épinglé. Mobile : panneaux empilés.
 */
export function ExpertiseRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const rail = track.current;
    if (!root || !rail) return;
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    const reduce = reducedMotion();

    mm.add("(min-width: 1024px)", () => {
      if (reduce) return;
      const distance = () => rail.scrollWidth - window.innerWidth;
      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
        },
      });
      // Les titres de chaque panneau glissent légèrement en parallaxe
      rail.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 18, opacity: 0.2 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el.closest("[data-panel]"), containerAnimation: tween, start: "left 90%", end: "left 30%", scrub: true },
          },
        );
      });
    });

    mm.add("(max-width: 1023px)", () => {
      if (reduce) return;
      rail.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.from(panel.querySelectorAll("[data-parallax], [data-visual]"), {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: panel, start: "top 75%" },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={section} id="expertises" aria-labelledby="expertises-title" className="relative overflow-hidden">
      <h2 id="expertises-title" className="sr-only">Nos quatre expertises</h2>
      <div ref={track} className="flex flex-col lg:h-[100svh] lg:w-max lg:flex-row">
        {panels.map(({ slug, title, line, Visual, bg }) => (
          <article
            key={slug}
            data-panel
            className={`relative flex min-h-[100svh] w-full items-center ${bg} lg:h-full lg:w-[100vw] lg:shrink-0`}
          >
            <div className="wrap grid items-center gap-12 py-24 lg:grid-cols-12 lg:gap-10 lg:py-0">
              <div data-parallax className="lg:col-span-6">
                <h3 className="text-[clamp(2.6rem,5.6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                  <span className="block whitespace-nowrap">{title[0]}</span>
                  <span className="block whitespace-nowrap text-muted">{title[1]}</span>
                </h3>
                <p className="mt-8 max-w-md text-lg text-soft md:text-xl">{line}</p>
                <Link href={`/services/${slug}/`} className="btn btn-ghost mt-10" data-cursor="Découvrir">
                  Découvrir <ArrowIcon />
                </Link>
              </div>
              <div data-visual className="min-w-0 lg:col-span-6">
                <Visual />
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 hidden h-px bg-line lg:block" aria-hidden>
        <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
