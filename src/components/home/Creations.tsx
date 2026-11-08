"use client";

import { useEffect, useRef } from "react";
import { VoiceAgent } from "@/components/creations/VoiceAgent";
import { ChatAssistant } from "@/components/creations/ChatAssistant";
import { Automation } from "@/components/creations/Automation";
import { DocReader } from "@/components/creations/DocReader";
import { reducedMotion, setupGsap } from "@/lib/motion";

const items = [
  { n: "01", title: "Agent vocal", line: "Il décroche, comprend, déplace le rendez-vous et confirme par SMS. Jour et nuit.", Demo: VoiceAgent, tint: "from-accent/25" },
  { n: "02", title: "Assistant client", line: "Il répond en deux secondes à partir de vos données, puis déclenche l’action.", Demo: ChatAssistant, tint: "from-violet/25" },
  { n: "03", title: "Automatisation", line: "Une demande entre, elle est qualifiée, saisie dans le CRM et chiffrée. Vous validez.", Demo: Automation, tint: "from-accent/25" },
  { n: "04", title: "Lecture de documents", line: "Factures, bons, contrats : les données sont lues, extraites et classées.", Demo: DocReader, tint: "from-violet/25" },
];

/**
 * Créations IA (concepts de démonstration) en cartes qui s'empilent au défilement.
 * Empilement en CSS sticky (fluide sur mobile), recul des cartes précédentes piloté par GSAP.
 */
export function Creations() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    const { gsap } = setupGsap();
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector("[data-card-inner]"), {
          scale: 0.9,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 90%", end: "top 15%", scrub: true },
        });
      });
      gsap.from("[data-creations-title] > *", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-creations-title]", start: "top 80%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="creations" aria-labelledby="creations-title" className="relative bg-ink pb-[20svh] pt-[var(--section-y)]">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="creations-title" data-creations-title className="overflow-hidden text-[clamp(2.8rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
            <span className="block">L’IA,</span>
            <span className="block text-muted">en vrai.</span>
          </h2>
          <p className="max-w-sm text-soft">
            Quatre exemples de ce que nous intégrons dans les entreprises. Ce sont des concepts de démonstration : données et noms fictifs.
          </p>
        </div>

        <ol className="mt-16 md:mt-24">
          {items.map(({ n, title, line, Demo, tint }, i) => (
            <li
              key={n}
              data-card
              className="sticky mb-[55svh] last:mb-0 md:mb-[35svh]"
              style={{ top: `calc(4.5rem + ${i * 0.9}rem)` }}
            >
              <article
                data-card-inner
                className="relative grid origin-top overflow-hidden rounded-[1.75rem] border border-line-strong bg-surface will-change-transform md:grid-cols-12"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tint} via-transparent to-transparent`} aria-hidden />
                <div className="relative flex flex-col p-5 md:col-span-5 md:p-10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-accent-bright">{n}</span>
                    <span className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Concept</span>
                  </div>
                  <h3 className="mt-4 text-[clamp(1.9rem,4vw,3.5rem)] md:mt-6 font-semibold leading-[0.95] tracking-[-0.045em]">{title}</h3>
                  <p className="mt-3 max-w-sm text-sm text-soft md:mt-4 md:text-base">{line}</p>
                </div>
                <div className="relative h-[27rem] overflow-hidden border-t border-line bg-ink md:col-span-7 md:h-auto md:min-h-[32rem] md:border-l md:border-t-0">
                  <Demo />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
