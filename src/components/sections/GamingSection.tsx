import Link from "next/link";
import { RevealTitle } from "@/components/Reveal";
import { DoorPicker } from "@/components/demos/DoorPicker";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { externalLinks } from "@/lib/site";

const facts = [
  ["1 000", "portes à franchir"],
  ["10", "mondes et leurs gardiens"],
  ["4", "classes jouables"],
] as const;

export function GamingSection() {
  return (
    <section aria-labelledby="gaming-title" className="section relative overflow-hidden bg-night">
      {/* Halo et ciel étoilé discret : on change d'univers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[50rem] w-[80rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(110,90,200,0.18),transparent)]" />
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(1px_1px_at_20%_30%,#fff8,transparent),radial-gradient(1px_1px_at_70%_20%,#fff6,transparent),radial-gradient(1px_1px_at_40%_80%,#fff5,transparent),radial-gradient(1px_1px_at_85%_65%,#fff7,transparent),radial-gradient(1px_1px_at_10%_75%,#fff4,transparent)]" />
      </div>

      <div className="wrap relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="kicker text-[#a59fc0]">Gaming & interactif</p>
          <RevealTitle id="gaming-title" className="text-title mt-8" lines={["Nous créons", "aussi nos propres", "mondes."]} />
          <p className="mt-8 text-lg text-[#c9c4dc]">
            <strong className="font-medium text-paper">Door Knight</strong> est notre premier jeu : un jeu d’action 3D pour iPhone, iPad et Android,
            où chaque porte cache une horde, un boss ou le gardien d’un monde. D’autres univers suivront.
          </p>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {facts.map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-semibold tracking-[-0.04em] text-paper md:text-5xl">{n}</dd>
                <dd className="mt-2 text-sm text-[#a59fc0]">{l}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <a href={externalLinks.doorknight} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Découvrir Door Knight <span className="btn-icon"><ExternalIcon /></span>
              <span className="sr-only">(nouvel onglet)</span>
            </a>
            <Link href="/gaming/" className="btn btn-ghost !border-[#3b3550] !bg-transparent">
              Nos univers <ArrowIcon />
            </Link>
          </div>
          <p className="mt-5 text-sm text-[#a59fc0]">Door Knight 2.0 est en développement. Une version est jouable en bêta via TestFlight.</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <DoorPicker />
        </div>
      </div>
    </section>
  );
}
