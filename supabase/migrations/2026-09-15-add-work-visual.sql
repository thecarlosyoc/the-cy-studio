-- Agrega el visual animado (video) opcional por proyecto.
-- Columna nullable, no afecta filas existentes.
alter table work_items add column visual jsonb;