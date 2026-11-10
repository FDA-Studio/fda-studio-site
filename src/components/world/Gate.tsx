"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { getSound } from "@/lib/sound";
import { reducedMotion } from "@/lib/motion";
import { GateField } from "./GateField";

const WORDS = ["Sites internet.", "Applications.", "Agents IA.", "Jeux vidéo."];

/**
 * Écran d'arrivée : pendant le chargement du monde, des particules de lumière se rassemblent
 * dans le symbole FD et les métiers du studio défilent. Puis le choix d'entrer avec ou sans le
 * son : le clic est le geste qui autorise l'audio sur tous les navigateurs, et le vol ne
 * commence qu'une fois tous les films en mémoire.
 */
export function Gate({ progress, ready, onEnter }: { progress: number; ready: boolean; onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [word, setWord] = useState(0);
  const [still, setStill] = useState(true);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => setStill(reducedMotion()), []);

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

  // Les métiers du studio défilent pendant le chargement
  useEffect(() => {
    if (ready || still) return;
    const id = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 1100);
    return () => window.clearInterval(id);
  }, [ready, still]);

  const enter = (withSound: boolean) => {
    if (leaving) return;
    try {
      localStorage.setItem("fda-sound", withSound ? "on" : "off");
    } catch {
      /* stockage indisponible */
    }
    if (withSound) void getSound().enable(); // dans le geste du clic
    setLeaving(true);
    onEnter();
    window.setTimeout(() => setGone(true), 1000);
  };

  if (gone) return null;
  const pct = Math.round(progress * 100);

  return (
    <div className="gate" data-sound-gate data-leaving={leaving ? "true" : "false"} data-ready={ready ? "true" : "false"} role="dialog" aria-modal="true" aria-labelledby="gate-title">
      {!still && <GateField progress={progress} ready={ready} leaving={leaving} target={mark} />}
      <div className="gate__glow" aria-hidden />

      <div className="gate__inner">
        <div ref={mark} className="gate__mark">
          <Logo variant="symbol" decorative className="gate__logo" />
        </div>
        <p id="gate-title" className="gate__title">FDA Studio</p>

        <p className="gate__words" aria-live="polite">
          {ready ? (
            <span key="ready" className="gate__word">Le studio est prêt.</span>
          ) : (
            <span key={word} className="gate__word">{WORDS[word]}</span>
          )}
        </p>

        <div className="gate__meter">
          <div className="gate__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Chargement du studio">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          <span className="gate__pct" aria-hidden>
            {String(pct).padStart(3, "0")}
          </span>
        </div>

        <div className="gate__actions">
          <button type="button" className="btn btn-primary" disabled={!ready} onClick={() => enter(true)}>
            Entrer avec le son
          </button>
          <button type="button" className="btn btn-ghost" disabled={!ready} onClick={() => enter(false)}>
            Entrer sans le son
          </button>
        </div>
        <p className="gate__hint">Faites défiler pour traverser le studio. Le son se coupe à tout moment en haut à droite.</p>
      </div>
    </div>
  );
}
