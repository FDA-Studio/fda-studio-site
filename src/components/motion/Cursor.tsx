"use client";

import { useEffect, useRef, useState } from "react";
import { finePointer, reducedMotion } from "@/lib/motion";

/**
 * Curseur d'accompagnement (souris uniquement) : un anneau qui suit le pointeur,
 * grossit sur les éléments interactifs et affiche le libellé de [data-cursor].
 * Le curseur natif reste visible : aucune perte d'accessibilité.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    setEnabled(true);
    const el = ring.current;
    if (!el) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button");
      const text = target?.dataset.cursor ?? "";
      setLabel(text);
      el.dataset.state = text ? "label" : target ? "hover" : "";
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => (el.dataset.state = "hidden");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={ring} className="cursor-ring" aria-hidden>
      <span>{label}</span>
    </div>
  );
}
