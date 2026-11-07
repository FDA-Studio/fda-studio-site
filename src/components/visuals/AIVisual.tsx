/** Réseau neuronal : les signaux circulent, les nœuds s'activent, une action ressort. */
const layers = [
  [60, 140, 220, 300],
  [40, 110, 180, 250, 320],
  [100, 180, 260],
];
const xs = [60, 240, 420];

export function AIVisual() {
  const edges: [number, number, number, number, number][] = [];
  let k = 0;
  for (let l = 0; l < layers.length - 1; l++)
    for (const y1 of layers[l]) for (const y2 of layers[l + 1]) edges.push([xs[l], y1, xs[l + 1], y2, k++]);
  return (
    <div className="relative mx-auto w-full max-w-[34rem]" aria-hidden>
      <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(47,91,255,0.2),transparent)]" />
      <svg viewBox="0 0 520 360" className="relative w-full">
        {edges.map(([x1, y1, x2, y2, i]) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#34363c" strokeWidth="1" />
            {i % 3 === 0 && (
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#6f8bff" strokeWidth="1.6" strokeDasharray="6 34" strokeLinecap="round"
                style={{ animation: `dash-flow ${1.6 + (i % 5) * 0.25}s linear infinite`, animationDelay: `${-(i % 7) * 0.3}s` }}
              />
            )}
          </g>
        ))}
        {layers.map((ys, l) =>
          ys.map((y, j) => (
            <circle
              key={`${l}-${j}`} cx={xs[l]} cy={y} r="5"
              fill={l === 2 && j === 1 ? "#2f5bff" : "#f4f4f2"}
              style={{ animation: `pulse-node 2.4s ease-in-out infinite`, animationDelay: `${(l * 0.4 + j * 0.27).toFixed(2)}s` }}
            />
          )),
        )}
        <line x1="420" y1="180" x2="470" y2="180" stroke="#2f5bff" strokeWidth="1.6" strokeDasharray="4 6" style={{ animation: "dash-flow 1s linear infinite" }} />
        <circle cx="490" cy="180" r="16" fill="#0a0a0b" stroke="#2f5bff" />
        <path d="M483 180l5 5 9-10" fill="none" stroke="#6f8bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="relative mt-4 flex flex-wrap justify-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted">
        {["Demande reçue", "Intention détectée", "Action préparée", "Validation humaine"].map((t, i) => (
          <span key={t} className="rounded-full border border-line-strong px-3 py-1.5" style={{ animation: `pulse-dot 4s ${i * 1}s ease-in-out infinite` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
