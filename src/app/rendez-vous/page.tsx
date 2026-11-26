import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";

const path = "/rendez-vous/";

export const metadata: Metadata = pageMeta({
  title: "Prendre rendez-vous avec FDA Studio",
  description:
    "Réservez en ligne un appel ou une visio de 30 minutes avec Antoine, FDA Studio, pour parler de votre site internet, de votre application ou de votre projet d’intelligence artificielle.",
  path,
  keywords: ["rendez-vous FDA Studio", "prendre rendez-vous agence web Tours", "visio agence web", "FDA Studio contact"],
});

/** Page de réservation : créneaux en direct depuis l'agenda du CRM. Adresse à partager (fiches, signatures, messages). */
export default function BookingPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Prendre rendez-vous", path }]}
        lines={["Prendre", "rendez-vous."]}
        intro={
          <p>
            Choisissez un créneau de 30 minutes, en visio ou par téléphone, pour parler de votre projet avec Antoine. Les créneaux affichés sont
            ceux réellement libres dans son agenda. Vous recevez une confirmation par e-mail.
          </p>
        }
      />
      <section className="wrap pb-24 md:pb-32">
        <div className="max-w-3xl">
          <BookingForm />
        </div>
      </section>
    </>
  );
}
