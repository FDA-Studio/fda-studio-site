import { RevealTitle } from "@/components/Reveal";

export function Vision() {
  return (
    <section aria-labelledby="vision-title" className="section">
      <div className="wrap">
        <p className="kicker">Vision</p>
        <RevealTitle
          id="vision-title"
          className="mt-8 max-w-[18ch] text-title text-paper"
          lines={["Nous réunissons", "ce que d’autres séparent :", "design, code, IA", "et jeu vidéo."]}
          as="h2"
        />
        <div className="mt-16 grid gap-12 border-t border-line pt-12 md:mt-24 md:grid-cols-12 md:gap-8">
          <p className="font-display text-2xl leading-snug tracking-[-0.02em] text-paper md:col-span-5 md:text-3xl">
            Un produit numérique réussi demande une seule équipe qui pense l’expérience, la technique et l’usage en même temps.
          </p>
          <div className="space-y-6 text-muted md:col-span-6 md:col-start-7">
            <p>
              <strong className="font-medium text-paper">Pour les entreprises</strong>, nous transformons un besoin en outil concret :
              un site qui convertit, un agent IA qui traite les demandes, une application que les équipes adoptent. Chaque projet commence
              par vos objectifs et se termine par un produit en production, mesuré et maintenu.
            </p>
            <p>
              <strong className="font-medium text-paper">Pour les talents et les partenaires</strong>, FDA Studio est un terrain
              d’exigence : 3D temps réel, intelligence artificielle appliquée, jeux mobiles. Nous concevons nos propres produits,
              et ce que nous y apprenons profite à chaque client.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
