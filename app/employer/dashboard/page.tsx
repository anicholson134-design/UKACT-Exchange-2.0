import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Briefcase, Users, Plus, Building2, MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'
import type { Job } from '@/types'

export const metadata: Metadata = { title: 'Collection Dashboard' }

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: myJobIds } = await supabase.from('jobs').select('id').eq('employer_id', user.id)
  const ids = (myJobIds ?? []).map(j => j.id)

  const [{ data: jobs }, { count: totalApps }, { data: myApplications }] = await Promise.all([
    supabase
      .from('jobs')
      .select('id, title, status, created_at, contract_type')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    ids.length
      ? supabase.from('applications').select('id', { count: 'exact', head: true }).in('job_id', ids)
      : Promise.resolve({ count: 0 }),
    ids.length
      ? supabase.from('applications').select('id').in('job_id', ids)
      : Promise.resolve({ data: [] as { id: string }[] }),
  ])

  let totalUnread = 0
  const appIds = (myApplications ?? []).map(a => a.id)
  if (appIds.length) {
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('application_id', appIds)
      .is('read_at', null)
      .neq('sender_id', user.id)
    totalUnread = count ?? 0
  }

  const activeJobs = jobs?.filter(j => j.status === 'active').length ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your job listings and applicants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/employer/profile"><Building2 className="h-4 w-4 mr-2" />Collection profile</Link>
          </Button>
          <Button asChild>
            <Link href="/employer/jobs/new"><Plus className="h-4 w-4 mr-2" />Post a job</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{activeJobs}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalApps ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalUnread}</p></CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Jobs</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/employer/jobs">View all</Link>
          </Button>
        </div>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Posted</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {(jobs as Job[] ?? []).map(job => (
                <tr key={job.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{job.title}</td>
                  <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(job.created_at)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/employer/jobs/${job.id}/applicants`}>Applicants</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
