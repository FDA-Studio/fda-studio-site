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

const LEAD = { name: "Maison Verlaine", initials: "MV", contact: "Claire Verlaine", need: "Site internet", budget: "5 à 15 k€", timeline: "1 à 3 mois", amount: "6 468 €" };
const BASE = 14_250;
const SIGNED = BASE + 6_468;
const BARS = [18, 32, 0, 41, 52, 30, 0, 61, 44, 57, 78];
const QUOTE = [
  ["Design et maquettes", "1 950 €"],
  ["Développement", "2 840 €"],
  ["SEO et mise en ligne", "600 €"],
] as const;

// 0 calme · 1 demande reçue · 2 fiche créée · 3 devis envoyé · 4 devis signé · 5 tenue
const DURATIONS = [1500, 2100, 2300, 2400, 2300, 2600];
// Écran affiché par l'iPhone à chaque étape : accueil, fiche client, devis
const SCREEN = [0, 0, 1, 2, 2, 0];
const STEPS = ["Demande", "Fiche client", "Devis", "Signé"] as const;
const stepOf = (step: number) => (step >= 4 ? 3 : step >= 3 ? 2 : step >= 2 ? 1 : step >= 1 ? 0 : -1);

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

/** Toucher simulé : un cercle qui s'enfonce là où « l'utilisateur » appuie. */
function Tap({ on, delay, className }: { on: boolean; delay: number; className: string }) {
  if (!on) return null;
  return <span aria-hidden className={`crm-tap pointer-events-none absolute h-7 w-7 rounded-full ${className}`} style={{ animationDelay: `${delay}ms` }} />;
}

/** Dynamic Island : se déploie en « activité en direct » à chaque événement. */
function Island({ step }: { step: number }) {
  const lead = step === 1;
  const won = step === 4 || step === 5;
  const open = lead || won;
  return (
    <div
      className={`absolute left-1/2 top-[7px] z-40 flex -translate-x-1/2 items-center overflow-hidden rounded-full bg-black transition-[width,height] duration-500 ease-[var(--ease-out-expo)] ${
        open ? "h-[30px] w-[88%]" : "h-[19px] w-[34%]"
      }`}
    >
      <div className={`flex w-full items-center gap-2 pl-[6px] pr-3 transition-opacity duration-300 ${open ? "opacity-100 delay-200" : "opacity-0"}`}>
        <span className={`grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full ${won ? "bg-ok" : "bg-accent"}`}>
          {won ? (
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-ink" strokeWidth="3.2" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          ) : (
            <Logo variant="symbol" decorative className="h-2.5 w-auto text-white" />
          )}
        </span>
        <span className="min-w-0 flex-1 truncate text-[9.5px] font-semibold text-paper">{won ? "Devis signé" : "Nouvelle demande"}</span>
        {won && <span className="shrink-0 text-[9.5px] font-semibold tabular-nums text-ok">+{LEAD.amount}</span>}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-line px-2.5 py-[7px] last:border-0">
      <span className="min-w-0 truncate text-[8.5px] text-muted">{k}</span>
      <span className="shrink-0 text-[9px] font-medium tabular-nums text-paper">{v}</span>
    </div>
  );
}

/** Accueil de l'app : chiffre du mois, compteurs, tâches du jour. */
function HomeScreen({ step }: { step: number }) {
  const signed = useCount(step >= 4 ? SIGNED : BASE, BASE);
  const last = Math.round((signed / SIGNED) * 100);
  const max = Math.max(...BARS, last);
  return (
    <div className="px-3.5 pt-11">
      <p className="text-[8.5px] text-muted">Lundi 9 novembre</p>
      <p className="text-[15px] font-semibold tracking-[-0.02em] text-paper">Bonsoir Antoine</p>

      <div className="mt-3 rounded-[14px] bg-surface p-3">
        <p className="text-[8.5px] text-muted">Signé en novembre</p>
        <p className={`mt-0.5 text-[21px] font-semibold tabular-nums tracking-[-0.03em] transition-colors duration-500 ${step === 5 ? "text-ok" : "text-paper"}`}>{eur(signed)}</p>
        <div className="mt-2.5 flex h-11 items-end gap-[3px]">
          {[...BARS, last].map((h, i, a) => (
            <span
              key={i}
              className={`flex-1 rounded-[2px] transition-[height] duration-700 ease-[var(--ease-out-expo)] ${i === a.length - 1 ? "bg-accent" : "bg-white/15"}`}
              style={{ height: `${h ? Math.max(6, (h / max) * 100) : 4}%` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-[14px] bg-surface">
        {[
          ["Prospects", step >= 1 && step < 5 ? 6 : step === 5 ? 5 : 5],
          ["Devis", step >= 3 && step < 4 ? 4 : 3],
          ["Signés", step >= 4 ? 5 : 4],
        ].map(([k, v], i) => (
          <div key={k} className={`p-2 ${i < 2 ? "border-r border-line" : ""}`}>
            <p className="text-[7.5px] text-muted">{k}</p>
            <p className="text-[13px] font-semibold tabular-nums text-paper">{v}</p>
          </div>
        ))}
      </div>

      <p className="mb-1.5 mt-3 text-[9px] font-semibold text-paper">Aujourd’hui</p>
      <div className="overflow-hidden rounded-[14px] bg-surface">
        <div className={`flex items-center gap-2 border-b border-line px-2.5 transition-[max-height,opacity,padding] duration-500 ${step >= 1 ? "max-h-10 py-2 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full border ${step === 5 ? "border-ok bg-ok" : "border-accent-bright"}`} />
          <span className={`truncate text-[9px] ${step === 5 ? "text-muted line-through" : "text-paper"}`}>Rappeler {LEAD.name}</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-line-strong" />
          <span className="truncate text-[9px] text-soft">Relancer Atelier Nord</span>
        </div>
      </div>
    </div>
  );
}

function NavBar({ back, title }: { back: string; title: string }) {
  return (
    <div className="flex items-center gap-1 px-3 pt-11">
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-accent-bright" strokeWidth="2.6" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
      <span className="text-[9.5px] text-accent-bright">{back}</span>
      <span className="ml-auto truncate text-[9.5px] font-semibold text-paper">{title}</span>
    </div>
  );
}

/** Fiche client créée automatiquement depuis le formulaire du site. */
function ClientScreen({ step }: { step: number }) {
  return (
    <div>
      <NavBar back="Accueil" title="Fiche client" />
      <div className="px-3.5">
        <div className="mt-3 flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-violet text-[11px] font-semibold text-white">{LEAD.initials}</span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-paper">{LEAD.name}</p>
            <p className="truncate text-[8.5px] text-muted">{LEAD.contact}</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded-full bg-accent/15 px-1.5 py-[2px] text-[7.5px] font-medium text-accent-bright">Prospect</span>
          <span className="rounded-full bg-white/8 px-1.5 py-[2px] text-[7.5px] text-soft">Via fdastudio.fr</span>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-[12px] bg-surface">
          <Row k="Besoin" v={LEAD.need} />
          <Row k="Budget" v={LEAD.budget} />
          <Row k="Délai" v={LEAD.timeline} />
        </div>
        <p className="mb-1.5 mt-3 text-[8.5px] font-semibold text-paper">Activité</p>
        <div className="space-y-2 border-l border-line-strong pl-2.5">
          <p className="relative text-[8.5px] text-soft">
            <span className="absolute -left-[13px] top-[3px] h-1.5 w-1.5 rounded-full bg-accent" />
            Demande reçue <span className="text-muted">· à l’instant</span>
          </p>
          <p className="relative text-[8.5px] text-soft">
            <span className="absolute -left-[13px] top-[3px] h-1.5 w-1.5 rounded-full bg-steel" />
            Rappel planifié <span className="text-muted">· demain 10 h</span>
          </p>
        </div>
        <div className="relative mt-3 rounded-[10px] bg-paper py-2 text-center text-[9.5px] font-semibold text-ink">
          Créer le devis
          <Tap on={step === 2} delay={1650} className="left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}

/** Devis : lignes, total, envoi puis signature en ligne. */
function QuoteScreen({ step }: { step: number }) {
  const sent = step >= 3;
  const signed = step >= 4;
  return (
    <div>
      <NavBar back={LEAD.name} title="Devis" />
      <div className="px-3.5">
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[12px] font-semibold tracking-[-0.01em] text-paper">FDA-2026-008</p>
          <span
            className={`rounded-full px-1.5 py-[2px] text-[7.5px] font-semibold transition-colors duration-500 ${
              signed ? "bg-ok/20 text-ok" : sent ? "bg-accent/20 text-accent-bright" : "bg-white/8 text-muted"
            }`}
          >
            {signed ? "Signé en ligne" : "Envoyé"}
          </span>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-[12px] bg-surface">
          {QUOTE.map(([k, v]) => (
            <Row key={k} k={k} v={v} />
          ))}
        </div>
        <div className="mt-2 space-y-1 px-1">
          <p className="flex justify-between text-[8.5px] text-muted"><span>Total HT</span><span className="tabular-nums">5 390 €</span></p>
          <p className="flex justify-between text-[8.5px] text-muted"><span>TVA 20 %</span><span className="tabular-nums">1 078 €</span></p>
          <p className="flex justify-between text-[11px] font-semibold text-paper"><span>Total TTC</span><span className="tabular-nums">{LEAD.amount}</span></p>
        </div>

        {/* Signature du client, reçue en direct */}
        <div className={`relative mt-3 overflow-hidden rounded-[12px] border transition-colors duration-500 ${signed ? "border-ok/50 bg-[#13201a]" : "border-line bg-surface"}`}>
          <div className="flex items-center gap-2 p-2.5">
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors duration-500 ${signed ? "bg-ok" : "bg-white/10"}`}>
              {signed ? (
                <svg viewBox="0 0 24 24" className="crm-check h-3.5 w-3.5 fill-none stroke-ink" strokeWidth="3" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              ) : (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-bright" />
              )}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[9px] font-medium text-paper">{signed ? `Signé par ${LEAD.contact}` : "En attente de signature"}</span>
              <span className="block truncate text-[8px] text-muted">{signed ? "Aujourd’hui, 18:26 · accompte demandé" : "Lien sécurisé envoyé par e-mail"}</span>
            </span>
          </div>
          {signed && (
            <svg viewBox="0 0 120 24" className="crm-sign mx-2.5 mb-2 h-5 w-24 fill-none stroke-ok" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="M2 17c6-10 10-12 12-6s-4 9 1 5 7-11 9-7-2 9 3 6 6-8 9-4 3 5 8 1 7-6 10-2 4 4 9 1 9-5 14-3" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

/** iPhone : cadre titane, Dynamic Island vivante et navigation entre trois écrans de l'app. */
function Phone({ step, className = "" }: { step: number; className?: string }) {
  const cur = SCREEN[step];
  const screens = [HomeScreen, ClientScreen, QuoteScreen];
  return (
    <div className={`crm-phone relative rounded-[2.55rem] p-[3px] ${className}`}>
      {/* Boutons latéraux */}
      <span aria-hidden className="absolute -left-[2px] top-[18%] h-[7%] w-[3px] rounded-l bg-[#5a5d64]" />
      <span aria-hidden className="absolute -left-[2px] top-[28%] h-[11%] w-[3px] rounded-l bg-[#5a5d64]" />
      <span aria-hidden className="absolute -right-[2px] top-[24%] h-[14%] w-[3px] rounded-r bg-[#5a5d64]" />
      <div className="relative h-full rounded-[2.4rem] bg-black p-[6px]">
        <div className="relative h-full overflow-hidden rounded-[2rem] bg-ink">
          <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-[11px] text-[9px] font-semibold text-paper">
            <span>18:24</span>
            <span className="h-[7px] w-3 rounded-[2px] border border-paper/70" aria-hidden />
          </div>
          <Island step={step} />
          <Tap on={step === 1} delay={1500} className="left-1/2 top-[8px] z-50 -translate-x-1/2" />

          {screens.map((Screen, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-ink transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)]"
              style={{
                transform: i === cur ? "none" : i < cur ? "translateX(-28%)" : "translateX(100%)",
                opacity: i < cur ? 0.4 : 1,
                zIndex: i,
              }}
            >
              <Screen step={step} />
            </div>
          ))}

          {/* Barre d'onglets et indicateur d'accueil */}
          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-line bg-ink/95 px-4 pb-2 pt-2 backdrop-blur" aria-hidden>
            <div className="flex items-center justify-around">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-[3px] w-4 rounded-full ${i === Math.min(cur, 1) ? "bg-accent" : "bg-white/20"}`} />
              ))}
            </div>
            <span className="mx-auto mt-2 block h-[3px] w-1/3 rounded-full bg-white/50" />
          </div>
          {/* Reflet du verre */}
          <span aria-hidden className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_35%)]" />
        </div>
      </div>
    </div>
  );
}

/** Étapes du parcours, synchronisées avec l'animation. */
function Progress({ step }: { step: number }) {
  const at = stepOf(step);
  return (
    <ol className="flex items-center gap-1.5" aria-hidden>
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-medium transition-colors duration-500 ${
              i === at ? (i === 3 ? "bg-ok text-ink" : "bg-paper text-ink") : i < at ? "text-soft" : "text-muted/60"
            }`}
          >
            {s}
          </span>
          {i < STEPS.length - 1 && <span className={`h-px w-2.5 transition-colors duration-500 ${i < at ? "bg-soft" : "bg-line-strong"}`} />}
        </li>
      ))}
    </ol>
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
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-[-25%] h-[75%] w-[60%] rounded-full bg-accent/25 blur-[100px]" />
      <div aria-hidden className={`pointer-events-none absolute right-[8%] top-[20%] h-[45%] w-[30%] rounded-full blur-[90px] transition-colors duration-1000 ${step >= 4 ? "bg-ok/15" : "bg-violet/10"}`} />

      {/* Ordinateur : l'app web et l'iPhone, synchronisés */}
      <div className="absolute inset-y-[8%] left-[3%] hidden w-[63%] md:block">
        <Browser step={step} />
      </div>
      <div className="absolute right-[3%] top-1/2 hidden h-[28rem] w-[13.5rem] -translate-y-1/2 md:block">
        <Phone step={step} className="h-full w-full" />
      </div>
      <p className="absolute bottom-3 left-[3%] hidden text-[11px] text-muted md:block">Notre CRM : app web et app mobile synchronisées en temps réel.</p>

      {/* Téléphone : l'iPhone en vedette et les étapes du parcours */}
      <div className="flex h-full flex-col items-center justify-center gap-4 md:hidden">
        <Phone step={step} className="h-[26.5rem] w-[13rem]" />
        <Progress step={step} />
      </div>
    </div>
  );
}
