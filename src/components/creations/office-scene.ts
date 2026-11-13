/**
 * Bureau des agents — la scène 3D (three.js pur, sans React).
 *
 * Un plateau de nuit : un poste par agent (bureau, écran, silhouette, anneau d'état), et au bout de
 * l'allée le CRM, vers lequel partent des impulsions de lumière quand un agent travaille.
 * Le « faisceau électrique » du style Nuit court autour du poste d'un agent au travail.
 *
 * Ce module est chargé à la demande. Il se met en pause hors écran et quand l'onglet est caché,
 * et ne dessine qu'à la demande si l'appareil demande de réduire les animations.
 * Le même fichier sert à la démo du site fdastudio.fr : le garder sans dépendance au CRM.
 */
import * as THREE from 'three';

export type DeskActivity = 'working' | 'idle' | 'error' | 'never';

export interface OfficeDesk {
  id: string;
  col: number;
  row: number;
}

export interface OfficeSceneOptions {
  desks: OfficeDesk[];
  /** Emplacement du CRM dans la grille. */
  core: { col: number; row: number };
  cols: number;
  rows: number;
  reducedMotion?: boolean;
  onSelect?: (id: string | null) => void;
  onHover?: (id: string | null) => void;
  /** Appelé après chaque image : le bon moment pour placer les étiquettes HTML. */
  onFrame?: () => void;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface OfficeScene {
  setActivity(id: string, activity: DeskActivity): void;
  setSelected(id: string | null): void;
  /** Fige la scène (bouton pause du site, démo masquée) ; elle reste affichée. */
  setPaused(paused: boolean): void;
  /** Position à l'écran (pixels CSS, relative au canvas) du point d'ancrage de l'étiquette d'un poste. */
  anchor(id: string): ScreenPoint | null;
  coreAnchor(): ScreenPoint;
  resize(): void;
  dispose(): void;
}

const BLUE = new THREE.Color('#2f5bff');
const BLUE_LIGHT = new THREE.Color('#93a8ff');
const AMBER = new THREE.Color('#f2a93b');
const SILVER = new THREE.Color('#a7abb2');

const SPACING_X = 3.3;
const SPACING_Z = 4.4;

const SCREEN_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const SCREEN_FRAG = /* glsl */ `
  precision mediump float;
  uniform float uTime; uniform float uActive; uniform float uSeed; uniform vec3 uColor;
  varying vec2 vUv;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float rows = 8.0;
    float y = (1.0 - vUv.y) * rows + uTime * 0.9 * uActive + uSeed * 10.0;
    float row = floor(y); float fy = fract(y);
    float len = 0.22 + 0.6 * hash(row + uSeed * 17.0);
    float indent = 0.08 + 0.12 * step(0.6, hash(row * 1.7 + uSeed));
    float bar = step(indent, vUv.x) * step(vUv.x, indent + len) * smoothstep(0.22, 0.34, fy) * smoothstep(0.78, 0.66, fy);
    float strong = step(0.8, hash(row * 3.1 + uSeed * 5.0));
    vec3 col = uColor * 0.07 + uColor * bar * (0.5 + 0.9 * strong);
    col *= mix(0.22, 1.25, uActive);
    float edge = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x) * smoothstep(0.0, 0.07, vUv.y) * smoothstep(1.0, 0.93, vUv.y);
    gl_FragColor = vec4(col * edge + uColor * 0.02, 1.0);
  }
`;

/** Contour du poste au sol : trait fin permanent + faisceau qui tourne quand l'agent travaille. */
const PAD_FRAG = /* glsl */ `
  precision mediump float;
  uniform float uTime; uniform float uActive; uniform float uSelected; uniform float uHover; uniform float uError;
  uniform vec2 uSize; uniform vec3 uBeam; uniform vec3 uAlert;
  varying vec2 vUv;
  float sdRoundBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRoundBox(p, uSize * 0.5 - 0.22, 0.34);
    float line = 1.0 - smoothstep(0.0, 0.035, abs(d));
    float glow = exp(-abs(d) * 9.0);
    float angle = atan(p.y / uSize.y, p.x / uSize.x) / 6.2831853 + 0.5;
    float sweep = fract(angle - uTime * 0.22);
    float head = pow(sweep, 7.0);
    vec3 beamCol = mix(uBeam, vec3(0.86, 0.9, 1.0), pow(sweep, 22.0));
    vec3 rest = vec3(0.62, 0.66, 0.74);
    vec3 col = rest * line * (0.3 + 0.5 * uSelected + 0.25 * uHover);
    col += uBeam * line * 0.55 * uActive;
    col += beamCol * (line * 1.6 + glow * 0.55) * head * uActive;
    col += beamCol * glow * 0.06 * uActive;
    col += uAlert * (line * 0.9 + glow * 0.3) * uError * (0.65 + 0.35 * sin(uTime * 2.4));
    float fill = (1.0 - smoothstep(-0.02, 0.0, d)) * (0.035 * uActive + 0.05 * uSelected);
    col += uBeam * fill;
    float a = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
    gl_FragColor = vec4(col, a);
  }
`;

const FLOOR_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec2 uHalf;
  varying vec2 vUv;
  varying vec3 vWorld;
  float grid(vec2 p, float step) { vec2 g = abs(fract(p / step - 0.5) - 0.5) / fwidth(p / step); return 1.0 - min(min(g.x, g.y), 1.0); }
  void main() {
    vec2 p = vWorld.xz;
    float g = grid(p, 1.1) * 0.05 + grid(p, 4.4) * 0.05;
    vec2 q = abs(p) / uHalf;
    float fade = (1.0 - smoothstep(0.62, 1.0, q.x)) * (1.0 - smoothstep(0.62, 1.0, q.y));
    vec3 col = vec3(0.045, 0.055, 0.085) + vec3(0.55, 0.62, 0.9) * g;
    gl_FragColor = vec4(col, fade * 0.92);
  }
`;
const FLOOR_VERT = /* glsl */ `
  varying vec2 vUv; varying vec3 vWorld;
  void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`;

function glowTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Desk {
  id: string;
  col: number;
  row: number;
  group: THREE.Group;
  figure: THREE.Group;
  head: THREE.Mesh;
  halo: THREE.Mesh;
  haloMat: THREE.MeshBasicMaterial;
  screenMat: THREE.ShaderMaterial;
  padMat: THREE.ShaderMaterial;
  glowMat: THREE.MeshBasicMaterial;
  bodyMat: THREE.MeshLambertMaterial;
  hit: THREE.Mesh;
  trace: THREE.Line;
  pulses: THREE.Sprite[];
  path: THREE.Vector3[];
  pathLength: number;
  target: DeskActivity;
  active: number; // 0 → 1, lissé
  error: number;
  presence: number; // 0 = jamais passé (silhouette estompée)
  seed: number;
}

/** Vrai si le navigateur dessine le WebGL sans carte graphique (rendu logiciel, très lent). */
function softwareRendering(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl');
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(name);
  } catch {
    return false;
  }
}

export function createOfficeScene(canvas: HTMLCanvasElement, opts: OfficeSceneOptions): OfficeScene {
  // Sans carte graphique : pas de lissage, et on part directement de la qualité la plus légère.
  const software = softwareRendering();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !software && (window.devicePixelRatio || 1) < 2, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xa9b8ff, 0x0a0c14, 1.5));
  const key = new THREE.DirectionalLight(0xe6ebff, 2.4);
  key.position.set(-5, 12, 9);
  scene.add(key);
  // Contre-jour bleu : détache les silhouettes du sol.
  const rim = new THREE.DirectionalLight(0x5f82ff, 1.6);
  rim.position.set(8, 5, -9);
  scene.add(rim);

  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(o: T): T => {
    disposables.push(o);
    return o;
  };
  const glow = track(glowTexture());

  // ── Sol ────────────────────────────────────────────────────────────────
  const floorMat = track(
    new THREE.ShaderMaterial({ vertexShader: FLOOR_VERT, fragmentShader: FLOOR_FRAG, transparent: true, depthWrite: false, uniforms: { uHalf: { value: new THREE.Vector2(10, 8) } } }),
  );
  const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  floor.renderOrder = -2; // toujours avant les tracés lumineux posés dessus
  scene.add(floor);

  // ── Géométries et matières partagées ───────────────────────────────────
  const matDesk = track(new THREE.MeshLambertMaterial({ color: 0x2a3040 }));
  const matLeg = track(new THREE.MeshLambertMaterial({ color: 0x1a1e2a }));
  const matBezel = track(new THREE.MeshLambertMaterial({ color: 0x12151d }));
  const geoTop = track(new THREE.BoxGeometry(1.9, 0.07, 0.95));
  const geoLeg = track(new THREE.BoxGeometry(0.07, 0.72, 0.8));
  const geoBezel = track(new THREE.BoxGeometry(1.3, 0.8, 0.05));
  const geoScreen = track(new THREE.PlaneGeometry(1.22, 0.72));
  const geoStand = track(new THREE.BoxGeometry(0.1, 0.24, 0.06));
  const geoBody = track(new THREE.CapsuleGeometry(0.25, 0.42, 6, 16));
  const geoHead = track(new THREE.SphereGeometry(0.19, 24, 18));
  const geoStool = track(new THREE.CylinderGeometry(0.2, 0.24, 0.42, 20));
  const geoHalo = track(new THREE.TorusGeometry(0.27, 0.014, 8, 48));
  const geoPad = track(new THREE.PlaneGeometry(1, 1));
  const geoHit = track(new THREE.BoxGeometry(2.5, 2.1, 2.9));
  const matHit = track(new THREE.MeshBasicMaterial({ visible: false }));
  const padSize = new THREE.Vector2(2.9, 3.3);

  const desks: Desk[] = opts.desks.map((d, i) => {
    const group = new THREE.Group();
    const top = new THREE.Mesh(geoTop, matDesk);
    top.position.set(0, 0.74, -0.35);
    const legL = new THREE.Mesh(geoLeg, matLeg);
    legL.position.set(-0.86, 0.36, -0.35);
    const legR = legL.clone();
    legR.position.x = 0.86;
    const stand = new THREE.Mesh(geoStand, matBezel);
    stand.position.set(0, 0.9, -0.62);
    const bezel = new THREE.Mesh(geoBezel, matBezel);
    bezel.position.set(0, 1.38, -0.6);
    const screenMat = track(
      new THREE.ShaderMaterial({
        vertexShader: SCREEN_VERT,
        fragmentShader: SCREEN_FRAG,
        uniforms: { uTime: { value: 0 }, uActive: { value: 0 }, uSeed: { value: i * 1.37 + 0.3 }, uColor: { value: BLUE_LIGHT.clone() } },
      }),
    );
    const screen = new THREE.Mesh(geoScreen, screenMat);
    screen.position.set(0, 1.38, -0.572);

    const figure = new THREE.Group();
    const bodyMat = track(new THREE.MeshLambertMaterial({ color: 0x7d8494, emissive: 0x2f5bff, emissiveIntensity: 0, transparent: true }));
    const body = new THREE.Mesh(geoBody, bodyMat);
    body.position.y = 0.86;
    const head = new THREE.Mesh(geoHead, bodyMat);
    head.position.y = 1.44;
    const stool = new THREE.Mesh(geoStool, matLeg);
    stool.position.y = 0.21;
    const haloMat = track(new THREE.MeshBasicMaterial({ color: SILVER.clone(), transparent: true, opacity: 0.4, depthWrite: false }));
    const halo = new THREE.Mesh(geoHalo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.78;
    figure.add(body, head, halo);
    figure.position.set(0, 0, 0.62);

    const padMat = track(
      new THREE.ShaderMaterial({
        vertexShader: SCREEN_VERT,
        fragmentShader: PAD_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: i * 1.9 },
          uActive: { value: 0 },
          uSelected: { value: 0 },
          uHover: { value: 0 },
          uError: { value: 0 },
          uSize: { value: padSize },
          uBeam: { value: BLUE.clone().lerp(BLUE_LIGHT, 0.35) },
          uAlert: { value: AMBER.clone() },
        },
      }),
    );
    const pad = new THREE.Mesh(geoPad, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.scale.set(padSize.x, padSize.y, 1);
    pad.position.set(0, 0.012, 0.1);
    pad.renderOrder = 1;

    // Lueur de l'écran sur le poste : un disque lumineux posé au sol (pas une vraie lumière,
    // qui coûterait un calcul par pixel sur toutes les surfaces de la scène).
    const glowMat = track(new THREE.MeshBasicMaterial({ map: glow, color: 0x3f66ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    const deskGlow = new THREE.Mesh(geoPad, glowMat);
    deskGlow.rotation.x = -Math.PI / 2;
    deskGlow.scale.set(4.4, 4.4, 1);
    deskGlow.position.set(0, 0.006, 0.2);
    deskGlow.renderOrder = 0;

    const hit = new THREE.Mesh(geoHit, matHit);
    hit.position.set(0, 1.05, 0.1);
    hit.userData.id = d.id;

    group.add(top, legL, legR, stand, bezel, screen, stool, figure, pad, deskGlow, hit);
    scene.add(group);

    const traceMat = track(new THREE.LineBasicMaterial({ color: 0x5b6b9c, transparent: true, opacity: 0.28 }));
    const trace = new THREE.Line(track(new THREE.BufferGeometry()), traceMat);
    trace.renderOrder = 1;
    scene.add(trace);
    const pulses = [0, 1].map(() => {
      const m = track(new THREE.SpriteMaterial({ map: glow, color: 0x9db2ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      const s = new THREE.Sprite(m);
      s.scale.setScalar(0.5);
      s.renderOrder = 2;
      scene.add(s);
      return s;
    });

    return { id: d.id, col: d.col, row: d.row, group, figure, head, halo, haloMat, screenMat, padMat, glowMat, bodyMat, hit, trace, pulses, path: [], pathLength: 1, target: 'never', active: 0, error: 0, presence: 0, seed: i * 0.77 };
  });

  // ── Le CRM, au bout de l'allée ─────────────────────────────────────────
  const core = new THREE.Group();
  const coreMat = track(new THREE.MeshLambertMaterial({ color: 0x0b0f1f, emissive: 0x14267a, emissiveIntensity: 0.2 }));
  const coreBody = new THREE.Mesh(track(new THREE.BoxGeometry(0.95, 2.3, 0.95)), coreMat);
  coreBody.position.y = 1.15;
  const coreEdges = new THREE.LineSegments(track(new THREE.EdgesGeometry(coreBody.geometry)), track(new THREE.LineBasicMaterial({ color: 0x93a8ff, transparent: true, opacity: 0.75 })));
  coreEdges.position.copy(coreBody.position);
  const coreRingMat = track(new THREE.MeshBasicMaterial({ color: 0x93a8ff, transparent: true, opacity: 0.85, depthWrite: false }));
  const coreRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.72, 0.012, 8, 64)), coreRingMat);
  coreRing.rotation.x = Math.PI / 2;
  coreRing.position.y = 2.62;
  const coreRing2 = coreRing.clone();
  coreRing2.scale.setScalar(0.62);
  coreRing2.position.y = 2.86;
  // Halo posé au sol sous le CRM (un disque, pas un sprite : il ne coupe pas le volume).
  const coreGlowMat = track(new THREE.MeshBasicMaterial({ map: glow, color: 0x2f5bff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  const coreGlow = new THREE.Mesh(geoPad, coreGlowMat);
  coreGlow.rotation.x = -Math.PI / 2;
  coreGlow.scale.set(8.5, 8.5, 1);
  coreGlow.position.y = 0.005;
  coreGlow.renderOrder = 0;
  const corePadMat = track(
    new THREE.ShaderMaterial({
      vertexShader: SCREEN_VERT,
      fragmentShader: PAD_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uActive: { value: 1 },
        uSelected: { value: 0.4 },
        uHover: { value: 0 },
        uError: { value: 0 },
        uSize: { value: new THREE.Vector2(2.9, 2.9) },
        uBeam: { value: BLUE.clone().lerp(BLUE_LIGHT, 0.35) },
        uAlert: { value: AMBER.clone() },
      },
    }),
  );
  const corePad = new THREE.Mesh(geoPad, corePadMat);
  corePad.rotation.x = -Math.PI / 2;
  corePad.scale.set(2.9, 2.9, 1);
  corePad.position.y = 0.012;
  corePad.renderOrder = 1;
  core.add(coreBody, coreEdges, coreRing, coreRing2, coreGlow, corePad);
  scene.add(core);
  let coreEnergy = 0;

  // ── Disposition (paysage : colonnes en largeur ; portrait : grille pivotée) ──
  let portrait = false;
  const place = (col: number, row: number, out = new THREE.Vector3()) => {
    if (!portrait) return out.set((col - (opts.cols - 1) / 2) * SPACING_X, 0, (row - (opts.rows - 1) / 2) * SPACING_Z);
    // En portrait : deux colonnes, les rangées deviennent des colonnes.
    return out.set((row - (opts.rows - 1) / 2) * SPACING_X * 1.12, 0, (col - (opts.cols - 1) / 2) * SPACING_Z * 0.8);
  };
  const corePos = new THREE.Vector3();

  function layout() {
    place(opts.core.col, opts.core.row, corePos);
    core.position.copy(corePos);
    const halfX = ((portrait ? opts.rows : opts.cols) * SPACING_X) / 2 + 5;
    const halfZ = ((portrait ? opts.cols : opts.rows) * SPACING_Z) / 2 + 5;
    floor.scale.set(halfX * 2, halfZ * 2, 1);
    floorMat.uniforms.uHalf!.value.set(halfX, halfZ);
    for (const d of desks) {
      place(d.col, d.row, d.group.position);
      // Le tracé au sol : du poste vers l'allée centrale, puis jusqu'au CRM.
      const p = d.group.position;
      const y = 0.02;
      const pts = portrait
        ? [new THREE.Vector3(p.x, y, p.z + 0.1), new THREE.Vector3(0, y, p.z + 0.1), new THREE.Vector3(0, y, corePos.z), new THREE.Vector3(corePos.x, y, corePos.z)]
        : [new THREE.Vector3(p.x, y, p.z + 0.1), new THREE.Vector3(p.x, y, 0), new THREE.Vector3(corePos.x, y, 0), new THREE.Vector3(corePos.x, y, corePos.z)];
      d.path = pts;
      d.pathLength = pts.slice(1).reduce((t, pt, i) => t + pt.distanceTo(pts[i]!), 0);
      d.trace.geometry.setFromPoints(pts);
    }
  }

  const tmp = new THREE.Vector3();
  function along(d: Desk, t: number, out: THREE.Vector3) {
    let dist = t * d.pathLength;
    for (let i = 1; i < d.path.length; i++) {
      const a = d.path[i - 1]!;
      const b = d.path[i]!;
      const seg = a.distanceTo(b);
      if (dist <= seg || i === d.path.length - 1) return out.copy(a).lerp(b, seg ? Math.min(1, dist / seg) : 0);
      dist -= seg;
    }
    return out;
  }

  // ── Caméra : vue plongeante, cadrée sur le plateau quel que soit le format ──
  let width = 1;
  let height = 1;
  function fit() {
    const azimuth = portrait ? 0.24 : 0.34;
    const elevation = portrait ? 0.92 : 0.56;
    const dir = new THREE.Vector3(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
    camera.position.copy(dir.multiplyScalar(60));
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0.6, 0);
    camera.updateMatrixWorld();
    const inv = camera.matrixWorldInverse;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const corners: THREE.Vector3[] = [];
    for (const d of desks) {
      const p = d.group.position;
      corners.push(new THREE.Vector3(p.x - 1.6, 0, p.z - 1.6), new THREE.Vector3(p.x + 1.6, 0, p.z + 1.9), new THREE.Vector3(p.x - 1.6, 0, p.z + 1.9), new THREE.Vector3(p.x + 1.6, 0, p.z - 1.6), new THREE.Vector3(p.x, 2.9, p.z));
    }
    corners.push(new THREE.Vector3(corePos.x - 1.6, 0, corePos.z - 1.6), new THREE.Vector3(corePos.x + 1.6, 0, corePos.z + 1.6), new THREE.Vector3(corePos.x, 3.9, corePos.z));
    for (const c of corners) {
      c.applyMatrix4(inv);
      minX = Math.min(minX, c.x);
      maxX = Math.max(maxX, c.x);
      minY = Math.min(minY, c.y);
      maxY = Math.max(maxY, c.y);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    let halfW = (maxX - minX) / 2;
    let halfH = (maxY - minY) / 2;
    const aspect = width / height;
    if (halfW / halfH > aspect) halfH = halfW / aspect;
    else halfW = halfH * aspect;
    camera.left = cx - halfW;
    camera.right = cx + halfW;
    camera.top = cy + halfH;
    camera.bottom = cy - halfH;
    camera.updateProjectionMatrix();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const nextPortrait = width / height < 0.95;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY[quality]!));
    renderer.setSize(width, height, false);
    if (nextPortrait !== portrait || !desks[0]!.path.length) {
      portrait = nextPortrait;
      layout();
    }
    fit();
    requestRender();
  }

  // ── Sélection au pointeur ──────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: string | null = null;
  let selected: string | null = null;
  const hits = desks.map((d) => d.hit);
  const pick = (e: PointerEvent): string | null => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(hits, false)[0];
    return hit ? (hit.object.userData.id as string) : null;
  };
  const onMove = (e: PointerEvent) => {
    const id = e.pointerType === 'touch' ? null : pick(e);
    if (id !== hovered) {
      hovered = id;
      canvas.style.cursor = id ? 'pointer' : '';
      opts.onHover?.(id);
      requestRender();
    }
  };
  const onLeave = () => {
    if (hovered) {
      hovered = null;
      canvas.style.cursor = '';
      opts.onHover?.(null);
      requestRender();
    }
  };
  let downAt: { x: number; y: number } | null = null;
  const onDown = (e: PointerEvent) => {
    downAt = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: PointerEvent) => {
    // Un glissement (défilement de la page au doigt) n'est pas un clic.
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
    opts.onSelect?.(pick(e));
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);

  // ── Qualité adaptative ─────────────────────────────────────────────────
  // La scène mesure le temps réel entre deux images. Si l'appareil ne suit pas, elle baisse
  // d'abord la finesse du rendu, puis espace ses images pour rendre la main à la page :
  // le défilement reste fluide même sans carte graphique. Elle ne remonte jamais en qualité
  // (pas d'oscillation).
  const QUALITY = [1.5, 1, 0.75, 0.55];
  let quality = software ? QUALITY.length - 1 : 0;
  let minInterval = 0; // 0 = une image à chaque rafraîchissement
  let lastRender = 0;
  let afterRender = false;
  let gap = 16; // moyenne glissante du temps d'une image rendue, en ms
  let samples = 0;
  function govern(now: number) {
    if (afterRender) {
      const g = Math.min(400, now - lastRender);
      gap += (g - gap) * 0.25;
      samples++;
    }
    if (samples < 10) return; // on laisse passer la mise en route (compilation des shaders)
    if (gap > 24) {
      if (quality < QUALITY.length - 1) {
        // Très en retard : on descend directement au plus léger, sans passer par les paliers.
        quality = gap > 55 ? QUALITY.length - 1 : quality + 1;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY[quality]!));
        renderer.setSize(width, height, false);
      } else {
        // Qualité minimale atteinte : on dessine moins souvent (au plus un tiers du temps).
        minInterval = Math.min(280, Math.max(minInterval, Math.round(gap * 3)));
      }
      samples = 4;
      gap = 16;
      // Visible dans l'inspecteur : niveau de qualité retenu et intervalle entre deux images.
      canvas.dataset.quality = `${quality}/${minInterval}`;
    }
  }

  // ── Animation ──────────────────────────────────────────────────────────
  const reduced = Boolean(opts.reducedMotion);
  let lastFrame = performance.now();
  const delta = () => {
    const t = performance.now();
    const dt = (t - lastFrame) / 1000;
    lastFrame = t;
    return dt;
  };
  let time = 0;
  let raf = 0;
  let visible = true;
  let pageVisible = typeof document === 'undefined' || !document.hidden;
  let disposed = false;
  let paused = false;
  let settled = false;
  const color = new THREE.Color();

  function update(dt: number) {
    time += dt;
    const k = reduced ? 1 : 1 - Math.exp(-dt * 4.5);
    let energy = 0;
    settled = true;
    for (const d of desks) {
      const working = d.target === 'working' ? 1 : 0;
      const err = d.target === 'error' ? 1 : 0;
      const present = d.target === 'never' ? 0 : 1;
      d.active += (working - d.active) * k;
      d.error += (err - d.error) * k;
      d.presence += (present - d.presence) * k;
      if (Math.abs(working - d.active) > 0.002 || Math.abs(err - d.error) > 0.002 || Math.abs(present - d.presence) > 0.002) settled = false;
      energy += d.active;

      d.screenMat.uniforms.uTime!.value = time;
      d.screenMat.uniforms.uActive!.value = Math.max(d.active, d.error * 0.55);
      color.copy(BLUE_LIGHT).lerp(AMBER, d.error);
      (d.screenMat.uniforms.uColor!.value as THREE.Color).copy(color);
      d.padMat.uniforms.uTime!.value = time + d.seed * 3;
      d.padMat.uniforms.uActive!.value = d.active;
      d.padMat.uniforms.uError!.value = d.error;
      d.padMat.uniforms.uSelected!.value += ((selected === d.id ? 1 : 0) - d.padMat.uniforms.uSelected!.value) * (reduced ? 1 : Math.min(1, dt * 10));
      d.padMat.uniforms.uHover!.value = hovered === d.id ? 1 : 0;
      d.glowMat.opacity = d.active * (0.5 + (reduced ? 0 : 0.05 * Math.sin(time * 5 + d.seed * 9))) + d.error * 0.25;
      d.glowMat.color.copy(color);
      d.bodyMat.emissiveIntensity = 0.22 * d.active;

      // Silhouette : estompée tant que l'agent n'est jamais passé ; penchée vers l'écran au travail.
      d.bodyMat.opacity = 0.28 + 0.72 * d.presence;
      const breathe = reduced ? 0 : Math.sin(time * 1.1 + d.seed * 5) * 0.012;
      const typing = reduced ? 0 : Math.sin(time * 7.5 + d.seed * 11) * 0.012 * d.active;
      d.figure.position.y = breathe + typing;
      d.figure.rotation.x = -0.1 * d.active;
      d.head.rotation.y = reduced ? 0 : Math.sin(time * 0.5 + d.seed * 7) * 0.25 * (1 - d.active);

      // Anneau d'état : bleu et vif au travail, argent discret au repos, ambre en erreur.
      color.copy(SILVER).lerp(BLUE_LIGHT, d.active).lerp(AMBER, d.error);
      d.haloMat.color.copy(color);
      d.haloMat.opacity = (0.22 + 0.7 * Math.max(d.active, d.error)) * d.presence;
      d.halo.position.y = 1.78 + (reduced ? 0 : Math.sin(time * 1.6 + d.seed * 4) * 0.025);
      d.halo.scale.setScalar(1 + 0.12 * d.active * (reduced ? 0 : Math.sin(time * 3.2 + d.seed)));

      // Impulsions vers le CRM.
      (d.trace.material as THREE.LineBasicMaterial).opacity = 0.3 + 0.5 * d.active;
      d.pulses.forEach((s, i) => {
        const t = reduced ? 0.5 + i * 0.25 : (time * 0.22 + d.seed + i * 0.5) % 1;
        along(d, t, tmp);
        s.position.set(tmp.x, 0.09, tmp.z);
        (s.material as THREE.SpriteMaterial).opacity = d.active * Math.sin(Math.PI * t) * 0.95;
      });
    }
    coreEnergy += (Math.min(1, energy / 2) - coreEnergy) * k;
    coreMat.emissiveIntensity = 0.16 + 0.34 * coreEnergy + (reduced ? 0 : 0.06 * Math.sin(time * 1.4));
    coreGlowMat.opacity = 0.4 + 0.45 * coreEnergy;
    if (!reduced) {
      coreRing.rotation.z = time * 0.35;
      coreRing2.rotation.z = -time * 0.5;
      coreRing.position.y = 2.62 + Math.sin(time * 1.2) * 0.04;
      coreRing2.position.y = 2.86 + Math.sin(time * 1.2 + 1) * 0.05;
    }
    corePadMat.uniforms.uTime!.value = time * 0.7;
    corePadMat.uniforms.uActive!.value = 0.35 + 0.65 * coreEnergy;
  }

  function frame(now: number) {
    raf = 0;
    if (disposed) return;
    govern(now);
    afterRender = false;
    if (minInterval && now - lastRender < minInterval) {
      // Image sautée : la page reste réactive entre deux rendus de la scène.
      if (visible && pageVisible && !paused && (!reduced || !settled)) raf = requestAnimationFrame(frame);
      return;
    }
    update(Math.min(delta(), minInterval ? 0.3 : 0.05));
    renderer.render(scene, camera);
    lastRender = now;
    afterRender = true;
    opts.onFrame?.();
    // Animations réduites : on redessine seulement jusqu'à ce que l'état soit stable.
    if (visible && pageVisible && !paused && (!reduced || !settled)) raf = requestAnimationFrame(frame);
  }
  function requestRender() {
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  }

  const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { visible = Boolean(e?.isIntersecting); if (visible) { delta(); afterRender = false; requestRender(); } }, { rootMargin: '80px' }) : null;
  io?.observe(canvas);
  const onVisibility = () => {
    pageVisible = !document.hidden;
    if (pageVisible) {
      delta();
      afterRender = false;
      requestRender();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
  ro?.observe(canvas);

  resize();

  const anchorVec = new THREE.Vector3();
  const toScreen = (v: THREE.Vector3): ScreenPoint => {
    v.project(camera);
    return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height };
  };

  return {
    setActivity(id, activity) {
      const d = desks.find((x) => x.id === id);
      if (!d || d.target === activity) return;
      d.target = activity;
      requestRender();
    },
    setSelected(id) {
      selected = id;
      requestRender();
    },
    setPaused(value) {
      if (paused === value) return;
      paused = value;
      if (!paused) {
        delta();
        afterRender = false;
        requestRender();
      }
    },
    anchor(id) {
      const d = desks.find((x) => x.id === id);
      if (!d) return null;
      return toScreen(anchorVec.set(d.group.position.x, 2.15, d.group.position.z + 0.62));
    },
    coreAnchor() {
      return toScreen(anchorVec.set(corePos.x, 3.2, corePos.z));
    },
    resize,
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      disposables.forEach((o) => o.dispose());
      renderer.dispose();
    },
  };
}
