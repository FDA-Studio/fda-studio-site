"use client";

import { useMemo, useState } from "react";
import { CheckIcon } from "@/components/icons";
import { sfx } from "@/lib/sound";

/** Concept « Cockpit opérationnel ». Toutes les données sont fictives. */
const series: Record<string, { label: string; values: number[]; kpis: [string, string, string][] }> = {
  "7j": {
    label: "7 derniers jours",
    values: [42, 48, 45, 61, 58, 72, 69],
    kpis: [["Demandes", "395", "+12 %"], ["Délai de réponse", "1 h 40", "−18 %"], ["Satisfaction", "4,7/5", "+0,2"]],
  },
  "30j": {
    label: "30 derniers jours",
    values: [30, 34, 31, 40, 44, 41, 49, 53, 50, 58, 62, 60, 67, 71],
    kpis: [["Demandes", "1 642", "+9 %"], ["Délai de réponse", "2 h 05", "−11 %"], ["Satisfaction", "4,6/5", "+0,1"]],
  },
  "12m": {
    label: "12 derniers mois",
    values: [20, 26, 24, 33, 38, 36, 44, 49, 47, 56, 63, 70],
    kpis: [["Demandes", "18 920", "+34 %"], ["Délai de réponse", "2 h 30", "−27 %"], ["Satisfaction", "4,6/5", "+0,4"]],
  },
};

const tasks = [
  { id: 1, title: "Maintenance chaudière", place: "Joué-lès-Tours", time: "08:30" },
  { id: 2, title: "Installation borne", place: "Saint-Avertin", time: "10:15" },
  { id: 3, title: "Diagnostic réseau", place: "Fondettes", time: "13:45" },
  { id: 4, title: "Visite de contrôle", place: "Tours centre", time: "16:00" },
];

function chartPath(values: number[], w: number, h: number, pad = 8) {
  const max = 80;
  const step = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)] as const);
  // Courbe lissée (Catmull-Rom → Bézier)
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return { d, area: `${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`, last: pts[pts.length - 1] };
}

export function ProductDemo() {
  const [view, setView] = useState<"dashboard" | "mobile" | "admin">("dashboard");
  const [period, setPeriod] = useState<keyof typeof series>("7j");
  const [done, setDone] = useState<number[]>([1]);
  const data = series[period];
  const chart = useMemo(() => chartPath(data.values, 560, 200), [data]);

  const views = [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "mobile", label: "Application terrain" },
    { id: "admin", label: "Back-office" },
  ] as const;

  return (
    <div>
      <div role="tablist" aria-label="Vues du produit" className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {views.map((v) => (
          <button
            key={v.id}
            role="tab"
            id={`tab-${v.id}`}
            aria-selected={view === v.id}
            aria-controls={`panel-${v.id}`}
            onClick={() => { setView(v.id); sfx("tick"); }}
            className="chip shrink-0"
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-line bg-[linear-gradient(160deg,#161617,#0c0c0d)] p-3 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] md:p-4">
        {/* Tableau de bord */}
        <div role="tabpanel" id="panel-dashboard" aria-labelledby="tab-dashboard" hidden={view !== "dashboard"} className="rounded-2xl bg-ink p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted">Activité</p>
              <p className="font-display text-xl text-paper">{data.label}</p>
            </div>
            <div className="flex rounded-full border border-line p-1" role="group" aria-label="Période">
              {(Object.keys(series) as (keyof typeof series)[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={period === k}
                  onClick={() => { setPeriod(k); sfx("tick"); }}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${period === k ? "bg-paper text-ink" : "text-muted hover:text-paper"}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {data.kpis.map(([k, v, delta]) => (
              <div key={k} className="rounded-xl border border-line p-3 md:p-4">
                <dt className="text-[0.7rem] text-muted md:text-xs">{k}</dt>
                <dd className="mt-1 font-display text-base text-paper md:text-2xl">{v}</dd>
                <dd className="text-[0.7rem] text-ok md:text-xs">{delta}</dd>
              </div>
            ))}
          </dl>
          <svg viewBox="0 0 560 200" className="mt-6 h-auto w-full" role="img" aria-label={`Courbe des demandes, ${data.label} (données fictives)`}>
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2f5bff" stopOpacity="0.28" />
                <stop offset="1" stopColor="#2f5bff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[40, 80, 120, 160].map((y) => (
              <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="#262626" strokeDasharray="2 6" />
            ))}
            <path d={chart.area} fill="url(#area)" style={{ transition: "d 0.8s cubic-bezier(.16,1,.3,1)" }} />
            <path d={chart.d} fill="none" stroke="#2f5bff" strokeWidth="2" style={{ transition: "d 0.8s cubic-bezier(.16,1,.3,1)" }} />
            <circle cx={chart.last[0]} cy={chart.last[1]} r="4.5" fill="#0a0a0a" stroke="#6f8bff" strokeWidth="2" style={{ transition: "cy 0.8s cubic-bezier(.16,1,.3,1)" }} />
          </svg>
        </div>

        {/* Application terrain */}
        <div role="tabpanel" id="panel-mobile" aria-labelledby="tab-mobile" hidden={view !== "mobile"} className="grid place-items-center rounded-2xl bg-ink py-8">
          <div className="w-[17rem] rounded-[2.4rem] border border-line-strong bg-[#0d0d0e] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,1)]">
            <div className="mx-auto h-5 w-24 rounded-full bg-ink" aria-hidden />
            <div className="px-3 pb-4 pt-5">
              <p className="text-xs text-muted">Aujourd’hui</p>
              <p className="font-display text-lg text-paper">Mes interventions</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
                <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${(done.length / tasks.length) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted" aria-live="polite">{done.length} sur {tasks.length} terminées</p>
              <ul className="mt-4 space-y-2">
                {tasks.map((t) => {
                  const isDone = done.includes(t.id);
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        aria-pressed={isDone}
                        onClick={() => { setDone((d) => (isDone ? d.filter((x) => x !== t.id) : [...d, t.id])); sfx("tick"); }}
                        className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong"
                      >
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${isDone ? "border-accent bg-accent text-white" : "border-line-strong"}`}>
                          {isDone && <CheckIcon className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm ${isDone ? "text-muted line-through" : "text-paper"}`}>{t.title}</span>
                          <span className="block text-xs text-muted">{t.place}</span>
                        </span>
                        <span className="text-xs text-muted">{t.time}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Back-office */}
        <div role="tabpanel" id="panel-admin" aria-labelledby="tab-admin" hidden={view !== "admin"} className="rounded-2xl bg-ink p-5 md:p-7">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl text-paper">Équipe et droits</p>
            <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">4 utilisateurs</span>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr className="border-b border-line">
                  <th className="py-3 font-normal">Utilisateur</th>
                  <th className="py-3 font-normal">Rôle</th>
                  <th className="py-3 font-normal">Accès</th>
                  <th className="py-3 text-right font-normal">Statut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Direction", "Administrateur", "Tout", true],
                  ["Responsable SAV", "Manager", "SAV, clients", true],
                  ["Technicien 1", "Terrain", "Ses interventions", true],
                  ["Technicien 2", "Terrain", "Ses interventions", false],
                ].map(([u, r, a, on]) => (
                  <tr key={u as string} className="border-b border-line/70">
                    <td className="py-3.5 text-paper">{u}</td>
                    <td className="py-3.5 text-muted">{r}</td>
                    <td className="py-3.5 text-muted">{a}</td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex items-center gap-2 text-xs ${on ? "text-ok" : "text-muted"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-ok" : "bg-line-strong"}`} />
                        {on ? "Actif" : "Invité"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-muted">Chaque rôle ne voit que ses données : les règles d’accès sont appliquées côté serveur, pas seulement dans l’interface.</p>
        </div>
      </div>
    </div>
  );
}
