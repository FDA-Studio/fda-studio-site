"use client";

import Link from "next/link";
import { useState } from "react";
import { services } from "@/lib/services";
import { ServiceEmblem } from "@/components/ServiceEmblem";
import { ArrowIcon, PlusIcon } from "@/components/icons";
import { sfx } from "@/lib/sound";

/**
 * Les quatre expertises en liste éditoriale dépliable.
 * Une seule ouverte à la fois ; au survol (pointeur fin) ou au clic / tap.
 */
export function Expertises() {
  const [active, setActive] = useState(0);

  return (
    <section id="expertises" aria-labelledby="expertises-title" className="section scroll-mt-16 bg-graphite">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="expertises-title" className="text-title max-w-[14ch]">Quatre expertises, une seule équipe.</h2>
          <p className="max-w-sm text-muted">
            Chaque projet mobilise les compétences dont il a besoin. Un site peut intégrer un agent IA, une application peut devenir un jeu.
          </p>
        </div>

        <ul className="mt-16 border-t border-line md:mt-24">
          {services.map((s, i) => {
            const open = active === i;
            return (
              <li key={s.slug} className="border-b border-line" onMouseEnter={() => window.matchMedia("(pointer: fine)").matches && setActive(i)}>
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`exp-${s.slug}`}
                    id={`exp-btn-${s.slug}`}
                    onClick={() => { setActive(i); sfx("tick"); }}
                    className="group flex w-full items-center gap-5 py-7 text-left md:gap-10 md:py-10"
                  >
                    <span className={`hidden w-14 font-display text-sm transition-colors md:block ${open ? "text-accent-bright" : "text-muted"}`}>{s.letter}</span>
                    <span
                      className={`flex-1 font-display text-[clamp(1.6rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.045em] transition-colors duration-500 ${
                        open ? "text-paper" : "text-paper/55 group-hover:text-paper/80"
                      }`}
                    >
                      {s.shortName}
                    </span>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${open ? "rotate-45 border-accent text-accent-bright" : "border-line-strong text-muted"}`}>
                      <PlusIcon />
                    </span>
                  </button>
                </h3>
                <div
                  id={`exp-${s.slug}`}
                  role="region"
                  aria-labelledby={`exp-btn-${s.slug}`}
                  className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" inert={!open}>
                    <div className="grid gap-8 pb-10 md:grid-cols-12 md:pb-14 md:pl-24">
                      <div className="md:col-span-5">
                        <p className="text-lg text-paper/90">{s.summary}</p>
                        <Link href={`/services/${s.slug}/`} className="btn btn-ghost mt-8">
                          Découvrir l’expertise <ArrowIcon />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-1 gap-x-8 gap-y-3 text-muted sm:grid-cols-2 md:col-span-4">
                        {s.offers.map((o) => (
                          <li key={o.title} className="flex items-center gap-3">
                            <span className="h-px w-3 bg-accent" aria-hidden />
                            {o.title}
                          </li>
                        ))}
                      </ul>
                      <div className="hidden text-steel md:col-span-3 md:block">
                        <ServiceEmblem slug={s.slug} className="ml-auto h-44 w-44" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
