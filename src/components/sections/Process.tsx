"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/lib/process";



export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.6 - r.top) / r.height;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const activeIndex = Math.min(processSteps.length - 1, Math.floor(progress * processSteps.length));

  return (
    <section aria-labelledby="process-title" className="section bg-graphite">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="kicker">Méthode</p>
            <h2 id="process-title" className="text-title mt-8">De l’idée à la production, sans zone d’ombre.</h2>
            <p className="mt-8 max-w-md text-lg text-muted">
              Cinq étapes, un livrable à chacune. Vous savez toujours où en est votre projet, ce qu’il coûte et ce qui reste à faire.
            </p>
          </div>
        </div>
        <ol ref={listRef} className="relative lg:col-span-6 lg:col-start-7">
          <span className="absolute bottom-0 left-[1.125rem] top-0 w-px bg-line" aria-hidden />
          <span className="absolute left-[1.125rem] top-0 w-px origin-top bg-accent transition-transform duration-200" style={{ height: "100%", transform: `scaleY(${progress})` }} aria-hidden />
          {processSteps.map((s, i) => {
            const on = i <= activeIndex && progress > 0;
            return (
              <li key={s.title} className="relative pb-16 pl-16 last:pb-0">
                <span
                  className={`absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border font-display text-sm transition-colors duration-500 ${
                    on ? "border-accent bg-ink text-accent-bright" : "border-line-strong bg-graphite text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className={`text-heading transition-colors duration-500 ${on ? "text-paper" : "text-paper/50"}`}>{s.title}</h3>
                <p className="mt-4 max-w-lg text-muted">{s.text}</p>
                <p className="mt-4 text-sm text-paper/80">
                  <span className="text-muted">Livrable : </span>{s.out}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
