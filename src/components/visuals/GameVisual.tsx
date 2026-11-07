"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";
import { reducedMotion } from "@/lib/motion";

/**
 * La Chevalière de Door Knight, animée et sans fond.
 * - Chrome, Edge, Firefox : vidéo WebM VP9 avec couche alpha (1,4 Mo).
 * - Safari (pas d'alpha en WebM) : WebP animé transparent.
 * - « Réduire les animations » : image fixe.
 * La lecture ne démarre qu'à l'approche du panneau et se met en pause hors écran.
 */
export function GameVisual() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"poster" | "video" | "webp">("poster");

  useEffect(() => {
    if (reducedMotion()) return;
    const apple = /Apple/.test(navigator.vendor) || /iPad|iPhone|iPod/.test(navigator.userAgent);
    setMode(apple ? "webp" : "video");
  }, []);

  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (mode !== "video" || !el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => setMode("webp"));
        } else v.pause();
      },
      { rootMargin: "0px 400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  const size = "relative mx-auto h-auto w-[min(26rem,78%)] drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]";

  return (
    <div ref={wrap} className="relative mx-auto w-full max-w-[34rem]" aria-hidden>
      {/* Halo et ombre au sol : la Chevalière reste détourée, sans décor */}
      <div className="absolute inset-x-0 top-[8%] mx-auto aspect-square w-[85%] rounded-full bg-[radial-gradient(closest-side,rgba(110,75,255,0.32),transparent)]" />
      <div className="absolute inset-x-0 bottom-[1%] mx-auto h-8 w-[46%] rounded-[50%] bg-black/60 blur-xl" />

      {mode === "video" ? (
        <video
          ref={video}
          className={size}
          width={554}
          height={760}
          muted
          loop
          playsInline
          preload="none"
          poster={asset("/gaming/knight-f-poster.webp")}
          style={{ aspectRatio: "554 / 760" }}
          disablePictureInPicture
        >
          <source src={asset("/gaming/knight-f.webm")} type='video/webm; codecs="vp9"' />
        </video>
      ) : (
        <img
          src={asset(mode === "webp" ? "/gaming/knight-f.webp" : "/gaming/knight-f-poster.webp")}
          alt=""
          width={350}
          height={480}
          loading="lazy"
          decoding="async"
          className={size}
        />
      )}
    </div>
  );
}
