"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/icons";
import { doorKnight as dk } from "@/lib/doorknight";
import { reducedMotion, setupGsap } from "@/lib/motion";

/**
 * Plongée dans la porte de Door Knight : au défilement, la porte grandit
 * jusqu'à remplir l'écran, puis l'univers du jeu apparaît.
 */
export function DoorPortal() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = setupGsap();
    if (reducedMotion()) {
      gsap.set(el.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const narrow = window.innerWidth < 768;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 1 },
      });
      tl.fromTo("[data-door]", { scale: narrow ? 0.9 : 0.75 }, { scale: narrow ? 5 : 7, ease: "power2.in", duration: 1 }, 0)
        .to("[data-intro]", { opacity: 0, y: -40, duration: 0.3 }, 0.05)
        .to("[data-flash]", { opacity: 1, duration: 0.25 }, 0.72)
        .fromTo("[data-reveal]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.25 }, 0.85);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="portal-title" className="relative h-[100svh] overflow-hidden bg-night">
      <div className="absolute inset-0 grid place-items-center">
        <img
          data-door
          src={dk.door}
          alt=""
          width={1640}
          height={2050}
          loading="lazy"
          decoding="async"
          className="h-[78svh] w-auto max-w-none origin-[46%_58%] will-change-transform"
        />
      </div>
      <div data-flash className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2a1f55,#0d0b1c_70%)] opacity-0" aria-hidden />

      <div data-intro className="absolute inset-x-0 top-[12svh] text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#a59fc0]">Nos propres univers</p>
        <p className="mx-auto mt-4 max-w-[16ch] text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.045em]">Franchissez la porte.</p>
      </div>

      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <h2 id="portal-title" className="sr-only">Door Knight, le jeu de FDA Studio</h2>
          <img data-reveal src={dk.wordmark} alt="Door Knight" width={1200} height={799} loading="lazy" decoding="async" className="mx-auto h-auto w-[min(30rem,80vw)] opacity-0" />
          <p data-reveal className="mx-auto mt-6 max-w-md text-lg text-[#c9c4dc] opacity-0">
            Jeu d’action 3D pour iPhone, iPad et Android. Mille portes, dix mondes, quatre héros.
          </p>
          <Link data-reveal href="/gaming/" className="btn btn-primary mt-8 opacity-0" data-cursor="Entrer">
            Entrer dans l’univers <span className="btn-icon"><ArrowIcon /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
