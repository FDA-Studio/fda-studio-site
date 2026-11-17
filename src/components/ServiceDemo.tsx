"use client";

import { VoiceAgent } from "@/components/creations/VoiceAgent";
import { CrmShowcase } from "@/components/creations/CrmShowcase";
import { FrameBar } from "@/components/home/Creations";
import { Live } from "@/components/motion/Live";

const demos = {
  voice: { title: "Agent vocal", Demo: VoiceAgent },
  crm: { title: "Notre CRM", Demo: CrmShowcase },
} as const;

export type ServiceDemoKind = keyof typeof demos;

/** La démo animée d'un service, dans sa fenêtre (la même que sur l'accueil). Données fictives. */
export function ServiceDemo({ kind }: { kind: ServiceDemoKind }) {
  const { title, Demo } = demos[kind];
  return (
    <div className="frame">
      <FrameBar title={title} />
      <Live className="relative h-[33rem] overflow-hidden md:h-[34rem]" threshold={0.25}>
        <div aria-hidden="true" className="h-full">
          <Demo />
        </div>
      </Live>
    </div>
  );
}
