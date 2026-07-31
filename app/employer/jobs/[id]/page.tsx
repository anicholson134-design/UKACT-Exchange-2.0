import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JobForm } from '@/components/employer/JobForm'
import { BackLink } from '@/components/shared/BackLink'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Placement' }

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: job }, { data: emp }] = await Promise.all([
    supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('employer_id', user.id)
      .single(),
    supabase
      .from('employer_profiles')
      .select('location')
      .eq('id', user.id)
      .single(),
  ])

  if (!job) notFound()

  return (
    <div className="space-y-6">
      <BackLink href="/employer/jobs" label="Back to my jobs" />
      <div>
        <h1 className="text-3xl font-bold">Edit Placement</h1>
        <p className="text-muted-foreground mt-1">{job.title}</p>
      </div>
      <JobForm job={job} employerLocation={emp?.location ?? null} />
    </div>
  )
}
