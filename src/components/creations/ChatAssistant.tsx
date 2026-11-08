"use client";

import { useLoop, useTyping } from "./useLoop";

const answer = "Votre colis est parti ce matin. Livraison prévue demain avant 13 h. Voulez-vous recevoir le suivi par SMS ?";

/** Assistant client sur un site e-commerce : question, réflexion, réponse sourcée, action. */
export function ChatAssistant() {
  const { ref, step } = useLoop<HTMLDivElement>([1200, 1400, 1300, 3400, 1800, 2400]);
  const typed = useTyping(answer, step >= 3);
  return (
    <div ref={ref} className="flex h-full flex-col p-5 md:p-8">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-violet text-sm font-semibold text-white">IA</span>
        <div>
          <p className="text-sm font-medium text-paper">Assistant client</p>
          <p className="flex items-center gap-1.5 text-[11px] text-ok"><span className="h-1.5 w-1.5 rounded-full bg-ok" />Répond en moins de 2 s</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 py-5">
        <div className={`ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-paper px-4 py-2.5 text-sm text-ink transition-all duration-500 ${step >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          Où en est ma commande n° 20481 ?
        </div>

        <div className={`flex items-center gap-2 font-mono text-[11px] text-muted transition-opacity duration-300 ${step === 2 ? "opacity-100" : "h-0 opacity-0"}`}>
          <span className="flex gap-1">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1.5 w-1.5 rounded-full bg-accent-bright" style={{ animation: `pulse-dot 0.9s ${d * 0.15}s infinite` }} />
            ))}
          </span>
          Consultation du suivi transporteur…
        </div>

        <div className={`max-w-[88%] rounded-2xl rounded-bl-md border border-line-strong bg-raised px-4 py-3 text-sm leading-relaxed text-paper transition-all duration-500 ${step >= 3 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <span className={step === 3 && typed.length < answer.length ? "caret" : ""}>{typed}</span>
          <span className={`mt-3 flex flex-wrap gap-2 transition-opacity duration-500 ${step >= 4 ? "opacity-100" : "opacity-0"}`}>
            <span className={`rounded-full px-3 py-1 text-xs transition-colors ${step >= 5 ? "bg-accent text-white" : "border border-line-strong text-soft"}`}>Oui, par SMS</span>
            <span className="rounded-full border border-line-strong px-3 py-1 text-xs text-soft">Non merci</span>
          </span>
        </div>

        <p className={`text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-opacity duration-500 ${step >= 5 ? "opacity-100" : "opacity-0"}`}>
          Suivi activé · ticket fermé automatiquement
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm text-muted">
        Écrivez votre question…
        <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-accent text-white">↑</span>
      </div>
    </div>
  );
}
