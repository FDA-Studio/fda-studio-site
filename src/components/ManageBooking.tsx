"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { loadTurnstile } from "@/lib/turnstile";
import { ArrowIcon, CheckIcon } from "./icons";
import { dayKey, SlotPicker, type Slot } from "./SlotPicker";

type Current = { label: string; kind: "visio" | "appel"; starts_at: string };
type Status = "loading" | "ready" | "invalid" | "sending" | "moved" | "cancelled";

/**
 * Déplacer ou annuler un rendez-vous depuis le lien de l'e-mail de confirmation.
 * Le jeton du lien est envoyé au CRM en POST, jamais affiché ni stocké par le site.
 */
export function ManageBooking({ token }: { token: string }) {
  const endpoint = site.bookingEndpoint ? `${site.bookingEndpoint}/manage` : "";
  const [status, setStatus] = useState<Status>("loading");
  const [current, setCurrent] = useState<Current | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const captchaOn = Boolean(site.turnstileSiteKey && endpoint);
  const captchaEl = useRef<HTMLDivElement>(null);
  const captchaId = useRef<string | null>(null);
  const captchaToken = useRef("");
  const doneRef = useRef<HTMLDivElement>(null);

  async function call(body: object) {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, ...body }) });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: res.ok, status: res.status, data };
  }

  async function load() {
    if (!endpoint) {
      setStatus("invalid");
      return;
    }
    try {
      const { ok, data } = await call({ action: "get" });
      if (!ok) {
        setMessage(String(data.error ?? ""));
        setStatus("invalid");
        return;
      }
      setCurrent({ label: String(data.label), kind: data.kind === "appel" ? "appel" : "visio", starts_at: String(data.starts_at) });
      const list = (data.slots as Slot[] | undefined) ?? [];
      setSlots(list);
      setDay(list[0] ? dayKey(list[0].starts_at) : "");
      setSlot("");
      setStatus("ready");
    } catch {
      setMessage("");
      setStatus("invalid");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function act(action: "reschedule" | "cancel") {
    if (action === "reschedule" && !slot) {
      setMessage("Choisissez un nouveau créneau.");
      return;
    }
    setStatus("sending");
    setMessage("");
    if (captchaOn && !captchaToken.current) {
      for (let i = 0; i < 20 && !captchaToken.current; i++) await new Promise((r) => window.setTimeout(r, 200));
    }
    try {
      const { ok, data } = await call({ action, ...(action === "reschedule" ? { starts_at: slot } : {}), ...(captchaToken.current ? { turnstile: captchaToken.current } : {}) });
      if (!ok) {
        captchaToken.current = "";
        if (captchaId.current) window.turnstile?.reset(captchaId.current);
        setMessage(String(data.error ?? `L’opération n’a pas abouti. Écrivez-nous à ${site.email}.`));
        if (data.reason === "link_invalid") {
          setStatus("invalid");
          return;
        }
        setStatus("ready");
        if (data.reason === "slot_taken" || data.reason === "slot_invalid") void load();
        return;
      }
      setDone(String(data.label ?? ""));
      setStatus(action === "cancel" ? "cancelled" : "moved");
      window.setTimeout(() => doneRef.current?.focus(), 50);
    } catch {
      setMessage(`L’opération n’a pas abouti. Écrivez-nous à ${site.email}.`);
      setStatus("ready");
    }
  }

  if (status === "loading") return <p className="panel p-8 text-muted" role="status">Chargement de votre rendez-vous…</p>;

  if (status === "invalid") {
    return (
      <div className="panel p-8 md:p-12">
        <h2 className="text-heading">Ce lien n’est plus valable.</h2>
        <p className="mt-4 max-w-md text-muted">
          {message || "Le rendez-vous est passé, a été annulé, ou le lien est incomplet."} Pour toute question, écrivez à{" "}
          <a href={`mailto:${site.email}`} className="link-line text-paper">{site.email}</a>.
        </p>
        <Link href="/rendez-vous/" className="btn btn-primary mt-8">Prendre un nouveau rendez-vous <ArrowIcon /></Link>
      </div>
    );
  }

  if (status === "moved" || status === "cancelled") {
    return (
      <div ref={doneRef} tabIndex={-1} className="panel p-8 outline-none md:p-12" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white"><CheckIcon className="h-5 w-5" /></span>
        <h2 className="text-heading mt-8">{status === "moved" ? "Rendez-vous déplacé." : "Rendez-vous annulé."}</h2>
        <p className="mt-4 max-w-md text-muted">
          {status === "moved"
            ? `C’est noté pour ${done}. Une nouvelle confirmation est en route par e-mail.`
            : "C’est bien noté. Vous pouvez reprendre rendez-vous quand vous le souhaitez."}
        </p>
        {status === "cancelled" && <Link href="/rendez-vous/" className="btn btn-ghost mt-8">Reprendre rendez-vous</Link>}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="panel p-8">
        <p className="field-label">Votre rendez-vous actuel</p>
        <p className="mt-3 text-lg text-paper">
          {current?.kind === "visio" ? "Visio" : "Appel téléphonique"}, {current?.label}
        </p>
      </div>

      <div className="space-y-12">
        <p className="text-muted">Choisissez un nouveau créneau :</p>
        {slots.length ? (
          <SlotPicker slots={slots} day={day} slot={slot} onDay={(d) => { setDay(d); setSlot(""); }} onSlot={setSlot} />
        ) : (
          <p className="text-muted">Aucun autre créneau libre pour le moment.</p>
        )}
      </div>

      {captchaOn && <div ref={captchaEl} className="min-h-0" />}

      {message && <p role="alert" className="rounded-xl border border-[#f0937f]/40 p-4 text-sm text-[#f0937f]">{message}</p>}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="button" onClick={() => void act("reschedule")} disabled={status === "sending" || !slots.length} className="btn btn-primary !h-14 !px-8 text-base disabled:opacity-60">
          {status === "sending" ? "Un instant…" : "Déplacer à ce créneau"} <span className="btn-icon"><ArrowIcon /></span>
        </button>
        {confirmCancel ? (
          <span className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">Annuler ce rendez-vous ?</span>
            <button type="button" onClick={() => void act("cancel")} disabled={status === "sending"} className="btn btn-ghost">Oui, annuler</button>
            <button type="button" onClick={() => setConfirmCancel(false)} className="link-line text-muted">Non</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmCancel(true)} className="link-line text-sm text-muted">Annuler le rendez-vous</button>
        )}
      </div>
    </div>
  );
}
