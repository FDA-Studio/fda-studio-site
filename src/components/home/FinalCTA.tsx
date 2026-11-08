"use client";

import { ContactForm } from "@/components/ContactForm";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/icons";
import { finePointer, reducedMotion, setupGsap } from "@/lib/motion";
import { site } from "@/lib/site";

/** Contact : titre monumental révélé lettre à lettre, formulaire de projet, bouton e-mail magnétique. */
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
    <section id="contact" aria-labelledby="final-title" className="relative overflow-hidden border-t border-line">
      <div className="glow-accent pointer-events-none absolute -top-1/3 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2" aria-hidden />
      <div className="wrap relative py-[var(--section-y)]">
        <h2 ref={title} id="final-title" className="text-[clamp(4rem,17vw,16rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-paper">
          Parlons-en.
        </h2>
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="max-w-sm text-lg text-soft">Un site, une IA, une application ou un jeu. Décrivez votre projet : réponse sous deux jours ouvrés.</p>
            <a ref={magnet} href={`mailto:${site.email}`} className="btn btn-ghost mt-8" data-cursor="Écrire">
              {site.email} <ArrowIcon />
            </a>
            <p className="mt-10 text-sm text-muted">{site.region}. Projets en France et à distance.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
