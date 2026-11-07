import { RevealTitle } from "@/components/Reveal";
import { LiveMetrics } from "@/components/demos/LiveMetrics";

const stack = [
  { group: "Interfaces", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js / WebGL", "React Native"] },
  { group: "Données et serveurs", items: ["Supabase", "PostgreSQL", "Edge functions", "Upstash", "Stripe", "Resend"] },
  { group: "Intelligence artificielle", items: ["Claude (Anthropic)", "OpenAI", "SignalWire", "ElevenLabs", "API CRM et ERP"] },
  { group: "Jeu et temps réel", items: ["Unity", "C#", "Shaders GLSL", "TestFlight"] },
  { group: "Qualité et sécurité", items: ["Tests Vitest et Playwright", "Règles d’accès en base", "RGPD", "Hébergement européen"] },
];

const proofs = [
  "La sculpture du haut de page est calculée en temps réel par votre appareil, avec un shader écrit sur mesure.",
  "Sa qualité s’adapte à l’appareil et son rendu s’arrête dès qu’elle sort de l’écran, pour préserver la batterie.",
  "Les démonstrations IA, produit et jeu sont de vrais composants interactifs, pas des vidéos.",
  "Le site est exporté en pages statiques, sans cookie ni traceur, et respecte le réglage « réduire les animations ».",
];

export function Capabilities() {
  return (
    <section aria-labelledby="tech-title" className="section">
      <div className="wrap">
        <p className="kicker">Capacité technique</p>
        <RevealTitle id="tech-title" className="text-title mt-8 max-w-[16ch]" lines={["Ce site est", "notre première preuve."]} />

        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <LiveMetrics />
          </div>
          <ul className="space-y-6 lg:col-span-4 lg:col-start-9">
            {proofs.map((p) => (
              <li key={p} className="flex gap-4 border-b border-line pb-6 text-muted last:border-0">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-accent" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-10 border-t border-line pt-12 lg:grid-cols-5">
          {stack.map((s) => (
            <div key={s.group}>
              <h3 className="font-display text-base font-medium tracking-[-0.01em] text-paper">{s.group}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
