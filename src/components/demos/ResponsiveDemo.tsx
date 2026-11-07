"use client";

import { useState } from "react";

const devices = [
  { id: "mobile", label: "Mobile", width: "22rem" },
  { id: "tablet", label: "Tablette", width: "38rem" },
  { id: "desktop", label: "Ordinateur", width: "100%" },
] as const;

/**
 * Démonstration du responsive : la même page se recompose selon l'écran.
 * La mise en page réagit à la largeur de son conteneur (container queries).
 */
export function ResponsiveDemo() {
  const [device, setDevice] = useState<(typeof devices)[number]["id"]>("desktop");
  const current = devices.find((d) => d.id === device)!;

  return (
    <div>
      <div role="group" aria-label="Taille d’écran" className="flex flex-wrap gap-2">
        {devices.map((d) => (
          <button key={d.id} type="button" aria-pressed={device === d.id} onClick={() => setDevice(d.id)} className="chip">
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-line bg-graphite p-3 md:p-5">
        <div
          className="mx-auto max-w-full overflow-hidden rounded-xl border border-line-strong bg-ink transition-[width] duration-700 ease-[var(--ease-out-expo)]"
          style={{ width: current.width }}
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-3" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="ml-3 h-5 flex-1 rounded-full bg-surface" />
          </div>
          {/* Page fictive « Atelier Martin » */}
          <div className="p-5 @container">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-paper">Atelier Martin</span>
              <span className="hidden gap-4 text-xs text-muted @[34rem]:flex"><span>Savoir-faire</span><span>Réalisations</span><span>Contact</span></span>
              <span className="flex flex-col gap-1 @[34rem]:hidden" aria-hidden><span className="h-px w-4 bg-paper" /><span className="h-px w-4 bg-paper" /></span>
            </div>
            <div className="mt-8 grid gap-6 @[34rem]:grid-cols-2 @[34rem]:items-center">
              <div>
                <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-paper @[34rem]:text-3xl @[50rem]:text-5xl">Le mobilier sur mesure, fabriqué en Touraine.</p>
                <p className="mt-3 text-sm text-muted">Exemple fictif de site vitrine.</p>
                <span className="mt-5 inline-block rounded-full bg-accent px-4 py-2 text-xs font-medium text-white">Demander un devis</span>
              </div>
              <div className="aspect-[4/3] rounded-lg bg-[radial-gradient(circle_at_30%_30%,#3a3a3a,#141414)]" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 @[34rem]:grid-cols-3 @[50rem]:grid-cols-4">
              {["Cuisines", "Bibliothèques", "Dressings", "Agencement"].map((t, i) => (
                <div key={t} className={`rounded-lg border border-line p-3 ${i === 3 ? "hidden @[50rem]:block" : ""}`}>
                  <div className="aspect-square rounded bg-surface" />
                  <p className="mt-2 text-xs text-paper">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">Exemple fictif. Changez la taille d’écran : la mise en page se recompose, elle n’est pas simplement réduite.</p>
    </div>
  );
}
