import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AdminJobModerationActions } from '@/components/admin/AdminJobModerationActions'
import { formatDate, formatContractType } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Review Placement' }

export default async function AdminJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/login')

  const admin = createAdminClient()
  const { data: job } = await admin
    .from('jobs')
    .select('*, employer_profiles(company_name, logo_url, location, website, description)')
    .eq('id', id)
    .single()

  if (!job) notFound()

  const emp = job.employer_profiles as any

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="text-muted-foreground mt-1">
            {emp?.company_name ?? 'Unknown collection'} · Posted {formatDate(job.created_at)}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <AdminJobModerationActions id={job.id} status={job.status} />

      <div className="flex gap-2">
        <Link href={`/admin/jobs/${job.id}/edit`} className="text-sm text-primary hover:underline">Edit posting</Link>
        <span className="text-muted-foreground">·</span>
        <Link href={`/admin/jobs/${job.id}/applicants`} className="text-sm text-primary hover:underline">View applicants</Link>
        {job.status === 'active' && job.slug && (
          <>
            <span className="text-muted-foreground">·</span>
            <Link href={`/jobs/${job.slug}`} target="_blank" className="text-sm text-primary hover:underline">View live page</Link>
          </>
        )}
      </div>

      {job.image_url && (
        <div className="rounded-lg overflow-hidden border aspect-[21/9] bg-muted">
          <img src={job.image_url} alt={job.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-lg">Placement details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Contract type</p>
            <p className="font-medium mt-0.5">{formatContractType(job.contract_type)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium mt-0.5">{job.location || '—'}</p>
          </div>
          {job.start_date && (
            <div>
              <p className="text-muted-foreground">Start date</p>
              <p className="font-medium mt-0.5">{formatDate(job.start_date)}</p>
            </div>
          )}
          {job.expires_at && (
            <div>
              <p className="text-muted-foreground">End date</p>
              <p className="font-medium mt-0.5">{formatDate(job.expires_at)}</p>
            </div>
          )}
          {job.application_deadline && (
            <div>
              <p className="text-muted-foreground">Application deadline</p>
              <p className="font-medium mt-0.5">{formatDate(job.application_deadline)}</p>
            </div>
          )}
        </div>

        {job.skills_required?.length > 0 && (
          <div>
            <p className="text-muted-foreground text-sm mb-1.5">Requirements</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills_required.map((s: string) => (
                <span key={s} className="text-xs bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-muted-foreground text-sm mb-1">Description</p>
          <p className="text-sm whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {emp && (
        <div className="rounded-lg border bg-card p-6 space-y-3">
          <h2 className="font-semibold text-lg">About the collection</h2>
          <div className="flex items-center gap-3">
            {emp.logo_url && (
              <img src={emp.logo_url} alt={emp.company_name} className="w-10 h-10 rounded-lg object-contain border bg-white p-1" />
            )}
            <div>
              <p className="font-medium">{emp.company_name}</p>
              {emp.location && <p className="text-sm text-muted-foreground">{emp.location}</p>}
            </div>
          </div>
          {emp.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{emp.description}</p>}
          {emp.website && (
            <a href={emp.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
              {emp.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
