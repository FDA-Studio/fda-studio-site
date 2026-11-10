import { site } from "./site";

/**
 * Captcha Cloudflare Turnstile (audit de sécurité V-01 et V-07).
 * La clé publique est dans `site.ts` ; le jeton est vérifié côté serveur par l'outil interne.
 * Le script n'est chargé qu'au premier besoin (formulaire affiché, démo lancée).
 */

export type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Charge le script Turnstile une seule fois. */
export function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile"))));
    s.addEventListener("error", () => reject(new Error("turnstile")));
  });
}

type Entry = { token: string; at: number; pending: Promise<string> | null };
const cache = new Map<string, Entry>();
/** Un jeton Turnstile vaut 300 s ; on le renouvelle avant. */
const FRESH_MS = 240_000;

/**
 * Obtient un jeton auprès de Cloudflare. Le widget reste invisible sauf si Cloudflare demande une
 * interaction : il s'affiche alors en bas de l'écran, DANS la fenêtre modale ouverte s'il y en a
 * une (hors d'elle, il serait masqué et inactif).
 */
async function fetchToken(action: string, timeoutMs: number): Promise<string> {
  if (!site.turnstileSiteKey) return "";
  let ts: Turnstile;
  try {
    ts = await loadTurnstile();
  } catch {
    return "";
  }
  const host = document.createElement("div");
  host.setAttribute("role", "region");
  host.setAttribute("aria-label", "Vérification anti-robot");
  host.style.cssText = "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000";
  (document.querySelector("dialog[open]") ?? document.body).appendChild(host);
  let id: string | null = null;
  try {
    return await new Promise<string>((resolve) => {
      const timer = window.setTimeout(() => resolve(""), timeoutMs);
      const done = (token: string) => {
        window.clearTimeout(timer);
        resolve(token);
      };
      id = ts.render(host, {
        sitekey: site.turnstileSiteKey,
        theme: "dark",
        language: "fr",
        appearance: "interaction-only",
        action,
        callback: (t: string) => done(t),
        "error-callback": () => done(""),
      });
    });
  } finally {
    if (id) ts.remove(id);
    host.remove();
  }
}

/**
 * Prépare un jeton en arrière-plan (à l'ouverture d'une démo), pour qu'il soit prêt au clic :
 * Safari n'autorise le son et le micro que juste après un geste de l'utilisateur, sans attente.
 */
export function warmTurnstile(action: string, timeoutMs = 30000): void {
  if (!site.turnstileSiteKey || typeof window === "undefined") return;
  const e = cache.get(action);
  if (e && (e.pending || (e.token && Date.now() - e.at < FRESH_MS))) return;
  const entry: Entry = { token: "", at: 0, pending: null };
  entry.pending = fetchToken(action, timeoutMs).then((token) => {
    entry.token = token;
    entry.at = Date.now();
    entry.pending = null;
    return token;
  });
  cache.set(action, entry);
}

/**
 * Jeton à usage unique : le jeton préparé s'il est encore valide, sinon un nouveau.
 * Sans réponse au bout de `timeoutMs`, renvoie "" : le serveur décide (jamais de blocage côté navigateur).
 */
export async function turnstileToken(action: string, timeoutMs = 15000): Promise<string> {
  if (!site.turnstileSiteKey) return "";
  const e = cache.get(action);
  cache.delete(action);
  if (e?.pending) {
    const token = await Promise.race([e.pending, new Promise<string>((r) => window.setTimeout(() => r(""), timeoutMs))]);
    if (token) return token;
  } else if (e?.token && Date.now() - e.at < FRESH_MS) {
    return e.token;
  }
  return fetchToken(action, timeoutMs);
}
