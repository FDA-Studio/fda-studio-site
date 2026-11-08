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
      data-sound-toggle
      onClick={() => getSound().toggle()}
      aria-pressed={on}
      className="inline-flex min-h-11 items-center gap-3 text-sm text-muted transition-colors duration-150 hover:text-paper"
    >
      <span className={`h-2 w-2 rounded-full ${on ? "bg-accent" : "bg-steel"}`} aria-hidden />
      <span className="link-line">{on ? "Expérience sonore activée" : "Activer l’expérience sonore"}</span>
    </button>
  );
}
