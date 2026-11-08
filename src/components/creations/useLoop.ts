"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fait avancer un compteur d'étapes en boucle, uniquement quand l'élément est visible.
 * `durations[i]` = temps passé à l'étape i (ms). Avec « réduire les animations », reste sur la dernière étape.
 */
export function useLoop<T extends HTMLElement>(durations: number[]) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);
  const key = durations.join(",");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(durations.length - 1);
      return;
    }
    let timer = 0;
    let current = 0;
    let running = false;
    const next = () => {
      timer = window.setTimeout(() => {
        current = (current + 1) % durations.length;
        setStep(current);
        next();
      }, durations[current]);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        next();
      } else if (!e.isIntersecting && running) {
        running = false;
        window.clearTimeout(timer);
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

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
