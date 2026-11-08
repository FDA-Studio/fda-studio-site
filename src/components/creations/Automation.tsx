"use client";

import { useLoop } from "./useLoop";

const nodes = [
  { label: "E-mail reçu", sub: "Demande de devis", icon: "✉" },
  { label: "Agent IA", sub: "Lit et qualifie", icon: "◆" },
  { label: "CRM", sub: "Fiche créée", icon: "▤" },
  { label: "Devis", sub: "Brouillon prêt", icon: "€" },
  { label: "Équipe", sub: "Validation", icon: "✓" },
];

/** Chaîne d'automatisation : la demande traverse chaque étape, qui s'allume à son passage. */
export function Automation() {
  const { ref, step } = useLoop<HTMLDivElement>([900, 900, 900, 900, 900, 1800]);
  return (
    <div ref={ref} className="flex h-full flex-col p-5 md:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-paper">Traitement des demandes entrantes</p>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" style={{ animation: "pulse-dot 1.4s infinite" }} />
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
                  className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border text-base transition-all duration-500 md:h-12 md:w-12 ${
                    on ? "border-accent bg-accent text-white shadow-[0_0_30px_rgba(47,91,255,0.55)]" : "border-line-strong bg-ink text-muted"
                  }`}
                >
                  {n.icon}
                  {step === i && <span className="absolute inset-0 rounded-2xl border border-accent-bright" style={{ animation: "ping-soft 1s ease-out infinite" }} />}
                </span>
                <span>
                  <span className={`block text-sm transition-colors ${on ? "text-paper" : "text-muted"}`}>{n.label}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{n.sub}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={`rounded-2xl border border-line-strong bg-raised p-4 transition-all duration-500 ${step >= 5 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-80"}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Résultat</p>
        <p className="mt-1 text-sm text-paper">Demande traitée en 38 secondes. Devis prêt à envoyer après relecture.</p>
      </div>
    </div>
  );
}
