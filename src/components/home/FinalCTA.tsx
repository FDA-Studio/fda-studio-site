import { ContactForm } from "@/components/ContactForm";
import { ArrowIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { OpenEmmaButton } from "@/components/chat/EmmaChat";

/** Contact : le formulaire de projet, l'adresse e-mail et la zone d'intervention. */
export function FinalCTA() {
  return (
    <section id="contact" aria-labelledby="final-title" className="section border-t border-line">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="final-title" className="section-title">Parlons de votre projet.</h2>
          <p className="mt-6 max-w-md text-lg text-soft">
            Un site, une IA ou une application : le plus rapide est d’en parler à Emma, notre assistante IA. Elle note votre besoin et vous propose un créneau avec Antoine.
          </p>
          <a href={`mailto:${site.email}`} className="btn btn-ghost mt-8">
            Écrire à {site.email}
            <ArrowIcon />
          </a>
          <p className="mt-8 text-sm text-muted">{site.region}. Projets en France et à distance.</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <OpenEmmaButton className="emma-cta group">
            <span className="emma-orb h-11 w-11" aria-hidden>
              <span className="emma-orb__core" />
              <span className="emma-orb__glint" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block font-medium text-paper">Discuter avec Emma</span>
              <span className="block text-sm text-muted">Réponse immédiate, rendez-vous pris dans l’agenda d’Antoine.</span>
            </span>
            <ArrowIcon />
          </OpenEmmaButton>
          <p className="mb-5 mt-8 text-sm text-muted">Vous préférez un formulaire ? Décrivez votre projet ici :</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
