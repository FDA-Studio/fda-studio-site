// Garde-fou (audit de sécurité du 19 nov. 2026) : l'en-tête Content-Security-Policy de vercel.json
// doit porter exactement la règle de src/lib/csp.json, que la balise meta de layout.tsx reprend.
// Deux règles qui divergent, c'est le navigateur qui applique la plus stricte des deux : une source
// ajoutée d'un seul côté reste bloquée (c'est ainsi que la démo vocale cassait sur Firefox).
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync("src/lib/csp.json", "utf8"));
const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

const parse = (value) =>
  new Map(
    value
      .split(";")
      .map((d) => d.trim().split(/\s+/).filter(Boolean))
      .filter((parts) => parts.length > 0)
      .map(([name, ...sources]) => [name.toLowerCase(), [...sources].sort()]),
  );

const expected = new Map(Object.entries(config.directives).map(([name, sources]) => [name, [...sources].sort()]));
const global = (vercel.headers ?? []).find((h) => h.source === "/(.*)");
const header = global?.headers.find((h) => h.key.toLowerCase() === "content-security-policy");

const errors = [];
if (!header) errors.push("vercel.json : aucun en-tête Content-Security-Policy sur /(.*).");
else {
  const actual = parse(header.value);
  for (const [name, sources] of expected) {
    if (!actual.has(name)) errors.push(`directive absente de vercel.json : ${name}`);
    else if (actual.get(name).join(" ") !== sources.join(" "))
      errors.push(`${name} diffère\n  csp.json    : ${sources.join(" ") || "(vide)"}\n  vercel.json : ${actual.get(name).join(" ") || "(vide)"}`);
  }
  for (const name of actual.keys()) if (!expected.has(name)) errors.push(`directive en trop dans vercel.json : ${name}`);
}
for (const name of config.headerOnly) if (!expected.has(name)) errors.push(`headerOnly cite une directive inconnue : ${name}`);

if (errors.length) {
  console.error("check-csp : la CSP de vercel.json ne correspond pas à src/lib/csp.json\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`check-csp : vercel.json et csp.json concordent (${expected.size} directives)`);
