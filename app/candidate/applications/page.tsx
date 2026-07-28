import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ApplicationCard } from '@/components/candidate/ApplicationCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Applications' }

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: applications } = await supabase
    .from('applications')
    .select('*, jobs(title, location, contract_type, employer_profiles(company_name, logo_url))')
    .eq('candidate_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground mt-1">{applications?.length ?? 0} applications submitted</p>
      </div>
      {applications && applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map(app => (
            <ApplicationCard key={app.id} application={app as any} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-16">You haven&apos;t applied to any jobs yet.</p>
      )}
    </div>
  )
}
