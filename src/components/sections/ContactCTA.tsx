import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { RevealTitle } from "@/components/Reveal";
import { site } from "@/lib/site";

export function ContactCTA({ title = ["Parlons de", "ce qui vient."], text }: { title?: string[]; text?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line">
      <div className="glow-accent pointer-events-none absolute -bottom-1/2 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 opacity-70" aria-hidden />
      <div className="wrap relative py-[clamp(7rem,16vw,14rem)]">
        <RevealTitle id="cta-title" className="text-giant metal-text font-semibold leading-[0.92] tracking-[-0.05em]" lines={title} />
        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-end">
          <p className="max-w-md text-lg text-muted md:col-span-5">
            {text ?? "Un site, une automatisation, une application ou un jeu : décrivez votre projet. Nous vous répondons sous deux jours ouvrés avec une première analyse."}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:col-span-7 md:justify-end">
            <Link href="/contact/" className="btn btn-primary !h-14 !px-8 text-base">
              Démarrer un projet <span className="btn-icon"><ArrowIcon /></span>
            </Link>
            <a href={`mailto:${site.email}`} className="link-line px-2 text-center font-display text-paper">{site.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
