"use client";

import { useEffect, useRef, useState } from "react";

const SYMBOL = "M0 0H48V24H24V48H40V72H24V120H0Z M72 -1.5A61.5 61.5 0 0 1 72 121.5Z M98 28L112 80H84Z";

/**
 * Intro de première visite (une fois par session) : le monogramme se trace,
 * un compteur monte, puis le rideau se lève sur le hero.
 * Rendu dans le HTML mais affiché uniquement si <html> porte la classe « intro »
 * (posée par un script en tête de page, avant le premier affichage).
 */
export function Intro() {
  const [count, setCount] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro")) return;
    const start = performance.now();
    const duration = 1150;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(step);
      else {
        root.current?.classList.add("is-leaving");
        // Le hero démarre pendant que le rideau se lève
        window.setTimeout(() => html.classList.remove("intro"), 120);
        try { sessionStorage.setItem("fda-intro", "1"); } catch { /* stockage indisponible */ }
        window.setTimeout(() => root.current?.remove(), 1100);
      }
    };
    raf = requestAnimationFrame(step);
    // Filet de sécurité : jamais bloqué derrière l'intro
    const safety = window.setTimeout(() => html.classList.remove("intro"), 4000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <div ref={root} className="intro-overlay" aria-hidden>
      <svg viewBox="-4 -6 142 132" className="intro-symbol">
        <path d={SYMBOL} pathLength={1} fillRule="evenodd" />
      </svg>
      <span className="intro-count">{String(count).padStart(3, "0")}</span>
    </div>
  );
}

/** Script inline : décide avant le premier affichage si l'intro doit jouer. */
export const introScript = `try{if(!sessionStorage.getItem('fda-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&location.pathname==='/'){document.documentElement.classList.add('intro')}}catch(e){}`;
