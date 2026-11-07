import { ProjectCover } from "./ProjectCover";
import { asset } from "@/lib/site";
import type { Project } from "@/lib/projects";

/** Visuel d'un projet : image réelle si disponible, sinon composition générée (concepts internes). */
export function ProjectVisual({ project, className = "", eager = false }: { project: Project; className?: string; eager?: boolean }) {
  const img = project.image;
  if (!img) return <ProjectCover variant={project.cover} className={className} />;
  const src = img.src.startsWith("/") ? asset(img.src) : img.src;
  return (
    <div className={`overflow-hidden bg-graphite ${className}`}>
      <img
        src={src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        style={{ objectPosition: img.position ?? "center" }}
      />
    </div>
  );
}
