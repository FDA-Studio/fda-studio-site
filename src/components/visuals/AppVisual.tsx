/** Téléphone vivant : liste qui défile, notification, graphique qui se trace. */
const rows = ["Maintenance planifiée", "Devis signé", "Nouveau client", "Intervention terminée", "Paiement reçu", "Rapport envoyé"];

export function AppVisual() {
  return (
    <div className="relative mx-auto grid w-full max-w-[34rem] place-items-center" aria-hidden>
      <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(110,75,255,0.22),transparent)]" />
      {/* Tableau de bord en arrière-plan */}
      <div className="absolute left-0 top-10 hidden w-[62%] rounded-2xl border border-line-strong bg-ink/90 p-4 sm:block">
        <div className="flex gap-2">
          {["+12 %", "4,7/5", "1 h 40"].map((k) => (
            <div key={k} className="flex-1 rounded-lg border border-line p-2">
              <div className="h-1.5 w-8 rounded bg-line-strong" />
              <div className="mt-2 font-display text-sm text-paper">{k}</div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 220 80" className="mt-3 w-full">
          <path d="M0 70 C30 60 45 40 70 46 S110 20 140 24 180 8 220 6" fill="none" stroke="#2f5bff" strokeWidth="2" pathLength={1} strokeDasharray="1" style={{ animation: "chart-draw 4s var(--ease-out-expo) infinite" }} />
        </svg>
      </div>
      {/* Téléphone */}
      <div className="relative z-10 ml-auto mr-2 w-[14.5rem] rounded-[2.4rem] border border-line-strong bg-[#0d0d0f] p-2.5 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] sm:mr-0">
        <div className="relative h-[24rem] overflow-hidden rounded-[2rem] bg-ink">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2"><div className="h-5 w-20 rounded-full bg-black" /></div>
          <div className="absolute inset-x-3 top-9 z-20 rounded-2xl border border-line-strong bg-raised/95 p-3 backdrop-blur" style={{ animation: "notif 6s var(--ease-out-expo) infinite" }}>
            <p className="text-[11px] text-muted">Agent IA</p>
            <p className="text-xs text-paper">Nouvelle demande qualifiée</p>
          </div>
          <div className="px-4 pt-12">
            <p className="font-display text-sm text-paper">Aujourd’hui</p>
            <div className="mt-3 h-[18rem] overflow-hidden">
              <ul className="space-y-2" style={{ animation: "app-scroll 14s linear infinite" }}>
                {[...rows, ...rows].map((r, i) => (
                  <li key={i} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5">
                    <span className={`h-6 w-6 shrink-0 rounded-full ${i % 3 === 0 ? "bg-accent" : i % 3 === 1 ? "bg-violet" : "bg-line-strong"}`} />
                    <span className="text-[11px] text-paper">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
