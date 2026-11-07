-- Demandes reçues via le formulaire de contact du site FDA Studio.
-- RLS activée sans aucune politique publique : seule la fonction serveur (service_role) écrit et lit.
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 200),
  company text,
  phone text,
  needs text[] not null,
  budget text not null,
  timeline text not null,
  message text not null check (char_length(message) between 20 and 5000)
);

alter table public.contact_requests enable row level security;

-- Purge RGPD : conservation 3 ans (à planifier, par exemple avec pg_cron)
-- delete from public.contact_requests where created_at < now() - interval '3 years';
