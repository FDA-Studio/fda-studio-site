"use client";
import { useEffect, useState } from "react";

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

/**
 * Garde un panneau affiché le temps de son animation de sortie : `shown` reste vrai pendant
 * `exitMs` après la fermeture, et `closing` le signale au CSS. Sans animation (mouvement réduit),
 * la fermeture est immédiate.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [shown, setShown] = useState(open);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (open) {
      setShown(true);
      setClosing(false);
      return;
    }
    if (reducedMotion()) {
      setShown(false);
      setClosing(false);
      return;
    }
    setClosing(true);
    const t = window.setTimeout(() => {
      setShown(false);
      setClosing(false);
    }, exitMs);
    return () => window.clearTimeout(t);
  }, [open, exitMs]);
  return { shown: open || shown, closing: !open && closing };
}
