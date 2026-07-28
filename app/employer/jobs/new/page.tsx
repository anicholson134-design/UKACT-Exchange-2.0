import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JobForm } from '@/components/employer/JobForm'

export const metadata: Metadata = { title: 'Post a Placement' }

export default async function NewJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: emp } = await supabase
    .from('employer_profiles')
    .select('location, company_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post a Placement</h1>
        <p className="text-muted-foreground mt-1">Your listing will be reviewed by KEEP before going live.</p>
      </div>
      <JobForm employerLocation={emp?.location ?? null} />
    </div>
  )
}
