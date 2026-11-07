/** Une page qui s'assemble bloc par bloc, en boucle (CSS pur). */
export function WebVisual() {
  const b = (delay: number, cls: string, extra = "") => (
    <div
      className={`origin-left rounded-md ${cls} ${extra}`}
      style={{ animation: `web-build 6.5s ${(delay - 1.6).toFixed(2)}s var(--ease-out-expo) infinite both` }}
    />
  );
  return (
    <div className="relative mx-auto w-full max-w-[34rem]" aria-hidden>
      <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(47,91,255,0.22),transparent)]" />
      <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-ink shadow-[0_50px_120px_-40px_rgba(47,91,255,0.45)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 h-5 flex-1 rounded-full bg-surface px-3 font-mono text-[10px] leading-5 text-muted">fdastudio.fr</span>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            {b(0.1, "h-3 w-16 bg-paper/80")}
            <div className="flex gap-3">{b(0.2, "h-2 w-10 bg-line-strong")}{b(0.25, "h-2 w-10 bg-line-strong")}{b(0.3, "h-2 w-10 bg-line-strong")}</div>
          </div>
          <div className="grid grid-cols-5 items-center gap-5 pt-4">
            <div className="col-span-3 space-y-3">
              {b(0.45, "h-6 w-full bg-paper")}
              {b(0.55, "h-6 w-4/5 bg-paper")}
              {b(0.7, "h-2.5 w-3/4 bg-line-strong")}
              {b(0.78, "h-2.5 w-2/3 bg-line-strong")}
              {b(0.95, "mt-2 h-8 w-28 rounded-full bg-accent")}
            </div>
            <div className="col-span-2">{b(0.6, "aspect-square w-full bg-[radial-gradient(circle_at_35%_30%,#f4f4f2,#8a8d91_25%,#1a1b1f_60%)] !rounded-full")}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[1.1, 1.2, 1.3].map((d) => (
              <div key={d} className="space-y-2">
                {b(d, "aspect-[4/3] w-full bg-surface")}
                {b(d + 0.08, "h-2 w-2/3 bg-line-strong")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
