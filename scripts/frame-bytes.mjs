// Poids réel de chaque film de l'accueil (séquences d'images), écrit avant chaque build.
// Le moteur s'en sert pour décider quand ouvrir l'écran d'arrivée : au débit mesuré, chaque
// film doit pouvoir arriver avant sa scène (voir preloadFrames dans src/lib/scroll-world/engine.js).
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "public/world/frames";
const out = {};
for (const dir of readdirSync(root).sort()) {
  const p = join(root, dir);
  if (!statSync(p).isDirectory()) continue;
  out[dir] = readdirSync(p).filter((f) => f.endsWith(".webp")).reduce((t, f) => t + statSync(join(p, f)).size, 0);
}
writeFileSync("src/components/world/frame-bytes.json", JSON.stringify(out, null, 2) + "\n");
console.log("frame-bytes:", Object.entries(out).map(([k, v]) => `${k} ${(v / 1e6).toFixed(1)} Mo`).join(", "));
