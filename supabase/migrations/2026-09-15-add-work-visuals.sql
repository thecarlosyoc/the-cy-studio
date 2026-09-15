-- Hasta 3 visuales animados por proyecto.
--
-- `work_items.visual` (objeto único, nullable) pasa a `work_items.visuals`
-- (arreglo de GalleryVisual[], not null con default '[]'). Cada elemento
-- conserva su propia `position` (cuántas imágenes van antes en el mosaico).
--
-- Backfill: si el proyecto ya tenía un visual (objeto), se envuelve en un
-- arreglo de un elemento; si no tenía (NULL), queda un arreglo vacío.
alter table work_items rename column visual to visuals;

update work_items
set visuals = case
  when jsonb_typeof(visuals) = 'object' then jsonb_build_array(visuals)
  else '[]'::jsonb
end;

alter table work_items
  alter column visuals set default '[]'::jsonb,
  alter column visuals set not null;