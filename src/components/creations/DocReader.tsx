"use client";

import { useLoop } from "./useLoop";

/**
 * Agent documents : on le voit travailler. Un document arrive, il est lu (faisceau + repères
 * numérotés), les champs sont extraits, vérifiés, puis classés dans les bons outils.
 * Deux documents s'enchaînent : une facture fournisseur, puis un contrat (avec une alerte).
 */

type Field = { label: string; value: string };
type Check = { text: string; warn?: boolean };
type Doc = {
  file: string;
  from: string;
  kind: string;
  fields: Field[];
  checks: Check[];
  route: { where: string; what: string }[];
};

const DOCS: Doc[] = [
  {
    file: "facture-atelier-martin.pdf",
    from: "compta@atelier-martin.fr",
    kind: "Facture fournisseur",
    fields: [
      { label: "Fournisseur", value: "Atelier Martin SARL" },
      { label: "N° facture", value: "F-2026-0412" },
      { label: "Date", value: "04/11/2026" },
      { label: "Montant HT", value: "4 280,00 €" },
      { label: "TVA 20 %", value: "856,00 €" },
      { label: "Échéance", value: "04/12/2026" },
    ],
    checks: [
      { text: "TVA = 20 % du montant HT" },
      { text: "Fournisseur connu, même IBAN qu’avant" },
      { text: "Conforme au bon de commande BC-118" },
    ],
    route: [
      { where: "Comptabilité › Fournisseurs", what: "Écriture préparée, à valider" },
      { where: "Agenda", what: "Payer avant le 04/12" },
    ],
  },
  {
    file: "contrat-maintenance-novatek.pdf",
    from: "contrats@novatek.fr",
    kind: "Contrat",
    fields: [
      { label: "Prestataire", value: "Novatek Services" },
      { label: "Objet", value: "Maintenance informatique" },
      { label: "Début", value: "01/02/2026" },
      { label: "Durée", value: "24 mois" },
      { label: "Montant", value: "390 € HT / mois" },
      { label: "Préavis", value: "3 mois" },
    ],
    checks: [
      { text: "Signé par les deux parties" },
      { text: "Montant identique au devis accepté" },
      { text: "Reconduction tacite : préavis avant le 01/11/2027", warn: true },
    ],
    route: [
      { where: "Contrats › Prestataires", what: "Fiche contrat créée" },
      { where: "Agenda", what: "Alerte résiliation le 01/10/2027" },
    ],
  },
];

const STAGES = ["Reçu", "Lu", "Vérifié", "Classé"];
// Étapes d'un document : 0 réception · 1 lecture · 2‑7 extraction · 8‑10 vérification · 11 classement · 12 terminé
const PER_DOC = [1100, 1700, 420, 420, 420, 420, 420, 420, 700, 700, 900, 1300, 2600];
const DURATIONS = [...PER_DOC, ...PER_DOC];

function stageOf(s: number) {
  if (s === 0) return 0;
  if (s <= 7) return 1;
  if (s <= 10) return 2;
  return 3;
}

/** Repère numéroté posé sur le document quand le champ correspondant est trouvé. */
function Mark({ n, on, children, className = "" }: { n: number; on: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block rounded px-1 transition-[background-color,box-shadow] duration-300 ${on ? "bg-accent/20 shadow-[0_0_0_1px_var(--color-accent)]" : ""} ${className}`}>
      {children}
      <span
        aria-hidden
        className={`absolute -right-2 -top-2 grid size-3.5 place-items-center rounded-full bg-accent text-[7px] font-semibold text-white transition-[opacity,transform] duration-300 ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        {n}
      </span>
    </span>
  );
}

function Invoice({ found }: { found: number }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <Mark n={1} on={found >= 1} className="font-bold">ATELIER MARTIN SARL</Mark>
        <span className="font-bold tracking-wide">FACTURE</span>
      </div>
      <div className="mt-2.5 flex justify-between">
        <span className="opacity-70">12 rue des Tanneurs<br />37000 Tours</span>
        <span className="space-y-1 text-right">
          <Mark n={2} on={found >= 2}>N° F-2026-0412</Mark>
          <br />
          <Mark n={3} on={found >= 3}>04/11/2026</Mark>
        </span>
      </div>
      <div className="mt-3 space-y-1 border-t border-[#2b2d31]/15 pt-2.5">
        {[["Mobilier sur mesure", "3 600,00"], ["Pose et réglages", "560,00"], ["Déplacement", "120,00"]].map(([l, v]) => (
          <div key={l} className="flex justify-between"><span>{l}</span><span>{v} €</span></div>
        ))}
      </div>
      <div className="mt-3 space-y-1 border-t border-[#2b2d31]/15 pt-2.5 text-right">
        <div><Mark n={4} on={found >= 4}>Total HT 4 280,00 €</Mark></div>
        <div><Mark n={5} on={found >= 5}>TVA 20 % 856,00 €</Mark></div>
        <div className="font-bold">Total TTC 5 136,00 €</div>
      </div>
      <div className="mt-2.5"><Mark n={6} on={found >= 6}>À régler avant le 04/12/2026</Mark></div>
    </>
  );
}

function Contract({ found }: { found: number }) {
  return (
    <>
      <p className="text-center font-bold tracking-wide">CONTRAT DE MAINTENANCE</p>
      <p className="mt-2.5">
        Entre la société cliente et <Mark n={1} on={found >= 1} className="font-semibold">Novatek Services</Mark>, il est convenu ce qui suit.
      </p>
      <p className="mt-2"><span className="font-semibold">Art. 1 — Objet.</span> <Mark n={2} on={found >= 2}>Maintenance informatique</Mark> du parc et assistance.</p>
      <p className="mt-2">
        <span className="font-semibold">Art. 2 — Durée.</span> À compter du <Mark n={3} on={found >= 3}>01/02/2026</Mark> pour <Mark n={4} on={found >= 4}>24 mois</Mark>, reconduit tacitement.
      </p>
      <p className="mt-2"><span className="font-semibold">Art. 3 — Prix.</span> <Mark n={5} on={found >= 5}>390 € HT par mois</Mark>, payable à 30 jours.</p>
      <p className="mt-2"><span className="font-semibold">Art. 4 — Résiliation.</span> Par lettre recommandée avec un <Mark n={6} on={found >= 6}>préavis de 3 mois</Mark>.</p>
      <div className="mt-3 flex justify-between opacity-70"><span>Le client</span><span>Le prestataire</span></div>
    </>
  );
}

/** Lignes du journal visibles à l'étape s (les plus récentes en bas, 4 au maximum). */
function log(doc: Doc, s: number): string[] {
  const lines = [`Pièce jointe reçue de ${doc.from}`];
  if (s >= 1) lines.push("Document lu, 1 page, texte reconnu");
  if (s >= 7) lines.push("6 champs extraits, confiance 99 %");
  if (s >= 10) lines.push(doc.checks.some((c) => c.warn) ? "2 contrôles OK, 1 point d’attention" : "3 contrôles OK");
  if (s >= 11) lines.push(`Classé : ${doc.route[0].where}`);
  return lines.slice(-4);
}

export function DocReader() {
  const { ref, step } = useLoop<HTMLDivElement>(DURATIONS);
  const d = step < PER_DOC.length ? 0 : 1;
  const s = step - d * PER_DOC.length;
  const doc = DOCS[d];
  const stage = stageOf(s);
  const found = Math.min(6, Math.max(0, s - 1)); // champs trouvés (0 → 6)
  const checked = s >= 8 ? Math.min(3, s - 7) : 0;
  const routed = s >= 11;
  const done = s >= 12;
  const reading = s === 1;

  return (
    <div ref={ref} className="flex h-full flex-col gap-3 p-4 md:gap-4 md:p-6">
      {/* Étapes de l'agent */}
      <div className="flex items-center gap-2 text-[11px] md:text-xs">
        {STAGES.map((label, i) => {
          const state = i < stage || done ? "done" : i === stage ? "now" : "next";
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full border text-[10px] transition-colors duration-300 ${
                  state === "done" ? "border-ok bg-ok/15 text-ok" : state === "now" ? "border-accent bg-accent/20 text-paper" : "border-line-strong text-muted"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span className={state === "next" ? "text-muted" : "text-paper"}>{label}</span>
              {i < STAGES.length - 1 && (
                <span className="relative hidden h-px flex-1 bg-line-strong sm:block">
                  <span className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-500" style={{ width: i < stage || done ? "100%" : "0%" }} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-[1.05fr_1fr] md:gap-5">
        {/* Document */}
        <div className="relative min-h-0">
          <div
            key={d}
            className="doc-in relative h-full max-h-[8.5rem] overflow-hidden rounded-xl bg-[#f4f4f2] p-3.5 text-[8.5px] leading-snug text-[#2b2d31] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)] sm:max-h-none md:p-4 md:text-[10px]"
          >
            <p className="mb-2 flex items-center justify-between border-b border-[#2b2d31]/10 pb-1.5 text-[8px] opacity-60 md:text-[9px]">
              <span className="truncate">{doc.file}</span>
              <span className="shrink-0">p. 1/1</span>
            </p>
            {d === 0 ? <Invoice found={found} /> : <Contract found={found} />}
            {/* Téléphone : le bas de la page s'estompe (document tronqué volontairement) */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#f4f4f2] to-transparent sm:hidden" />
            {/* Faisceau de lecture */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-accent/35 to-transparent"
              style={{ animation: reading ? "scan 1.7s cubic-bezier(.65,0,.35,1) both" : "none", top: reading ? undefined : "-4rem" }}
            />
          </div>
        </div>

        {/* Ce que fait l'agent */}
        <div className="flex min-h-0 flex-col">
          <p className="flex items-center gap-2 text-xs text-muted">
            <span className={`size-1.5 rounded-full ${done ? "bg-ok" : "animate-pulse bg-accent"}`} />
            {done ? `${doc.kind} traité en 9 s` : s === 0 ? `Nouveau document : ${doc.kind.toLowerCase()}` : stage === 1 ? "Lecture et extraction…" : stage === 2 ? "Vérifications…" : "Classement dans vos outils…"}
          </p>

          {stage <= 1 ? (
            <dl className="mt-2.5 space-y-1 md:mt-3 md:space-y-1.5">
              {doc.fields.map((f, i) => (
                <div
                  key={f.label}
                  className={`flex items-baseline gap-2 border-b border-line pb-1 text-[12.5px] transition-[opacity,transform] duration-300 md:pb-1.5 md:text-sm ${found > i ? "translate-x-0 opacity-100" : "translate-x-1.5 opacity-45"}`}
                >
                  <span className={`grid size-3.5 shrink-0 place-items-center rounded-full text-[7px] font-semibold ${found > i ? "bg-accent text-white" : "bg-line text-muted"}`}>{i + 1}</span>
                  <dt className="text-muted">{f.label}</dt>
                  <dd className="ml-auto truncate text-right text-paper">{found > i ? f.value : "…"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="mt-2.5 space-y-3 md:mt-3">
              <ul className="space-y-1.5 md:space-y-2">
                {doc.checks.map((c, i) => (
                  <li
                    key={c.text}
                    className={`flex items-start gap-2 text-[12.5px] leading-snug transition-[opacity,transform] duration-300 md:text-sm ${checked > i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
                  >
                    <span className={`mt-px shrink-0 ${c.warn ? "text-[#f2b84b]" : "text-ok"}`}>{c.warn ? "!" : "✓"}</span>
                    <span className={c.warn ? "text-[#f2d79b]" : "text-soft"}>{c.text}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {doc.route.map((r, i) => (
                  <li
                    key={r.where}
                    className={`rounded-lg border border-line bg-white/[0.03] px-3 py-2 transition-[opacity,transform] duration-500 ${routed ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"}`}
                    style={{ transitionDelay: routed ? `${i * 180}ms` : "0ms" }}
                  >
                    <p className="text-[11px] text-muted md:text-xs">{r.where}</p>
                    <p className="text-[12.5px] text-paper md:text-sm">{r.what}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Journal de l'agent : ce qu'il vient de faire, ligne par ligne */}
          <ol className="mt-auto hidden space-y-1 border-t border-line pt-3 font-mono text-[10.5px] leading-relaxed text-muted sm:block">
            {log(doc, s).map((l, i) => (
              <li key={`${d}-${i}`} className="log-line flex gap-2">
                <span className="shrink-0 text-line-strong">09:41:{String(2 + i * 2).padStart(2, "0")}</span>
                <span className={i === log(doc, s).length - 1 && !done ? "text-soft" : ""}>{l}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* File de documents */}
      <div className="flex items-center justify-between gap-3 border-t border-line pt-2.5 text-[11px] text-muted md:text-xs">
        <span className="truncate">
          Boîte « factures@ » · {d + (done ? 1 : 0)} / 2 traités
        </span>
        <span className="shrink-0 text-ok">0 ressaisie</span>
      </div>
    </div>
  );
}
