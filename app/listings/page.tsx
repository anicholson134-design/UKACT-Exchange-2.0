import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { JobCard } from '@/components/candidate/JobCard'
import { Pagination } from '@/components/shared/Pagination'
import { Search } from 'lucide-react'
import Link from 'next/link'
import type { Job } from '@/types'

export const metadata = { title: 'Current Placements' }

const PAGE_SIZE = 12

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const supabase = await createClient()
  const settings = await getSiteSettings()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const params = await searchParams
  const page = Number(params.page ?? 1)
  const q = params.q ?? ''

  let query = supabase
    .from('jobs')
    .select('*, employer_profiles(company_name, logo_url, location)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (q) query = query.ilike('title', `%${q}%`)

  const { data: jobs, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} logoUrl={settings['branding.logo_url']} />
      <main className="flex-1">

        {/* Hero search */}
        <section className="relative pt-32 pb-16 bg-forest overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=40')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest" />
          <div className="relative z-10 container-keep text-center">
            <p className="eyebrow text-gold mb-4">Opportunities</p>
            <h1 className="display-lg text-cream mb-4">Find Your Next Placement</h1>
            <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
              Browse placement opportunities at animal management colleges and farm schools across the UK.
            </p>

            {/* Search bar */}
            <form className="flex gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search placements…"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-ink placeholder:text-ink/40 border-0 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gold text-cream font-medium rounded-xl hover:bg-gold-light transition-colors text-sm"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="section-padding bg-cream">
          <div className="container-keep">
            <div className="flex items-center justify-between mb-8">
              <p className="text-ink/60 text-sm">
                {count ?? 0} placement{count !== 1 ? 's' : ''} found
                {q && <span> for &quot;<strong>{q}</strong>&quot;</span>}
              </p>
              {!user && (
                <p className="text-sm text-ink/50">
                  <Link href="/login" className="text-canopy hover:text-gold font-medium">Log in</Link> to apply
                </p>
              )}
            </div>

            {jobs && jobs.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(jobs as Job[]).map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    href={`/jobs/${job.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="font-display text-2xl text-forest mb-2">No placements found</h3>
                <p className="text-ink/50 mb-6">Try a different search</p>
                <Link href="/listings" className="text-sm text-canopy hover:text-gold font-medium">
                  Clear search
                </Link>
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
