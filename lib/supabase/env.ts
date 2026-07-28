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
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
