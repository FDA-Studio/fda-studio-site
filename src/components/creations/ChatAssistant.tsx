"use client";

import { useLoop, useTyping } from "./useLoop";

/** Bloc qui se déplie : tant qu'il est caché, il ne prend aucune place (la conversation reste collée en bas). */
function Reveal({ on, children, className = "" }: { on: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} ${className}`}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

const answer = "Votre colis est parti ce matin. Livraison prévue demain avant 13 h. Voulez-vous recevoir le suivi par SMS ?";

const checks = ["Commande 20481 retrouvée", "Transporteur interrogé", "Livraison prévue demain avant 13 h"];

/** Assistant client sur un site e-commerce : question, vérifications visibles, réponse sourcée, action. */
export function ChatAssistant() {
  const { ref, step } = useLoop<HTMLDivElement>([1400, 1200, 2300, 3300, 1500, 2800]);
  const typed = useTyping(answer, step >= 3);
  return (
    <div ref={ref} className="flex h-full flex-col p-5 md:p-7">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-violet text-sm font-semibold text-white">IA</span>
        <div>
          <p className="text-sm font-medium text-paper">Assistant client</p>
          <p className="flex items-center gap-1.5 text-[11px] text-ok"><span className="h-1.5 w-1.5 rounded-full bg-ok" />Répond en moins de 2 s, jour et nuit</p>
        </div>
      </div>

      {/* La conversation reste collée en bas : l'historique remonte et s'efface sous l'en-tête */}
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden py-4 [mask-image:linear-gradient(to_bottom,transparent,black_2.5rem)]">
        <p className="text-center text-[10px] text-muted">Hier</p>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-paper/80 px-4 py-2.5 text-sm text-ink">Vous livrez le samedi ?</div>
        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-raised px-4 py-2.5 text-sm leading-relaxed text-soft">Oui, le samedi de 9 h à 13 h, sans supplément.</div>
        <p className="text-center text-[10px] text-muted">Aujourd’hui</p>
        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-raised px-4 py-2.5 text-sm leading-relaxed text-soft">
          Bonjour ! Je peux suivre une commande, modifier une livraison ou répondre à vos questions.
        </div>

        <Reveal on={step >= 1}>
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-paper px-4 py-2.5 text-sm text-ink">Où en est ma commande n° 20481 ?</div>
        </Reveal>

        {/* Ce que l'assistant vérifie avant de répondre */}
        <Reveal on={step >= 2}>
        <ol className="space-y-1 font-mono text-[11px]">
          {checks.map((c, i) => (
            <li
              key={c}
              className="flex items-center gap-2 text-muted"
              style={{ transition: "opacity 300ms", transitionDelay: step === 2 ? `${i * 550}ms` : "0ms", opacity: step >= 2 ? 1 : 0 }}
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 fill-none stroke-ok" strokeWidth="3" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              {c}
            </li>
          ))}
        </ol>
        </Reveal>

        <Reveal on={step >= 3}>
        <div className={`max-w-[90%] rounded-2xl rounded-bl-md border border-line-strong bg-raised px-4 py-3 text-sm leading-relaxed text-paper`}>
          <span className={step === 3 && typed.length < answer.length ? "caret" : ""}>{typed}</span>
          <span className={`mt-2 block text-[11px] text-muted transition-opacity duration-500 ${step >= 4 ? "opacity-100" : "opacity-0"}`}>Source : suivi transporteur, mis à jour à 08:12</span>
          <span className={`mt-3 flex flex-wrap gap-2 transition-opacity duration-500 ${step >= 4 ? "opacity-100" : "opacity-0"}`}>
            <span className={`rounded-full px-3 py-1 text-xs transition-colors ${step >= 5 ? "bg-accent text-white" : "border border-line-strong text-soft"}`}>Oui, par SMS</span>
            <span className="rounded-full border border-line-strong px-3 py-1 text-xs text-soft">Non merci</span>
          </span>
        </div>
        </Reveal>

        <Reveal on={step >= 5}>
        <p className="flex items-center justify-center gap-2 text-xs text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          Suivi activé, ticket fermé automatiquement
        </p>
        </Reveal>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm text-muted">
        Écrivez votre question…
        <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-accent text-white">↑</span>
      </div>
    </div>
  );
}
