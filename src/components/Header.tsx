"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./brand/Logo";
import { nav, site } from "@/lib/site";
import { SoundToggle } from "./SoundToggle";

/** Lien d'ancre : défilement fluide sur l'accueil, retour à l'accueil depuis les pages légales. */
function useAnchor() {
  const pathname = usePathname();
  const home = pathname === "/";
  return (id: string) => ({
    href: home ? `#${id}` : `/#${id}`,
    onClick: (e: React.MouseEvent) => {
      if (!home) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: id === "contact" ? 0 : -8, duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    },
  });
}

export function Header() {
  const anchor = useAnchor();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Fond après 24 px et section active
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  // Menu mobile : verrouillage du scroll, Échap, piège du focus
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const all = [toggleRef.current!, ...Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"))];
        const i = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); all[all.length - 1].focus(); }
        else if (!e.shiftKey && i === all.length - 1) { e.preventDefault(); all[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    const a = anchor(id);
    return {
      href: a.href,
      onClick: (e: React.MouseEvent) => {
        setOpen(false);
        // Laisse le menu se fermer avant de défiler
        window.setTimeout(() => a.onClick(e), 0);
        if (a.href.startsWith("#")) e.preventDefault();
      },
    };
  };

  return (
    <>
      <a href="#contenu" className="sr-only-focusable fixed left-4 top-4 z-[80] rounded-full bg-paper px-4 py-2 text-ink">
        Aller au contenu
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          scrolled && !open ? "border-b border-line/70 bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="wrap flex h-[4.25rem] items-center justify-between md:h-20">
          <Link href="/" aria-label="FDA Studio, accueil" className="relative z-10 -m-2 p-2">
            <Logo variant="horizontal" decorative className="h-[2.2rem] w-auto text-white md:h-10" studioColor="var(--color-muted)" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-9 md:flex">
            {nav.slice(0, 3).map((item) => (
              <a
                key={item.id}
                {...go(item.id)}
                aria-current={active === item.id ? "location" : undefined}
                className={`link-line text-[0.9375rem] tracking-[-0.01em] transition-colors ${active === item.id ? "text-paper" : "text-muted hover:text-paper"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SoundToggle className="relative z-10" />
            <a {...go("contact")} className="btn btn-primary hidden !h-11 !px-5 text-sm sm:inline-flex">
              Démarrer un projet
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-line-strong md:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 block h-px w-5 bg-paper transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 block h-px w-5 bg-paper transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div id="menu-mobile" ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open} className="fixed inset-0 z-40 bg-ink md:hidden">
        <div className="glow-accent pointer-events-none absolute -right-40 top-20 h-96 w-96 opacity-60" />
        <div className="wrap flex h-full flex-col pb-10 pt-28">
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {nav.map((item, i) => (
              <a
                key={item.id}
                {...go(item.id)}
                style={{ ["--i" as string]: i }}
                className="hero-fade flex items-baseline justify-between border-b border-line py-5 text-[2.4rem] font-semibold leading-none tracking-[-0.04em]"
              >
                {item.label}
                <span className={`h-2 w-2 rounded-full ${active === item.id ? "bg-accent" : "bg-transparent"}`} aria-hidden />
              </a>
            ))}
          </nav>
          <div className="mt-auto space-y-5">
            <a {...go("contact")} className="btn btn-primary w-full">Démarrer un projet</a>
            <a href={`mailto:${site.email}`} className="block text-center text-muted">{site.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
