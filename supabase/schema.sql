-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Creates the two content tables backing app/data/work.ts and app/data/about.ts.

create table work_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  type text not null check (type in ('product', 'brand')),
  "order" integer not null default 0,
  title_es text not null,
  title_en text not null,
  description_es text not null,
  description_en text not null,
  role jsonb not null default '[]',       -- LocalizedText[]: [{ es, en }, ...]
  tools text[] not null default '{}',
  context_es text not null,
  context_en text not null,
  date_es text not null,
  date_en text not null,
  gallery text[] not null default '{}',   -- public Supabase Storage URLs
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
