"use client";

import { useEffect, useState } from "react";
import { getSound } from "@/lib/sound";

/** Bouton son : coupé par défaut, active l'ouverture sonore et la nappe ambiante. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const engine = getSound();
    setOn(engine.enabled);
    const unsub = engine.subscribe(setOn);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        engine.setDepth(window.scrollY / (window.innerHeight * 1.5));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      unsub();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => getSound().toggle()}
      aria-pressed={on}
      aria-label={on ? "Couper le son" : "Activer le son"}
      title={on ? "Couper le son" : "Activer le son"}
      className={`group relative grid h-11 w-11 place-items-center rounded-full border transition-colors ${
        on ? "border-accent text-paper" : "border-line-strong text-muted hover:border-steel hover:text-paper"
      } ${className}`}
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full ${on ? "bg-accent-bright" : "bg-current"}`}
            style={{
              height: on ? "100%" : `${[35, 60, 45, 30][i]}%`,
              transformOrigin: "bottom",
              animation: on ? `eq 1.1s ${i * 0.17}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </span>
    </button>
  );
}
