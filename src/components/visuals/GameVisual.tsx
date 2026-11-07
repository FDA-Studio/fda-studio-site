import { doorKnight as dk } from "@/lib/doorknight";

/** Univers Door Knight : la porte officielle et les quatre héros en suspension. */
export function GameVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]" aria-hidden>
      <div className="absolute -inset-12 rounded-full bg-[radial-gradient(closest-side,rgba(110,75,255,0.35),transparent)]" />
      <img src={dk.door} alt="" width={1640} height={2050} loading="lazy" decoding="async" className="relative mx-auto h-auto w-[70%]" />
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-2">
        {dk.classes.map((c, i) => (
          <img
            key={c.name}
            src={c.img}
            alt=""
            width={155}
            height={240}
            loading="lazy"
            decoding="async"
            className="h-28 w-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] sm:h-36"
            style={{ animation: `float-y ${3 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
