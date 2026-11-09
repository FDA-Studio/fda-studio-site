"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useLoop } from "./useLoop";

/**
 * Notre CRM (FDA Studio Business Manager) rejoué avec des données fictives :
 * une demande arrive du site, la fiche et l'opportunité se créent, l'iPhone sonne,
 * le devis part puis est signé en ligne, le chiffre du mois monte.
 * Ordinateur : l'app web dans une fenêtre et l'app iPhone par-dessus. Téléphone : l'iPhone seul.
 */

const LEAD = { name: "Maison Verlaine", need: "Site internet", budget: "5 à 15 k€", amount: "6 468 €" };
const BASE = 14_250;
const SIGNED = BASE + 6_468;
const BARS = [18, 32, 0, 41, 52, 30, 0, 61, 44, 57, 78];

// 0 calme · 1 demande reçue · 2 fiche créée · 3 devis envoyé · 4 devis signé · 5 tenue
const DURATIONS = [1300, 1700, 1500, 1600, 1900, 2400];

function useCount(target: number, from: number) {
  const [v, setV] = useState(from);
  const cur = useRef(from);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cur.current = target;
      setV(target);
      return;
    }
    const start = cur.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      cur.current = Math.round(start + (target - start) * e);
      setV(cur.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

const eur = (n: number) => `${n.toLocaleString("fr-FR")} €`;

function Notification({ show, title, body }: { show: boolean; title: string; body: string }) {
  return (
    <div
      className={`absolute inset-x-2 top-9 z-20 flex items-start gap-2 rounded-[14px] border border-white/10 bg-[#1f2025]/95 p-2 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)] backdrop-blur transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] ${
        show ? "translate-y-0 opacity-100" : "-translate-y-[140%] opacity-0"
      }`}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-ink">
        <Logo variant="symbol" decorative className="h-3 w-auto text-paper" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[9.5px] font-semibold text-paper">{title}</span>
        <span className="mt-0.5 line-clamp-2 block text-[9px] text-soft">{body}</span>
      </span>
    </div>
  );
}

function Phone({ step, className = "" }: { step: number; className?: string }) {
  const signed = useCount(step >= 4 ? SIGNED : BASE, BASE);
  const max = Math.max(...BARS, Math.round((signed / SIGNED) * 100));
  return (
    <div className={`relative rounded-[2.4rem] border border-[#3a3c42] bg-[#050506] p-[7px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.04)_inset] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[1.95rem] bg-ink">
        {/* Barre d'état et Dynamic Island */}
        <div className="flex items-center justify-between px-5 pt-2.5 text-[9px] font-semibold text-paper">
          <span>18:24</span>
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-[7px] w-3 rounded-[2px] border border-paper/70" />
          </span>
        </div>
        <div className="absolute left-1/2 top-2 h-[18px] w-[62px] -translate-x-1/2 rounded-full bg-black" aria-hidden />

        <Notification show={step === 1 || step === 2} title="Nouvelle demande" body={`${LEAD.name} — ${LEAD.budget}`} />
        <Notification show={step === 4 || step === 5} title="Devis signé" body={`${LEAD.name}, ${LEAD.amount} TTC`} />

        <div className="px-3.5 pt-5">
          <p className="text-[8.5px] text-muted">Lundi 9 novembre</p>
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-paper">Bonsoir Antoine</p>

          <div className="mt-3 rounded-[14px] bg-surface p-3">
            <p className="text-[8.5px] text-muted">Signé en novembre</p>
            <p className="mt-0.5 text-[21px] font-semibold tabular-nums tracking-[-0.03em] text-paper">{eur(signed)}</p>
            <div className="mt-2.5 flex h-12 items-end gap-[3px]">
              {[...BARS, Math.round((signed / SIGNED) * 100)].map((h, i, a) => (
                <span
                  key={i}
                  className={`flex-1 rounded-[2px] transition-[height] duration-700 ease-[var(--ease-out-expo)] ${i === a.length - 1 ? "bg-accent" : "bg-white/15"}`}
                  style={{ height: `${h ? Math.max(6, (h / max) * 100) : 4}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-[14px] bg-surface">
            <div className="border-r border-line p-2.5">
              <p className="text-[8px] text-muted">En attente</p>
              <p className="text-[13px] font-semibold tabular-nums text-paper">{step >= 3 && step < 4 ? 4 : 3}</p>
            </div>
            <div className="p-2.5">
              <p className="text-[8px] text-muted">Prospects</p>
              <p className="text-[13px] font-semibold tabular-nums text-paper">{step >= 2 && step < 3 ? 6 : 5}</p>
            </div>
          </div>

          <p className="mb-1.5 mt-3 text-[9px] font-semibold text-paper">Aujourd’hui</p>
          <div className="overflow-hidden rounded-[14px] bg-surface">
            <div className={`flex items-center gap-2 border-b border-line px-2.5 transition-[max-height,opacity] duration-500 ${step >= 2 ? "max-h-10 py-2 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-accent-bright" />
              <span className="truncate text-[9px] text-paper">Rappeler {LEAD.name}</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-line-strong" />
              <span className="truncate text-[9px] text-soft">Relancer Atelier Nord</span>
            </div>
          </div>
        </div>

        {/* Barre d'onglets */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-line bg-ink/95 px-3 pb-3 pt-2" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-[3px] w-4 rounded-full ${i === 0 ? "bg-accent" : "bg-white/20"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

const COLS = ["Prospect", "Devis envoyé", "Accepté"] as const;
const STATIC: Record<(typeof COLS)[number], { n: string; v: string }[]> = {
  Prospect: [
    { n: "Domaine des Aubiers", v: "9 000 €" },
    { n: "Brasserie Loire", v: "3 800 €" },
  ],
  "Devis envoyé": [
    { n: "Atelier Nord", v: "6 468 €" },
    { n: "Clinique Saint-Roch", v: "5 760 €" },
  ],
  Accepté: [{ n: "Kinetic Sport", v: "12 400 €" }],
};

function Browser({ step }: { step: number }) {
  const signed = useCount(step >= 4 ? SIGNED : BASE, BASE);
  const col = step >= 4 ? 2 : step >= 3 ? 1 : 0;
  const cardOn = step >= 2;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-line-strong bg-ink shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
      {/* Barre du navigateur */}
      <div className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2" aria-hidden>
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto rounded-md bg-ink px-6 py-0.5 text-[10px] text-muted">app.fdastudio.fr</span>
        <span className="w-8" />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Barre latérale */}
        <div className="flex w-11 shrink-0 flex-col items-center gap-3 border-r border-line bg-[#0d0e10] py-3" aria-hidden>
          <Logo variant="symbol" decorative className="mb-2 h-4 w-auto text-paper" />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-[5px] w-[18px] rounded-full ${i === 1 ? "bg-accent" : "bg-white/15"}`} />
          ))}
        </div>

        <div className="relative min-w-0 flex-1 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] text-muted">Suivi commercial</p>
              <p className="text-lg font-semibold tracking-[-0.02em] text-paper">Pipeline</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted">Signé en novembre</p>
              <p className={`text-lg font-semibold tabular-nums tracking-[-0.02em] transition-colors duration-500 ${step >= 4 ? "text-ok" : "text-paper"}`}>{eur(signed)}</p>
            </div>
          </div>

          {/* Toast : la demande arrive du site */}
          <div
            className={`absolute right-4 top-14 z-10 w-56 rounded-xl border border-accent/50 bg-raised p-2.5 shadow-[0_16px_40px_-12px_rgba(47,91,255,0.55)] transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] ${
              step === 1 ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
          >
            <p className="text-[10px] text-accent-bright">Demande reçue via fdastudio.fr</p>
            <p className="mt-0.5 text-xs font-medium text-paper">{LEAD.name}</p>
            <p className="text-[10px] text-muted">
              {LEAD.need}, {LEAD.budget}
            </p>
          </div>

          <div className="relative mt-4 grid grid-cols-3 gap-2.5">
            {COLS.map((c, i) => (
              <div key={c} className="min-w-0 rounded-xl border border-line bg-surface/60 p-2">
                <p className="flex items-center justify-between px-1 pb-2 text-[10px] font-medium text-soft">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${i === 2 ? "bg-ok" : i === 1 ? "bg-accent-bright" : "bg-muted"}`} />
                    {c}
                  </span>
                  <span className="tabular-nums text-muted">{STATIC[c].length + (cardOn && col === i ? 1 : 0)}</span>
                </p>
                {/* Emplacement réservé à la carte animée */}
                <div className="h-[4.15rem]" />
                <div className="mt-1.5 space-y-1.5">
                  {STATIC[c].map((s) => (
                    <div key={s.n} className="rounded-lg border border-line bg-ink p-2">
                      <p className="truncate text-[10.5px] text-paper">{s.n}</p>
                      <p className="text-[10px] tabular-nums text-muted">{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* La carte de la nouvelle demande traverse le pipeline */}
            <div
              className={`absolute top-[1.9rem] rounded-lg border p-2 transition-[left,opacity,transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] ${
                cardOn ? "scale-100 opacity-100" : "scale-95 opacity-0"
              } ${step >= 4 ? "border-ok/60 bg-[#13201a] shadow-[0_0_24px_-6px_rgba(127,191,142,0.5)]" : "border-accent bg-[#141a33] shadow-[0_0_28px_-6px_rgba(47,91,255,0.7)]"}`}
              style={{ left: `calc(${col} * (100% + 0.625rem) / 3 + 0.5rem)`, width: "calc((100% - 1.25rem) / 3 - 1rem)" }}
            >
              <p className="truncate text-[10.5px] font-medium text-paper">{LEAD.name}</p>
              <p className="text-[10px] tabular-nums text-muted">{step >= 3 ? LEAD.amount : LEAD.need}</p>
              <p className={`mt-0.5 text-[9px] ${step >= 4 ? "text-ok" : "text-accent-bright"}`}>{step >= 4 ? "Signé en ligne" : step >= 3 ? "Devis FDA-2026-008 envoyé" : "Nouvelle demande"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CrmShowcase() {
  const { ref, step } = useLoop<HTMLDivElement>(DURATIONS);
  return (
    <div ref={ref} className="relative h-full overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-[-30%] h-[70%] w-[70%] rounded-full bg-accent/20 blur-[90px]" />

      {/* Ordinateur : l'app web + l'iPhone par-dessus */}
      <div className="absolute inset-y-[7%] left-[5%] hidden w-[74%] md:block">
        <Browser step={step} />
      </div>
      <div className="absolute bottom-[-3.5rem] right-[5%] hidden h-[25rem] w-[12.2rem] md:block">
        <Phone step={step} className="h-full w-full" />
      </div>

      {/* Téléphone : l'iPhone seul, centré */}
      <div className="flex h-full items-start justify-center pt-6 md:hidden">
        <Phone step={step} className="h-[30rem] w-[14.6rem]" />
      </div>

      <p className="absolute bottom-3 left-[5%] hidden text-[11px] text-muted md:block">
        Notre CRM : app web et app iPhone synchronisées en temps réel.
      </p>
    </div>
  );
}
