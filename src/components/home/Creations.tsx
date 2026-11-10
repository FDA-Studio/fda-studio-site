"use client";

import { useEffect, useRef, useState } from "react";
import { VoiceAgent } from "@/components/creations/VoiceAgent";
import { ChatAssistant } from "@/components/creations/ChatAssistant";
import { CrmShowcase } from "@/components/creations/CrmShowcase";
import { DocReader } from "@/components/creations/DocReader";
import { TalkToEmma } from "@/components/creations/TalkToEmma";
import { SystemMap } from "@/components/creations/SystemMap";
import { Live, PauseButton } from "@/components/motion/Live";
import { sfx } from "@/lib/sound";

const items = [
  { id: "demo-telephone", title: "Répondre au téléphone", line: "L’agent vocal décroche, comprend, déplace le rendez-vous et confirme par SMS. Jour et nuit.", Demo: VoiceAgent },
  { id: "demo-messages", title: "Répondre aux clients par écrit", line: "L’assistant répond en deux secondes à partir de vos documents, puis déclenche l’action.", Demo: ChatAssistant },
  { id: "demo-crm", title: "Notre CRM, de la demande au devis signé", line: "Une demande arrive sur le site : la fiche client et l’opportunité se créent, le mobile sonne. Le devis part, il est signé en ligne. Notre propre outil, conçu par le studio pour le web et l’iPhone.", Demo: CrmShowcase },
  { id: "demo-documents", title: "Lire factures et contrats", line: "Un agent lit chaque document reçu, en extrait les données, les vérifie et les classe dans vos outils. Il signale ce qui demande votre attention. Sans ressaisie.", Demo: DocReader },
];

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
export function Creations() {
  const [active, setActive] = useState(0);
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
            Le téléphone, le site, les messages et les documents arrivent au même endroit, et vous êtes prévenu de ce qui compte. Trois concepts et notre propre CRM, rejoués avec des données fictives.
          </p>
        </div>

        {/* Vue d'ensemble : les signaux de l'entreprise convergent vers le CRM */}
        <div className="frame mt-12 md:mt-16">
          <FrameBar title="Vue d’ensemble" />
          <Live className="relative px-4 pb-8 pt-7 md:px-10 md:pb-12 md:pt-10" threshold={0.25}>
            <SystemMap />
          </Live>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
          <ol className="min-w-0 lg:col-span-5 lg:pb-[16svh]">
            {items.map(({ id, title, line, Demo }, i) => (
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
                <h3 className="chapter-title">{title}</h3>
                <p className="mt-3 max-w-md text-soft">{line}</p>
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
                <FrameBar title={items[active].title} />
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
      </div>
    </section>
  );
}
