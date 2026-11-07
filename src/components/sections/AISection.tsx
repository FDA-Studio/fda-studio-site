import Link from "next/link";
import { RevealTitle } from "@/components/Reveal";
import { AgentConsole } from "@/components/demos/AgentConsole";
import { ArrowIcon } from "@/components/icons";

const principles = [
  { title: "Un périmètre précis", text: "L’agent traite un type de demande défini, avec des règles écrites. Rien de plus." },
  { title: "Un humain qui valide", text: "Tout ce qui engage votre entreprise auprès d’un client passe par une validation." },
  { title: "Des coûts maîtrisés", text: "Estimés avant le projet, plafonnés chez le fournisseur, suivis chaque mois." },
  { title: "Des données protégées", text: "Clés côté serveur, données minimisées, hébergement européen privilégié." },
];

export function AISection() {
  return (
    <section id="demo-ia" aria-labelledby="ia-title" className="section scroll-mt-16 overflow-hidden">
      <div className="glow-accent pointer-events-none absolute -left-60 top-1/3 h-[40rem] w-[40rem] opacity-40" aria-hidden />
      <div className="wrap relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="kicker">Intelligence artificielle</p>
          <RevealTitle id="ia-title" className="text-title mt-8" lines={["L’IA au travail,", "pas en vitrine."]} />
          <p className="measure mt-8 text-lg text-muted">
            Une demande arrive : e-mail, appel, formulaire. L’agent la lit, en extrait l’essentiel, prépare les actions dans vos outils
            et laisse la décision à votre équipe. Essayez les trois scénarios.
          </p>
          <dl className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="border-t border-line pt-5">
                <dt className="font-display text-paper">{p.title}</dt>
                <dd className="mt-2 text-sm text-muted">{p.text}</dd>
              </div>
            ))}
          </dl>
          <Link href="/services/ia/" className="btn btn-ghost mt-12">
            L’IA pour votre entreprise <ArrowIcon />
          </Link>
        </div>
        <div className="min-w-0 lg:col-span-7 lg:pt-20">
          <AgentConsole />
          <p className="mt-4 text-xs text-muted">
            Démonstration scénarisée : elle n’appelle aucun modèle d’IA et ne traite aucune donnée réelle. Les exemples sont fictifs.
          </p>
        </div>
      </div>
    </section>
  );
}
