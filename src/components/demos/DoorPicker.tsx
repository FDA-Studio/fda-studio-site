"use client";

import { useState } from "react";

const fates = [
  { name: "Une horde", text: "Des vagues d’ennemis. Tiens la position.", tone: "#8b93a1" },
  { name: "Un boss", text: "Il garde la zone. Son butin vaut le détour.", tone: "#9a80ff" },
  { name: "Le gardien", text: "Le dernier verrou du monde. Prépare-toi.", tone: "#6e4bff" },
];

function shuffle() {
  const order = [0, 1, 2];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Mini-expérience inspirée de Door Knight : choisir une porte et découvrir ce qu'elle cache. */
export function DoorPicker() {
  const [order, setOrder] = useState<number[]>([0, 1, 2]);
  const [opened, setOpened] = useState<number | null>(null);

  const open = (i: number) => {
    if (opened !== null) return;
    if (opened === null && i >= 0) setOpened(i);
  };
  const reset = () => {
    setOpened(null);
    window.setTimeout(() => setOrder(shuffle()), 450);
  };

  const result = opened !== null ? fates[order[opened]] : null;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:gap-6" style={{ perspective: "1200px" }}>
        {[0, 1, 2].map((i) => {
          const fate = fates[order[i]];
          const isOpen = opened === i;
          const dim = opened !== null && !isOpen;
          return (
            <button
              key={i}
              type="button"
              onClick={() => open(i)}
              disabled={opened !== null && !isOpen}
              aria-label={`Porte ${i + 1}${isOpen ? ` : ${fate.name}` : ""}`}
              className={`group relative aspect-[3/5] w-full transition-opacity duration-500 ${dim ? "opacity-35" : ""}`}
            >
              {/* Ce qui attend derrière */}
              <span className="absolute inset-0 overflow-hidden rounded-t-full border border-white/10 bg-[radial-gradient(circle_at_50%_70%,rgba(47,91,255,0.35),#07060f_70%)]">
                <span className={`absolute inset-x-0 bottom-[16%] text-center transition-all delay-200 duration-700 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  <svg viewBox="0 0 40 40" className="mx-auto h-8 w-8 sm:h-12 sm:w-12" aria-hidden>
                    <path d="M20 6l13 24H7z" fill="none" stroke={fate.tone} strokeWidth="1.5" />
                    <circle cx="20" cy="22" r="3" fill={fate.tone} />
                  </svg>
                  <span className="mt-2 block font-display text-[0.7rem] text-paper sm:text-base">{fate.name}</span>
                </span>
              </span>
              {/* Le battant */}
              <span
                className="absolute inset-0 origin-left rounded-t-full border border-[#3b3550] bg-[linear-gradient(180deg,#1d1930,#120f22)] shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] transition-transform duration-[1100ms] ease-[var(--ease-in-out-quart)]"
                style={{ transform: isOpen ? "rotateY(-105deg)" : "rotateY(0deg)", backfaceVisibility: "hidden" }}
              >
                <span className="absolute inset-[10%] rounded-t-full border border-[#3b3550]" />
                <span className="absolute inset-x-[49%] bottom-0 top-[34%] bg-[#2a2540]" />
                <span className="absolute right-[18%] top-[56%] h-2 w-2 rounded-full bg-violet shadow-[0_0_12px_#6e4bff] transition-transform group-hover:scale-125" />
                <span className="absolute inset-x-0 top-[20%] text-center font-display text-xs text-[#a59fc0] sm:text-sm">{i + 1}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex min-h-[3.5rem] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
        <p className="text-[#c9c4dc]">{result ? <><strong className="font-display font-semibold text-paper">{result.name}.</strong> {result.text}</> : "Choisis ta porte. Affronte ce qu’il y a derrière."}</p>
        {opened !== null && (
          <button type="button" onClick={reset} className="btn btn-ghost !h-11 shrink-0 !border-[#3b3550] !bg-transparent">
            Choisir une autre porte
          </button>
        )}
      </div>
    </div>
  );
}
