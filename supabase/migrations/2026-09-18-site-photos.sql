-- Fotos editables del sitio: 'about' (hero de /about) y 'home' (teaser del inicio).
-- Sin fila = el sitio usa /images/about.png como respaldo.
create table site_photos (
  key text primary key check (key in ('about', 'home')),
  url text not null,
  updated_at timestamptz not null default now()
);

alter table site_photos enable row level security;
-- Sin policies, igual que work_items/about_sections: solo service_role.
