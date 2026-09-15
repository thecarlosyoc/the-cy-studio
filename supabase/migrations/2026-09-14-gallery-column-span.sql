-- Run this once in the Supabase SQL editor.
-- Gallery images now carry a manual column-span (1, 2 or 3) chosen from the
-- admin, replacing the automatic aspect-ratio detection previously used in
-- GalleryGrid.vue. Converts gallery from text[] (plain URLs) to jsonb
-- ({ url, colSpan }[]), preserving existing order and defaulting colSpan to 1.

alter table work_items
  add column gallery_jsonb jsonb not null default '[]';

update work_items
set gallery_jsonb = (
  select coalesce(
    jsonb_agg(jsonb_build_object('url', url, 'colSpan', 1) order by ord),
    '[]'::jsonb
  )
  from unnest(gallery) with ordinality as t(url, ord)
);

alter table work_items drop column gallery;
alter table work_items rename column gallery_jsonb to gallery;
