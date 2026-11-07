import Link from "next/link";
import { RevealTitle } from "@/components/Reveal";
import { DoorPicker } from "@/components/demos/DoorPicker";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { doorKnight as dk } from "@/lib/doorknight";

const facts = [
  ["1 000", "portes à franchir"],
  ["10", "mondes et leurs gardiens"],
  ["4", "classes jouables"],
] as const;

export function GamingSection() {
  return (
    <section aria-labelledby="gaming-title" className="relative isolate overflow-hidden bg-night">
      {/* Visuel officiel : la porte de Door Knight */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <img
          src={dk.door}
          alt=""
          width={1640}
          height={2050}
          loading="lazy"
          decoding="async"
          className="absolute -right-1/3 top-0 h-full w-auto max-w-none opacity-25 blur-[2px] md:-right-[12%] md:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-night/55" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-night to-transparent" />
      </div>

      <div className="section">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="kicker text-[#a59fc0]">Gaming & interactif</p>
            <RevealTitle id="gaming-title" className="text-title mt-8" lines={["Nous créons", "aussi nos propres", "mondes."]} />
            <img src={dk.wordmark} alt="Door Knight" width={1200} height={799} loading="lazy" decoding="async" className="mt-10 h-auto w-64 md:w-80" />
            <p className="mt-6 text-lg text-[#c9c4dc]">
              Notre premier jeu : un jeu d’action 3D pour iPhone, iPad et Android, où chaque porte cache une horde, un boss ou le gardien d’un monde.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {facts.map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl font-semibold tracking-[-0.04em] text-paper md:text-5xl">{n}</dd>
                  <dd className="mt-2 text-sm text-[#a59fc0]">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link href="/gaming/" className="btn btn-primary">
                Découvrir Door Knight <span className="btn-icon"><ArrowIcon /></span>
              </Link>
              <a href={dk.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !border-[#3b3550] !bg-transparent">
                doorknight.games <ExternalIcon />
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            </div>
            <p className="mt-5 text-sm text-[#a59fc0]">Door Knight 2.0 est en développement. Une version est jouable en bêta via TestFlight.</p>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <DoorPicker />
          </div>
        </div>

        {/* Les quatre classes */}
        <ul className="wrap mt-20 grid grid-cols-4 gap-3 md:mt-28 md:gap-6" aria-label="Classes jouables de Door Knight">
          {dk.classes.map((c) => (
            <li key={c.name} className="group">
              <div className="grid aspect-[3/4] place-items-end justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(110,75,255,0.3),transparent_70%)] px-3 pt-4">
                <img src={c.img} alt="" width={155} height={240} loading="lazy" decoding="async" className="h-[90%] w-auto object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105" />
              </div>
              <p className="mt-3 text-center text-sm text-paper md:text-base">{c.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
