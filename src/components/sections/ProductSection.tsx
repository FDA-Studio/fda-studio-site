import Link from "next/link";
import { RevealTitle } from "@/components/Reveal";
import { ProductDemo } from "@/components/demos/ProductDemo";
import { ArrowIcon } from "@/components/icons";

export function ProductSection() {
  return (
    <section id="demo-produit" aria-labelledby="produit-title" className="section scroll-mt-16 bg-graphite">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:order-2 lg:col-span-4 lg:col-start-9">
          <p className="kicker">Applications & produits</p>
          <RevealTitle id="produit-title" className="text-title mt-8" lines={["Un produit,", "trois points", "de vue."]} />
          <p className="mt-8 text-lg text-muted">
            La direction suit ses indicateurs, le terrain gère sa journée, l’administration attribue les droits. Une même application, trois
            interfaces pensées pour chaque rôle. Manipulez le concept : changez de période, cochez une intervention.
          </p>
          <ul className="mt-10 space-y-4 border-t border-line pt-8 text-paper">
            <li>Applications web et mobiles iOS, Android</li>
            <li>SaaS, comptes, abonnements et facturation</li>
            <li>Dashboards et outils métiers sur mesure</li>
          </ul>
          <Link href="/services/applications/" className="btn btn-ghost mt-10">
            Créer votre application <ArrowIcon />
          </Link>
        </div>
        <div className="min-w-0 lg:order-1 lg:col-span-8">
          <ProductDemo />
          <p className="mt-4 text-xs text-muted">Concept d’interface FDA Studio. Données, lieux et chiffres fictifs.</p>
        </div>
      </div>
    </section>
  );
}
