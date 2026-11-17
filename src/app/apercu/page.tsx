import type { Metadata } from "next";
import { World, WorldCopy } from "@/components/world/World";
import { Creations } from "@/components/home/Creations";
import { FinalCTA } from "@/components/home/FinalCTA";

/**
 * Page d'essai (non référencée, absente du plan du site) : l'accueil avec la suite du film en
 * version courte. Démos en onglets sur téléphone, accroches courtes, contact en deux temps.
 * À supprimer une fois la version choisie.
 */
export const metadata: Metadata = {
  title: { absolute: "FDA Studio — aperçu de l'accueil (version courte)" },
  robots: { index: false, follow: false },
};

export default function ApercuPage() {
  return (
    <>
      <WorldCopy />
      <World />
      <Creations compact />
      <FinalCTA compact />
    </>
  );
}
