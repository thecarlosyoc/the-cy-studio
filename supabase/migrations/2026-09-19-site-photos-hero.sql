-- Tercer slot de foto: 'hero' (retrato del hero de la inicio). 'about' y 'home' conservan sus filas.
alter table site_photos drop constraint site_photos_key_check;
alter table site_photos add constraint site_photos_key_check check (key in ('about', 'home', 'hero'));
