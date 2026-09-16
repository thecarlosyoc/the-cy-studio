-- Link "See it in action" configurable por proyecto en admin.
--
-- `work_items.demo_url` (text, nullable): URL del demo/live del producto.
-- NULL o vacío → el botón no se muestra en `/work/[slug]`.
alter table work_items add column demo_url text;