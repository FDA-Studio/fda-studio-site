"use client";

import { useEffect, useRef } from "react";
import { reducedMotion, setupGsap } from "@/lib/motion";

/** Une seule phrase, qui s'allume mot à mot au rythme du défilement. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap, SplitText } = setupGsap();
    const split = new SplitText(el, { type: "words", wordsClass: "word", aria: "none" });
    if (reducedMotion()) {
      gsap.set(split.words, { opacity: 1 });
      return () => split.revert();
    }
    const tween = gsap.to(split.words, {
      opacity: 1,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: 1 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, []);
  return (
    <section aria-label="Notre vision" className="section">
      <div className="wrap">
        <p className="sr-only">Nous concevons des sites, des intelligences et des mondes qui se vivent.</p>
        <p ref={ref} aria-hidden className="fill-text max-w-[20ch] font-display text-[clamp(2.2rem,6.4vw,6rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-paper">
          Nous concevons des sites, des intelligences et des mondes qui se vivent.
        </p>
      </div>
    </section>
  );
}
