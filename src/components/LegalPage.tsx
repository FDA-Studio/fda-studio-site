import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

export function LegalPage({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  return (
    <>
      <PageHeader crumbs={[{ name: title, path }]} lines={[title]} />
      <section className="pb-[var(--section-y)]">
        <div className="wrap">
          <div className="measure space-y-10 text-muted [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-paper [&_p]:mt-3 [&_li]:mt-2 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_mark]:rounded [&_mark]:bg-accent/15 [&_mark]:px-1 [&_mark]:text-accent-bright">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
