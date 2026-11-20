import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Robots des assistants IA, autorisés explicitement : recherche et réponses (ChatGPT, Claude,
 * Perplexity, Le Chat), entraînement des modèles (pour que les IA connaissent le studio) et jetons
 * de contrôle d'usage de Google (Gemini) et d'Apple (Apple Intelligence). La règle « * » les autorise
 * déjà : ce groupe ne change rien aujourd'hui, il rend la décision visible et empêche qu'une future
 * restriction ajoutée sur « * » les bloque sans qu'on s'en aperçoive.
 * Noms relevés dans la documentation officielle de chaque éditeur (novembre 2026).
 */
const AI_AGENTS = [
  // OpenAI : index de recherche ChatGPT, lecture à la demande, entraînement
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic : index de recherche Claude, lecture à la demande, entraînement
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity : index de recherche, lecture à la demande
  "PerplexityBot",
  "Perplexity-User",
  // Mistral (Le Chat) : lecture à la demande, index de recherche, entraînement
  "MistralAI-User",
  "MistralAI-Index",
  "MistralAI-Training",
  // Google et Apple : usage par Gemini et par Apple Intelligence, Siri et Spotlight
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AGENTS, allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
