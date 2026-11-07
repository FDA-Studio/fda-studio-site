import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Vision } from "@/components/sections/Vision";
import { Expertises } from "@/components/sections/Expertises";
import { AISection } from "@/components/sections/AISection";
import { ProductSection } from "@/components/sections/ProductSection";
import { GamingSection } from "@/components/sections/GamingSection";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { Process } from "@/components/sections/Process";
import { Capabilities } from "@/components/sections/Capabilities";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Sites internet, intelligence artificielle, applications et jeux vidéo",
    description: site.description,
    path: "/",
    keywords: ["création de site internet", "agence IA", "intégration intelligence artificielle entreprise", "automatisation IA", "création application mobile", "développement application web", "développement jeux vidéo", "développement digital"],
  }),
  title: { absolute: "FDA Studio — Sites internet, intelligence artificielle, applications et jeux vidéo" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Vision />
      <Expertises />
      <AISection />
      <ProductSection />
      <GamingSection />
      <WorkShowcase />
      <Process />
      <Capabilities />
      <ContactCTA />
    </>
  );
}
