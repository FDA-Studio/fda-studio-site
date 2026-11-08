import { ContactForm } from "@/components/ContactForm";
import { ArrowIcon } from "@/components/icons";
import { site } from "@/lib/site";

/** Contact : le formulaire de projet, l'adresse e-mail et la zone d'intervention. */
export function FinalCTA() {
  return (
    <section id="contact" aria-labelledby="final-title" className="section border-t border-line">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="final-title" className="section-title">Parlons de votre projet.</h2>
          <p className="mt-6 max-w-md text-lg text-soft">
            Un site, une IA, une application ou un jeu : décrivez votre besoin en quelques lignes, nous revenons vers vous avec une première proposition.
          </p>
          <a href={`mailto:${site.email}`} className="btn btn-ghost mt-8">
            Écrire à {site.email}
            <ArrowIcon />
          </a>
          <p className="mt-8 text-sm text-muted">{site.region}. Projets en France et à distance.</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
