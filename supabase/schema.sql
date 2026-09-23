-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Creates the CMS content tables: work_items, about_sections, site_photos, site_copy.

create table work_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  type text not null check (type in ('product', 'brand')),
  "order" integer not null default 0,
  title_es text not null,
  title_en text not null,
  description_es text not null,
  description_en text not null,
  long_description_es text not null default '',
  long_description_en text not null default '',
  challenge_es text not null default '',
  challenge_en text not null default '',
  status_es text not null default '',
  status_en text not null default '',
  role jsonb not null default '[]',       -- LocalizedText[]: [{ es, en }, ...]
  tools text[] not null default '{}',
  context_es text not null,
  context_en text not null,
  date_es text not null,
  date_en text not null,
  gallery jsonb not null default '[]',    -- [{ url, colSpan }, ...], colSpan is 1|2|3
  visuals jsonb not null default '[]'::jsonb, -- GalleryVisual[], hasta 3 por proyecto
  demo_url text,                          -- link opcional a demo en vivo
  hidden boolean not null default false,  -- oculta el proyecto de /work sin borrarlo
  updated_by text,                        -- email/id del admin que hizo el último cambio
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table about_sections (
  id uuid primary key default gen_random_uuid(),
  "order" integer not null default 0,
  label_es text not null,
  label_en text not null,
  heading_es text,
  heading_en text,
  paragraphs jsonb not null default '[]', -- LocalizedText[]: [{ es, en }, ...]
  cta_label_es text,
  cta_label_en text,
  cta_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table work_items enable row level security;
alter table about_sections enable row level security;
-- No policies defined on purpose: only the service_role key (used server-side in
-- this app's Nitro API routes) can read or write these tables. The anon key is
-- never used by this app, so RLS with zero policies fully locks the tables down
-- from any other caller.

-- Fotos editables del sitio ('about' | 'home' | 'hero'); sin fila se usa /images/about.png.
create table site_photos (
  key text primary key check (key in ('about', 'home', 'hero')),
  url text not null,
  updated_at timestamptz not null default now()
);
alter table site_photos enable row level security;

-- Overrides de copy editable (clave de app/data/i18n.ts); sin fila = valor por defecto del código.
create table site_copy (
  key text primary key,
  es text not null,
  en text not null,
  updated_at timestamptz not null default now()
);
alter table site_copy enable row level security;
