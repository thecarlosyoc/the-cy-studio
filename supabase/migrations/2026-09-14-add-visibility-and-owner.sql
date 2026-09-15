-- Run this once in the Supabase SQL editor.
-- Adds a per-item visibility switch for the admin grid, and tracks which
-- admin (by email) last created/edited each work item.

alter table work_items
  add column hidden boolean not null default false,
  add column updated_by text;
