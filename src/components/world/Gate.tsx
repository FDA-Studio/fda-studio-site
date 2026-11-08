"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { getSound } from "@/lib/sound";

/**
 * Écran d'arrivée : fond noir, logo, progression du chargement du monde, puis le choix
 * d'entrer avec ou sans le son. Le clic est le geste qui autorise l'audio sur tous les
 * navigateurs, et le vol ne commence qu'une fois tous les films en mémoire : plus de
 * saccade due à un segment qui arrive pendant le défilement.
 */
export function Gate({ progress, ready, onEnter }: { progress: number; ready: boolean; onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  // Tant que l'écran est là, la page ne défile pas
  useEffect(() => {
    if (gone) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = prev;
    };
  }, [gone]);

  const enter = (withSound: boolean) => {
    if (leaving) return;
    if (withSound) {
      try { localStorage.setItem("fda-sound", "on"); } catch { /* stockage indisponible */ }
      void getSound().enable(); // dans le geste du clic
    } else {
      try { localStorage.setItem("fda-sound", "off"); } catch { /* stockage indisponible */ }
    }
    setLeaving(true);
    onEnter();
    window.setTimeout(() => setGone(true), 900);
  };

  if (gone) return null;
  const pct = Math.round(progress * 100);

  return (
    <div className="gate" data-sound-gate data-leaving={leaving ? "true" : "false"} role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate__inner">
        <Logo variant="symbol" decorative className="gate__logo" />
        <p id="gate-title" className="gate__title">FDA Studio</p>
        <p className="gate__line">
          {ready ? "Le studio est prêt. Entrez, et faites défiler pour le traverser." : "Préparation du studio…"}
        </p>
        <div className="gate__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Chargement">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="gate__actions">
          <button type="button" className="btn btn-primary" disabled={!ready} onClick={() => enter(true)}>
            Entrer avec le son
          </button>
          <button type="button" className="btn btn-ghost" disabled={!ready} onClick={() => enter(false)}>
            Entrer sans le son
          </button>
        </div>
        <p className="gate__hint">Le son se coupe à tout moment avec le bouton en haut à droite.</p>
      </div>
    </div>
  );
}
