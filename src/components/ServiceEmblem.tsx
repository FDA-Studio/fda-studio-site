import type { ServiceSlug } from "@/lib/services";

/** Emblème vectoriel propre à chaque expertise (pas d'icône générique). */
export function ServiceEmblem({ slug, className = "" }: { slug: ServiceSlug; className?: string }) {
  const stroke = "currentColor";
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
      {slug === "web" && (
        <g stroke={stroke} strokeWidth="1.2">
          <rect x="34" y="58" width="132" height="92" rx="8" opacity="0.35" />
          <rect x="24" y="46" width="132" height="92" rx="8" opacity="0.6" />
          <rect x="14" y="34" width="132" height="92" rx="8" fill="#0a0a0a" />
          <path d="M14 50h132" />
          <circle cx="24" cy="42" r="2" fill={stroke} /><circle cx="32" cy="42" r="2" fill={stroke} /><circle cx="40" cy="42" r="2" fill={stroke} />
          <path d="M28 70h56M28 82h40" strokeWidth="3" strokeLinecap="round" />
          <rect x="28" y="96" width="34" height="12" rx="6" stroke="#2f5bff" fill="#2f5bff" />
          <path d="M98 64l26 46H72z" stroke="#2f5bff" />
        </g>
      )}
      {slug === "ia" && (
        <g stroke={stroke} strokeWidth="1.2">
          <path d="M40 60L100 100M40 140L100 100M100 100L160 70M100 100L160 130M40 60L40 140M160 70L160 130" opacity="0.45" />
          <circle cx="40" cy="60" r="9" fill="#0a0a0a" />
          <circle cx="40" cy="140" r="9" fill="#0a0a0a" />
          <circle cx="160" cy="70" r="9" fill="#0a0a0a" />
          <circle cx="160" cy="130" r="9" fill="#0a0a0a" />
          <circle cx="100" cy="100" r="22" fill="#0a0a0a" stroke="#2f5bff" />
          <circle cx="100" cy="100" r="34" opacity="0.25" strokeDasharray="3 5" />
          <path d="M92 108l8-16 8 16z" fill="#2f5bff" stroke="none" />
        </g>
      )}
      {slug === "applications" && (
        <g stroke={stroke} strokeWidth="1.2">
          <rect x="18" y="44" width="118" height="84" rx="8" opacity="0.6" />
          <path d="M30 110l18-16 16 10 22-26 18 12 18-20" stroke="#2f5bff" strokeWidth="1.6" />
          <path d="M30 60h40" strokeWidth="3" strokeLinecap="round" />
          <rect x="116" y="70" width="62" height="112" rx="12" fill="#0a0a0a" />
          <rect x="140" y="78" width="14" height="3" rx="1.5" fill={stroke} />
          <rect x="126" y="94" width="42" height="26" rx="5" opacity="0.6" />
          <rect x="126" y="126" width="42" height="10" rx="5" opacity="0.4" />
          <rect x="126" y="142" width="30" height="10" rx="5" opacity="0.4" />
          <rect x="126" y="160" width="42" height="12" rx="6" fill="#2f5bff" stroke="#2f5bff" />
        </g>
      )}
      {slug === "gaming" && (
        <g stroke={stroke} strokeWidth="1.2">
          <path d="M56 180V84a44 44 0 0 1 88 0v96" fill="#0a0a0a" />
          <path d="M70 180V88a30 30 0 0 1 60 0v92" opacity="0.5" />
          <path d="M100 58v122" opacity="0.35" />
          <circle cx="118" cy="128" r="3" fill="#2f5bff" stroke="none" />
          <path d="M100 96l12 22H88z" stroke="#2f5bff" />
          <path d="M20 180h160" />
          <path d="M34 168l6-8 6 8M160 172l4-6 4 6" opacity="0.5" />
        </g>
      )}
    </svg>
  );
}
