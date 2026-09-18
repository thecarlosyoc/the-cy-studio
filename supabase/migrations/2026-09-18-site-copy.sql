-- Overrides de copy editable desde el admin (textos del inicio y CTA).
-- Sin fila para una clave = se usa el valor de app/data/i18n.ts.
create table site_copy (
  key text primary key,
  es text not null,
  en text not null,
  updated_at timestamptz not null default now()
);

alter table site_copy enable row level security;
-- Sin policies: solo service_role, igual que el resto de tablas.
