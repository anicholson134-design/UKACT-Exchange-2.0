import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import { ApplicantTable } from '@/components/employer/ApplicantTable'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Applicants' }

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: job } = await supabase
    .from('jobs')
    .select('id, title, employer_id')
    .eq('id', id)
    .eq('employer_id', user.id)
    .single()

  if (!job) notFound()

  // Use admin client to bypass RLS and get full application data
  const admin = createAdminClient()

  const { data: applications } = await admin
    .from('applications')
    .select('id, created_at, status, cv_url, cover_letter, considerations, candidate_id')
    .eq('job_id', id)
    .order('created_at', { ascending: false })

  if (!applications?.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Applicants</h1>
          <p className="text-muted-foreground mt-1">{job.title} · 0 applications</p>
        </div>
        <p className="text-muted-foreground text-sm py-10 text-center">No applications yet.</p>
      </div>
    )
  }

  const candidateIds = applications.map((a: any) => a.candidate_id)

  // Fetch profiles separately (avoids ambiguous FK join issue)
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', candidateIds)

  const profileMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]))

  // Fetch emails via admin auth API
  const emailMap: Record<string, string> = {}
  for (const cid of candidateIds) {
    const { data: authUser } = await admin.auth.admin.getUserById(cid)
    if (authUser?.user?.email) emailMap[cid] = authUser.user.email
  }

  // Generate signed URLs for private CVs
  const cvSignedUrls: Record<string, string> = {}
  for (const app of applications as any[]) {
    if (app.cv_url) {
      // Extract path from full URL
      const match = app.cv_url.match(/\/object\/(?:public|sign)\/cvs\/(.+)/)
      const pathMatch = app.cv_url.match(/\/storage\/v1\/object\/(?:public|authenticated)\/cvs\/(.+)/)
      const storagePath = (match?.[1] ?? pathMatch?.[1])?.split('?')[0]
      if (storagePath) {
        const { data: signed } = await admin.storage
          .from('cvs')
          .createSignedUrl(storagePath, 3600) // 1 hour
        if (signed?.signedUrl) cvSignedUrls[app.id] = signed.signedUrl
      } else {
        // Already a public URL or direct link — use as-is
        cvSignedUrls[app.id] = app.cv_url
      }
    }
  }

  // Unread message counts — messages from the candidate that this employer hasn't read yet
  const appIds = applications.map((a: any) => a.id)
  const { data: unreadMessages } = await admin
    .from('messages')
    .select('application_id')
    .in('application_id', appIds)
    .is('read_at', null)
    .neq('sender_id', user.id)

  const unreadCounts: Record<string, number> = {}
  for (const m of unreadMessages ?? []) {
    unreadCounts[m.application_id] = (unreadCounts[m.application_id] ?? 0) + 1
  }

  // Enrich applications with profile + email + signed CV URL
  const enriched = (applications as any[]).map(app => ({
    ...app,
    profile: profileMap[app.candidate_id] ?? null,
    email: emailMap[app.candidate_id] ?? null,
    cvSignedUrl: cvSignedUrls[app.id] ?? null,
    unreadCount: unreadCounts[app.id] ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applicants</h1>
        <p className="text-muted-foreground mt-1">{job.title} · {enriched.length} application{enriched.length !== 1 ? 's' : ''}</p>
      </div>
      <ApplicantTable applications={enriched as any} currentUserId={user.id} />
    </div>
  )
}
