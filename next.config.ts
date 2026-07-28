import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90, 95, 100],
  },
  env: {
    // Supabase's dashboard now surfaces newer names for these same two
    // values ("Project URL" / "Publishable key" instead of the classic
    // NEXT_PUBLIC_SUPABASE_URL / anon key), so bridge either naming into
    // the NEXT_PUBLIC_* vars the app reads and Next.js inlines into the
    // browser bundle at build time. A real NEXT_PUBLIC_* var always wins
    // if it's set. Never put the secret/service-role key here — that one
    // must stay server-only (see lib/supabase/env.ts).
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '',
  },
}

export default nextConfig
