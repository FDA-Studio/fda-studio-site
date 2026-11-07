"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { categoryLabels, projects, type ProjectCategory } from "@/lib/projects";

const filters: ("all" | ProjectCategory)[] = ["all", "web", "ia", "applications", "gaming"];

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const list = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  return (
    <div>
      <div role="group" aria-label="Filtrer les réalisations" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "all" ? projects.length : projects.filter((p) => p.categories.includes(f)).length;
          return (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className="chip">
              {f === "all" ? "Tout" : categoryLabels[f]}
              <span className="text-xs opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">{list.length} projets affichés</p>
      <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">
        {list.map((p, i) => (
          <div key={p.slug} className={i % 2 === 1 ? "md:mt-24" : ""}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
