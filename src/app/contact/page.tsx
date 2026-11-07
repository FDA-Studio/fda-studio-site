import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact : démarrer un projet",
  description: "Décrivez votre projet de site internet, d'intégration IA, d'application ou de jeu. FDA Studio vous répond sous deux jours ouvrés avec une première analyse.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", path: "/contact/" }]}
        lines={["Démarrons", "votre projet."]}
        intro={<p>Quelques questions pour comprendre votre besoin. Nous vous répondons sous deux jours ouvrés avec une première analyse et les prochaines étapes.</p>}
      />
      <section aria-label="Formulaire de contact" className="pb-[var(--section-y)]">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32 space-y-10">
              <div>
                <h2 className="font-display text-sm text-muted">Écrire directement</h2>
                <a href={`mailto:${site.email}`} className="link-line mt-3 inline-block font-display text-2xl text-paper">{site.email}</a>
              </div>
              <div>
                <h2 className="font-display text-sm text-muted">Ce qui se passe ensuite</h2>
                <ol className="mt-4 space-y-4 text-muted">
                  <li className="flex gap-4"><span className="font-display text-accent-bright">1</span>Nous étudions votre demande et revenons vers vous sous deux jours ouvrés.</li>
                  <li className="flex gap-4"><span className="font-display text-accent-bright">2</span>Un échange de 30 minutes pour préciser vos objectifs et contraintes.</li>
                  <li className="flex gap-4"><span className="font-display text-accent-bright">3</span>Une proposition écrite : périmètre, planning, budget et coûts récurrents.</li>
                </ol>
              </div>
              <div>
                <h2 className="font-display text-sm text-muted">Localisation</h2>
                <p className="mt-3 text-paper">{site.region}. Projets en France et à distance.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
