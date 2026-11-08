"use client";

import { useEffect } from "react";

/** Anciennes pages (avant le passage à une page unique) → section correspondante de l'accueil. */
const map: [string, string][] = [
  ["/services/ia", "/agence-ia-tours/"],
  ["/services/web", "/creation-site-internet-tours/"],
  ["/services/apps", "/developpement-application-tours/"],
  ["/services", "/#expertises"],
  ["/work", "/#creations"],
  ["/about", "/"],
  ["/contact", "/#contact"],
  ["/experience", "/"],
];

export function LegacyRedirect() {
  useEffect(() => {
    const path = window.location.pathname;
    const hit = map.find(([from]) => path === from || path.startsWith(from + "/"));
    if (hit) window.location.replace(hit[1]);
  }, []);
  return null;
}
