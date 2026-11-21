import { site } from "@/lib/site";

/**
 * Badge « source préférée » de Google, aux couleurs de FDA Studio.
 *
 * Un visiteur qui l'ajoute voit davantage fdastudio.fr dans ses recherches (À la une, AI Overviews,
 * AI Mode). On passe par le lien profond documenté par Google plutôt que par son script : aucun
 * JavaScript tiers, aucun traceur, et la règle de sécurité des scripts (CSP) reste inchangée.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
const domain = new URL(site.url).hostname;
export const preferredSourceUrl = `https://www.google.com/preferences/source?q=${domain}`;

const StarIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
    <path
      d="M10 2.2l2.35 4.77 5.27.77-3.81 3.71.9 5.24L10 14.22l-4.71 2.47.9-5.24-3.81-3.71 5.27-.77L10 2.2z"
      fill="currentColor"
    />
  </svg>
);

export function PreferredSource({ className = "" }: { className?: string }) {
  return (
    <a
      href={preferredSourceUrl}
      target="_blank"
      rel="noopener"
      className={`preferred-source group ${className}`}
      aria-label="Ajouter FDA Studio à vos sources préférées sur Google (nouvel onglet)"
    >
      <span className="preferred-source__icon">
        <StarIcon />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">Sur Google</span>
        <span className="text-sm text-paper">Ajouter FDA Studio à mes sources préférées</span>
      </span>
    </a>
  );
}
