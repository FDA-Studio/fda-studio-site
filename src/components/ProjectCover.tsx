import type { CoverVariant } from "@/lib/projects";

/**
 * Visuels de projet générés en code (SVG).
 * TODO(FDA) : remplacer par des captures réelles des projets quand elles sont disponibles
 * (ajouter un champ `image` au projet et l'afficher ici en priorité).
 */
export function ProjectCover({ variant, className = "" }: { variant: CoverVariant; className?: string }) {
  return (
    <div className={`overflow-hidden ${className.includes("absolute") ? "" : "relative"} ${className}`} aria-hidden>
      <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
        <defs>
          <radialGradient id={`sph-${variant}`} cx="38%" cy="32%" r="70%">
            <stop offset="0" stopColor="#f4f4f4" />
            <stop offset="0.2" stopColor="#9aa1ad" />
            <stop offset="0.55" stopColor="#1d1d1f" />
            <stop offset="1" stopColor="#0a0a0a" />
          </radialGradient>
          <radialGradient id={`glow-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#2f5bff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#2f5bff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`night-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1533" />
            <stop offset="1" stopColor="#07060f" />
          </linearGradient>
        </defs>

        {variant === "doors" && (
          <g>
            <rect width="800" height="560" fill={`url(#night-${variant})`} />
            <ellipse cx="400" cy="420" rx="360" ry="120" fill={`url(#glow-${variant})`} />
            {[170, 400, 630].map((x, i) => (
              <g key={x} transform={`translate(${x} ${i === 1 ? 120 : 170}) scale(${i === 1 ? 1.15 : 0.9})`}>
                <path d="M-80 300V80a80 80 0 0 1 160 0v220z" fill="#120f22" stroke="#3b3550" strokeWidth="2" />
                <path d="M-62 300V86a62 62 0 0 1 124 0v214" fill="none" stroke="#2a2540" strokeWidth="2" />
                <circle cx="44" cy="190" r="5" fill="#2f5bff" />
                {i === 1 && <path d="M-80 300V80a80 80 0 0 1 80-80" fill="none" stroke="#6f8bff" strokeWidth="2" opacity="0.7" />}
              </g>
            ))}
          </g>
        )}

        {variant === "sculpture" && (
          <g>
            <rect width="800" height="560" fill="#0a0a0a" />
            <circle cx="430" cy="280" r="250" fill={`url(#glow-${variant})`} />
            <circle cx="430" cy="280" r="160" fill={`url(#sph-${variant})`} />
            <path d="M430 60L640 420H220Z" fill="none" stroke="#2f5bff" strokeWidth="1.5" opacity="0.8" transform="rotate(-12 430 280)" />
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx={(i * 137) % 800} cy={(i * 89) % 560} r={i % 7 === 0 ? 1.8 : 1} fill={i % 9 === 0 ? "#2f5bff" : "#9aa1ad"} opacity="0.6" />
            ))}
          </g>
        )}

        {variant === "holding" && (
          <g>
            <rect width="800" height="560" fill="#101011" />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="560" stroke="#1f1f20" />
            ))}
            {/* Logotype FDA (tracé officiel du kit de marque) */}
            <path
              fillRule="evenodd"
              fill="#e4e5e8"
              transform="translate(254 190) scale(0.98)"
              d="M0 0H64V20H20V42H52V62H20V100H0Z M84 0H124A50 50 0 0 1 124 100H84Z M104 20V80H124A30 30 0 0 0 124 20Z M192 100L232 0H252L292 100H270L242 30L214 100Z"
            />
            <rect x="254" y="330" width="286" height="2" fill="#2f5bff" />
          </g>
        )}

        {variant === "browser" && (
          <g>
            <rect width="800" height="560" fill="#0d0b1c" />
            <ellipse cx="400" cy="560" rx="420" ry="200" fill={`url(#glow-${variant})`} />
            <g transform="translate(110 80)">
              <rect width="580" height="400" rx="14" fill="#120f22" stroke="#3b3550" strokeWidth="2" />
              <path d="M0 40h580" stroke="#3b3550" strokeWidth="2" />
              <circle cx="22" cy="20" r="5" fill="#3b3550" /><circle cx="40" cy="20" r="5" fill="#3b3550" /><circle cx="58" cy="20" r="5" fill="#3b3550" />
              <rect x="150" y="12" width="280" height="16" rx="8" fill="#1d1930" />
              <text x="290" y="160" textAnchor="middle" fill="#ededed" fontFamily="Inter Variable, sans-serif" fontWeight="700" fontSize="56" letterSpacing="-2">D</text>
              <path d="M313 118v46h28v-46a14 14 0 0 0-28 0z" fill="#6b4a2a" stroke="#2f5bff" strokeWidth="2" transform="translate(-14 0)" />
              <text x="360" y="160" fill="#ededed" fontFamily="Inter Variable, sans-serif" fontWeight="700" fontSize="56" letterSpacing="-2">OR</text>
              <rect x="180" y="200" width="220" height="10" rx="5" fill="#2a2540" />
              <rect x="215" y="222" width="150" height="10" rx="5" fill="#2a2540" />
              <rect x="225" y="262" width="130" height="34" rx="17" fill="#2f5bff" />
              {[60, 200, 340].map((x) => (
                <rect key={x} x={x + 30} y="330" width="120" height="50" rx="8" fill="#1d1930" />
              ))}
            </g>
          </g>
        )}

        {variant === "agent" && (
          <g>
            <rect width="800" height="560" fill="#0c0c0d" />
            <circle cx="400" cy="280" r="220" fill={`url(#glow-${variant})`} opacity="0.6" />
            <g stroke="#3a3a3a" strokeWidth="1.5" fill="none">
              <path d="M140 140C280 140 280 280 400 280M140 420C280 420 280 280 400 280M400 280C520 280 520 170 660 170M400 280C520 280 520 390 660 390M400 280H660" />
            </g>
            <g stroke="#2f5bff" strokeWidth="2" fill="none" strokeDasharray="6 10">
              <path d="M140 140C280 140 280 280 400 280C520 280 520 170 660 170" />
            </g>
            {[[140, 140], [140, 420], [660, 170], [660, 280], [660, 390]].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <rect x={x - 46} y={y - 18} width="92" height="36" rx="18" fill="#141414" stroke="#3a3a3a" />
                <rect x={x - 26} y={y - 3} width="52" height="6" rx="3" fill="#5a5a5a" />
              </g>
            ))}
            <circle cx="400" cy="280" r="54" fill="#0a0a0a" stroke="#2f5bff" strokeWidth="2" />
            <path d="M385 296l15-30 15 30z" fill="#2f5bff" />
          </g>
        )}

        {variant === "cockpit" && (
          <g>
            <rect width="800" height="560" fill="#101011" />
            <g transform="translate(80 90)">
              <rect width="470" height="330" rx="16" fill="#0a0a0a" stroke="#262626" strokeWidth="2" />
              {[0, 1, 2].map((i) => (
                <rect key={i} x={24 + i * 146} y="24" width="130" height="64" rx="10" fill="#141414" stroke="#262626" />
              ))}
              <path d="M30 280C80 260 110 230 160 236S240 190 290 180 370 130 440 120" fill="none" stroke="#2f5bff" strokeWidth="3" />
              <path d="M30 280C80 260 110 230 160 236S240 190 290 180 370 130 440 120V300H30Z" fill="#2f5bff" opacity="0.1" />
            </g>
            <g transform="translate(500 150)">
              <rect width="200" height="360" rx="34" fill="#0d0d0e" stroke="#3a3a3a" strokeWidth="2" />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x="18" y={60 + i * 62} width="164" height="50" rx="14" fill="#141414" stroke="#262626" />
              ))}
              <circle cx="40" cy="85" r="9" fill="#2f5bff" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
