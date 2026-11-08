import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Chapters } from "@/components/home/Chapters";
import { Stage } from "@/components/stage/Stage";
import { Creations } from "@/components/home/Creations";
import { FinalCTA } from "@/components/home/FinalCTA";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Agence web et IA à Tours : sites internet, applications, intelligence artificielle",
    description: site.description,
    path: "/",
    keywords: ["agence web Tours", "création site internet Tours", "agence IA Tours", "développement application Tours", "agence digitale Indre-et-Loire", "création de site internet", "agence IA", "intégration intelligence artificielle entreprise", "agent vocal IA", "chatbot entreprise", "automatisation IA", "création application mobile", "développement jeux vidéo"],
  }),
  title: { absolute: "FDA Studio — Agence web et IA à Tours : sites, applications, IA" },
};

export default function HomePage() {
  return (
    <>
      <Stage />
      <Hero />
      <Chapters />
      <Creations />
      <FinalCTA />
    </>
  );
}
