"use client";

import { useEffect, useState } from "react";

type Metric = { label: string; value: string; note: string };

/** Mesures réelles de la visite en cours, lues dans l'API Performance du navigateur. */
export function LiveMetrics() {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);

  useEffect(() => {
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const fcp = performance.getEntriesByName("first-contentful-paint")[0];
      const bytes = res.reduce((sum, r) => sum + (r.transferSize || 0), 0) + (nav?.transferSize || 0);
      const cached = bytes === 0;
      let webgl = "Non disponible";
      try {
        const c = document.createElement("canvas");
        if (c.getContext("webgl2")) webgl = "WebGL 2";
        else if (c.getContext("webgl")) webgl = "WebGL 1";
      } catch { /* indisponible */ }

      setMetrics([
        { label: "Premier affichage", value: fcp ? `${Math.round(fcp.startTime)} ms` : "n/d", note: "First Contentful Paint" },
        { label: "Page interactive", value: nav ? `${Math.round(nav.domInteractive)} ms` : "n/d", note: "DOM interactif" },
        { label: "Données transférées", value: cached ? "Cache" : `${(bytes / 1024).toFixed(0)} Ko`, note: cached ? "Servie depuis le cache" : `${res.length + 1} requêtes` },
        { label: "Cookies déposés", value: String(document.cookie ? document.cookie.split(";").length : 0), note: "Aucun traceur" },
        { label: "Rendu 3D", value: webgl, note: "Sculpture calculée en direct" },
        { label: "Animations", value: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "Réduites" : "Actives", note: "Selon vos réglages système" },
      ]);
    };
    if (document.readyState === "complete") measure();
    else window.addEventListener("load", measure, { once: true });
  }, []);

  return (
    <div className="panel p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-paper">Mesuré sur votre visite</p>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" style={{ animation: "pulse-dot 2s infinite" }} aria-hidden />
          En direct
        </span>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
        {(metrics ?? Array.from({ length: 6 }, () => null)).map((m, i) => (
          <div key={i} className="border-t border-line pt-4">
            <dt className="text-sm text-muted">{m?.label ?? "Mesure en cours"}</dt>
            <dd className="mt-2 font-display text-2xl tracking-[-0.03em] text-paper md:text-3xl">{m?.value ?? "…"}</dd>
            <dd className="mt-1 text-xs text-muted">{m?.note ?? " "}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
