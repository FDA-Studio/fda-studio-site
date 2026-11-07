"use client";

import { useEffect } from "react";
import { reducedMotion, setupGsap } from "@/lib/motion";

/** Au défilement, le titre du hero s'éloigne et se floute pendant que la sculpture monte. */
export function HeroScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const { gsap } = setupGsap();
    const ctx = gsap.context(() => {
      gsap.to("#hero-title", {
        yPercent: -35,
        scale: 0.92,
        opacity: 0,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("#hero-foot", {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "60% top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
