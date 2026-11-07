"use client";

import { useEffect, useState } from "react";
import { getSound } from "@/lib/sound";

/** Invitation discrète à activer l'expérience sonore (jamais de lecture automatique). */
export function SoundHint() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const engine = getSound();
    setOn(engine.enabled);
    return engine.subscribe(setOn);
  }, []);
  return (
    <button
      type="button"
      onClick={() => getSound().toggle()}
      aria-pressed={on}
      className="group inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-paper"
    >
      <span className={`relative grid h-2 w-2 place-items-center rounded-full ${on ? "bg-accent" : "bg-steel"}`} aria-hidden>
        {!on && <span className="absolute inset-0 rounded-full bg-accent-bright opacity-60" style={{ animation: "pulse-dot 1.8s infinite" }} />}
      </span>
      <span className="link-line">{on ? "Expérience sonore activée" : "Activer l’expérience sonore"}</span>
    </button>
  );
}
