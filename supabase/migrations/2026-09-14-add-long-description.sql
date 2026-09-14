-- Run this once in the Supabase SQL editor.
-- `description` was being reused both as the card/hero subtitle and as the
-- "Descripción" block on the project detail page. Splits it into two fields:
-- `description` stays the short subtitle, `long_description` is the detail-page copy.

alter table work_items
  add column long_description_es text not null default '',
  add column long_description_en text not null default '';
