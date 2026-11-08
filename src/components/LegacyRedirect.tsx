"use client";

import { useEffect } from "react";

/** Anciennes pages (avant le passage à une page unique) → section correspondante de l'accueil. */
const map: [string, string][] = [
  ["/services/ia", "/#creations"],
  ["/services", "/#expertises"],
  ["/work", "/#creations"],
  ["/gaming", "/#doorknight"],
  ["/about", "/"],
  ["/contact", "/#contact"],
];

export function LegacyRedirect() {
  useEffect(() => {
    const path = window.location.pathname;
    const hit = map.find(([from]) => path === from || path.startsWith(from + "/"));
    if (hit) window.location.replace(hit[1]);
  }, []);
  return null;
}
