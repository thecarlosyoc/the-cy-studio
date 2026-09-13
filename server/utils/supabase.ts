import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | undefined

export function useSupabase() {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return client
}
