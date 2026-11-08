"use client";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Pause globale des animations en boucle (WCAG 2.2.2 : tout ce qui bouge plus de 5 s
 * doit pouvoir être arrêté). Un seul état pour tout le site, mémorisé pour la session.
 */
type Listener = (paused: boolean) => void;
const listeners = new Set<Listener>();
let paused: boolean | null = null;

const read = () => {
  if (paused === null) {
    try {
      paused = sessionStorage.getItem("fda-pause") === "1";
    } catch {
      paused = false;
    }
  }
  return paused;
};

export const motionPause = {
  get: () => (typeof window === "undefined" ? false : read()),
  set(value: boolean) {
    paused = value;
    try {
      sessionStorage.setItem("fda-pause", value ? "1" : "0");
    } catch {
      /* stockage indisponible : l'état reste en mémoire */
    }
    document.documentElement.dataset.paused = value ? "true" : "false";
    listeners.forEach((l) => l(value));
  },
  toggle() {
    this.set(!read());
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
