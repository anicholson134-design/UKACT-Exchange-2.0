import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import { ApplicantTable } from '@/components/employer/ApplicantTable'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Applicants' }

export default async function AdminApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/login')

  const admin = createAdminClient()

  const { data: job } = await admin
    .from('jobs')
    .select('id, title, employer_id, employer_profiles(company_name)')
    .eq('id', id)
    .single()

  if (!job) notFound()

  const { data: applications } = await admin
    .from('applications')
    .select('id, created_at, status, cv_url, cover_letter, considerations, candidate_id')
    .eq('job_id', id)
    .order('created_at', { ascending: false })

  const companyName = (job.employer_profiles as any)?.company_name

  if (!applications?.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Applicants</h1>
          <p className="text-muted-foreground mt-1">{job.title} · {companyName} · 0 applications</p>
        </div>
        <p className="text-muted-foreground text-sm py-10 text-center">No applications yet.</p>
      </div>
    )
  }

  const candidateIds = applications.map((a: any) => a.candidate_id)

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', candidateIds)

  const profileMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]))

  const emailMap: Record<string, string> = {}
  for (const cid of candidateIds) {
    const { data: authUser } = await admin.auth.admin.getUserById(cid)
    if (authUser?.user?.email) emailMap[cid] = authUser.user.email
  }

  const cvSignedUrls: Record<string, string> = {}
  for (const app of applications as any[]) {
    if (app.cv_url) {
      const match = app.cv_url.match(/\/object\/(?:public|sign)\/cvs\/(.+)/)
      const pathMatch = app.cv_url.match(/\/storage\/v1\/object\/(?:public|authenticated)\/cvs\/(.+)/)
      const storagePath = (match?.[1] ?? pathMatch?.[1])?.split('?')[0]
      if (storagePath) {
        const { data: signed } = await admin.storage.from('cvs').createSignedUrl(storagePath, 3600)
        if (signed?.signedUrl) cvSignedUrls[app.id] = signed.signedUrl
      } else {
        cvSignedUrls[app.id] = app.cv_url
      }
    }
  }

  const enriched = (applications as any[]).map(app => ({
    ...app,
    profile: profileMap[app.candidate_id] ?? null,
    email: emailMap[app.candidate_id] ?? null,
    cvSignedUrl: cvSignedUrls[app.id] ?? null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applicants</h1>
        <p className="text-muted-foreground mt-1">{job.title} · {companyName} · {enriched.length} application{enriched.length !== 1 ? 's' : ''}</p>
      </div>
      <ApplicantTable applications={enriched as any} />
    </div>
  )
}
