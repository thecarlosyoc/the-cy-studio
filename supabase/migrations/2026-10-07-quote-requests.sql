-- Solicitudes del cotizador público (/quote): lo que pidió el cliente y el rango que vio.
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'demo', 'won', 'lost')),
  name text not null,
  email text not null,
  whatsapp text,
  business text,
  region text not null check (region in ('gt', 'abroad')),
  timing text not null,
  brief text,
  lang text not null default 'es',
  items jsonb not null, -- [{ slug, size }]
  estimate jsonb not null -- QuoteEstimate (shared/types/quote.ts)
);

alter table quote_requests enable row level security;
-- Sin policies: solo service_role, igual que el resto de tablas.
