import { createClient } from '@supabase/supabase-js'

// Deliberately not cached as a module-level singleton: a long-lived client
// held across many requests (a warm serverless instance, a dev server left
// running) has been observed to silently degrade — reads start coming back
// empty with no thrown error. Creating one per call is cheap (no persistent
// connection is opened here; PostgREST calls go out over plain fetch) and
// avoids that class of bug entirely.
export function useSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
