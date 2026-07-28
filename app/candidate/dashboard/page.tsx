import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ApplicationCard } from '@/components/candidate/ApplicationCard'
import { Briefcase, FileText, Send } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Dashboard' }

export default async function CandidateDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: candidateProfile }, { data: applications, count: appCount }, { count: jobCount }] =
    await Promise.all([
      supabase.from('candidate_profiles').select('cv_url, cv_filename').eq('id', user.id).single(),
      supabase
        .from('applications')
        .select('*, jobs(title, location, contract_type, employer_profiles(company_name, logo_url))', { count: 'exact' })
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your job search progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{appCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Live Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{jobCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">CV Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{candidateProfile?.cv_url ? 'Uploaded' : 'Not uploaded'}</p>
            {!candidateProfile?.cv_url && (
              <Button size="sm" variant="link" className="px-0 h-auto" asChild>
                <Link href="/candidate/cv">Upload CV →</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/candidate/applications">View all</Link>
          </Button>
        </div>
        {applications && applications.length > 0 ? (
          <div className="grid gap-3">
            {applications.map(app => (
              <ApplicationCard key={app.id} application={app as any} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No applications yet.</p>
              <Button asChild>
                <Link href="/candidate/jobs">Browse jobs</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
