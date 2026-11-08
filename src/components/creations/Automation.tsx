"use client";

import { useLoop } from "./useLoop";

/** Pictogrammes au trait (24 × 24, trait 1,6) : un seul style pour toute la chaîne. */
const icons = {
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2z",
  card: "M4 5h16v14H4zM8 9h8M8 13h8M8 17h5",
  euro: "M17 6.5A6 6 0 1 0 17 17.5M5 10h9M5 14h9",
  check: "M5 12.5l4.5 4.5L19 7.5",
} as const;

const nodes = [
  { label: "E-mail reçu", sub: "Demande de devis", icon: icons.mail },
  { label: "Agent IA", sub: "Lit et qualifie", icon: icons.spark },
  { label: "CRM", sub: "Fiche créée", icon: icons.card },
  { label: "Devis", sub: "Brouillon prêt", icon: icons.euro },
  { label: "Équipe", sub: "Validation", icon: icons.check },
];

/** Chaîne d'automatisation : la demande traverse chaque étape, qui s'allume à son passage. */
export function Automation() {
  const { ref, step } = useLoop<HTMLDivElement>([900, 900, 900, 900, 900, 1800]);
  return (
    <div ref={ref} className="flex h-full flex-col p-5 md:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-paper">Traitement des demandes entrantes</p>
        <span className="flex items-center gap-2 text-xs text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          Actif
        </span>
      </div>

      <div className="relative my-auto py-6">
        {/* Rail et impulsion : vertical sur mobile, horizontal sur ordinateur */}
        <div className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-line-strong md:hidden" aria-hidden>
          <div className="h-full w-full origin-top bg-accent transition-transform duration-[900ms] ease-[var(--ease-out-expo)]" style={{ transform: `scaleY(${Math.min(step, 4) / 4})` }} />
        </div>
        <div className="absolute left-6 right-6 top-[3.1rem] hidden h-px bg-line-strong md:block" aria-hidden>
          <div className="h-full w-full origin-left bg-accent transition-transform duration-[900ms] ease-[var(--ease-out-expo)]" style={{ transform: `scaleX(${Math.min(step, 4) / 4})` }} />
        </div>
        <ol className="relative grid gap-5 md:grid-cols-5 md:gap-3">
          {nodes.map((n, i) => {
            const on = step >= i;
            return (
              <li key={n.label} className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
                <span
                  className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-300 ease-out md:h-12 md:w-12 ${
                    on ? "border-accent bg-accent text-white shadow-[0_0_30px_rgba(47,91,255,0.55)]" : "border-line-strong bg-ink text-muted"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={n.icon} />
                  </svg>
                  {step === i && <span className="absolute inset-0 rounded-2xl border border-accent-bright" style={{ animation: "ping-soft 1s ease-out infinite" }} />}
                </span>
                <span>
                  <span className={`block text-sm transition-colors ${on ? "text-paper" : "text-muted"}`}>{n.label}</span>
                  <span className="block text-[11px] text-muted">{n.sub}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={`rounded-2xl border border-line-strong bg-raised p-4 transition-[transform,opacity] duration-300 ease-out ${step >= 5 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-80"}`}>
        <p className="text-xs text-muted">Résultat</p>
        <p className="mt-1 text-sm text-paper">Demande traitée en 38 secondes. Devis prêt à envoyer après relecture.</p>
      </div>
    </div>
  );
}
