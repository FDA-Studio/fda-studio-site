"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./brand/Logo";
import { nav, site } from "@/lib/site";
import { SoundToggle } from "./SoundToggle";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // État au scroll : fond après 24px, masquage au scroll descendant
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 320) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture du menu à chaque navigation
  useEffect(() => setOpen(false), [pathname]);

  // Menu mobile : verrouillage du scroll, Échap, focus
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"));
        const all = [toggleRef.current!, ...items];
        const i = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); all[all.length - 1].focus(); }
        else if (!e.shiftKey && i === all.length - 1) { e.preventDefault(); all[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <a href="#contenu" className="sr-only-focusable fixed left-4 top-4 z-[80] rounded-full bg-paper px-4 py-2 text-ink">
        Aller au contenu
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled && !open ? "border-b border-line/70 bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"}`}
      >
        <div className="wrap flex h-[4.25rem] items-center justify-between md:h-20">
          <Link href="/" aria-label="FDA Studio, accueil" className="relative z-10 -m-2 p-2">
            <Logo variant="horizontal" decorative className="h-[2.4rem] w-auto text-white md:h-10" studioColor="var(--color-muted)" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`link-line font-display text-[0.9375rem] tracking-[-0.01em] transition-colors ${
                  isActive(item.href) ? "text-paper" : "text-muted hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SoundToggle className="relative z-10" />
            <Link href="/contact/" className="btn btn-primary hidden !h-11 !px-5 text-sm sm:inline-flex">
              Démarrer un projet
            </Link>
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
      <div
        id="menu-mobile"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink md:hidden"
      >
        <div className="glow-accent pointer-events-none absolute -right-40 top-20 h-96 w-96 opacity-60" />
        <div className="wrap flex h-full flex-col pb-10 pt-28">
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {[...nav, { href: "/contact/", label: "Contact" }].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                style={{ ["--i" as string]: i }}
                className="hero-fade flex items-baseline justify-between border-b border-line py-5 font-display text-[2.4rem] font-semibold leading-none tracking-[-0.04em]"
              >
                {item.label}
                <span className={`h-2 w-2 rounded-full ${isActive(item.href) ? "bg-accent" : "bg-transparent"}`} aria-hidden />
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-5">
            <Link href="/contact/" className="btn btn-primary w-full">Démarrer un projet</Link>
            <a href={`mailto:${site.email}`} className="block text-center text-muted">{site.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
