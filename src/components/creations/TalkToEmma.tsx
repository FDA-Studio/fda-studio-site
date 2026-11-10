"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VoiceConversation } from "@elevenlabs/client";
import { site } from "@/lib/site";
import { turnstileToken, warmTurnstile } from "@/lib/turnstile";

type Phase = "idle" | "requesting" | "connecting" | "live" | "ended" | "error";

const BARS = 32;

/** Nom de l'erreur, quel que soit son type (Safari ne renvoie pas toujours une DOMException). */
function errName(e: unknown): string {
  return e && typeof e === "object" && "name" in e ? String((e as { name: unknown }).name) : "";
}

/** Explique pourquoi le micro est inaccessible, car le navigateur n'affiche pas toujours de fenêtre. */
function micError(name: string): string {
  const ios = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return ios
        ? "Le micro est bloqué pour ce site. Réglages › Safari › Micro (ou aA › Réglages du site web › Micro) : choisissez « Demander » ou « Autoriser », puis réessayez."
        : "Le micro est bloqué pour ce site. Cliquez sur l’icône à gauche de l’adresse (cadenas ou réglages), autorisez le micro, puis réessayez. Sur Mac, vérifiez aussi Réglages Système › Confidentialité › Micro pour votre navigateur.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "Aucun micro détecté. Branchez ou activez un micro, puis réessayez.";
    case "NotReadableError":
      return "Le micro est déjà utilisé par une autre application (visio, appel…). Fermez-la, puis réessayez.";
    case "NotSupportedError":
      return "Ce navigateur ne donne pas accès au micro. Ouvrez fdastudio.fr dans Safari ou Chrome (pas depuis une application comme Instagram ou Mail).";
    default:
      return `Impossible d’accéder au micro. Fermez les autres applications qui l’utilisent, puis réessayez.${name ? ` (code : ${name})` : ""}`;
  }
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

/**
 * « Parler à Emma » : démo vocale en direct de l'agent IA de FDA Studio.
 * Le site demande une session signée à app.fdastudio.fr (quotas côté serveur), puis
 * ouvre la conversation avec ElevenLabs. Le SDK n'est chargé qu'au clic.
 */
export function TalkToEmma() {
  const dialog = useRef<HTMLDialogElement>(null);
  const conv = useRef<VoiceConversation | null>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const raf = useRef(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [speaking, setSpeaking] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [left, setLeft] = useState(120);
  const limit = useRef(120);

  const stopMeter = () => cancelAnimationFrame(raf.current);

  const end = useCallback(async () => {
    stopMeter();
    const c = conv.current;
    conv.current = null;
    if (c) await c.endSession().catch(() => {});
  }, []);

  // Compte à rebours affiché (la limite réelle est appliquée par l'agent et le serveur)
  useEffect(() => {
    if (phase !== "live") return;
    const t0 = Date.now();
    const id = setInterval(() => setLeft(Math.max(0, limit.current - Math.round((Date.now() - t0) / 1000))), 250);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => () => void end(), [end]);

  const meter = () => {
    const c = conv.current;
    if (c) {
      const out = c.getOutputVolume();
      const inp = c.getInputVolume();
      const level = Math.min(1, Math.max(out, inp) * 2.2);
      bars.current.forEach((el, i) => {
        if (!el) return;
        const shape = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.62 + performance.now() / 260));
        el.style.transform = `scaleY(${Math.max(0.08, level * shape).toFixed(3)})`;
      });
    }
    raf.current = requestAnimationFrame(meter);
  };

  const open = () => {
    setPhase("idle");
    setError("");
    setCaption("");
    dialog.current?.showModal();
    // Jeton anti-robot préparé pendant la lecture : au clic, la session part sans attente (Safari)
    warmTurnstile("demo");
  };

  const close = async () => {
    await end();
    dialog.current?.close();
    setPhase("idle");
  };

  const start = async () => {
    setError("");
    setCaption("");
    if (!site.voiceDemoEndpoint) {
      setPhase("error");
      setError("La démo en direct n’est disponible que sur fdastudio.fr.");
      return;
    }
    setPhase("requesting");
    try {
      // Micro d'abord : le navigateur demande l'autorisation dans le geste de l'utilisateur
      if (!navigator.mediaDevices?.getUserMedia) throw new DOMException("", "NotSupportedError");
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        // iPhone : le micro peut être momentanément occupé (session audio en cours) ; un second essai suffit souvent
        const name = errName(e);
        if (name !== "AbortError" && name !== "InvalidStateError" && name !== "NotReadableError") throw e;
        await new Promise((r) => setTimeout(r, 400));
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      stream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      setPhase("error");
      setError(micError(errName(e)));
      return;
    }
    try {
      const turnstile = await turnstileToken("demo");
      const res = await fetch(site.voiceDemoEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ turnstile }) });
      const data = (await res.json().catch(() => ({}))) as { signedUrl?: string; maxSeconds?: number; error?: string };
      if (!res.ok || !data.signedUrl) {
        setPhase("error");
        setError(data.error ?? "La démo est indisponible pour le moment.");
        return;
      }
      limit.current = data.maxSeconds ?? 120;
      setLeft(limit.current);
      setPhase("connecting");
      const { Conversation } = await import("@elevenlabs/client");
      conv.current = (await Conversation.startSession({
        signedUrl: data.signedUrl,
        connectionType: "websocket",
        onConnect: () => {
          setPhase("live");
          meter();
        },
        onModeChange: ({ mode }) => setSpeaking(mode === "speaking"),
        onMessage: ({ role, message }) => {
          if (role === "agent") setCaption(message);
        },
        onDisconnect: () => {
          stopMeter();
          conv.current = null;
          setSpeaking(false);
          setPhase((p) => (p === "error" ? p : "ended"));
        },
        onError: () => {
          setPhase("error");
          setError("La connexion a été interrompue.");
        },
      })) as VoiceConversation;
    } catch {
      await end();
      setPhase("error");
      setError("Impossible de lancer la démo. Réessayez dans un instant.");
    }
  };

  const busy = phase === "requesting" || phase === "connecting";
  const live = phase === "live";

  return (
    <>
      <button type="button" onClick={open} className="btn btn-primary btn-sm self-start">
        Parler à Emma
        <span className="btn-icon" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" /></svg>
        </span>
      </button>

      <dialog
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          void close();
        }}
        aria-labelledby="emma-title"
        className="emma-dialog frame m-auto w-[min(32rem,calc(100vw-2rem))] p-0 text-paper"
      >
        <div className="flex items-center justify-between border-b border-line py-2 pl-5 pr-2">
          <p id="emma-title" className="text-sm">
            <span className="text-paper">Emma</span> <span className="text-muted">· agent vocal IA, en direct</span>
          </p>
          <button type="button" onClick={() => void close()} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:text-paper" aria-label="Fermer la démo">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="px-5 pb-6 pt-8 md:px-8">
          {/* Forme d'onde pilotée par le volume réel de la conversation */}
          <div className="flex h-24 items-center justify-center gap-[3px]" aria-hidden>
            {Array.from({ length: BARS }).map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  bars.current[i] = el;
                }}
                className={`h-full w-1 origin-center rounded-full transition-colors duration-300 ${speaking ? "bg-accent-bright" : "bg-paper/70"}`}
                style={{ transform: "scaleY(0.08)" }}
              />
            ))}
          </div>

          <div className="mt-6 min-h-[4.5rem] text-center" aria-live="polite">
            {phase === "idle" && <p className="text-soft">Deux minutes pour tester un agent vocal comme ceux que nous intégrons : parlez-lui de votre entreprise, ou demandez une mise en situation.</p>}
            {busy && <p className="text-soft">Connexion à Emma…</p>}
            {live && <p className="text-paper">{caption || (speaking ? "Emma parle…" : "Emma vous écoute…")}</p>}
            {phase === "ended" && <p className="text-soft">Merci ! Pour aller plus loin, décrivez-nous votre projet : Antoine vous rappelle.</p>}
            {phase === "error" && <p className="text-soft">{error}</p>}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {live ? (
              <>
                <span className="tabular rounded-full border border-line-strong px-3 py-1.5 text-sm text-muted">{fmt(left)}</span>
                <button type="button" onClick={() => void end()} className="btn btn-sm bg-[#d93c3c] text-white">
                  Raccrocher
                </button>
              </>
            ) : phase === "ended" || (phase === "error" && error.includes("projet")) ? (
              <a href="#contact" onClick={() => void close()} className="btn btn-primary btn-sm">
                Décrire mon projet
              </a>
            ) : (
              <button type="button" onClick={() => void start()} disabled={busy} className="btn btn-primary btn-sm disabled:opacity-60">
                {busy ? "Connexion…" : phase === "error" ? "Réessayer" : "Démarrer l’appel"}
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted">
            Emma est une intelligence artificielle. Votre voix est traitée en direct par ElevenLabs, sans enregistrement audio ; la transcription est conservée 30 jours.{" "}
            <Link href="/confidentialite/" className="underline underline-offset-2 hover:text-paper">
              Confidentialité
            </Link>
          </p>
        </div>
      </dialog>
    </>
  );
}
