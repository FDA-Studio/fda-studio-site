"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TextConversation } from "@elevenlabs/client";
import { usePaused } from "@/components/motion/Live";
import { site } from "@/lib/site";
import { turnstileToken, warmTurnstile } from "@/lib/turnstile";
import { sfx } from "@/lib/sound";

/**
 * « Emma, par écrit » : l'assistante IA de FDA Studio, accessible sur tout le site.
 * Une sphère lumineuse en bas à droite ouvre un panneau de discussion. La session n'est
 * ouverte qu'au premier message envoyé (quotas côté serveur, à app.fdastudio.fr), puis la
 * conversation passe par ElevenLabs en mode texte. Emma enregistre les demandes dans le CRM
 * et réserve des créneaux : ce n'est pas une démo. Le SDK n'est chargé qu'au premier envoi.
 * D'autres composants peuvent ouvrir le panneau avec l'événement « fda:open-chat ».
 */

type Msg = { id: number; role: "user" | "agent"; text: string; done: boolean };
type Phase = "idle" | "connecting" | "live" | "ended" | "error";

const GREETING = "Bonjour ! Je suis Emma, l’assistante IA de FDA Studio. Un projet de site, d’application ou d’IA ? Dites-m’en un peu plus, je vous réponds tout de suite.";

const SUGGESTIONS = ["J’ai besoin d’un site internet", "Un agent vocal pour mon entreprise", "Automatiser une tâche avec l’IA", "Prendre rendez-vous avec Antoine"];

// Ce que fait Emma pendant qu'on attend sa réponse, d'après l'outil appelé
const TOOL_LABELS: Record<string, string> = {
  creneaux_disponibles: "Emma consulte l’agenda d’Antoine…",
  enregistrer_demande: "Emma enregistre votre demande…",
  reserver_creneau: "Emma réserve le créneau…",
};

export const openEmmaChat = () => window.dispatchEvent(new Event("fda:open-chat"));

function Orb({ size = "md", busy = false }: { size?: "sm" | "md"; busy?: boolean }) {
  return (
    <span aria-hidden className={`emma-orb ${size === "sm" ? "h-8 w-8" : "h-14 w-14"}`} data-busy={busy ? "true" : "false"}>
      <span className="emma-orb__core" />
      <span className="emma-orb__glint" />
    </span>
  );
}

export function EmmaChat() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [tool, setTool] = useState("");
  const [error, setError] = useState("");
  const [seen, setSeen] = useState(true); // true : la sphère attend encore son moment
  const paused = usePaused();

  const conv = useRef<TextConversation | null>(null);
  const queue = useRef<string[]>([]);
  const skipGreeting = useRef(true);
  const streamed = useRef(false);
  const ids = useRef(0);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);

  const push = (role: Msg["role"], text: string, done = true) => setMsgs((m) => [...m, { id: ++ids.current, role, text, done }]);

  // Jeton anti-robot préparé dès l'ouverture du panneau, pour que la session démarre sans attente
  useEffect(() => {
    if (open) warmTurnstile("demo");
  }, [open]);

  // Ouverture depuis n'importe quel bouton du site (« Discuter avec Emma »)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("fda:open-chat", onOpen);
    return () => window.removeEventListener("fda:open-chat", onOpen);
  }, []);

  // Quand la sphère apparaît : sur l'accueil, à la fin du film (la section qui suit le vol
  // monte dans l'écran) ; ailleurs, après un court instant. Une fois apparue, elle reste.
  const pathname = usePathname();
  useEffect(() => {
    if (!seen) return;
    const world = document.querySelector(".world");
    const after = document.getElementById("creations");
    if (!world || !after) {
      const t = window.setTimeout(() => setSeen(false), 2500);
      return () => window.clearTimeout(t);
    }
    // Le vol se met en place après le chargement (la page s'allonge alors) : on juge au défilement,
    // jamais au montage, pour ne pas révéler la sphère avant que le film ait été parcouru.
    const check = () => {
      if (window.scrollY > window.innerHeight && after.getBoundingClientRect().top < window.innerHeight * 0.65) setSeen(false);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname, seen]);

  // Dans la section Contact, la carte « Discuter avec Emma » prend le relais : la sphère s'efface
  const [atContact, setAtContact] = useState(false);
  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Défilement automatique et focus sur la saisie
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [msgs, waiting, tool]);
  // Focus immédiat seulement à la souris : sur téléphone, le clavier attend que l'on touche le champ
  useEffect(() => {
    if (open && window.matchMedia("(pointer: fine)").matches) window.setTimeout(() => input.current?.focus(), 80);
  }, [open]);

  // Mobile : la feuille suit le clavier (visualViewport) et la page derrière ne défile plus
  const panel = useRef<HTMLElement>(null);
  const [kb, setKb] = useState(false);
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 768px)").matches) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const vv = window.visualViewport;
    const sync = () => {
      const el = panel.current;
      if (!el || !vv) return;
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      el.style.setProperty("--emma-kb", `${Math.round(offset)}px`);
      el.style.setProperty("--emma-vh", `${Math.round(vv.height)}px`);
      setKb(offset > 80);
    };
    sync();
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    return () => {
      html.style.overflow = prev;
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      setKb(false);
    };
  }, [open]);

  // Glisser la poignée vers le bas ferme la feuille
  const dragY = useRef<number | null>(null);

  // Échap ferme le panneau et rend le focus au bouton
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => void conv.current?.endSession().catch(() => {}), []);

  /** Envoie les messages tapés pendant l'ouverture de la session. */
  const flush = useCallback(() => {
    if (!conv.current) return;
    const pending = queue.current.splice(0);
    pending.forEach((t) => conv.current?.sendUserMessage(t));
  }, []);

  const connect = useCallback(async () => {
    if (!site.chatEndpoint) {
      setPhase("error");
      setError("Emma répond sur fdastudio.fr. Ici, décrivez votre projet dans le formulaire.");
      return;
    }
    setPhase("connecting");
    setError("");
    try {
      const turnstile = await turnstileToken("demo");
      const res = await fetch(site.chatEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ turnstile }) });
      const data = (await res.json().catch(() => ({}))) as { signedUrl?: string; error?: string };
      if (!res.ok || !data.signedUrl) {
        setPhase("error");
        setError(data.error ?? "Emma est indisponible pour le moment. Décrivez votre projet dans le formulaire : Antoine vous répond.");
        setWaiting(false);
        return;
      }
      const { Conversation } = await import("@elevenlabs/client");
      skipGreeting.current = true;
      conv.current = await Conversation.startSession({
        signedUrl: data.signedUrl,
        connectionType: "websocket",
        textOnly: true,
        // onConnect arrive avant que startSession ne rende la session : la file est envoyée
        // plus bas, une fois la session en main et l'accueil de l'agent reçu.
        onConnect: () => setPhase("live"),
        onAgentChatResponsePart: (part) => {
          if (skipGreeting.current) return;
          if (part.type === "start") {
            streamed.current = true;
            setWaiting(false);
            setTool("");
            setMsgs((m) => [...m, { id: ++ids.current, role: "agent", text: "", done: false }]);
          } else if (part.type === "delta") {
            setMsgs((m) => {
              const last = m[m.length - 1];
              if (!last || last.role !== "agent" || last.done) return m;
              return [...m.slice(0, -1), { ...last, text: last.text + part.text }];
            });
          } else {
            setMsgs((m) => {
              const last = m[m.length - 1];
              return last && last.role === "agent" ? [...m.slice(0, -1), { ...last, done: true }] : m;
            });
          }
        },
        onMessage: ({ role, message }) => {
          if (role !== "agent") return;
          // Le message d'accueil est déjà affiché : on ne le répète pas
          if (skipGreeting.current) {
            skipGreeting.current = false;
            flush();
            return;
          }
          setWaiting(false);
          setTool("");
          if (streamed.current) {
            streamed.current = false;
            setMsgs((m) => {
              const last = m[m.length - 1];
              if (last && last.role === "agent") return [...m.slice(0, -1), { ...last, text: message, done: true }];
              return [...m, { id: ++ids.current, role: "agent", text: message, done: true }];
            });
          } else {
            push("agent", message);
          }
          sfx("blip", 2);
        },
        onAgentToolRequest: ({ tool_name }) => setTool(TOOL_LABELS[tool_name] ?? "Emma vérifie…"),
        onAgentToolResponse: () => setTool(""),
        onDisconnect: () => {
          conv.current = null;
          setWaiting(false);
          setTool("");
          setPhase((p) => (p === "error" ? p : "ended"));
        },
        onError: () => {
          setPhase("error");
          setError("La connexion avec Emma a été interrompue. Réessayez, ou décrivez votre projet dans le formulaire.");
          setWaiting(false);
        },
      });
      // L'accueil est peut-être déjà arrivé pendant l'ouverture : on envoie tout de suite.
      // Sinon, filet de sécurité : on n'attend pas plus de 3 s.
      if (!skipGreeting.current) flush();
      else window.setTimeout(() => {
        skipGreeting.current = false;
        flush();
      }, 3000);
    } catch {
      conv.current = null;
      setPhase("error");
      setError("Impossible de joindre Emma pour le moment. Réessayez, ou décrivez votre projet dans le formulaire.");
      setWaiting(false);
    }
  }, []);

  const send = (raw: string) => {
    const text = raw.trim().slice(0, 1000);
    if (!text || waiting) return;
    push("user", text);
    setDraft("");
    setWaiting(true);
    streamed.current = false;
    sfx("tick");
    if (conv.current && phase === "live") {
      conv.current.sendUserMessage(text);
    } else {
      queue.current.push(text);
      if (phase !== "connecting") void connect();
    }
  };

  const restart = () => {
    setMsgs([]);
    setPhase("idle");
    setError("");
    queue.current = [];
  };

  const toForm = () => {
    setOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    if (!document.getElementById("contact")) window.location.href = "/#contact";
  };

  const started = msgs.length > 0;
  const closedChat = phase === "ended" || phase === "error";

  return (
    <>
      {/* Bouton flottant */}
      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="emma-chat"
        className="emma-launcher"
        data-open={open ? "true" : "false"}
        data-hidden={seen || (atContact && !open) ? "true" : "false"}
        data-paused={paused ? "true" : "false"}
      >
        <Orb busy={waiting} />
        <span className="emma-launcher__label">
          <span className="block text-sm font-medium text-paper">Écrire à Emma</span>
          <span className="block text-xs text-muted">Réponse immédiate</span>
        </span>
        <span className="sr-only">{open ? "Fermer la discussion avec Emma" : "Ouvrir la discussion avec Emma, l’assistante IA de FDA Studio"}</span>
      </button>

      {/* Panneau de discussion */}
      <div className="emma-scrim" hidden={!open} onClick={() => setOpen(false)} aria-hidden />
      <section
        ref={panel}
        id="emma-chat"
        role="dialog"
        aria-modal="false"
        aria-labelledby="emma-chat-title"
        className="emma-panel"
        data-open={open ? "true" : "false"}
        data-grown={started ? "true" : "false"}
        data-kb={kb ? "true" : "false"}
        hidden={!open}
        onTouchStart={(e) => {
          const top = panel.current?.getBoundingClientRect().top ?? 0;
          dragY.current = e.touches[0].clientY - top < 76 ? e.touches[0].clientY : null;
        }}
        onTouchEnd={(e) => {
          if (dragY.current !== null && e.changedTouches[0].clientY - dragY.current > 60) setOpen(false);
          dragY.current = null;
        }}
      >
        <span className="emma-grip" aria-hidden />
        <header className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Orb size="sm" busy={waiting} />
          <div className="min-w-0 flex-1">
            <p id="emma-chat-title" className="text-sm font-semibold text-paper">Emma</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${phase === "error" ? "bg-[#d93c3c]" : "bg-ok"}`} />
              {phase === "connecting" ? "Connexion…" : phase === "error" ? "Indisponible" : "Assistante IA de FDA Studio"}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-paper" aria-label="Fermer la discussion">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div ref={log} className="emma-log" aria-live="polite" aria-relevant="additions">
          <div className="emma-msg emma-msg--agent">{GREETING}</div>

          {!started && (
            <div className="emma-chips" aria-label="Suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={s} type="button" onClick={() => send(s)} className="emma-chip" style={{ animationDelay: `${120 + i * 60}ms` }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {msgs.map((m) => (
            <div key={m.id} className={`emma-msg emma-msg--${m.role}`}>
              {m.text}
              {!m.done && <span className="caret" />}
            </div>
          ))}

          {(waiting || tool) && (
            <div className="flex items-center gap-2 text-xs text-muted" role="status">
              <span className="emma-dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              {tool || (phase === "connecting" ? "Emma arrive…" : "Emma écrit…")}
            </div>
          )}

          {closedChat && (
            <div className="rounded-2xl border border-line-strong bg-surface p-3 text-sm text-soft">
              <p>{phase === "error" ? error : "La conversation est terminée. Merci !"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={restart} className="emma-chip">
                  Nouvelle conversation
                </button>
                <button type="button" onClick={toForm} className="emma-chip">
                  Remplir le formulaire
                </button>
              </div>
            </div>
          )}
        </div>

        <form
          className="border-t border-line p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <div className="flex items-end gap-2 rounded-2xl border border-line-strong bg-ink px-3 py-2 focus-within:border-accent">
            <label htmlFor="emma-input" className="sr-only">
              Votre message à Emma
            </label>
            <textarea
              id="emma-input"
              ref={input}
              rows={1}
              value={draft}
              maxLength={1000}
              disabled={closedChat}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              placeholder={closedChat ? "Conversation terminée" : "Écrivez votre message…"}
              className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent py-1.5 text-[16px] leading-snug text-paper outline-none placeholder:text-muted disabled:opacity-50"
            />
            <button type="submit" disabled={!draft.trim() || waiting || closedChat} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-white transition-opacity disabled:opacity-35" aria-label="Envoyer">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.2" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-2 px-1 text-[11px] leading-snug text-muted">
            Emma est une IA : elle peut se tromper. Conversation conservée 30 jours.{" "}
            <Link href="/confidentialite/" className="underline underline-offset-2 hover:text-paper">
              Confidentialité
            </Link>
          </p>
        </form>
      </section>
    </>
  );
}

/** Bouton qui ouvre la discussion avec Emma depuis n'importe quelle section. */
export function OpenEmmaButton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={openEmmaChat} className={className}>
      {children}
    </button>
  );
}
