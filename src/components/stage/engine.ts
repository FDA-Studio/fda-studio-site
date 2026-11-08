import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { ARCH, PHONES, WEB_PANES, buildShapes, type SceneId, type ShapeTarget } from "./shapes";

/**
 * La « matière » FDA : un seul nuage d'éclats de titane (InstancedMesh) qui se recompose
 * au scroll en monogramme, fenêtres web, orbe d'IA, téléphones, puis porte de Door Knight.
 * Un seul appel de rendu pour les éclats ; les écrans, le cœur et la porte sont des extras légers.
 */

export const SCENES: SceneId[] = ["hero", "web", "ai", "apps", "gaming", "quiet"];

export interface StageOptions {
  lowPower: boolean;
  reduced: boolean;
}

export interface Stage {
  /** Position continue sur la ligne du temps : 0 = monogramme … 4 = porte, 5 = calme. */
  setTimeline(t: number): void;
  setPointer(x: number, y: number, active: boolean): void;
  /**
   * Cadrage téléphone : pour chaque scène, la bande libre de l'écran (au-dessus du texte),
   * en fractions de la hauteur de la fenêtre (0 = haut). `null` = grand écran, cadrage fixe.
   */
  setBands(bands: { top: number; bottom: number }[] | null): void;
  start(): void;
  stop(): void;
  renderOnce(): void;
  dispose(): void;
}

const SILVER = new THREE.Color("#a9adb5");
const ACCENTS: Record<SceneId, THREE.Color> = {
  hero: new THREE.Color("#ffffff"),
  web: new THREE.Color("#4d78ff"),
  ai: new THREE.Color("#8fb4ff"),
  apps: new THREE.Color("#ffffff"),
  gaming: new THREE.Color("#8a6bff"),
  quiet: new THREE.Color("#6f8bff"),
};
// Cadrage par scène : décalage de la matière (x, y) et recul caméra
// s / ms : échelle de la matière sur grand écran / sur téléphone
const FRAMING: Record<SceneId, { x: number; y: number; z: number; s: number; mx: number; my: number; ms: number }> = {
  hero: { x: 1.75, y: 0.1, z: 6.6, s: 0.62, mx: 0, my: 1.05, ms: 0.3 },
  web: { x: 1.2, y: 0.05, z: 6.9, s: 0.7, mx: 0, my: 1.2, ms: 0.3 },
  ai: { x: 1.35, y: 0, z: 6.4, s: 0.74, mx: 0, my: 1.2, ms: 0.38 },
  apps: { x: 1.35, y: 0.1, z: 7.0, s: 0.74, mx: 0, my: 1.15, ms: 0.32 },
  gaming: { x: 1.4, y: 0.15, z: 7.2, s: 0.8, mx: 0, my: 1.2, ms: 0.36 },
  quiet: { x: 0, y: 0, z: 7.5, s: 1, mx: 0, my: 0, ms: 1 },
};

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function uiTexture(kind: "web" | "phone", seed: number): THREE.CanvasTexture {
  const W = kind === "web" ? 512 : 256;
  const H = kind === "web" ? 332 : 532;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0e0f12";
  g.fillRect(0, 0, W, H);
  const accent = "#2f5bff";
  const line = (x: number, y: number, w: number, h: number, color = "#2a2c33") => {
    g.fillStyle = color;
    g.beginPath();
    g.roundRect(x, y, w, h, Math.min(h / 2, 8));
    g.fill();
  };
  if (kind === "web") {
    g.fillStyle = "#15161a";
    g.fillRect(0, 0, W, 44);
    line(24, 16, 80, 12, "#e8e8e6");
    line(W - 180, 18, 40, 8);
    line(W - 128, 18, 40, 8);
    line(W - 76, 18, 48, 8, accent);
    if (seed === 0) {
      line(32, 92, 230, 26, "#f0f0ee");
      line(32, 128, 180, 26, "#f0f0ee");
      line(32, 176, 200, 8);
      line(32, 194, 150, 8);
      line(32, 232, 96, 30, accent);
      g.fillStyle = "#1b2440";
      g.beginPath();
      g.roundRect(320, 80, 160, 200, 14);
      g.fill();
      const grad = g.createLinearGradient(320, 80, 480, 280);
      grad.addColorStop(0, "rgba(79,120,255,0.55)");
      grad.addColorStop(1, "rgba(79,120,255,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.roundRect(320, 80, 160, 200, 14);
      g.fill();
    } else if (seed === 1) {
      for (let i = 0; i < 3; i++) {
        g.fillStyle = "#17191e";
        g.beginPath();
        g.roundRect(32 + i * 152, 80, 136, 120, 12);
        g.fill();
        line(32 + i * 152, 216, 100, 10, "#d8d8d6");
        line(32 + i * 152, 236, 76, 8);
      }
      line(32, 272, 120, 30, accent);
    } else {
      line(32, 84, 320, 22, "#f0f0ee");
      line(32, 118, 260, 22, "#f0f0ee");
      for (let i = 0; i < 4; i++) line(32, 170 + i * 26, 300 - i * 40, 8);
    }
  } else {
    g.fillStyle = "#121318";
    g.fillRect(0, 0, W, 72);
    line(24, 30, 90, 14, "#f0f0ee");
    g.fillStyle = accent;
    g.beginPath();
    g.arc(W - 36, 37, 12, 0, Math.PI * 2);
    g.fill();
    if (seed === 0) {
      // Tableau de bord : courbe et cartes
      g.fillStyle = "#17191e";
      g.beginPath();
      g.roundRect(20, 96, W - 40, 150, 16);
      g.fill();
      g.strokeStyle = accent;
      g.lineWidth = 3;
      g.beginPath();
      const pts = [0.6, 0.55, 0.62, 0.45, 0.5, 0.35, 0.38, 0.22];
      pts.forEach((p, i) => {
        const x = 36 + (i / (pts.length - 1)) * (W - 72);
        const y = 110 + p * 120;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      });
      g.stroke();
      for (let i = 0; i < 3; i++) {
        g.fillStyle = "#17191e";
        g.beginPath();
        g.roundRect(20, 270 + i * 78, W - 40, 62, 14);
        g.fill();
        line(40, 288 + i * 78, 110, 10, "#e8e8e6");
        line(40, 306 + i * 78, 70, 8);
        line(W - 80, 292 + i * 78, 40, 18, i === 1 ? accent : "#2a2c33");
      }
    } else {
      // Messagerie : bulles d'assistant
      const bubbles = [
        { me: false, w: 160, h: 48 },
        { me: true, w: 120, h: 40 },
        { me: false, w: 180, h: 70 },
        { me: true, w: 90, h: 40 },
        { me: false, w: 150, h: 48 },
      ];
      let y = 100;
      bubbles.forEach((b) => {
        g.fillStyle = b.me ? accent : "#1b1d23";
        g.beginPath();
        g.roundRect(b.me ? W - 24 - b.w : 24, y, b.w, b.h, 16);
        g.fill();
        line(b.me ? W - 24 - b.w + 16 : 40, y + 16, b.w - 40, 8, b.me ? "#dfe6ff" : "#8a8d91");
        if (b.h > 44) line(b.me ? W - 24 - b.w + 16 : 40, y + 34, b.w - 70, 8, b.me ? "#dfe6ff" : "#8a8d91");
        y += b.h + 14;
      });
      g.fillStyle = "#17191e";
      g.beginPath();
      g.roundRect(20, H - 72, W - 40, 48, 24);
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createStage(host: HTMLElement, opts: StageOptions): Stage {
  const { lowPower, reduced } = opts;
  const N = lowPower ? 1200 : 2400;

  const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const fog = new THREE.FogExp2(0x0a0a0b, 0.045);
  scene.fog = fog;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  camera.position.set(0, 0, 6.6);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fb4ff, 0.8);
  rim.position.set(-4, -2, -3);
  scene.add(rim);
  const accentLight = new THREE.PointLight(0x4d78ff, 0, 9, 1.6);
  scene.add(accentLight);

  const rig = new THREE.Group(); // suit le curseur
  const world = new THREE.Group(); // cadrage par scène
  rig.add(world);
  scene.add(rig);

  // ---- Les éclats
  const shapes = buildShapes(N);
  const shardGeo = new THREE.BoxGeometry(1, 0.62, 0.16);
  const shardMat = new THREE.MeshStandardMaterial({ color: SILVER, metalness: 1, roughness: 0.34, envMapIntensity: 0.75 });
  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) seeds[i] = (i * 0.618033988749895) % 1;
  shardGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
  const uAccent = { value: new THREE.Color("#ffffff") };
  const uAccentMix = { value: 0 };
  const uTime = { value: 0 };
  shardMat.onBeforeCompile = (sh) => {
    sh.uniforms.uAccent = uAccent;
    sh.uniforms.uAccentMix = uAccentMix;
    sh.uniforms.uTime = uTime;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aSeed; varying float vSeed;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSeed = aSeed;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uAccent; uniform float uAccentMix; uniform float uTime; varying float vSeed;")
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        // Une fraction des éclats prend la teinte de la scène ; ils scintillent lentement.
        float pick = step(1.0 - uAccentMix, vSeed);
        float twinkle = 0.5 + 0.5 * sin(uTime * 1.3 + vSeed * 40.0);
        diffuseColor.rgb = mix(diffuseColor.rgb, uAccent, pick * (0.55 + 0.45 * twinkle));
        totalEmissiveRadiance += uAccent * pick * twinkle * 0.35;`,
      );
  };
  const shards = new THREE.InstancedMesh(shardGeo, shardMat, N);
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shards.frustumCulled = false;
  world.add(shards);

  // ---- Extras par scène
  const extras = new THREE.Group();
  world.add(extras);

  // Web : vitres et pages
  const paneMat = new THREE.MeshPhysicalMaterial({ color: 0x9fb4ff, metalness: 0, roughness: 0.08, transparent: true, opacity: 0, side: THREE.DoubleSide, envMapIntensity: 1.4, depthWrite: false });
  const webPanes = WEB_PANES.map((p, i) => {
    const g = new THREE.Group();
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), paneMat);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(p.w * 0.93, p.h * 0.9), new THREE.MeshBasicMaterial({ map: uiTexture("web", i), transparent: true, opacity: 0, toneMapped: false }));
    screen.position.z = -0.02;
    g.add(glass, screen);
    g.position.set(p.x, p.y, p.z);
    g.visible = false;
    extras.add(g);
    return { g, screen, glass };
  });

  // IA : cœur lumineux et synapses
  const coreMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime, uOpacity: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vV; uniform float uTime;
      void main(){ vec3 p = position * (1.0 + 0.05 * sin(uTime * 2.0 + position.y * 6.0));
        vec4 mv = modelViewMatrix * vec4(p,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vV; uniform float uTime; uniform float uOpacity;
      void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
        float pulse = 0.75 + 0.25 * sin(uTime * 1.8);
        vec3 col = mix(vec3(0.25,0.4,1.0), vec3(1.0), f) * (0.35 + f * 1.4) * pulse;
        gl_FragColor = vec4(col, uOpacity * (0.25 + f)); }`,
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 32), coreMat);
  core.visible = false;
  extras.add(core);
  const synCount = lowPower ? 40 : 80;
  const synPos = new Float32Array(synCount * 2 * 3);
  for (let i = 0; i < synCount; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    const d = new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th));
    const a = d.clone().multiplyScalar(0.7), b = d.clone().multiplyScalar(1.5);
    synPos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
  }
  const synGeo = new THREE.BufferGeometry();
  synGeo.setAttribute("position", new THREE.BufferAttribute(synPos, 3));
  const synMat = new THREE.LineBasicMaterial({ color: 0x8fb4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const synapses = new THREE.LineSegments(synGeo, synMat);
  synapses.visible = false;
  extras.add(synapses);

  // Applications : écrans de téléphone
  const phoneScreens = PHONES.map((p, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(p.w * 0.86, p.h * 0.92), new THREE.MeshBasicMaterial({ map: uiTexture("phone", i), transparent: true, opacity: 0, toneMapped: false }));
    m.position.set(p.x, p.y, p.z);
    m.rotation.y = p.ry;
    m.visible = false;
    extras.add(m);
    return m;
  });

  // Gaming : la lumière derrière la porte
  const portalMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime, uOpacity: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uOpacity;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
      void main(){ vec2 p = vUv - 0.5; float r = length(p * vec2(1.0, 0.7));
        float n = noise(vUv * 5.0 + vec2(0.0, uTime * 0.35)) * 0.6 + noise(vUv * 11.0 - vec2(uTime * 0.2, 0.0)) * 0.4;
        float glow = smoothstep(0.62, 0.0, r) * (0.55 + 0.45 * n);
        float edge = smoothstep(0.5, 0.42, abs(p.x)) * smoothstep(0.5, 0.4, abs(p.y));
        vec3 col = mix(vec3(0.43,0.3,1.0), vec3(1.0,0.86,0.7), smoothstep(0.35, 0.0, r));
        gl_FragColor = vec4(col * glow * edge * 2.4, uOpacity * glow * edge); }`,
  });
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(ARCH.w * 0.86, ARCH.h * 0.94), portalMat);
  portal.position.set(0, ARCH.y - 0.02, -0.12);
  portal.visible = false;
  extras.add(portal);

  // ---- État
  let timeline = 0;
  let bands: { top: number; bottom: number }[] | null = null;
  // Hauteur approximative de chaque forme (unités scène), pour l'ajuster à la bande libre
  const OBJ_H: Record<SceneId, number> = { hero: 2.8, web: 3.6, ai: 3.2, apps: 3.4, gaming: 3.6, quiet: 1 };
  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  let pointerActive = false;
  let time = 0;
  let raf = 0;
  let last = performance.now();
  const cur = { x: 0, y: 0, z: 6.6, scale: 1 };

  const m = new THREE.Matrix4();
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const cursorWorld = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ray = new THREE.Raycaster();

  function lerpTargets(a: ShapeTarget, b: ShapeTarget, t: number, out: { a: ShapeTarget; b: ShapeTarget; t: number }) {
    out.a = a; out.b = b; out.t = t;
  }
  const mix = { a: shapes.hero, b: shapes.hero, t: 0 };

  function updateShards() {
    const idx = Math.min(Math.floor(timeline), SCENES.length - 2);
    const frac = timeline - idx;
    lerpTargets(shapes[SCENES[idx]], shapes[SCENES[idx + 1]], frac, mix);
    const { a, b, t } = mix;
    const transit = t > 0.001 && t < 0.999;

    // Curseur projeté sur le plan de la matière (repoussement local)
    let push = false;
    if (pointerActive && !reduced) {
      ray.setFromCamera(pointer, camera);
      if (ray.ray.intersectPlane(plane, cursorWorld)) {
        world.worldToLocal(cursorWorld);
        push = true;
      }
    }

    for (let i = 0; i < N; i++) {
      const seed = seeds[i];
      // Décalage par éclat : la transformation parcourt la matière comme une vague
      const lt = ease(clamp01((t - seed * 0.4) / 0.6));
      const i3 = i * 3, i4 = i * 4;
      p.set(
        a.pos[i3] + (b.pos[i3] - a.pos[i3]) * lt,
        a.pos[i3 + 1] + (b.pos[i3 + 1] - a.pos[i3 + 1]) * lt,
        a.pos[i3 + 2] + (b.pos[i3 + 2] - a.pos[i3 + 2]) * lt,
      );
      if (transit) {
        // Arc de vol pendant la transition
        const arc = Math.sin(lt * Math.PI);
        p.y += arc * (0.25 + seed * 0.5);
        p.z += arc * (seed - 0.5) * 1.2;
      }
      if (!reduced) {
        // Respiration : léger flottement individuel
        const ph = seed * 6.283;
        p.x += Math.sin(time * 0.6 + ph) * 0.012;
        p.y += Math.cos(time * 0.5 + ph * 1.3) * 0.016;
      }
      if (push) {
        tmp.subVectors(p, cursorWorld);
        tmp.z = 0;
        const d = tmp.length();
        if (d < 0.55 && d > 0.0001) {
          const f = 1 - d / 0.55;
          tmp.multiplyScalar((f * f * 0.22) / d);
          p.add(tmp);
          p.z += f * 0.2;
        }
      }
      qa.set(a.quat[i4], a.quat[i4 + 1], a.quat[i4 + 2], a.quat[i4 + 3]);
      qb.set(b.quat[i4], b.quat[i4 + 1], b.quat[i4 + 2], b.quat[i4 + 3]);
      q.copy(qa).slerp(qb, lt);
      if (transit) {
        // Vrille pendant le vol
        const spin = Math.sin(lt * Math.PI) * (1 + seed * 2);
        qa.setFromAxisAngle(tmp.set(seed - 0.5, 1, 0).normalize(), spin);
        q.multiply(qa);
      }
      const sc = a.scale[i] + (b.scale[i] - a.scale[i]) * lt;
      s.set(sc, sc, sc);
      m.compose(p, q, s);
      shards.setMatrixAt(i, m);
    }
    shards.instanceMatrix.needsUpdate = true;
  }

  function weight(id: SceneId) {
    const i = SCENES.indexOf(id);
    return clamp01(1 - Math.abs(timeline - i));
  }

  function updateExtras() {
    const w = weight("web");
    const ws = smooth(w);
    webPanes.forEach(({ g, screen, glass }, i) => {
      g.visible = w > 0.02;
      (screen.material as THREE.MeshBasicMaterial).opacity = clamp01((ws - 0.5) / 0.5) * 0.95;
      (glass.material as THREE.MeshPhysicalMaterial).opacity = ws * 0.14;
      g.scale.setScalar(0.92 + ws * 0.08);
      g.position.y = WEB_PANES[i].y + Math.sin(time * 0.7 + i) * 0.02;
    });

    const ai = weight("ai");
    const ais = smooth(ai);
    core.visible = synapses.visible = ai > 0.02;
    coreMat.uniforms.uOpacity.value = ais;
    core.scale.setScalar(0.4 + ais * 0.6);
    synMat.opacity = ais * 0.55;
    synapses.rotation.y = time * 0.15;
    synapses.rotation.x = Math.sin(time * 0.2) * 0.3;

    const ap = weight("apps");
    const aps = smooth(ap);
    phoneScreens.forEach((mesh, i) => {
      mesh.visible = ap > 0.02;
      (mesh.material as THREE.MeshBasicMaterial).opacity = clamp01((aps - 0.4) / 0.6);
      mesh.position.y = PHONES[i].y + Math.sin(time * 0.6 + i * 2) * 0.02;
    });

    const gm = weight("gaming");
    const gms = smooth(gm);
    portal.visible = gm > 0.02;
    portalMat.uniforms.uOpacity.value = gms;
    accentLight.position.set(0, ARCH.y, -0.6);
    accentLight.color.set(0x8a6bff);
    accentLight.intensity = gms * 18;
    fog.density = 0.045 + gms * 0.02;

    // Teinte des éclats : mélange des accents des deux scènes voisines
    const idx = Math.min(Math.floor(timeline), SCENES.length - 2);
    const frac = smooth(timeline - idx);
    uAccent.value.copy(ACCENTS[SCENES[idx]]).lerp(ACCENTS[SCENES[idx + 1]], frac);
    const mixA = SCENES[idx] === "hero" ? 0.06 : 0.22;
    const mixB = SCENES[idx + 1] === "hero" ? 0.06 : 0.22;
    uAccentMix.value = mixA + (mixB - mixA) * frac;
  }

  function updateFraming(dt: number) {
    const idx = Math.min(Math.floor(timeline), SCENES.length - 2);
    const frac = smooth(timeline - idx);
    const fa = FRAMING[SCENES[idx]], fb = FRAMING[SCENES[idx + 1]];
    const tz = fa.z + (fb.z - fa.z) * frac;
    let tx: number, ty: number, ts: number;
    if (bands) {
      // Téléphone : la forme est centrée dans la bande libre et réduite pour y tenir
      const visible = 2 * tz * Math.tan((camera.fov * Math.PI) / 360); // hauteur visible à la profondeur de la matière
      const place = (id: SceneId, b: { top: number; bottom: number }) => {
        const h = Math.max(0.12, b.bottom - b.top);
        const cy = (0.5 - (b.top + b.bottom) / 2) * visible;
        const fit = (h * visible * 0.92) / OBJ_H[id];
        return { y: cy, s: Math.min(FRAMING[id].ms * 1.4, fit) };
      };
      const pa = place(SCENES[idx], bands[Math.min(idx, bands.length - 1)]);
      const pb = place(SCENES[idx + 1], bands[Math.min(idx + 1, bands.length - 1)]);
      tx = fa.mx + (fb.mx - fa.mx) * frac;
      ty = pa.y + (pb.y - pa.y) * frac;
      ts = pa.s + (pb.s - pa.s) * frac;
    } else {
      tx = fa.x + (fb.x - fa.x) * frac;
      ty = fa.y + (fb.y - fa.y) * frac;
      ts = fa.s + (fb.s - fa.s) * frac;
    }
    const k = reduced ? 1 : 1 - Math.exp(-dt * 6);
    cur.x += (tx - cur.x) * k;
    cur.y += (ty - cur.y) * k;
    cur.z += (tz - cur.z) * k;
    cur.scale += (ts - cur.scale) * k;
    world.position.set(cur.x, cur.y, 0);
    world.scale.setScalar(cur.scale);
    camera.position.z = cur.z;
    // Parallaxe curseur : la matière pivote doucement vers le pointeur
    pointer.lerp(pointerTarget, reduced ? 1 : 1 - Math.exp(-dt * 4));
    rig.rotation.y = pointer.x * 0.14;
    rig.rotation.x = -pointer.y * 0.1;
    world.rotation.y = Math.sin(time * 0.12) * 0.06;
  }

  function frame(dt: number) {
    time += dt;
    uTime.value = time;
    updateFraming(dt);
    updateShards();
    updateExtras();
    renderer.render(scene, camera);
  }

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(() => { resize(); if (reduced) renderOnce(); });
  ro.observe(host);

  function loop() {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    frame(dt);
    raf = requestAnimationFrame(loop);
  }
  function renderOnce() {
    frame(1 / 60);
  }
  function start() {
    if (raf || reduced) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const onLost = (e: Event) => { e.preventDefault(); stop(); host.dataset.lost = "true"; };
  renderer.domElement.addEventListener("webglcontextlost", onLost);

  return {
    setTimeline(t) {
      timeline = Math.max(0, Math.min(SCENES.length - 1, t));
      if (reduced) renderOnce();
    },
    setPointer(x, y, active) {
      pointerTarget.set(x, y);
      pointerActive = active;
    },
    setBands(b) { bands = b; },
    start,
    stop,
    renderOnce,
    dispose() {
      stop();
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      webPanes.forEach(({ screen }) => (screen.material as THREE.MeshBasicMaterial).map?.dispose());
      phoneScreens.forEach((mesh) => (mesh.material as THREE.MeshBasicMaterial).map?.dispose());
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
