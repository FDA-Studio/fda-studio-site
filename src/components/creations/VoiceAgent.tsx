"use client";

import { useLoop, useTyping } from "./useLoop";

const lines = [
  { who: "Client", text: "Bonjour, je voudrais déplacer mon rendez-vous de jeudi." },
  { who: "Agent IA", text: "Bien sûr. Je vous propose vendredi à 10 h ou à 14 h." },
  { who: "Client", text: "14 h, parfait." },
  { who: "Agent IA", text: "C’est noté. Vous recevez la confirmation par SMS." },
];

function Line({ who, text, active, done }: { who: string; text: string; active: boolean; done: boolean }) {
  const typed = useTyping(text, active || done);
  const ai = who === "Agent IA";
  return (
    <div className={`transition-opacity duration-500 ${active || done ? "opacity-100" : "opacity-0"}`}>
      <p className={`text-xs ${ai ? "text-accent-bright" : "text-muted"}`}>{who}</p>
      <p className={`mt-1 text-sm leading-snug md:text-base ${ai ? "text-paper" : "text-soft"} ${active && typed.length < text.length ? "caret" : ""}`}>{typed}</p>
    </div>
  );
}

/** Standard téléphonique IA : forme d'onde vivante et sous-titres en direct. */
export function VoiceAgent() {
  const { ref, step } = useLoop<HTMLDivElement>([2600, 2800, 1600, 3200, 1400]);
  const speaking = step < 4;
  const aiTalking = step === 1 || step === 3;
  return (
    <div ref={ref} className="relative flex h-full flex-col gap-4 p-5 md:gap-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-full bg-accent">
            <span className="absolute inset-0 rounded-full bg-accent" style={{ animation: speaking ? "ping-soft 1.6s ease-out infinite" : "none" }} />
            <svg viewBox="0 0 24 24" className="relative h-5 w-5 fill-white" aria-hidden><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" /></svg>
          </span>
          <div>
            <p className="text-sm font-medium text-paper">Appel entrant</p>
            <p className="tabular text-xs text-muted">Agent vocal · 00:{String(8 + step * 6).padStart(2, "0")}</p>
          </div>
        </div>
        <span className="rounded-full border border-line-strong px-2.5 py-1 text-xs text-muted">En ligne</span>
      </div>

      {/* Forme d'onde */}
      <div className="flex h-16 items-center justify-center gap-[3px] md:h-28" aria-hidden>
        {Array.from({ length: 44 }).map((_, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full transition-colors duration-500 md:w-1 ${aiTalking ? "bg-accent-bright" : "bg-paper/70"}`}
            style={{
              height: `${18 + Math.abs(Math.sin(i * 0.55)) * 70}%`,
              transformOrigin: "center",
              animation: speaking ? `wave ${0.6 + (i % 7) * 0.09}s ${(i % 11) * -0.07}s ease-in-out infinite alternate` : "none",
              transform: speaking ? undefined : "scaleY(0.12)",
            }}
          />
        ))}
      </div>

      <div className="mt-auto space-y-3 md:space-y-4">
        {lines.map((l, i) => (
          <Line key={i} {...l} active={step === i} done={step > i && step < 4} />
        ))}
      </div>
    </div>
  );
}
