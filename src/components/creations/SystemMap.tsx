"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useLive } from "@/components/motion/Live";
import { reducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";

/**
 * Vue d'ensemble des quatre démos : tout ce qui arrive dans l'entreprise (appel, demande
 * du site, message, document) part vers le CRM, qui prévient le dirigeant sur son mobile.
 * Un signal lumineux parcourt chaque liaison, le CRM compte, la notification tombe.
 * Ordinateur : canaux à gauche, CRM au centre, mobile à droite. Téléphone : de haut en bas.
 * Données fictives. Avec « réduire les animations » : état final, sans signal en mouvement.
 */

type NodeId = "phone" | "web" | "chat" | "docs";

const NODES: { id: NodeId; label: string; sub: string; href: string }[] = [
  { id: "phone", label: "Téléphone", sub: "Agent vocal", href: "#demo-telephone" },
  { id: "web", label: "Site web", sub: "Demandes de devis", href: "#demo-crm" },
  { id: "chat", label: "Messages", sub: "Assistant client", href: "#demo-messages" },
  { id: "docs", label: "Documents", sub: "Factures, contrats", href: "#demo-documents" },
];

type Ev = { from: NodeId; title: string; detail: string; count: 0 | 1 | 2; ok?: boolean };

// count : quel compteur du CRM avance (0 appels, 1 demandes, 2 documents)
const EVENTS: Ev[] = [
  { from: "phone", title: "Rendez-vous déplacé", detail: "Vendredi 14 h, SMS de confirmation envoyé", count: 0 },
  { from: "web", title: "Nouvelle demande", detail: "Maison Verlaine, site internet, 5 à 15 k€", count: 1 },
  { from: "docs", title: "Facture classée", detail: "Atelier Martin, 5 136 € TTC, à payer le 4/12", count: 2 },
  { from: "chat", title: "Commande 20481", detail: "Suivi envoyé au client, ticket fermé", count: 0 },
  { from: "web", title: "Devis signé en ligne", detail: "Maison Verlaine, 6 468 € TTC", count: 1, ok: true },
  { from: "docs", title: "Contrat à surveiller", detail: "Novatek, reconduction tacite le 1/02", count: 2 },
];

const START = [11, 4, 9];
const COUNTERS = ["Appels et messages", "Demandes", "Documents"];

function Icon({ id, className = "" }: { id: NodeId; className?: string }) {
  const p = { viewBox: "0 0 24 24", className: `fill-none stroke-current ${className}`, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (id) {
    case "phone":
      return (
        <svg {...p}>
          <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
        </svg>
      );
    case "web":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z" />
          <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeWidth="2.4" />
        </svg>
      );
    case "docs":
      return (
        <svg {...p}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
  }
}

/** Trajet d'un point à un autre, en courbe douce, horizontal ou vertical selon la mise en page. */
function curve(ax: number, ay: number, bx: number, by: number, horizontal: boolean) {
  if (horizontal) {
    const k = (bx - ax) * 0.5;
    return `M${ax},${ay} C${ax + k},${ay} ${bx - k},${by} ${bx},${by}`;
  }
  const k = (by - ay) * 0.55;
  return `M${ax},${ay} C${ax},${ay + k} ${bx},${by - k} ${bx},${by}`;
}

type Paths = Record<NodeId | "out", string>;

export function SystemMap() {
  const live = useLive();
  const box = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Partial<Record<NodeId, HTMLAnchorElement | null>>>({});
  const coreEl = useRef<HTMLDivElement>(null);
  const youEl = useRef<HTMLDivElement>(null);
  const pathEls = useRef<Partial<Record<NodeId | "out", SVGPathElement | null>>>({});
  const packet = useRef<SVGGElement>(null);

  const [paths, setPaths] = useState<Paths | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState<NodeId | "out" | null>(null);
  const [pulse, setPulse] = useState(0);
  // Deux notifications déjà là au départ : la scène n'est jamais vide
  const [feed, setFeed] = useState<{ ev: Ev; key: number }[]>([
    { ev: EVENTS[5], key: -1 },
    { ev: EVENTS[4], key: -2 },
  ]);
  const [counts, setCounts] = useState(START);
  const cursor = useRef(0);
  const serial = useRef(0);

  // Recalcule les liaisons à partir de la position réelle des blocs
  const measure = useCallback(() => {
    const b = box.current?.getBoundingClientRect();
    const c = coreEl.current?.getBoundingClientRect();
    const y = youEl.current?.getBoundingClientRect();
    if (!b || !c || !y) return;
    const first = nodeEls.current.phone?.getBoundingClientRect();
    const horizontal = !!first && first.right < c.left;
    const next = {} as Paths;
    for (const n of NODES) {
      const r = nodeEls.current[n.id]?.getBoundingClientRect();
      if (!r) return;
      next[n.id] = horizontal
        ? curve(r.right - b.left, r.top + r.height / 2 - b.top, c.left - b.left, c.top + c.height / 2 - b.top, true)
        : curve(r.left + r.width / 2 - b.left, r.bottom - b.top, c.left + c.width / 2 - b.left, c.top - b.top, false);
    }
    next.out = horizontal
      ? curve(c.right - b.left, c.top + c.height / 2 - b.top, y.left - b.left, y.top + 46 - b.top, true)
      : curve(c.left + c.width / 2 - b.left, c.bottom - b.top, y.left + y.width / 2 - b.left, y.top - b.top, false);
    setSize({ w: b.width, h: b.height });
    setPaths(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [measure]);

  // Mouvement réduit : la scène s'affiche complète, sans signal qui circule
  useEffect(() => {
    if (!reducedMotion()) return;
    setFeed(EVENTS.slice(0, 3).map((ev, i) => ({ ev, key: i })));
    setCounts([START[0] + 2, START[1] + 2, START[2] + 2]);
  }, []);

  // Boucle : un événement à la fois, du canal au CRM, puis du CRM au mobile
  useEffect(() => {
    if (!live || !paths || reducedMotion()) return;
    let raf = 0;
    let timer = 0;
    let stopped = false;

    const travel = (id: NodeId | "out", ms: number, done: () => void) => {
      const path = pathEls.current[id];
      const g = packet.current;
      if (!path || !g) return done();
      const len = path.getTotalLength();
      const t0 = performance.now();
      setActive(id);
      g.style.opacity = "1";
      const step = (t: number) => {
        if (stopped) return;
        const k = Math.min(1, (t - t0) / ms);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        const pt = path.getPointAtLength(e * len);
        g.setAttribute("transform", `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`);
        if (k < 1) raf = requestAnimationFrame(step);
        else done();
      };
      raf = requestAnimationFrame(step);
    };

    const run = () => {
      const ev = EVENTS[cursor.current % EVENTS.length];
      travel(ev.from, 1150, () => {
        if (packet.current) packet.current.style.opacity = "0";
        setPulse((p) => p + 1);
        setCounts((c) => c.map((v, i) => (i === ev.count ? v + 1 : v)));
        sfx("blip", (cursor.current % 4) + 1);
        timer = window.setTimeout(() => {
          travel("out", 850, () => {
            if (packet.current) packet.current.style.opacity = "0";
            setActive(null);
            serial.current += 1;
            const key = serial.current;
            setFeed((f) => [{ ev, key }, ...f].slice(0, 3));
            cursor.current += 1;
            timer = window.setTimeout(run, 1500);
          });
        }, 380);
      });
    };
    timer = window.setTimeout(run, 500);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      if (packet.current) packet.current.style.opacity = "0";
      setActive(null);
    };
  }, [live, paths]);

  const okNow = active === "out" && EVENTS[(cursor.current) % EVENTS.length].ok;

  return (
    <div ref={box} className="relative">
      {/* Liaisons et signal */}
      {paths && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
          <defs>
            <radialGradient id="sys-glow">
              <stop offset="0%" stopColor="#9fb2ff" stopOpacity="1" />
              <stop offset="40%" stopColor="#2f5bff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#2f5bff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sys-glow-ok">
              <stop offset="0%" stopColor="#d6f5de" stopOpacity="1" />
              <stop offset="40%" stopColor="#7fbf8e" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#7fbf8e" stopOpacity="0" />
            </radialGradient>
          </defs>
          {(Object.keys(paths) as (NodeId | "out")[]).map((id) => (
            <g key={id}>
              <path d={paths[id]} className="fill-none stroke-line-strong" strokeWidth="1" />
              <path
                ref={(el) => {
                  pathEls.current[id] = el;
                }}
                d={paths[id]}
                className={`sys-wire fill-none stroke-accent-bright transition-opacity duration-300 ${active === id ? "opacity-70" : "opacity-0"}`}
                strokeWidth="1.5"
                strokeDasharray="3 7"
              />
            </g>
          ))}
          <g ref={packet} style={{ opacity: 0 }}>
            <circle r="16" fill={okNow ? "url(#sys-glow-ok)" : "url(#sys-glow)"} />
            <circle r="3" fill="#ffffff" />
          </g>
        </svg>
      )}

      <div className="relative grid gap-y-14 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,19rem)] lg:items-center lg:gap-x-[clamp(3rem,7vw,7rem)]">
        {/* Canaux */}
        <ul className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-3">
          {NODES.map((n) => {
            const on = active === n.id;
            return (
              <li key={n.id}>
                <a
                  ref={(el) => {
                    nodeEls.current[n.id] = el;
                  }}
                  href={n.href}
                  className={`sys-node group flex flex-col items-center gap-2 rounded-2xl border px-1.5 py-3 text-center transition-[border-color,background-color,box-shadow] duration-300 lg:flex-row lg:gap-3 lg:px-4 lg:text-left ${
                    on ? "border-accent/70 bg-accent/10 shadow-[0_0_32px_-8px_rgba(47,91,255,0.7)]" : "border-line-strong bg-ink/60 hover:border-soft/40"
                  }`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${on ? "bg-accent text-white" : "bg-raised text-soft group-hover:text-paper"}`}>
                    <Icon id={n.id} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium leading-tight text-paper lg:text-sm">{n.label}</span>
                    <span className="hidden text-xs text-muted lg:block">{n.sub}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Le CRM, au centre */}
        <div className="flex justify-center">
          <div ref={coreEl} className="relative w-full max-w-[22rem]">
            <span key={pulse} aria-hidden className={`sys-ring pointer-events-none absolute inset-0 rounded-[1.75rem] ${pulse ? "" : "hidden"}`} />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line-strong bg-[radial-gradient(120%_90%_at_50%_0%,#18204a_0%,#0e0f13_55%)] p-5 shadow-[0_40px_90px_-40px_rgba(47,91,255,0.6)]">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper text-ink">
                  <Logo variant="symbol" decorative className="h-4 w-auto" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-paper">Votre CRM</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                    Tout arrive ici, au même endroit
                  </p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-2">
                {COUNTERS.map((label, i) => (
                  <div key={label} className="rounded-xl bg-white/[0.04] px-2.5 py-2">
                    <dt className="text-[10px] leading-tight text-muted">{label}</dt>
                    <dd key={counts[i]} className="sys-count mt-1 text-xl font-semibold tabular-nums tracking-[-0.02em] text-paper">{counts[i]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[11px] text-muted">Aujourd’hui · données de démonstration</p>
            </div>
          </div>
        </div>

        {/* Le mobile du dirigeant : les notifications qui comptent */}
        <div ref={youEl} className="mx-auto w-full max-w-[22rem] lg:mx-0">
          <p className="mb-3 flex items-center gap-2 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
            Vous, sur votre mobile
          </p>
          <ol className="relative h-[15.5rem] space-y-2 overflow-hidden" aria-live="off">
            {feed.map(({ ev, key }, i) => (
              <li
                key={key}
                className={`sys-notif rounded-2xl border bg-raised/90 p-3 backdrop-blur ${ev.ok ? "border-ok/40" : "border-line-strong"}`}
                style={{ opacity: 1 - i * 0.25 }}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${ev.ok ? "bg-ok text-ink" : "bg-paper text-ink"}`}>
                    <Icon id={ev.from} className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13px] font-medium text-paper">{ev.title}</span>
                      <span className="shrink-0 text-[10px] text-muted">{i === 0 ? "à l’instant" : `il y a ${i * 2} min`}</span>
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-soft">{ev.detail}</span>
                  </span>
                </div>
              </li>
            ))}
            {feed.length === 0 && (
              <li className="rounded-2xl border border-dashed border-line-strong p-4 text-center text-xs text-muted">Les notifications arrivent ici.</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
