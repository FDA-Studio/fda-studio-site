/**
 * Formes cibles de la « matière » FDA : chaque scène est une liste de N éclats
 * (position, orientation, taille) que le moteur interpole au scroll.
 * Les formes planes sont échantillonnées depuis un dessin 2D (canvas), ce qui permet
 * de réutiliser le tracé exact du monogramme et de dessiner des interfaces lisibles.
 */

export type SceneId = "hero" | "web" | "ai" | "apps" | "gaming" | "quiet";

export interface ShapeTarget {
  pos: Float32Array; // N*3
  quat: Float32Array; // N*4
  scale: Float32Array; // N
}

/** Panneaux « navigateur » de la scène web, réutilisés par le moteur pour les vitres. */
export const WEB_PANES = [
  { x: -0.7, y: 0.3, z: 0.5, ry: 0, w: 2.7, h: 1.75, share: 0.26 },
  { x: 1.1, y: -0.75, z: -0.5, ry: 0, w: 2.2, h: 1.45, share: 0.16 },
  { x: 1.6, y: 1.15, z: -1.5, ry: 0, w: 1.8, h: 1.15, share: 0.1 },
] as const;

/** Téléphones de la scène applications : les éclats dessinent le cadre, l'écran est une texture. */
export const PHONES = [
  { x: -0.7, y: 0.05, z: 0.25, ry: 0.32, w: 1.42, h: 2.95 },
  { x: 0.95, y: -0.2, z: -0.55, ry: -0.26, w: 1.42, h: 2.95 },
] as const;

/** Arche de la scène gaming (la porte de Door Knight). */
export const ARCH = { w: 2.1, h: 3.1, y: 0.05 } as const;

const SYMBOL = "M0 0H48V24H24V48H40V72H24V120H0Z M72 -1.5A61.5 61.5 0 0 1 72 121.5Z M98 28L112 80H84Z";

type Rng = () => number;
const mulberry = (seed: number): Rng => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Points remplis d'un dessin 2D, en coordonnées normalisées (u ∈ [-0.5, 0.5], v vers le haut). */
function sample2D(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, n: number, rng: Rng): [number, number][] {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  draw(ctx);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: number[] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 127) filled.push(x, y);
  const count = filled.length / 2;
  const out: [number, number][] = [];
  if (!count) return out;
  // Tirage stratifié : on parcourt les pixels remplis à pas régulier, avec un léger décalage aléatoire,
  // pour une densité homogène (pas d'amas ni de trous).
  const step = count / n;
  for (let i = 0; i < n; i++) {
    const k = Math.min(count - 1, Math.floor(i * step + rng() * step));
    out.push([(filled[k * 2] + rng()) / w - 0.5, 0.5 - (filled[k * 2 + 1] + rng()) / h]);
  }
  // Mélange : sinon les éclats voisins dans la liste seraient voisins dans l'espace
  // et les transitions décaleraient la forme par bandes.
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const roundRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
};

// Quaternion qui oriente l'axe Z local (face de l'éclat) vers la direction (nx, ny, nz), avec une rotation propre.
function faceQuat(out: Float32Array, i: number, nx: number, ny: number, nz: number, spin: number) {
  // Rotation de (0,0,1) vers n
  const d = nz;
  let qx: number, qy: number, qz: number, qw: number;
  if (d < -0.9999) {
    qx = 0; qy = 1; qz = 0; qw = 0;
  } else {
    qx = -ny; qy = nx; qz = 0; qw = 1 + d;
    const l = Math.hypot(qx, qy, qz, qw);
    qx /= l; qy /= l; qz /= l; qw /= l;
  }
  // Rotation propre autour de Z local
  const s = Math.sin(spin / 2), c = Math.cos(spin / 2);
  out[i * 4] = qx * c + qy * s;
  out[i * 4 + 1] = qy * c - qx * s;
  out[i * 4 + 2] = qz * c + qw * s;
  out[i * 4 + 3] = qw * c - qz * s;
}

function alloc(n: number): ShapeTarget {
  return { pos: new Float32Array(n * 3), quat: new Float32Array(n * 4), scale: new Float32Array(n) };
}

/** Place des points 2D sur un plan orienté (rotation Y) dans l'espace. */
function placeOnPlane(t: ShapeTarget, start: number, pts: [number, number][], p: { x: number; y: number; z: number; ry: number; w: number; h: number }, size: number, rng: Rng, depth = 0.04) {
  const cs = Math.cos(p.ry), sn = Math.sin(p.ry);
  pts.forEach(([u, v], k) => {
    const i = start + k;
    const lx = u * p.w, ly = v * p.h, lz = (rng() - 0.5) * depth;
    t.pos[i * 3] = p.x + lx * cs + lz * sn;
    t.pos[i * 3 + 1] = p.y + ly;
    t.pos[i * 3 + 2] = p.z - lx * sn + lz * cs;
    faceQuat(t.quat, i, sn, 0, cs, (rng() - 0.5) * 0.5);
    t.scale[i] = size * (0.75 + rng() * 0.5);
  });
}

export function buildShapes(n: number): Record<SceneId, ShapeTarget> {
  const rng = mulberry(7);
  // Taille d'éclat compensée selon le nombre d'instances (moins d'éclats = éclats plus grands)
  const k = Math.sqrt(2400 / n);

  // ---- Monogramme : le symbole exact du logo, extrudé en profondeur
  const hero = alloc(n);
  {
    const W = 268, H = 248;
    const pts = sample2D(W, H, (c) => {
      c.setTransform(2, 0, 0, 2, 0, 4);
      c.fill(new Path2D(SYMBOL), "evenodd");
    }, n, rng);
    const width = 3.0, height = width * (H / W);
    pts.forEach(([u, v], i) => {
      hero.pos[i * 3] = u * width;
      hero.pos[i * 3 + 1] = v * height;
      hero.pos[i * 3 + 2] = (rng() - 0.5) * 0.42;
      faceQuat(hero.quat, i, (rng() - 0.5) * 0.25, (rng() - 0.5) * 0.25, 1, (rng() - 0.5) * 0.6);
      hero.scale[i] = 0.058 * k * (0.7 + rng() * 0.6);
    });
  }

  // ---- Web : trois fenêtres de navigateur en perspective. Les éclats dessinent les cadres ;
  // la page elle-même est un écran (texture) côté moteur. Le reste de la matière flotte en poussière autour.
  const web = alloc(n);
  {
    let start = 0;
    WEB_PANES.forEach((pane) => {
      const count = Math.round(n * pane.share);
      const W = 270, H = Math.round(270 * (pane.h / pane.w));
      const pts = sample2D(W, H, (c) => {
        c.lineWidth = 6;
        roundRect(c, 3, 3, W - 6, H - 6, 12);
        c.stroke();
        c.fillRect(3, 26, W - 6, 4); // bas de la barre d'adresse
        [16, 30, 44].forEach((x) => { c.beginPath(); c.arc(x, 14, 4, 0, Math.PI * 2); c.fill(); });
        roundRect(c, 70, 9, 130, 9, 4);
        c.fill();
      }, count, rng);
      placeOnPlane(web, start, pts, pane, 0.05 * k, rng, 0.03);
      start += count;
    });
    for (let i = start; i < n; i++) {
      // Poussière : nuage aplati derrière et autour des fenêtres
      const th = rng() * Math.PI * 2;
      const r = 1.2 + Math.pow(rng(), 0.6) * 2.4;
      web.pos[i * 3] = 0.5 + Math.cos(th) * r;
      web.pos[i * 3 + 1] = 0.2 + Math.sin(th) * r * 0.65;
      web.pos[i * 3 + 2] = -4.5 + Math.pow(rng(), 1.6) * 3.6;
      faceQuat(web.quat, i, (rng() - 0.5) * 0.6, (rng() - 0.5) * 0.6, 1, rng() * Math.PI);
      web.scale[i] = 0.024 * k * (0.5 + rng());
    }
    shuffleTarget(web, n, rng);
  }

  // ---- IA : orbe de deux couches (sphère de Fibonacci), éclats orientés vers l'extérieur
  const ai = alloc(n);
  {
    const outer = Math.round(n * 0.78);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const isOuter = i < outer;
      const m = isOuter ? outer : n - outer;
      const j = isOuter ? i : i - outer;
      const y = 1 - (j / (m - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = j * golden;
      const nx = Math.cos(th) * r, nz = Math.sin(th) * r;
      const R = isOuter ? 1.55 : 0.82 + rng() * 0.12;
      ai.pos[i * 3] = nx * R;
      ai.pos[i * 3 + 1] = y * R;
      ai.pos[i * 3 + 2] = nz * R;
      faceQuat(ai.quat, i, nx, y, nz, rng() * Math.PI);
      ai.scale[i] = (isOuter ? 0.068 : 0.05) * k * (0.7 + rng() * 0.6);
    }
    // Mélange de l'ordre (même raison que sample2D)
    shuffleTarget(ai, n, rng);
  }

  // ---- Applications : deux téléphones (cadre en éclats, écran en texture côté moteur)
  const apps = alloc(n);
  {
    let start = 0;
    PHONES.forEach((ph, pi) => {
      const count = pi === 0 ? Math.round(n * 0.55) : n - start;
      const W = 142, H = 295;
      const pts = sample2D(W, H, (c) => {
        c.lineWidth = 7;
        roundRect(c, 5, 5, W - 10, H - 10, 26);
        c.stroke();
        roundRect(c, W / 2 - 22, 12, 44, 9, 5);
        c.fill();
        c.fillRect(W / 2 - 24, H - 18, 48, 4);
      }, count, rng);
      placeOnPlane(apps, start, pts, ph, 0.04 * k, rng, 0.03);
      start += count;
    });
  }

  // ---- Gaming : l'arche d'une porte et un sol d'éclats qui y mène
  const gaming = alloc(n);
  {
    const archN = Math.round(n * 0.62);
    const W = 210, H = 310;
    const pts = sample2D(W, H, (c) => {
      c.lineWidth = 16;
      const r = W / 2 - 12;
      c.beginPath();
      c.moveTo(12, H - 4);
      c.lineTo(12, r + 12);
      c.arc(W / 2, r + 12, r, Math.PI, 0);
      c.lineTo(W - 12, H - 4);
      c.stroke();
      // Clé de voûte
      c.beginPath();
      c.moveTo(W / 2 - 12, 2);
      c.lineTo(W / 2 + 12, 2);
      c.lineTo(W / 2 + 7, 26);
      c.lineTo(W / 2 - 7, 26);
      c.fill();
    }, archN, rng);
    placeOnPlane(gaming, 0, pts, { x: 0, y: ARCH.y, z: 0, ry: 0, w: ARCH.w, h: ARCH.h }, 0.062 * k, rng, 0.28);
    const floorY = ARCH.y - ARCH.h / 2;
    for (let i = archN; i < n; i++) {
      // Dalles : plus denses près de l'arche, s'élargissant vers le spectateur
      const d = Math.pow(rng(), 0.8);
      const z = 0.25 - d * 2.6;
      const spread = 0.9 + d * 1.6;
      gaming.pos[i * 3] = (rng() - 0.5) * 2 * spread;
      gaming.pos[i * 3 + 1] = floorY + (rng() - 0.5) * 0.04;
      gaming.pos[i * 3 + 2] = -z;
      faceQuat(gaming.quat, i, 0, 1, 0, rng() * Math.PI);
      gaming.scale[i] = 0.06 * k * (0.7 + rng() * 0.7);
    }
    shuffleTarget(gaming, n, rng);
  }

  // ---- Calme : la matière se retire au loin, poussière scintillante derrière le contenu
  const quiet = alloc(n);
  for (let i = 0; i < n; i++) {
    const th = rng() * Math.PI * 2;
    const ph = Math.acos(2 * rng() - 1);
    const r = 7 + rng() * 6;
    quiet.pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    quiet.pos[i * 3 + 1] = r * Math.cos(ph) * 0.6;
    quiet.pos[i * 3 + 2] = -6 - Math.abs(r * Math.sin(ph) * Math.sin(th));
    faceQuat(quiet.quat, i, 0, 0, 1, rng() * Math.PI * 2);
    quiet.scale[i] = 0.05 * k * (0.5 + rng());
  }

  return { hero, web, ai, apps, gaming, quiet };
}

function shuffleTarget(t: ShapeTarget, n: number, rng: Rng) {
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    for (let a = 0; a < 3; a++) [t.pos[i * 3 + a], t.pos[j * 3 + a]] = [t.pos[j * 3 + a], t.pos[i * 3 + a]];
    for (let a = 0; a < 4; a++) [t.quat[i * 4 + a], t.quat[j * 4 + a]] = [t.quat[j * 4 + a], t.quat[i * 4 + a]];
    [t.scale[i], t.scale[j]] = [t.scale[j], t.scale[i]];
  }
}
