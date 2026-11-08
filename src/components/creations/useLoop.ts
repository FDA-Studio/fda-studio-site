"use client";

import { useEffect, useRef, useState } from "react";
import { useLive } from "@/components/motion/Live";

/**
 * Fait avancer un compteur d'étapes en boucle, seulement quand la zone <Live> parente tourne
 * (visible et pas en pause). Elle reprend là où elle s'était arrêtée.
 * Avec « réduire les animations », reste sur la dernière étape, l'état complet.
 */
export function useLoop<T extends HTMLElement>(durations: number[]) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);
  const live = useLive();
  const current = useRef(0);
  const key = durations.join(",");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(durations.length - 1);
      return;
    }
    if (!live) return;
    let timer = 0;
    const next = () => {
      timer = window.setTimeout(() => {
        current.current = (current.current + 1) % durations.length;
        setStep(current.current);
        next();
      }, durations[current.current]);
    };
    next();
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, live]);

  return { ref, step };
}

/** Texte qui se tape caractère par caractère quand `active` passe à vrai. */
export function useTyping(text: string, active: boolean, speed = 22) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setN(Math.min(i, text.length));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed]);
  return text.slice(0, n);
}
