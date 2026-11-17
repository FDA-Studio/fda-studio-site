"use client";

import { useEffect, useRef, useState } from "react";
import { VoiceAgent } from "@/components/creations/VoiceAgent";
import { ChatAssistant } from "@/components/creations/ChatAssistant";
import { CrmShowcase } from "@/components/creations/CrmShowcase";
import { DocReader } from "@/components/creations/DocReader";
import { TalkToEmma } from "@/components/creations/TalkToEmma";
import { SystemMap } from "@/components/creations/SystemMap";
import { AgentOffice } from "@/components/creations/AgentOffice";
import { Live, PauseButton } from "@/components/motion/Live";
import { sfx } from "@/lib/sound";

const items = [
  { id: "demo-telephone", tab: "Téléphone", title: "Répondre au téléphone", punch: "Il décroche. Jour et nuit.", short: "L’agent vocal comprend, déplace le rendez-vous et note tout dans le CRM.", line: "L’agent vocal décroche, comprend, déplace le rendez-vous dans votre agenda et note tout dans le CRM. Jour et nuit.", Demo: VoiceAgent },
  { id: "demo-messages", tab: "Messages", title: "Répondre aux clients par écrit", punch: "Une réponse en deux secondes.", short: "L’assistant répond à partir de vos documents, puis déclenche l’action.", line: "L’assistant répond en deux secondes à partir de vos documents, puis déclenche l’action.", Demo: ChatAssistant },
  { id: "demo-crm", tab: "CRM", title: "Notre CRM", punch: "De la demande au devis signé.", short: "Notre propre CRM, sur le web et l’iPhone : la fiche se crée, le devis part, il est signé en ligne.", line: "Une demande arrive sur le site : la fiche client et l’opportunité se créent, le mobile sonne. Le devis part, il est signé en ligne. Notre propre outil, conçu par le studio pour le web et l’iPhone.", Demo: CrmShowcase },
  { id: "demo-documents", tab: "Documents", title: "Lire factures et contrats", punch: "Zéro ressaisie.", short: "Un agent lit chaque document, vérifie, classe et signale ce qui demande votre attention.", line: "Un agent lit chaque document reçu, en extrait les données, les vérifie et les classe dans vos outils. Il signale ce qui demande votre attention. Sans ressaisie.", Demo: DocReader },
];
// Titres de l'accueil actuel (la version courte les garde en surtitre, pour le référencement)
const longTitles = ["Répondre au téléphone", "Répondre aux clients par écrit", "Notre CRM, de la demande au devis signé", "Lire factures et contrats"];

/** Barre de fenêtre commune aux démos : nom du concept, mention « démo », pause. */
function FrameBar({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-1 pl-4 pr-3 md:pl-5">
      <p className="min-w-0 truncate text-sm text-muted">
        {title && (
          <>
            <span className="text-paper">{title}</span> <span aria-hidden>·</span>{" "}
          </>
        )}
        Démo, données fictives
      </p>
      <PauseButton className="shrink-0" />
    </div>
  );
}

/**
 * Le moment de la page : quatre démonstrations d'IA présentées comme des chapitres.
 * Ordinateur : la liste défile, une seule fenêtre reste à l'écran (position sticky) et change de démo.
 * Téléphone et « réduire les animations » : chaque chapitre porte sa propre démo, sans épinglage.
 */
export function Creations({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const tabsEl = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const ActiveDemo = items[active].Demo;

  // Version courte, téléphone : un lien vers #demo-… ouvre le bon onglet
  useEffect(() => {
    if (!compact) return;
    const open = () => {
      const i = items.findIndex((it) => `#${it.id}` === window.location.hash);
      if (i < 0 || window.matchMedia("(min-width: 1024px)").matches) return;
      setActive(i);
      tabsEl.current?.scrollIntoView({ block: "start" });
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [compact]);

  // Glisser la démo vers la gauche ou la droite change d'onglet
  const swipe = (dx: number, dy: number) => {
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    setActive((a) => Math.min(items.length - 1, Math.max(0, a + (dx < 0 ? 1 : -1))));
  };
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const first = useRef(true);

  // Changement de chapitre : un souffle et une note (si le son est activé)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    sfx("step");
  }, [active]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="creations" aria-labelledby="creations-title" className="section bg-graphite">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="creations-title" className="section-title md:col-span-7">
            Quatre agents.
            <br />
            Un seul système.
          </h2>
          <p className="text-lg text-soft md:col-span-5">
            {compact
              ? "Téléphone, site, messages, documents : tout arrive au même endroit. Démos rejouées avec des données fictives."
              : "Le téléphone, le site, les messages et les documents arrivent au même endroit, et vous êtes prévenu de ce qui compte. Trois concepts et notre propre CRM, rejoués avec des données fictives."}
          </p>
        </div>

        {/* Vue d'ensemble : les signaux de l'entreprise convergent vers le CRM */}
        <div className={`frame mt-12 md:mt-16 ${compact ? "hidden lg:block" : ""}`}>
          <FrameBar title="Vue d’ensemble" />
          <Live className="relative px-4 pb-8 pt-7 md:px-10 md:pb-12 md:pt-10" threshold={0.25}>
            <SystemMap />
          </Live>
        </div>

        {/* Version courte, téléphone et tablette : une seule démo à la fois, choisie par onglet */}
        {compact && (
          <div ref={tabsEl} className="mt-10 scroll-mt-24 lg:hidden">
            <div role="tablist" aria-label="Démonstrations" className="demo-tabs">
              {items.map(({ tab }, i) => (
                <button key={tab} type="button" role="tab" id={`demo-tab-${i}`} aria-selected={active === i} aria-controls={`demo-panel-${i}`} tabIndex={active === i ? 0 : -1} className="demo-tab" onClick={() => setActive(i)}>
                  {tab}
                </button>
              ))}
            </div>
            {items.map(({ title, punch, short }, i) => (
              <div key={title} role="tabpanel" id={`demo-panel-${i}`} aria-labelledby={`demo-tab-${i}`} hidden={active !== i} className="demo-panel mt-8">
                <p className="text-sm text-muted">{longTitles[i]}</p>
                <h3 className="chapter-title mt-2">{punch}</h3>
                <p className="mt-3 max-w-md text-soft">{short}</p>
                {i === 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <TalkToEmma />
                    <p className="flex items-center gap-2 text-sm text-muted">
                      <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
                      Elle vous répond en direct.
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div
              className="frame mt-6"
              onTouchStart={(e) => {
                touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
              }}
              onTouchEnd={(e) => {
                const t = touch.current;
                touch.current = null;
                if (t) swipe(e.changedTouches[0].clientX - t.x, e.changedTouches[0].clientY - t.y);
              }}
            >
              <FrameBar />
              <Live className="relative h-[33rem] overflow-hidden" threshold={0.3}>
                <div key={active} aria-hidden="true" className="demo-swap h-full">
                  <ActiveDemo />
                </div>
              </Live>
            </div>
            <div className="mt-4 flex justify-center gap-2" aria-hidden>
              {items.map(({ tab }, i) => (
                <span key={tab} className="demo-dot" data-on={active === i} />
              ))}
            </div>
          </div>
        )}

        <div className={`mt-14 grid-cols-1 gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12 ${compact ? "hidden lg:grid" : "grid"}`}>
          <ol className="min-w-0 lg:col-span-5 lg:pb-[16svh]">
            {items.map(({ id, title, line, punch, short, Demo }, i) => (
              <li
                key={title}
                id={id}
                ref={(el) => {
                  steps.current[i] = el;
                }}
                data-index={i}
                data-active={active === i}
                className="chapter scroll-mt-28 border-t border-line py-8 lg:flex lg:min-h-[62svh] lg:flex-col lg:justify-center lg:py-0"
              >
                {compact && <p className="text-sm text-muted">{longTitles[i]}</p>}
                <h3 className={`chapter-title ${compact ? "mt-2" : ""}`}>{compact ? punch : longTitles[i]}</h3>
                <p className="mt-3 max-w-md text-soft">{compact ? short : line}</p>
                {i === 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <TalkToEmma />
                    <p className="flex items-center gap-2 text-sm text-muted">
                      <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
                      Pas une vidéo : elle vous répond en direct.
                    </p>
                  </div>
                )}

                {/* Téléphone et tablette : la démo sous son chapitre */}
                <div className="frame mt-6 lg:hidden">
                  <FrameBar />
                  <Live className="relative h-[33rem] overflow-hidden" threshold={0.3}>
                    <div aria-hidden="true" className="h-full">
                      <Demo />
                    </div>
                  </Live>
                </div>
              </li>
            ))}
          </ol>

          {/* Ordinateur : une fenêtre épinglée qui change de démo */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[max(6rem,calc(50svh-19rem))]">
              <div className="frame">
                <FrameBar title={longTitles[active]} />
                <div className="relative h-[min(34rem,70svh)] overflow-hidden">
                  {items.map(({ title, Demo }, i) => (
                    <Live
                      key={title}
                      enabled={active === i}
                      threshold={0.1}
                      className="demo-layer absolute inset-0"
                    >
                      <div aria-hidden="true" data-shown={active === i} className="demo-slide h-full">
                        <Demo />
                      </div>
                    </Live>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Le bureau : la page de notre CRM où l'on voit les agents travailler */}
        <div id="demo-bureau" className="mt-16 scroll-mt-28 border-t border-line pt-12 md:mt-24 md:pt-16">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <h3 className="section-title md:col-span-7">
              Un bureau pour
              <br />
              les voir travailler.
            </h3>
            <p className="text-lg text-soft md:col-span-5">
              {compact
                ? "Chaque agent a son poste. Une page de notre CRM, rejouée avec une journée fictive."
                : "Chaque agent a son poste. Le faisceau tourne autour de celui qui travaille, et son travail part vers le CRM. C’est une page de notre propre outil, sur le web et sur mobile, rejouée ici avec une journée fictive."}
            </p>
          </div>
          <div className="frame mt-10 md:mt-14">
            <FrameBar title="Le bureau des agents" />
            <Live className="relative" threshold={0.2}>
              <div aria-hidden="true">
                <AgentOffice />
              </div>
            </Live>
          </div>
        </div>
      </div>
    </section>
  );
}
