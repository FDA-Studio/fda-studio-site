"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/icons";
import { categoryLabels, natureLabels, projects } from "@/lib/projects";
import { asset } from "@/lib/site";
import { reducedMotion, setupGsap } from "@/lib/motion";

const picks = ["door-knight", "fda-holding", "doorknight-games"];

/** Trois réalisations réelles : l'image se dévoile et glisse en parallaxe au défilement. */
export function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const list = picks.map((s) => projects.find((p) => p.slug === s)!).filter((p) => p?.image);

  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    const { gsap } = setupGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-work]").forEach((card) => {
        const frame = card.querySelector("[data-frame]");
        const img = card.querySelector("img");
        gsap.fromTo(frame, { clipPath: "inset(18% 12% 18% 12% round 24px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: card, start: "top 90%", end: "top 30%", scrub: true },
        });
        gsap.fromTo(img, { yPercent: -10, scale: 1.18 }, {
          yPercent: 10,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="work-title" className="section">
      <div className="wrap">
        <div className="flex items-end justify-between gap-6">
          <h2 id="work-title" className="text-title">Réalisations</h2>
          <Link href="/work/" className="link-line hidden text-muted hover:text-paper sm:inline">Toutes les réalisations</Link>
        </div>
        <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
          {list.map((p, i) => (
            <article key={p.slug} data-work className={`group md:w-[78%] ${i % 2 ? "md:ml-auto" : ""}`}>
              <Link href={`/work/${p.slug}/`} data-cursor="Voir" className="block" aria-label={`${p.title} : ${p.summary}`}>
                <div data-frame className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-graphite">
                  <img
                    src={p.image!.src.startsWith("/") ? asset(p.image!.src) : p.image!.src}
                    alt={p.image!.alt}
                    width={p.image!.width}
                    height={p.image!.height}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover will-change-transform"
                    style={{ objectPosition: p.image!.position ?? "center" }}
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                  <h3 className="text-[clamp(1.8rem,4vw,3.5rem)] font-semibold tracking-[-0.045em] transition-colors group-hover:text-accent-bright">{p.title}</h3>
                  <p className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    <span>{p.categories.map((c) => categoryLabels[c]).join(" / ")}</span>
                    <span className="rounded-full border border-line-strong px-2.5 py-1 normal-case tracking-normal">{natureLabels[p.nature]}</span>
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <Link href="/work/" className="btn btn-ghost mt-20 sm:hidden">Toutes les réalisations <ArrowIcon /></Link>
      </div>
    </section>
  );
}
