// Copie dans public/vendor/ le module de rééchantillonnage audio utilisé par la démo vocale
// (client ElevenLabs, Firefox et Safari iOS). Servi par le site, il n'a plus à venir de
// cdn.jsdelivr.net : pas de script tiers, et la CSP reste en 'self'.
// L'empreinte est figée : une version modifiée du paquet arrête le build au lieu d'être servie.
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const PKG = "@alexanderolsen/libsamplerate-js";
// Empreinte SHA-256 de dist/libsamplerate.worklet.js en 2.1.2, identique au fichier de jsdelivr.
const SHA256 = "ca6e162f194d3ee5a2d2cd3c3b49641d31e56845aeae507feca1cdf8aa8116cb";

const root = dirname(createRequire(import.meta.url).resolve(`${PKG}/package.json`));
const src = join(root, "dist", "libsamplerate.worklet.js");
const hash = createHash("sha256").update(readFileSync(src)).digest("hex");
if (hash !== SHA256) {
  console.error(`vendor-audio: empreinte inattendue pour ${PKG} (${hash}). Vérifier la nouvelle version, puis mettre à jour SHA256.`);
  process.exit(1);
}

mkdirSync("public/vendor", { recursive: true });
copyFileSync(src, "public/vendor/libsamplerate.worklet.js");
copyFileSync(join(root, "LICENSE.md"), "public/vendor/libsamplerate.LICENSE.txt");
console.log("vendor-audio: libsamplerate.worklet.js copié (empreinte vérifiée)");
