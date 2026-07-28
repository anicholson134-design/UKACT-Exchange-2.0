// Supabase project credentials, resolved once.
//
// Falling back to inert placeholders (instead of asserting with `!` and
// letting @supabase/ssr / @supabase/supabase-js throw synchronously) means a
// missing or misconfigured env var never crashes a build's static-export
// pass or a server render. Calls made with a placeholder client still fail —
// just as a normal network/auth error the calling page can catch — instead
// of taking down the whole page.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
// Server-only — accepts either the classic "service_role key" name or
// Supabase's newer "secret key" naming (SUPABASE_SECRET_KEY). Safe to read
// process.env directly here: on the server Node resolves the real value at
// runtime, and in any client bundle that pulls in this shared module,
// Next.js strips non-NEXT_PUBLIC_ vars to `undefined` automatically — the
// actual secret never reaches the browser.
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || 'placeholder-service-role-key'

// True when NEXT_PUBLIC_SUPABASE_URL was missing at build time and we're
// running on the inert fallback above — used to surface a clear warning
// instead of a cryptic network error the moment a Supabase call is made.
export const isSupabasePlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL
