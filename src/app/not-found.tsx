import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden">
      <div className="glow-accent pointer-events-none absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden />
      <div className="wrap relative">
        <p className="outline-text font-display text-[30vw] font-semibold leading-none tracking-[-0.06em] md:text-[18rem]" aria-hidden>404</p>
        <h1 className="text-title mt-4">Cette porte ne mène nulle part.</h1>
        <p className="mt-6 max-w-md text-lg text-muted">La page demandée n’existe pas ou a été déplacée. Choisissez une autre porte.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">Retour à l’accueil</Link>
          <Link href="/contact/" className="btn btn-ghost">Nous contacter</Link>
        </div>
      </div>
    </section>
  );
}
