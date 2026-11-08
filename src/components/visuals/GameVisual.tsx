"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";
import { getSound, sfx } from "@/lib/sound";
import { usePaused } from "@/components/motion/Live";
import { motionPause, reducedMotion } from "@/lib/motion";

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
  const paused = usePaused();

  // La porte s'ouvre quand la Chevalière entre à l'écran, ou quand on active le son devant elle
  // (au plus une fois toutes les 20 s, si le son est activé)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let visible = false;
    let last = 0;
    const door = () => {
      if (!visible || performance.now() - last < 20000) return;
      last = performance.now();
      sfx("door");
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        door();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    // Juste après l'ouverture sonore, pour ne pas couvrir l'impact
    const off = getSound().subscribe((on) => {
      if (on) window.setTimeout(door, 1600);
    });
    return () => {
      io.disconnect();
      off();
    };
  }, []);

  useEffect(() => {
    if (reducedMotion()) return;
    const apple = /Apple/.test(navigator.vendor) || /iPad|iPhone|iPod/.test(navigator.userAgent);
    setMode(apple ? "webp" : "video");
  }, []);

  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (mode !== "video" || !el || !v) return;
    let visible = false;
    const sync = () => {
      if (visible && !motionPause.get()) {
        if (v.preload !== "auto") v.preload = "auto";
        v.play().catch(() => setMode("webp"));
      } else v.pause();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    const off = motionPause.subscribe(sync);
    return () => {
      io.disconnect();
      off();
    };
  }, [mode]);

  const size = "relative mx-auto h-auto w-[min(30rem,82%)] drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]";

  return (
    <div ref={wrap} className="relative mx-auto w-full max-w-[38rem]" aria-hidden>
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
          poster={asset("/media/knight-f-poster.webp")}
          style={{ aspectRatio: "554 / 760" }}
          disablePictureInPicture
        >
          <source src={asset("/media/knight-f.webm")} type='video/webm; codecs="vp9"' />
        </video>
      ) : (
        <img
          src={asset(mode === "webp" && !paused ? "/media/knight-f.webp" : "/media/knight-f-poster.webp")}
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
