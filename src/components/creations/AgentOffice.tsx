"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLive } from "@/components/motion/Live";
import { reducedMotion } from "@/lib/motion";
import type { OfficeScene } from "./office-scene";

/**
 * Le bureau des agents : la page « Bureau » de notre CRM, rejouée avec une journée fictive.
 * Chaque agent a son poste ; le faisceau bleu tourne autour de celui qui travaille et son
 * travail part vers le CRM. Une journée entière défile en une minute, puis recommence.
 *
 * La scène 3D (three.js) n'est chargée que lorsque la démo arrive à l'écran, se fige avec le
 * bouton pause du site et hors écran. Avec « réduire les animations » : une image fixe en milieu
 * de matinée. Sans accélération matérielle : la liste des agents, sans 3D.
 * Données fictives : aucun client, aucun chiffre réel.
 */

type AgentId = "voice" | "chat" | "prospect" | "writer" | "docs" | "books" | "followups";

const AGENTS: { id: AgentId; name: string; col: number; row: number }[] = [
  { id: "voice", name: "Agent vocal", col: 0, row: 0 },
  { id: "chat", name: "Assistant écrit", col: 1, row: 0 },
  { id: "prospect", name: "Prospection", col: 2, row: 0 },
  { id: "writer", name: "Rédaction", col: 3, row: 0 },
  { id: "docs", name: "Documents", col: 0, row: 1 },
  { id: "books", name: "Comptabilité", col: 1, row: 1 },
  { id: "followups", name: "Relances", col: 2, row: 1 },
];
const NAME = Object.fromEntries(AGENTS.map((a) => [a.id, a.name])) as Record<AgentId, string>;

/** La journée fictive : début (en minutes depuis minuit), durée, et ce qui en sort. */
const DAY_EVENTS: { agent: AgentId; at: number; mins: number; text: string }[] = [
  { agent: "prospect", at: 150, mins: 130, text: "96 entreprises examinées, 3 messages préparés pour relecture" },
  { agent: "books", at: 360, mins: 80, text: "Banque lue, rien de nouveau" },
  { agent: "writer", at: 450, mins: 100, text: "3 idées de publication prêtes pour la journée" },
  { agent: "followups", at: 480, mins: 100, text: "1 devis relancé, 1 devis arrivé à expiration signalé" },
  { agent: "voice", at: 545, mins: 100, text: "Appel pris, rendez-vous déplacé à vendredi 14 h" },
  { agent: "books", at: 570, mins: 90, text: "Banque lue : 1 facture passée en « payée »" },
  { agent: "writer", at: 610, mins: 110, text: "Article publié sur le site" },
  { agent: "chat", at: 640, mins: 100, text: "Demande enregistrée, créneau de rappel réservé" },
  { agent: "docs", at: 700, mins: 110, text: "Facture lue, vérifiée et classée" },
  { agent: "prospect", at: 770, mins: 100, text: "Une réponse reçue : la fiche du prospect est mise à jour" },
  { agent: "voice", at: 830, mins: 110, text: "Appel pris, demande notée dans le CRM" },
  { agent: "docs", at: 880, mins: 100, text: "Contrat lu : une reconduction à surveiller" },
  { agent: "chat", at: 940, mins: 100, text: "Question d’un client répondue en deux secondes" },
  { agent: "followups", at: 985, mins: 100, text: "2 rappels envoyés" },
  { agent: "books", at: 1040, mins: 100, text: "1 paiement rapproché de sa facture" },
  { agent: "voice", at: 1125, mins: 110, text: "Appel pris après la fermeture, rappel proposé demain" },
  { agent: "chat", at: 1230, mins: 100, text: "Demande enregistrée dans la soirée" },
  { agent: "voice", at: 1330, mins: 90, text: "Appel pris à 22 h, créneau réservé pour le lendemain" },
];

const DAY_MINUTES = 1440;
/** Durée réelle d'une journée de démo, en secondes. */
const LOOP_SECONDS = 60;
/** Image fixe (animations réduites) et point de départ : 10 h 50, trois agents au travail. */
const STILL_AT = 650;

const hour = (m: number) => `${Math.floor(m / 60)} h ${String(Math.floor(m % 60)).padStart(2, "0")}`;

export function AgentOffice() {
  const live = useLive();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OfficeScene | null>(null);
  const chips = useRef<Partial<Record<AgentId | "core", HTMLElement | null>>>({});
  const [minute, setMinute] = useState(STILL_AT);
  const [mode, setMode] = useState<"waiting" | "ok" | "unavailable">("waiting");
  const [wanted, setWanted] = useState(false);

  // La scène n'est chargée qu'à la première apparition de la démo à l'écran.
  useEffect(() => {
    if (live) setWanted(true);
  }, [live]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!wanted || !canvas) return;
    let cancelled = false;
    let scene: OfficeScene | null = null;
    const place = () => {
      if (!scene) return;
      for (const a of AGENTS) {
        const el = chips.current[a.id];
        const p = scene.anchor(a.id);
        if (el && p) el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
      const core = chips.current.core;
      if (core) {
        const p = scene.coreAnchor();
        core.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    };
    import("./office-scene")
      .then(({ createOfficeScene }) => {
        if (cancelled) return;
        scene = createOfficeScene(canvas, {
          desks: AGENTS.map((a) => ({ id: a.id, col: a.col, row: a.row })),
          core: { col: 3, row: 1 },
          cols: 4,
          rows: 2,
          reducedMotion: reducedMotion(),
          onFrame: place,
        });
        sceneRef.current = scene;
        setMode("ok");
      })
      .catch(() => {
        if (!cancelled) setMode("unavailable");
      });
    return () => {
      cancelled = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [wanted]);

  // L'horloge de la journée fictive : elle n'avance que si la zone est visible et pas en pause.
  useEffect(() => {
    sceneRef.current?.setPaused(!live);
    if (!live || reducedMotion()) return;
    let raf = 0;
    let last = performance.now();
    let t = minute;
    let shown = minute;
    const tick = (now: number) => {
      t = (t + ((now - last) / 1000) * (DAY_MINUTES / LOOP_SECONDS)) % DAY_MINUTES;
      last = now;
      // L'affichage n'a pas besoin de 60 images par seconde : un pas de 5 minutes fictives suffit.
      if (Math.abs(t - shown) >= 5 || t < shown) {
        shown = t;
        setMinute(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `minute` n'est lu qu'au démarrage, pour reprendre là où la pause a figé l'horloge.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, mode]);

  const working = useMemo(() => new Set(DAY_EVENTS.filter((e) => minute >= e.at && minute < e.at + e.mins).map((e) => e.agent)), [minute]);
  const done = useMemo(() => DAY_EVENTS.filter((e) => minute >= e.at + e.mins).sort((x, y) => x.at + x.mins - (y.at + y.mins)), [minute]);
  const recent = done.slice(-3).reverse();

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (const a of AGENTS) scene.setActivity(a.id, working.has(a.id) ? "working" : "idle");
  }, [working, mode]);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_72%_-10%,rgba(47,91,255,0.18),transparent_62%)]" />

      <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 pt-4 md:px-7 md:pt-6">
        <p className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent-bright">Journée type</span>
          <span className="font-mono text-sm tabular-nums tracking-[0.06em] text-soft">{hour(minute)}</span>
        </p>
        <p className="text-sm text-muted">
          {working.size ? (
            <>
              <span className="text-paper">{working.size}</span> agent{working.size > 1 ? "s" : ""} au travail
            </>
          ) : (
            "Tout le monde est au repos"
          )}
        </p>
      </div>

      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[2.1/1]">
        <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full touch-pan-y transition-opacity duration-700 ${mode === "ok" ? "opacity-100" : "opacity-0"}`} />

        {mode === "ok" && (
          <div className="pointer-events-none absolute inset-0">
            {AGENTS.map((a) => {
              const on = working.has(a.id);
              return (
                <span
                  key={a.id}
                  ref={(el) => {
                    chips.current[a.id] = el;
                  }}
                  className={`absolute left-0 top-0 inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium backdrop-blur-md transition-colors duration-200 will-change-transform ${
                    on ? "border-accent-bright/40 bg-[#0d1226]/85 text-paper" : "border-white/10 bg-ink/75 text-muted"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-accent-bright shadow-[0_0_10px_2px_rgba(47,91,255,0.9)]" : "bg-muted/60"}`} />
                  {a.name}
                </span>
              );
            })}
            <span
              ref={(el) => {
                chips.current.core = el;
              }}
              className="absolute left-0 top-0 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-accent-bright will-change-transform"
            >
              CRM
            </span>
          </div>
        )}

        {mode === "unavailable" && (
          <ul className="absolute inset-0 grid grid-cols-2 content-center gap-2 p-4 sm:grid-cols-4 md:p-7">
            {AGENTS.map((a) => {
              const on = working.has(a.id);
              return (
                <li key={a.id} className={`flex h-20 flex-col justify-end rounded-2xl border p-3 ${on ? "crm-beam border-accent-bright/40 bg-accent/10" : "border-line-strong bg-surface"}`}>
                  <span className="text-sm font-medium text-paper">{a.name}</span>
                  <span className="text-xs text-muted">{on ? "Au travail" : "Au repos"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Le journal : ce que les agents viennent de terminer */}
      <div className="relative border-t border-line px-4 pb-5 pt-4 md:px-7 md:pb-6">
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-line-strong">
          <div className="h-full origin-left bg-[linear-gradient(90deg,#2f5bff,#6f8bff)]" style={{ transform: `scaleX(${(minute / DAY_MINUTES).toFixed(4)})` }} />
        </div>
        <ol className="mt-4 grid min-h-[10.5rem] content-start gap-1.5 sm:min-h-[5.25rem]">
          {recent.length ? (
            recent.map((e, i) => (
              <li key={`${e.agent}-${e.at}`} className={`flex items-baseline gap-3 text-sm ${i === 0 ? "text-paper" : i === 1 ? "text-soft" : "text-muted"}`}>
                <span className="w-14 shrink-0 font-mono text-xs tabular-nums text-muted">{hour(e.at + e.mins)}</span>
                <span className="min-w-0">
                  <span className="font-medium">{NAME[e.agent]}</span>
                  <span className="text-muted"> · </span>
                  {e.text}
                </span>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted">La journée commence. Le premier agent se met au travail à 2 h 30.</li>
          )}
        </ol>
      </div>
    </div>
  );
}
