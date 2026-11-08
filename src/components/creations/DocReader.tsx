"use client";

import { useLoop } from "./useLoop";

const fields = [
  ["Fournisseur", "Atelier Martin SARL"],
  ["N° facture", "F-2026-0412"],
  ["Date", "04/11/2026"],
  ["Montant HT", "4 280,00 €"],
  ["TVA", "856,00 €"],
  ["Échéance", "04/12/2026"],
];

/** Lecture de documents : la facture est scannée, les champs sont repérés puis extraits. */
export function DocReader() {
  const { ref, step } = useLoop<HTMLDivElement>([1800, 700, 700, 700, 700, 700, 700, 2400]);
  const found = Math.max(0, step - 1);
  return (
    <div ref={ref} className="grid h-full gap-4 p-5 sm:grid-cols-2 sm:gap-5 md:p-8">
      {/* Facture */}
      <div className="relative overflow-hidden rounded-xl bg-[#f4f4f2] p-4 text-[9px] leading-tight text-[#2b2d31] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] md:text-[10px]">
        <div className="flex justify-between">
          <span className={`rounded px-1 font-bold transition-colors ${found >= 1 ? "bg-accent/25 outline outline-1 outline-accent" : ""}`}>ATELIER MARTIN SARL</span>
          <span className="font-bold">FACTURE</span>
        </div>
        <div className="mt-3 flex justify-between">
          <span className="hidden sm:inline">12 rue des Tanneurs<br />37000 Tours</span>
          <span className="text-right">
            <span className={`rounded px-1 transition-colors ${found >= 2 ? "bg-accent/25 outline outline-1 outline-accent" : ""}`}>N° F-2026-0412</span><br />
            <span className={`rounded px-1 transition-colors ${found >= 3 ? "bg-accent/25 outline outline-1 outline-accent" : ""}`}>04/11/2026</span>
          </span>
        </div>
        <div className="mt-4 hidden space-y-1.5 border-t border-[#2b2d31]/20 pt-3 sm:block">
          {["Mobilier sur mesure", "Pose et réglages", "Déplacement"].map((l, i) => (
            <div key={l} className="flex justify-between"><span>{l}</span><span>{["3 600,00", "560,00", "120,00"][i]} €</span></div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-[#2b2d31]/20 pt-3 text-right">
          <div><span className={`rounded px-1 transition-colors ${found >= 4 ? "bg-accent/25 outline outline-1 outline-accent" : ""}`}>Total HT 4 280,00 €</span></div>
          <div><span className={`rounded px-1 transition-colors ${found >= 5 ? "bg-accent/25 outline outline-1 outline-accent" : ""}`}>TVA 20 % 856,00 €</span></div>
          <div className="font-bold">Total TTC 5 136,00 €</div>
        </div>
        <div className="mt-3"><span className={`rounded px-1 transition-colors ${found >= 6 ? "bg-accent/25 outline outline-1 outline-accent" : ""}`}>À régler avant le 04/12/2026</span></div>
        {/* Faisceau de lecture */}
        <div
          className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-accent/30 to-transparent"
          style={{ animation: step === 0 ? "scan 1.8s cubic-bezier(.65,0,.35,1) both" : "none", top: step === 0 ? undefined : "-4rem" }}
          aria-hidden
        />
      </div>

      {/* Champs extraits */}
      <div className="flex flex-col">
        <p className="text-xs text-muted">Données extraites</p>
        <dl className="mt-3 space-y-1.5 sm:space-y-2">
          {fields.map(([k, v], i) => (
            <div key={k} className={`flex items-baseline justify-between gap-3 border-b border-line pb-2 text-sm transition-[transform,opacity] duration-300 ease-out ${found > i ? "translate-x-0 opacity-100" : "translate-x-2 opacity-80"}`}>
              <dt className="text-muted">{k}</dt>
              <dd className="text-right text-paper">{found > i ? v : "…"}</dd>
            </div>
          ))}
        </dl>
        <p className={`mt-auto pt-4 text-sm transition-opacity duration-500 ${step >= 7 ? "text-ok opacity-100" : "opacity-0"}`}>✓ Envoyée en comptabilité, prête à valider</p>
      </div>
    </div>
  );
}
