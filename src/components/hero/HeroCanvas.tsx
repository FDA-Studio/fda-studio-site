"use client";

import { useEffect, useRef, useState } from "react";
import { particlesFragment, particlesVertex, sculptureFragment, sculptureVertex } from "./shaders";

/**
 * Sculpture WebGL du hero.
 * - Three.js chargé à la demande (hors du bundle initial) pour préserver le premier affichage.
 * - Qualité adaptée à l'appareil (subdivision, particules, densité de pixels).
 * - Rendu suspendu hors écran et onglet masqué ; une seule image si « réduire les animations ».
 */
export function HeroCanvas({ variant = "home" }: { variant?: "home" | "compact" }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    // Démarrage différé : la 3D ne concurrence pas le premier affichage ni l'interactivité
    const whenIdle = () =>
      new Promise<void>((resolve) => {
        const go = () => {
          if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => resolve(), { timeout: 1500 });
          else setTimeout(resolve, 300);
        };
        if (document.readyState === "complete") go();
        else window.addEventListener("load", go, { once: true });
      });

    (async () => {
      // Économie de données ou appareil très limité : visuel statique
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      if (conn?.saveData || (mem !== undefined && mem <= 2)) {
        setFailed(true);
        return;
      }
      await whenIdle();
      if (disposed) return;
      // Sans accélération matérielle (rendu logiciel), la 3D temps réel pénaliserait l'appareil :
      // on le détecte avant de télécharger Three.js, et on affiche le visuel statique.
      if (!new URLSearchParams(window.location.search).has("force3d")) {
        try {
          const probe = document.createElement("canvas").getContext("webgl");
          const ext = probe?.getExtension("WEBGL_debug_renderer_info");
          const gpu = probe && ext ? String(probe.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
          probe?.getExtension("WEBGL_lose_context")?.loseContext();
          if (!probe || /swiftshader|llvmpipe|software|basic render/i.test(gpu)) {
            setFailed(true);
            return;
          }
        } catch {
          setFailed(true);
          return;
        }
      }
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        setFailed(true);
        return;
      }
      if (disposed) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const small = window.innerWidth < 768;
      const lowPower = small || coarse || (navigator.hardwareConcurrency ?? 8) <= 4;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
      camera.position.set(0, 0, 7.4);

      const accent = new THREE.Color("#2f5bff");
      const steel = new THREE.Color("#8b93a1");

      // Sculpture
      const detail = lowPower ? 30 : 72;
      const geo = new THREE.IcosahedronGeometry(1.32, detail);
      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uAmp: { value: 1 },
        uAccent: { value: accent },
        uSteel: { value: steel },
      };
      const mat = new THREE.ShaderMaterial({ vertexShader: sculptureVertex, fragmentShader: sculptureFragment, uniforms });
      const sculpture = new THREE.Mesh(geo, mat);
      const rig = new THREE.Group();
      rig.add(sculpture);
      scene.add(rig);

      // Triangle d'or en orbite : rappel du A du monogramme
      const triPts: import("three").Vector3[] = [];
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 2;
        triPts.push(new THREE.Vector3(Math.cos(a) * 2.25, Math.sin(a) * 2.25, 0));
      }
      const triGeo = new THREE.BufferGeometry().setFromPoints(triPts);
      const triMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.55 });
      const triangle = new THREE.LineLoop(triGeo, triMat);
      triangle.rotation.x = 1.15;
      rig.add(triangle);

      // Particules
      const count = lowPower ? 520 : 1500;
      const pos = new Float32Array(count * 3);
      const size = new Float32Array(count);
      const seed = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const r = 2.3 + Math.pow(Math.random(), 0.7) * 5.5;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
        pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
        size[i] = 0.6 + Math.random() * 2.2;
        seed[i] = Math.random();
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      pGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
      pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      const pUniforms = { uTime: { value: 0 }, uPixelRatio: { value: dpr }, uAccent: { value: accent } };
      const pMat = new THREE.ShaderMaterial({
        vertexShader: particlesVertex,
        fragmentShader: particlesFragment,
        uniforms: pUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // Disposition selon la largeur
      let baseX = 0;
      let baseY = 0;
      let baseScale = 1;
      const layout = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const wide = w / h > 1.1;
        if (variant === "compact") {
          baseX = wide ? 1.6 : 0;
          baseY = wide ? 0 : 0.6;
          baseScale = wide ? 0.85 : 0.7;
        } else {
          baseX = wide ? 1.25 : 0;
          baseY = wide ? 0.1 : 1.05;
          baseScale = wide ? 0.92 : 0.55;
        }
      };
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(host);

      // Interactions
      const target = new THREE.Vector2();
      const mouse = new THREE.Vector2();
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let scroll = 0;
      const onScroll = () => {
        scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.5);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      // Boucle de rendu
      let last = performance.now();
      let visible = true;
      let raf = 0;
      let t = 0;

      const frame = () => {
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        mouse.lerp(target, 0.04);
        uniforms.uTime.value = t;
        uniforms.uMouse.value.copy(mouse);
        uniforms.uAmp.value = 1 + scroll * 0.6;
        pUniforms.uTime.value = t;

        rig.position.set(baseX + mouse.x * 0.12, baseY + mouse.y * 0.1 + scroll * 1.1, 0);
        rig.scale.setScalar(baseScale * (1 - scroll * 0.18));
        sculpture.rotation.y = t * 0.08 + mouse.x * 0.35;
        sculpture.rotation.x = Math.sin(t * 0.05) * 0.2 - mouse.y * 0.25;
        triangle.rotation.z = t * 0.12;
        triangle.rotation.y = Math.sin(t * 0.1) * 0.3 + mouse.x * 0.2;
        particles.rotation.y = mouse.x * 0.08;
        particles.position.y = scroll * 0.6;

        renderer.render(scene, camera);
      };

      const loop = () => {
        frame();
        raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (reduced || raf || !visible || document.hidden) return;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      if (reduced) {
        t = 4;
        frame();
        ro.disconnect();
        const reRender = new ResizeObserver(() => { layout(); frame(); });
        reRender.observe(host);
        cleanup = () => reRender.disconnect();
      }

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      });
      io.observe(host);
      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);

      const onLost = (e: Event) => {
        e.preventDefault();
        stop();
        setFailed(true);
      };
      renderer.domElement.addEventListener("webglcontextlost", onLost);

      start();

      const prevCleanup = cleanup;
      cleanup = () => {
        prevCleanup();
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        renderer.domElement.removeEventListener("webglcontextlost", onLost);
        geo.dispose();
        mat.dispose();
        triGeo.dispose();
        triMat.dispose();
        pGeo.dispose();
        pMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [variant]);

  return (
    <div ref={hostRef} className="canvas-fade absolute inset-0" aria-hidden>
      {failed && (
        // Repli sans 3D temps réel : sculpture statique en CSS/SVG, même composition
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-[30%] aspect-square w-[78vmin] -translate-x-1/2 -translate-y-1/2 md:left-[63%] md:top-1/2 md:w-[52vmin]">
            <div className="glow-accent absolute -inset-1/3" />
            <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_34%_28%,#fbfbfb_0%,#b9bec7_12%,#5b616b_30%,#1a1a1c_55%,#0a0a0a_74%)] shadow-[inset_-30px_-40px_80px_rgba(47,91,255,0.25)]" />
            <div className="absolute inset-[12%] rounded-full bg-[conic-gradient(from_200deg,transparent_0deg,rgba(47,91,255,0.35)_40deg,transparent_90deg)] mix-blend-screen" style={{ animation: "spin-slow 24s linear infinite" }} />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ animation: "spin-slow 60s linear infinite" }}>
              <path d="M50 4L94 80H6Z" fill="none" stroke="#2f5bff" strokeOpacity="0.55" strokeWidth="0.3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
