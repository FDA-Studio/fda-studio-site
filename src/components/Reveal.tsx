"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";

/**
 * Révèle son contenu quand il entre dans le viewport (attribut data-shown).
 * Réservé aux grands titres : la révélation ligne par ligne est le seul
 * mouvement non déclenché par l'utilisateur hors du hero.
 */
export function Reveal({
  as = "div",
  className,
  children,
  id,
}: {
  as?: "div" | "h1" | "h2" | "h3" | "p";
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.shown = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(as, { ref, className, id, "data-shown": "false" }, children);
}

/** Titre révélé ligne par ligne. */
export function RevealTitle({
  lines,
  as = "h2",
  className = "",
  id,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <Reveal as={as} className={className} id={id}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line">
          <span style={{ ["--i" as string]: i }}>{line}</span>
        </span>
      ))}
    </Reveal>
  );
}
