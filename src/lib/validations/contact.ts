import { z } from "zod";

// Pas de génération de code à l'exécution : compatible avec la CSP (pas de 'unsafe-eval')
z.config({ jitless: true });

/** Schéma partagé par le formulaire (navigateur) et la fonction serveur (revalidation). */
export const needs = [
  { value: "web", label: "Site internet" },
  { value: "ia", label: "IA & automatisation" },
  { value: "applications", label: "Application" },
  { value: "gaming", label: "Interactif" },
  { value: "autre", label: "Autre" },
] as const;

export const budgets = ["Moins de 5 k€", "5 à 15 k€", "15 à 40 k€", "Plus de 40 k€", "À définir"] as const;
export const timelines = ["Dès que possible", "1 à 3 mois", "3 à 6 mois", "Flexible"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom.").max(120),
  email: z.string().trim().email("Indiquez une adresse e-mail valide.").max(200),
  company: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().max(40).regex(/^[0-9+().\s-]*$/, "Numéro invalide.").optional().default(""),
  needs: z.array(z.enum(needs.map((n) => n.value) as [string, ...string[]])).min(1, "Choisissez au moins un type de besoin."),
  budget: z.enum(budgets, { message: "Choisissez un budget indicatif." }),
  timeline: z.enum(timelines, { message: "Choisissez un délai." }),
  message: z.string().trim().min(20, "Décrivez votre projet en quelques phrases (20 caractères minimum).").max(5000),
  consent: z.literal(true, { message: "Votre accord est nécessaire pour traiter la demande." }),
  // Anti-spam : champ piège (doit rester vide) et délai minimal de remplissage
  website: z.string().max(0).optional().default(""),
  elapsed: z.number().min(3000),
});

export type ContactInput = z.infer<typeof contactSchema>;
