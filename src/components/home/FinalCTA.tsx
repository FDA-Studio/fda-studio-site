"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/icons";
import { finePointer, reducedMotion, setupGsap } from "@/lib/motion";
import { site } from "@/lib/site";

/** Appel final : titre monumental révélé lettre à lettre, bouton magnétique. */
export function FinalCTA() {
  const title = useRef<HTMLHeadingElement>(null);
  const magnet = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const { gsap, SplitText } = setupGsap();
    const el = title.current;
    let split: InstanceType<typeof SplitText> | null = null;
    let tween: gsap.core.Tween | null = null;
    if (el && !reducedMotion()) {
      split = new SplitText(el, { type: "chars", mask: "chars" });
      tween = gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: "top 80%" },
      });
    }
    const btn = magnet.current;
    if (!btn || !finePointer() || reducedMotion()) return () => { tween?.kill(); split?.revert(); };
    const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const reset = () => { xTo(0); yTo(0); };
    btn.addEventListener("pointermove", move);
    btn.addEventListener("pointerleave", reset);
    return () => {
      btn.removeEventListener("pointermove", move);
      btn.removeEventListener("pointerleave", reset);
      tween?.kill();
      split?.revert();
    };
  }, []);

  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden">
      <div className="glow-accent pointer-events-none absolute -bottom-1/2 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2" aria-hidden />
      <div className="wrap relative flex min-h-[90svh] flex-col justify-center py-24">
        <h2 ref={title} id="final-title" className="text-[clamp(4rem,17vw,16rem)] text-paper font-semibold leading-[0.85] tracking-[-0.06em]">
          Parlons-en.
        </h2>
        <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-lg text-soft">Un site, une IA, une application ou un jeu. Réponse sous deux jours ouvrés.</p>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <Link ref={magnet} href="/contact/" className="btn btn-primary !h-16 !px-10 text-base" data-cursor="Go">
              Démarrer un projet <span className="btn-icon"><ArrowIcon /></span>
            </Link>
            <a href={`mailto:${site.email}`} className="link-line font-mono text-sm text-muted hover:text-paper">{site.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
