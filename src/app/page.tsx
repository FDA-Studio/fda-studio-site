import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Statement } from "@/components/home/Statement";
import { ExpertiseRail } from "@/components/home/ExpertiseRail";
import { Creations } from "@/components/home/Creations";
import { DoorKnightSpot } from "@/components/home/DoorKnightSpot";
import { FinalCTA } from "@/components/home/FinalCTA";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Sites internet, intelligence artificielle, applications et jeux vidéo",
    description: site.description,
    path: "/",
    keywords: ["création de site internet", "agence IA", "intégration intelligence artificielle entreprise", "agent vocal IA", "chatbot entreprise", "automatisation IA", "création application mobile", "développement jeux vidéo"],
  }),
  title: { absolute: "FDA Studio — Sites internet, intelligence artificielle, applications et jeux vidéo" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Statement />
      <ExpertiseRail />
      <Creations />
      <DoorKnightSpot />
      <FinalCTA />
    </>
  );
}
