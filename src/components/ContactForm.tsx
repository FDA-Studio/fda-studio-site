"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { budgets, contactSchema, needs, timelines } from "@/lib/validations/contact";
import { site } from "@/lib/site";
import { ArrowIcon, CheckIcon } from "./icons";
import { sfx } from "@/lib/sound";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "sending" | "sent" | "mail" | "error";

export function ContactForm() {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    // Pré-sélection depuis une page d'expertise : /contact/?besoin=ia
    const besoin = new URLSearchParams(window.location.search).get("besoin");
    if (besoin && needs.some((n) => n.value === besoin)) setSelectedNeeds([besoin]);
  }, []);

  // Petit carillon quand la demande part (ou est prête dans la messagerie)
  useEffect(() => {
    if (status === "sent" || status === "mail") sfx("chime");
  }, [status]);

  const toggleNeed = (v: string) => setSelectedNeeds((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      needs: selectedNeeds,
      budget: String(fd.get("budget") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      elapsed: Date.now() - startedAt.current,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (key === "website" || key === "elapsed") continue; // anti-spam : silencieux
        next[key] ??= issue.message;
      }
      // Robot présumé : on simule un succès sans rien envoyer
      if (Object.keys(next).length === 0) {
        setStatus("sent");
        return;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      document.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setErrors({});

    const data = parsed.data;
    if (site.contactEndpoint) {
      setStatus("sending");
      try {
        const ctrl = new AbortController();
        const timer = window.setTimeout(() => ctrl.abort(), 12000);
        const res = await fetch(site.contactEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: ctrl.signal,
        });
        window.clearTimeout(timer);
        if (!res.ok) throw new Error(String(res.status));
        setStatus("sent");
      } catch {
        setServerError("L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous directement à " + site.email + ".");
        setStatus("error");
      }
    } else {
      // Repli tant que la fonction d'envoi n'est pas déployée : e-mail pré-rempli
      const needLabels = needs.filter((n) => data.needs.includes(n.value)).map((n) => n.label).join(", ");
      const body = [
        `Nom : ${data.name}`,
        `E-mail : ${data.email}`,
        data.company ? `Entreprise : ${data.company}` : null,
        data.phone ? `Téléphone : ${data.phone}` : null,
        `Besoin : ${needLabels}`,
        `Budget indicatif : ${data.budget}`,
        `Délai : ${data.timeline}`,
        "",
        data.message,
      ].filter((l) => l !== null).join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Nouveau projet : ${needLabels}`)}&body=${encodeURIComponent(body)}`;
      setStatus("mail");
    }
    window.setTimeout(() => statusRef.current?.focus(), 50);
  }

  if (status === "sent" || status === "mail") {
    return (
      <div ref={statusRef} tabIndex={-1} className="panel p-8 outline-none md:p-12" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white"><CheckIcon className="h-5 w-5" /></span>
        <h2 className="text-heading mt-8">{status === "sent" ? "Demande envoyée." : "Votre demande est prête."}</h2>
        <p className="mt-4 max-w-md text-muted">
          {status === "sent"
            ? "Merci. Nous revenons vers vous sous deux jours ouvrés avec une première analyse de votre projet."
            : `Votre messagerie s’est ouverte avec votre demande pré-remplie. Il ne reste qu’à l’envoyer. Si rien ne s’est ouvert, écrivez-nous à ${site.email}.`}
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost mt-8">Nouvelle demande</button>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-sm text-[#f0937f]">{errors[k]}</p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-12" aria-describedby="form-note">
      {/* Besoin */}
      <fieldset>
        <legend className="field-label">Votre besoin <span className="text-muted">(plusieurs choix possibles)</span></legend>
        <div className="mt-4 flex flex-wrap gap-2" data-field="needs" tabIndex={-1}>
          {needs.map((n) => (
            <button key={n.value} type="button" className="chip" aria-pressed={selectedNeeds.includes(n.value)} onClick={() => toggleNeed(n.value)}>
              {n.label}
            </button>
          ))}
        </div>
        {err("needs")}
      </fieldset>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">Nom et prénom</label>
          <input id="name" name="name" data-field="name" autoComplete="name" required className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="field-label">E-mail professionnel</label>
          <input id="email" name="email" data-field="email" type="email" autoComplete="email" inputMode="email" required className="field" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="company" className="field-label">Entreprise <span className="text-muted">(facultatif)</span></label>
          <input id="company" name="company" autoComplete="organization" className="field" />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">Téléphone <span className="text-muted">(facultatif)</span></label>
          <input id="phone" name="phone" data-field="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
          {err("phone")}
        </div>
      </div>

      <fieldset>
        <legend className="field-label">Budget indicatif</legend>
        <div className="mt-4 flex flex-wrap gap-2" data-field="budget" tabIndex={-1}>
          {budgets.map((b) => (
            <label key={b} className="relative">
              <input type="radio" name="budget" value={b} className="peer sr-only" />
              <span className="chip">{b}</span>
            </label>
          ))}
        </div>
        {err("budget")}
      </fieldset>

      <fieldset>
        <legend className="field-label">Délai souhaité</legend>
        <div className="mt-4 flex flex-wrap gap-2" data-field="timeline" tabIndex={-1}>
          {timelines.map((t) => (
            <label key={t} className="relative">
              <input type="radio" name="timeline" value={t} className="peer sr-only" />
              <span className="chip">{t}</span>
            </label>
          ))}
        </div>
        {err("timeline")}
      </fieldset>

      <div>
        <label htmlFor="message" className="field-label">Présentez votre projet</label>
        <textarea
          id="message"
          name="message"
          data-field="message"
          rows={5}
          required
          maxLength={5000}
          placeholder="Votre activité, l’objectif du projet, ce qui existe déjà, ce qui compte le plus pour vous…"
          className="field resize-y"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {err("message")}
      </div>

      {/* Champ piège anti-robots, invisible pour les humains */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" data-field="consent" className="mt-1 h-4 w-4 shrink-0 accent-[#2f5bff]" aria-invalid={!!errors.consent} />
          <span>
            J’accepte que FDA Studio utilise ces informations pour répondre à ma demande. Elles ne sont ni revendues ni utilisées à d’autres fins.{" "}
            <Link href="/confidentialite/" className="link-line text-paper">Politique de confidentialité</Link>
          </span>
        </label>
        {err("consent")}
      </div>

      {status === "error" && <p role="alert" className="rounded-xl border border-[#f0937f]/40 p-4 text-sm text-[#f0937f]">{serverError}</p>}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary !h-14 !px-8 text-base disabled:opacity-60">
          {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"} <span className="btn-icon"><ArrowIcon /></span>
        </button>
        <p id="form-note" className="text-sm text-muted">Réponse sous deux jours ouvrés.</p>
      </div>
    </form>
  );
}
