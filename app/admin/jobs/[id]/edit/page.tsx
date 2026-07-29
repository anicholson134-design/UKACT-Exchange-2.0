import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import { JobForm } from '@/components/employer/JobForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Placement' }

export default async function AdminEditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/login')

  const admin = createAdminClient()
  const { data: job } = await admin.from('jobs').select('*').eq('id', id).single()
  if (!job) notFound()

  const { data: emp } = await admin
    .from('employer_profiles')
    .select('location, company_name')
    .eq('id', job.employer_id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Placement</h1>
        <p className="text-muted-foreground mt-1">{job.title} · {emp?.company_name}</p>
      </div>
      <JobForm job={job} employerLocation={emp?.location ?? null} redirectTo={`/admin/jobs/${job.id}`} />
    </div>
  )
}
