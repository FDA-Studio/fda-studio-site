"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { ArrowIcon, CheckIcon } from "./icons";
import { loadTurnstile } from "@/lib/turnstile";

type Slot = { starts_at: string; label: string };
type Kind = "visio" | "appel";
type Status = "loading" | "ready" | "empty" | "unavailable" | "sending" | "sent" | "error";

const DAY = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
const TIME = new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "2-digit", timeZone: "Europe/Paris" });
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dayKey = (iso: string) => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));

/**
 * Prise de rendez-vous en ligne. Les créneaux sont lus en direct dans l'agenda du CRM
 * (app.fdastudio.fr) : ce qui est pris dans le CRM ou dans l'agenda d'Antoine disparaît ici.
 * La réservation crée la fiche client et le rendez-vous dans le CRM, puis un e-mail de confirmation.
 */
export function BookingForm() {
  const endpoint = site.bookingEndpoint;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [day, setDay] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [kind, setKind] = useState<Kind>("visio");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [booked, setBooked] = useState("");
  const startedAt = useRef(0);
  const captchaOn = Boolean(site.turnstileSiteKey && endpoint);
  const captchaEl = useRef<HTMLDivElement>(null);
  const captchaId = useRef<string | null>(null);
  const captchaToken = useRef("");
  const doneRef = useRef<HTMLDivElement>(null);

  async function loadSlots(keep?: string) {
    if (!endpoint) {
      setStatus("unavailable");
      return;
    }
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { slots?: Slot[] };
      const list = data.slots ?? [];
      setSlots(list);
      setStatus(list.length ? "ready" : "empty");
      const first = list[0] ? dayKey(list[0].starts_at) : "";
      setDay((d) => (keep && list.some((s) => dayKey(s.starts_at) === d) ? d : first));
      setSlot("");
    } catch {
      setStatus("unavailable");
    }
  }

  useEffect(() => {
    startedAt.current = Date.now();
    void loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Le captcha se monte dans le formulaire : on attend qu'il soit affiché (après le chargement des créneaux).
  const formShown = status === "ready" || status === "sending";
  useEffect(() => {
    if (!captchaOn || !formShown) return;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !captchaEl.current || captchaId.current) return;
        captchaId.current = ts.render(captchaEl.current, {
          sitekey: site.turnstileSiteKey,
          theme: "dark",
          language: "fr",
          appearance: "interaction-only",
          action: "booking",
          callback: (t: string) => (captchaToken.current = t),
          "expired-callback": () => (captchaToken.current = ""),
          "error-callback": () => (captchaToken.current = ""),
        });
      })
      .catch(() => null);
    return () => {
      cancelled = true;
      if (captchaId.current) window.turnstile?.remove(captchaId.current);
      captchaId.current = null;
      captchaToken.current = "";
    };
  }, [captchaOn, formShown]);

  const days = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const k = dayKey(s.starts_at);
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return [...map.entries()];
  }, [slots]);
  const daySlots = days.find(([k]) => k === day)?.[1] ?? [];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      starts_at: slot,
      kind,
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      topic: String(fd.get("topic") ?? "").trim(),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      elapsed: Date.now() - startedAt.current,
    };
    const next: Record<string, string> = {};
    if (!payload.starts_at) next.slot = "Choisissez un créneau.";
    if (payload.name.length < 2) next.name = "Indiquez votre nom.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) next.email = "Indiquez une adresse e-mail valide.";
    if (!/^[0-9+().\s-]{6,40}$/.test(payload.phone)) next.phone = "Indiquez un numéro de téléphone.";
    if (payload.topic.length < 10) next.topic = "Dites-nous en une phrase de quoi vous voulez parler.";
    if (!payload.consent) next.consent = "Merci d’accepter l’utilisation de ces informations.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.querySelector<HTMLElement>(`[data-field="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    if (!endpoint) return;
    setStatus("sending");
    setMessage("");
    if (captchaOn && !captchaToken.current) {
      for (let i = 0; i < 20 && !captchaToken.current; i++) await new Promise((r) => window.setTimeout(r, 200));
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(captchaToken.current ? { ...payload, turnstile: captchaToken.current } : payload),
      });
      const data = (await res.json().catch(() => ({}))) as { label?: string; error?: string; reason?: string };
      if (!res.ok) {
        captchaToken.current = "";
        if (captchaId.current) window.turnstile?.reset(captchaId.current);
        setMessage(data.error ?? `La réservation n’a pas abouti. Réessayez, ou écrivez-nous à ${site.email}.`);
        setStatus("ready");
        if (data.reason === "slot_taken" || data.reason === "slot_invalid") void loadSlots(day);
        return;
      }
      setBooked(data.label ?? slots.find((s) => s.starts_at === slot)?.label ?? "");
      setStatus("sent");
      window.setTimeout(() => doneRef.current?.focus(), 50);
    } catch {
      setMessage(`La réservation n’a pas abouti. Réessayez, ou écrivez-nous à ${site.email}.`);
      setStatus("ready");
    }
  }

  if (status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} className="panel p-8 outline-none md:p-12" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white"><CheckIcon className="h-5 w-5" /></span>
        <h2 className="text-heading mt-8">Rendez-vous confirmé.</h2>
        <p className="mt-4 max-w-md text-muted">
          {booked ? `C’est noté pour ${booked}. ` : ""}
          {kind === "visio" ? "Antoine vous enverra le lien de la visio." : "Antoine vous appellera au numéro indiqué."} Un e-mail de confirmation est en route.
        </p>
      </div>
    );
  }

  if (status === "loading") return <p className="panel p-8 text-muted" role="status">Chargement des créneaux disponibles…</p>;

  if (status === "unavailable" || status === "empty") {
    return (
      <div className="panel p-8 md:p-12">
        <h2 className="text-heading">{status === "empty" ? "Aucun créneau libre pour le moment." : "L’agenda est momentanément indisponible."}</h2>
        <p className="mt-4 max-w-md text-muted">
          Écrivez-nous à <a href={`mailto:${site.email}`} className="link-line text-paper">{site.email}</a> ou appelez le{" "}
          <a href={`tel:${site.phone.e164}`} className="link-line text-paper">{site.phone.display}</a> : nous trouverons un moment ensemble.
        </p>
      </div>
    );
  }

  const err = (k: string) => (errors[k] ? <p id={`${k}-error`} className="mt-2 text-sm text-[#f0937f]">{errors[k]}</p> : null);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-12">
      <fieldset>
        <legend className="field-label">Type de rendez-vous</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["visio", "appel"] as const).map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k === "visio" ? "Visio (30 min)" : "Appel téléphonique (30 min)"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Jour</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {days.map(([k, list]) => (
            <button key={k} type="button" className="chip" aria-pressed={day === k} onClick={() => { setDay(k); setSlot(""); }}>
              {cap(DAY.format(new Date(list[0]!.starts_at)))}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Heure <span className="text-muted">(heure de Paris)</span></legend>
        <div className="mt-4 flex flex-wrap gap-2" data-field="slot" tabIndex={-1}>
          {daySlots.map((s) => (
            <button key={s.starts_at} type="button" className="chip" aria-pressed={slot === s.starts_at} onClick={() => setSlot(s.starts_at)}>
              {TIME.format(new Date(s.starts_at)).replace(":", " h ").replace(/^0/, "").replace(/ h 00$/, " h")}
            </button>
          ))}
        </div>
        {err("slot")}
      </fieldset>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label htmlFor="b-name" className="field-label">Nom et prénom</label>
          <input id="b-name" name="name" data-field="name" autoComplete="name" required className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="b-email" className="field-label">E-mail</label>
          <input id="b-email" name="email" data-field="email" type="email" autoComplete="email" inputMode="email" required className="field" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="b-phone" className="field-label">Téléphone</label>
          <input id="b-phone" name="phone" data-field="phone" type="tel" autoComplete="tel" inputMode="tel" required className="field" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="b-company" className="field-label">Entreprise <span className="text-muted">(facultatif)</span></label>
          <input id="b-company" name="company" autoComplete="organization" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="b-topic" className="field-label">De quoi voulez-vous parler ?</label>
        <textarea id="b-topic" name="topic" data-field="topic" rows={3} required maxLength={1000} placeholder="Un site, un agent vocal, une application, une automatisation…" className="field resize-y" aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "topic-error" : undefined} />
        {err("topic")}
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="b-website">Ne pas remplir</label>
        <input id="b-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" data-field="consent" className="mt-1 h-4 w-4 shrink-0 accent-[#2f5bff]" aria-invalid={!!errors.consent} />
          <span>
            J’accepte que FDA Studio utilise ces informations pour organiser ce rendez-vous. Elles ne sont ni revendues ni utilisées à d’autres fins.{" "}
            <Link href="/confidentialite/" className="link-line text-paper">Politique de confidentialité</Link>
          </span>
        </label>
        {err("consent")}
      </div>

      {captchaOn && <div ref={captchaEl} className="min-h-0" />}

      {message && <p role="alert" className="rounded-xl border border-[#f0937f]/40 p-4 text-sm text-[#f0937f]">{message}</p>}

      <button type="submit" disabled={status === "sending"} className="btn btn-primary !h-14 !px-8 text-base disabled:opacity-60">
        {status === "sending" ? "Réservation…" : "Réserver ce créneau"} <span className="btn-icon"><ArrowIcon /></span>
      </button>
    </form>
  );
}
