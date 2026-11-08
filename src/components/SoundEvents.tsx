"use client";

import { useEffect } from "react";
import { sfx } from "@/lib/sound";

/**
 * Retour sonore des gestes : un « tick » à l'appui sur un bouton, un lien ou un choix.
 * À l'appui (pas au survol) : le son répond à une action, jamais au simple passage de la souris.
 * Sans effet tant que le visiteur n'a pas activé le son.
 */
export function SoundEvents() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a, button, .chip, summary");
      if (!target || target.closest("[data-sound-toggle]")) return;
      sfx("tick");
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
