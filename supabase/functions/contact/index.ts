// Fonction serveur du formulaire de contact (Supabase Edge Function, Deno).
// Déploiement : supabase functions deploy contact --no-verify-jwt
// Secrets requis : RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, ALLOWED_ORIGIN,
//                  UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (rate-limit)
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase.
import { z } from "npm:zod@4";
import { createClient } from "npm:@supabase/supabase-js@2";

const budgets = ["Moins de 5 k€", "5 à 15 k€", "15 à 40 k€", "Plus de 40 k€", "À définir"] as const;
const timelines = ["Dès que possible", "1 à 3 mois", "3 à 6 mois", "Flexible"] as const;

// Même schéma que src/lib/validations/contact.ts : la validation navigateur n'est jamais suffisante.
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().max(40).regex(/^[0-9+().\s-]*$/).optional().default(""),
  needs: z.array(z.enum(["web", "ia", "applications", "gaming", "autre"])).min(1).max(5),
  budget: z.enum(budgets),
  timeline: z.enum(timelines),
  message: z.string().trim().min(20).max(5000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
  elapsed: z.number().min(3000),
});

const origin = Deno.env.get("ALLOWED_ORIGIN") ?? "https://fdastudio.fr";
const cors = {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Vary": "Origin",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Rate-limit : 5 demandes par heure et par IP (Upstash Redis REST, fenêtre fixe)
async function allowed(ip: string): Promise<boolean> {
  const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
  const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return true; // à configurer avant la mise en production
  const key = `contact:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([["INCR", key], ["EXPIRE", key, "3600"]]),
  });
  if (!res.ok) return true;
  const results = (await res.json()) as { result: number }[];
  return (results[0]?.result ?? 0) <= 5;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });
  if (req.headers.get("origin") !== origin) return json(403, { error: "forbidden_origin" });
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return json(413, { error: "too_large" });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!(await allowed(ip))) return json(429, { error: "rate_limited" });

  let body: unknown;
  try { body = await req.json(); } catch { return json(400, { error: "invalid_json" }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Robot présumé (champ piège ou envoi trop rapide) : réponse neutre, rien n'est enregistré
    const bot = parsed.error.issues.some((i) => i.path[0] === "website" || i.path[0] === "elapsed");
    return bot ? json(200, { ok: true }) : json(422, { error: "invalid_input" });
  }
  const d = parsed.data;

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { error: dbError } = await supabase.from("contact_requests").insert({
    name: d.name, email: d.email, company: d.company || null, phone: d.phone || null,
    needs: d.needs, budget: d.budget, timeline: d.timeline, message: d.message,
  });
  if (dbError) {
    console.error("db_insert_failed", dbError.code);
    return json(500, { error: "storage_failed" });
  }

  const html = `<h2>Nouvelle demande de projet</h2>
    <p><b>${escapeHtml(d.name)}</b> &lt;${escapeHtml(d.email)}&gt;${d.company ? ` · ${escapeHtml(d.company)}` : ""}${d.phone ? ` · ${escapeHtml(d.phone)}` : ""}</p>
    <p>Besoin : ${escapeHtml(d.needs.join(", "))}<br>Budget : ${escapeHtml(d.budget)}<br>Délai : ${escapeHtml(d.timeline)}</p>
    <p style="white-space:pre-wrap">${escapeHtml(d.message)}</p>`;
  const mail = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("CONTACT_FROM") ?? "FDA Studio <site@fdastudio.fr>",
      to: [Deno.env.get("CONTACT_TO") ?? "contact@fdastudio.fr"],
      reply_to: d.email,
      subject: `Nouveau projet : ${d.needs.join(", ")} — ${d.name}`,
      html,
    }),
  });
  // La demande est déjà enregistrée : un échec d'e-mail est journalisé sans faire échouer l'envoi.
  if (!mail.ok) console.error("mail_failed", mail.status);

  return json(200, { ok: true });
});
