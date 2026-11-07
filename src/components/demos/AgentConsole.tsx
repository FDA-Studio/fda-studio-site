"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon } from "@/components/icons";
import { sfx } from "@/lib/sound";

type Scenario = {
  id: string;
  label: string;
  channel: string;
  input: string;
  fields: [string, string][];
  actions: string[];
  human: string;
};

/** Scénarios fictifs : aucun nom, aucune donnée et aucun appel réel. */
const scenarios: Scenario[] = [
  {
    id: "devis",
    label: "Demande de devis",
    channel: "E-mail entrant",
    input:
      "Bonjour, nous sommes une PME de 40 personnes. Nous voulons refondre notre site et ajouter un assistant pour le service client. Budget autour de 15 k€, idéalement en ligne avant mars.",
    fields: [
      ["Intention", "Demande de devis"],
      ["Besoin", "Refonte du site + assistant client"],
      ["Entreprise", "PME, 40 personnes"],
      ["Budget", "≈ 15 k€"],
      ["Échéance", "Mars"],
      ["Priorité", "Normale"],
    ],
    actions: ["Fiche contact et entreprise créées dans le CRM", "Opportunité « Refonte + assistant » ouverte", "Réponse rédigée avec deux créneaux de rendez-vous", "Rappel planifié à J+2"],
    human: "Réponse prête. Envoi après validation par un commercial.",
  },
  {
    id: "appel",
    label: "Appel manqué",
    channel: "Messagerie vocale, transcrite",
    input:
      "Bonjour, j’appelle pour ma commande 4471, le colis devait arriver hier et je n’ai rien reçu. Pouvez-vous me rappeler rapidement ? Merci.",
    fields: [
      ["Intention", "Réclamation livraison"],
      ["Commande", "#4471"],
      ["Ton", "Inquiet"],
      ["Priorité", "Haute"],
    ],
    actions: ["Commande retrouvée dans l’ERP : colis en retard chez le transporteur", "Ticket SAV ouvert en priorité haute", "SMS de prise en charge préparé", "Responsable SAV notifié"],
    human: "Rappel du client attribué à un conseiller. SMS envoyé après validation.",
  },
  {
    id: "relance",
    label: "Relance commerciale",
    channel: "Déclencheur CRM",
    input: "Le devis D-2031 a été envoyé il y a 7 jours. Aucune réponse. Le contact a ouvert l’e-mail deux fois.",
    fields: [
      ["Intention", "Relance de devis"],
      ["Signal", "E-mail ouvert 2 fois"],
      ["Étape", "Proposition envoyée"],
      ["Priorité", "Normale"],
    ],
    actions: ["Historique des échanges résumé", "Relance personnalisée rédigée", "Créneau d’appel proposé", "Statut de l’opportunité mis à jour"],
    human: "Relance en attente de relecture par le commercial en charge.",
  },
];

type Phase = 0 | 1 | 2 | 3 | 4; // 0 attente, 1 lecture, 2 analyse, 3 actions, 4 validation

export function AgentConsole() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>(0);
  const [typed, setTyped] = useState(0);
  const [shownFields, setShownFields] = useState(0);
  const [shownActions, setShownActions] = useState(0);
  const timers = useRef<number[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const s = scenarios[idx];

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const run = useCallback((i: number) => {
    clear();
    const sc = scenarios[i];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(sc.input.length);
      setShownFields(sc.fields.length);
      setShownActions(sc.actions.length);
      setPhase(4);
      return;
    }
    setPhase(1);
    setTyped(0);
    setShownFields(0);
    setShownActions(0);
    const step = 14;
    let t = 0;
    for (let c = 1; c <= sc.input.length; c += 3) {
      t += step;
      const n = Math.min(c + 2, sc.input.length);
      at(t, () => setTyped(n));
    }
    t += 400;
    at(t, () => setPhase(2));
    sc.fields.forEach((_, k) => at(t + 300 + k * 260, () => setShownFields(k + 1)));
    t += 300 + sc.fields.length * 260 + 300;
    at(t, () => setPhase(3));
    sc.actions.forEach((_, k) => at(t + 250 + k * 420, () => { setShownActions(k + 1); sfx("tick"); }));
    t += 250 + sc.actions.length * 420 + 300;
    at(t, () => setPhase(4));
  }, []);

  // Démarrage automatique au premier passage dans le viewport
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          run(0);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [run]);

  const select = (i: number) => {
    sfx("tick");
    setIdx(i);
    started.current = true;
    run(i);
  };

  const status = ["Prêt", "Lecture de la demande", "Analyse et extraction", "Préparation des actions", "En attente de validation humaine"][phase];

  return (
    <div ref={rootRef} className="panel relative overflow-hidden">
      {/* Barre de titre */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </span>
          <span className="font-display text-sm text-paper">Agent de qualification</span>
        </div>
        <span className="rounded-full border border-line-strong px-2.5 py-1 text-xs text-muted">Simulation</span>
      </div>

      {/* Scénarios */}
      <div role="group" aria-label="Choisir un scénario" className="flex gap-2 overflow-x-auto border-b border-line px-5 py-3 [scrollbar-width:none]">
        {scenarios.map((sc, i) => (
          <button key={sc.id} type="button" aria-pressed={i === idx} onClick={() => select(i)} className="chip shrink-0 !min-h-9 !py-1.5 text-sm">
            {sc.label}
          </button>
        ))}
      </div>

      <div className="grid gap-px bg-line md:grid-cols-2">
        {/* Entrée */}
        <div className="bg-ink p-5 md:p-6">
          <p className="text-xs text-muted">{s.channel}</p>
          <p className={`mt-3 min-h-[7.5rem] text-[0.95rem] leading-relaxed text-paper ${phase === 1 ? "caret" : ""}`}>
            {s.input.slice(0, typed)}
          </p>
        </div>

        {/* Extraction */}
        <div className="bg-ink p-5 md:p-6">
          <p className="text-xs text-muted">Données extraites</p>
          <dl className="mt-3 space-y-2">
            {s.fields.map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-baseline justify-between gap-4 border-b border-line/70 pb-2 text-sm transition-all duration-500 ${
                  i < shownFields ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                <dt className="text-muted">{k}</dt>
                <dd className="text-right text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-line p-5 md:p-6">
        <p className="text-xs text-muted">Actions préparées</p>
        <ol className="mt-4 space-y-3">
          {s.actions.map((a, i) => {
            const done = i < shownActions;
            return (
              <li key={a} className={`flex items-start gap-3 text-sm transition-opacity duration-500 ${done ? "opacity-100" : "opacity-30"}`}>
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${done ? "border-accent bg-accent text-white" : "border-line-strong"}`}>
                  {done && <CheckIcon className="h-3 w-3" />}
                </span>
                <span className="text-paper">{a}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Validation humaine */}
      <div className="flex flex-col gap-4 border-t border-line bg-raised/60 p-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="flex items-center gap-3 text-sm" aria-live="polite">
          <span className={`h-2 w-2 shrink-0 rounded-full ${phase === 4 ? "bg-accent" : "bg-steel"}`} style={{ animation: phase > 0 && phase < 4 ? "pulse-dot 1s infinite" : undefined }} aria-hidden />
          <span className="text-paper">{phase === 4 ? s.human : status}</span>
        </p>
        <button type="button" onClick={() => run(idx)} className="btn btn-ghost !h-10 shrink-0 !px-4 text-sm">
          Rejouer
        </button>
      </div>
    </div>
  );
}
