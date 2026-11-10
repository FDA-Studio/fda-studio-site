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

/**
 * Jeton à usage unique pour une action ponctuelle (ouvrir une démo). Le widget reste invisible
 * sauf si Cloudflare demande une interaction ; il s'affiche alors en bas de l'écran.
 * Sans réponse au bout de `timeoutMs`, renvoie "" : le serveur décide (jamais de blocage côté navigateur).
 */
export async function turnstileToken(action: string, timeoutMs = 15000): Promise<string> {
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
  document.body.appendChild(host);
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
