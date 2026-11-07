import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { RevealTitle } from "@/components/Reveal";
import { ArrowIcon } from "@/components/icons";
import { projects } from "@/lib/projects";

export function WorkShowcase() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const [first, ...rest] = featured;
  return (
    <section aria-labelledby="work-title" className="section">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Réalisations</p>
            <RevealTitle id="work-title" className="text-title mt-8" lines={["Ce que nous", "construisons."]} />
          </div>
          <p className="max-w-sm text-muted">
            Nos produits, nos sites et nos démonstrateurs. Chaque projet indique clairement son statut : en ligne, en développement ou démonstrateur interne.
          </p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12">
          {first && (
            <div className="md:col-span-12">
              <ProjectCard project={first} size="lg" />
            </div>
          )}
          {rest.map((p, i) => (
            <div key={p.slug} className={`md:col-span-6 ${i === 1 ? "md:mt-32" : ""}`}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Link href="/work/" className="btn btn-ghost">
            Toutes les réalisations <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
