"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motionPause } from "@/lib/motion";

/** Vrai quand les boucles d'une zone doivent tourner : visible à l'écran et pas en pause. */
const LiveContext = createContext(false);
export const useLive = () => useContext(LiveContext);

/** État de la pause globale, synchronisé entre tous les composants. */
export function usePaused() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setPaused(motionPause.get());
    return motionPause.subscribe(setPaused);
  }, []);
  return paused;
}

/**
 * Zone animée : ses boucles (CSS et minuteries) ne tournent que lorsqu'elle est visible
 * et que la pause globale n'est pas active. Hors écran, rien ne consomme de batterie.
 */
export function Live({
  children,
  className = "",
  threshold = 0.2,
  enabled = true,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  /** Faux : la zone reste figée même visible (ex. une démo masquée derrière une autre). */
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const paused = usePaused();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const running = visible && !paused && enabled;
  return (
    <div ref={ref} className={className} data-live={running ? "on" : "off"}>
      <LiveContext.Provider value={running}>{children}</LiveContext.Provider>
    </div>
  );
}

/** Bouton pause / lecture des animations, commun à tout le site. */
export function PauseButton({ className = "" }: { className?: string }) {
  const paused = usePaused();
  return (
    <button
      type="button"
      onClick={() => motionPause.toggle()}
      className={`pause-btn ${className}`}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        {paused ? <path d="M4.5 3v10l8.5-5z" fill="currentColor" /> : <path d="M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z" fill="currentColor" />}
      </svg>
      <span aria-hidden>{paused ? "Lecture" : "Pause"}</span>
      <span className="sr-only">{paused ? "Relancer la lecture des animations" : "Mettre les animations en pause"}</span>
    </button>
  );
}
