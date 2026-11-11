-- Origen de cada solicitud del cotizador: { utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer }.
alter table quote_requests add column source jsonb;
