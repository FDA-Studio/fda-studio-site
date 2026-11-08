"use client";

import { useEffect } from "react";
import { getSound, sfx, soundOptedOut } from "@/lib/sound";

/**
 * Retour sonore des gestes : un « tick » à l'appui sur un bouton, un lien ou un choix.
 * À l'appui (pas au survol) : le son répond à une action, jamais au simple passage de la souris.
 * Sans effet tant que le visiteur n'a pas activé le son.
 *
 * Démarrage automatique : au premier geste du visiteur (toucher, clic, touche clavier), le son
 * s'active — sur téléphone, c'est le premier défilement. La molette seule n'est pas un geste
 * autorisé par les navigateurs : sur ordinateur, le premier clic ou la première touche suffit.
 * Un visiteur qui a coupé le son n'est jamais relancé (choix mémorisé). Le bouton reste visible.
 */
export function SoundEvents() {
  useEffect(() => {
    const engine = getSound();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const auto = (e: Event) => {
      // Le bouton son garde son propre comportement (sinon : activé par le geste, puis coupé par le clic)
      if ((e.target as HTMLElement | null)?.closest?.("[data-sound-toggle]")) return;
      if (engine.enabled || reduced || soundOptedOut()) return;
      void engine.enable();
    };
    const opts = { passive: true, once: true } as const;
    const onKey = (e: KeyboardEvent) => { if (!e.metaKey && !e.ctrlKey && !e.altKey) auto(e); };
    document.addEventListener("pointerdown", auto, opts);
    document.addEventListener("touchstart", auto, opts);
    document.addEventListener("keydown", onKey, opts);
    document.documentElement.dataset.soundAuto = engine.enabled ? "on" : soundOptedOut() || reduced ? "off" : "waiting";
    const off = engine.subscribe((on) => { document.documentElement.dataset.soundAuto = on ? "on" : "off"; });

    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a, button, .chip, summary");
      if (!target || target.closest("[data-sound-toggle]")) return;
      sfx("tick");
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerdown", auto);
      document.removeEventListener("touchstart", auto);
      document.removeEventListener("keydown", onKey);
      off();
    };
  }, []);
  return null;
}
