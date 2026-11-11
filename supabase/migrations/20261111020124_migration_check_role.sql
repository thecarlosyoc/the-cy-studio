-- Read-only role for the deploy gate (scripts/check-migrations.mjs, run by every Workers Builds build).
-- It can read one column of one table: the applied versions in supabase_migrations.schema_migrations.
-- No grant on any other schema or table, no RLS bypass, no role membership.
--
-- It is created without login and without a password, so no secret lives in this repo.
-- Carlos enables it by hand, once, in the Supabase SQL editor:
--   alter role migration_check with login password '<generated>';
-- and stores the connection string as the build secret MIGRATION_CHECK_DB_URL in Cloudflare.
-- To cut the access: alter role migration_check nologin;

do $$
begin
  -- Roles belong to the cluster, not the database: a replay on a local stack must not fail here.
  if not exists (select from pg_roles where rolname = 'migration_check') then
    create role migration_check nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls
      connection limit 5;
  end if;
end
$$;

alter role migration_check set statement_timeout = '5s';
alter role migration_check set default_transaction_read_only = on;

grant usage on schema supabase_migrations to migration_check;
grant select (version) on supabase_migrations.schema_migrations to migration_check;
