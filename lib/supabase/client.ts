import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabasePlaceholder } from './env'

export function createClient() {
  if (isSupabasePlaceholder && typeof window !== 'undefined') {
    // Runs in the browser only — surfaces a clear, actionable message instead
    // of a cryptic ERR_NAME_NOT_RESOLVED the moment a Supabase call fires.
    console.warn(
      '[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY were not set when this ' +
      'app was built, so it is falling back to a placeholder project that does not exist. ' +
      'Any sign-up/login/data call will fail with a network error until you set both in your ' +
      'deploy environment and trigger a NEW build — Next.js inlines NEXT_PUBLIC_* vars at build ' +
      'time, so adding them after the fact does not affect an already-built deployment.'
    )
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
