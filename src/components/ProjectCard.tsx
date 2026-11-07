import Link from "next/link";
import { ProjectVisual } from "./ProjectVisual";
import { categoryLabels, natureLabels, type Project } from "@/lib/projects";

export function ProjectCard({ project, size = "md" }: { project: Project; size?: "lg" | "md" }) {
  const concept = project.nature === "concept";
  return (
    <article className="group">
      <Link href={`/work/${project.slug}/`} className="block" aria-label={`${project.title} : ${project.summary}`}>
        <div className={`relative overflow-hidden rounded-[1.25rem] border border-line ${size === "lg" ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3]"}`}>
          <ProjectVisual project={project} className="absolute inset-0" />
          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-md ${
              concept ? "border-line-strong bg-ink/60 text-muted" : "border-accent/40 bg-ink/60 text-paper"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${concept ? "bg-steel" : project.nature === "production" ? "bg-ok" : "bg-accent"}`} aria-hidden />
            {natureLabels[project.nature]}
          </span>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h3 className={`font-display font-semibold tracking-[-0.035em] text-paper transition-colors group-hover:text-accent-bright ${size === "lg" ? "text-3xl md:text-4xl" : "text-2xl"}`}>
              {project.title}
            </h3>
            <p className="mt-2 max-w-xl text-muted">{project.summary}</p>
          </div>
          <p className="shrink-0 text-sm text-muted sm:pt-2 sm:text-right">
            {project.categories.map((c) => categoryLabels[c]).join(", ")}
          </p>
        </div>
      </Link>
    </article>
  );
}
