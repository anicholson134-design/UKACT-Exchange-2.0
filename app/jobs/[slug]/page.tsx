import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ApplySection } from '@/components/candidate/ApplySection'
import { PlacementUnavailable } from '@/components/candidate/PlacementUnavailable'
import { isPastDeadline } from '@/lib/utils'
import { MapPin, Calendar, Clock, Building2, Globe, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('title')
    .eq('slug', slug)
    .single()
  return { title: job?.title ?? 'Placement' }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const settings = await getSiteSettings()

  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  let candidateProfile = null
  if (user) {
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = p
    if (p?.role === 'candidate') {
      const { data: cp } = await supabase
        .from('candidate_profiles')
        .select('cv_url, cv_filename, status')
        .eq('id', user.id)
        .single()
      candidateProfile = cp
    }
  }

  const { data: job } = await supabase
    .from('jobs')
    .select('*, employer_profiles(company_name, logo_url, location, website, description)')
    .eq('slug', slug)
    .single()

  if (!job || job.status !== 'active') {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar profile={profile as any} logoUrl={settings['branding.logo_url']} />
        <main className="flex-1 pt-24 md:pt-28">
          <PlacementUnavailable />
        </main>
        <Footer />
      </div>
    )
  }

  // Check if already applied
  let alreadyApplied = false
  if (user && profile?.role === 'candidate') {
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', job.id)
      .eq('candidate_id', user.id)
      .maybeSingle()
    alreadyApplied = !!existing
  }

  const emp = job.employer_profiles as any
  const startDate = (job as any).start_date
  const endDate = job.expires_at

  function formatDateShort(d: string) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  function getDuration(start: string, end: string) {
    const ms = new Date(end).getTime() - new Date(start).getTime()
    const days = Math.round(ms / (1000 * 60 * 60 * 24))
    if (days < 28) return `${days} day${days !== 1 ? 's' : ''}`
    const months = Math.round(days / 30.44)
    return `${months} month${months !== 1 ? 's' : ''}`
  }

  const deadline = (job as any).application_deadline
  const deadlinePassed = isPastDeadline(deadline)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} logoUrl={settings['branding.logo_url']} />
      <main className="flex-1 pt-24 md:pt-28">

        {/* Back link */}
        <div className="container-keep py-4">
          <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-gold transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to placements
          </Link>
        </div>

        <div className="container-keep pb-16">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 items-start">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Header */}
              <div>
                {emp?.company_name && (
                  <p className="text-sm font-medium text-moss mb-2">{emp.company_name}</p>
                )}
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest leading-tight mb-4">
                  {job.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap gap-5 text-sm text-ink/60">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-stone" />
                      {job.location}
                    </span>
                  )}
                  {startDate && endDate && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-stone" />
                      {getDuration(startDate, endDate)}
                    </span>
                  )}
                  {startDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-stone" />
                      Starts {formatDateShort(startDate)}
                    </span>
                  )}
                  {deadline && (
                    <span className={`flex items-center gap-1.5 ${deadlinePassed ? 'text-red-600' : ''}`}>
                      <Calendar className="h-4 w-4 text-stone" />
                      {deadlinePassed ? 'Applications closed' : `Apply by ${formatDateShort(deadline)}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Skills/requirements tags */}
              {job.skills_required?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((s: string) => (
                    <span key={s} className="text-sm px-3 py-1 rounded-full bg-mist text-moss border border-sage/20 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-stone/20" />

              {/* Description */}
              <div>
                <h2 className="font-display font-semibold text-xl text-forest mb-4">About this placement</h2>
                <div className="prose prose-sm max-w-none text-ink/70 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Placement photo */}
              {job.image_url && (
                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-mist">
                  <img src={job.image_url} alt={job.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Exchange dates */}
              {(startDate || endDate) && (
                <div>
                  <h2 className="font-display font-semibold text-xl text-forest mb-4">Exchange dates</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {startDate && (
                      <div className="bg-mist rounded-xl p-5 border border-stone/20">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-1">Start date</p>
                        <p className="font-display font-semibold text-xl text-forest">{formatDateShort(startDate)}</p>
                      </div>
                    )}
                    {endDate && (
                      <div className="bg-mist rounded-xl p-5 border border-stone/20">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-1">End date</p>
                        <p className="font-display font-semibold text-xl text-forest">{formatDateShort(endDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* About the collection */}
              {emp?.description && (
                <div>
                  <h2 className="font-display font-semibold text-xl text-forest mb-4">
                    About {emp.company_name}
                  </h2>
                  <p className="text-ink/70 leading-relaxed whitespace-pre-wrap">{emp.description}</p>
                  {emp.website && (
                    <a
                      href={emp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm text-canopy hover:text-gold transition-colors font-medium"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Visit website
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar — apply + collection info */}
            <div className="lg:col-span-1 space-y-5">
              {/* Collection card */}
              <div className="rounded-2xl border border-stone/20 bg-white p-6 space-y-4">
                <div className="flex items-center gap-3">
                  {emp?.logo_url ? (
                    <img src={emp.logo_url} alt={emp.company_name} className="w-12 h-12 rounded-xl object-contain border border-stone/20 bg-white shrink-0 p-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-moss" strokeWidth={1.5} />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-forest">{emp?.company_name ?? 'Collection'}</p>
                    {emp?.location && <p className="text-sm text-ink/50">{emp.location}</p>}
                  </div>
                </div>
                {emp?.website && (
                  <a
                    href={emp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-canopy hover:text-gold transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {emp.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              {/* Apply section — client component handles auth state */}
              <ApplySection
                jobId={job.id}
                jobTitle={job.title}
                isLoggedIn={!!user}
                isCandidate={profile?.role === 'candidate'}
                isApproved={(candidateProfile as any)?.status === 'approved'}
                alreadyApplied={alreadyApplied}
                deadlinePassed={deadlinePassed}
                cvFilename={(candidateProfile as any)?.cv_filename ?? null}
                cvUrl={(candidateProfile as any)?.cv_url ?? null}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
