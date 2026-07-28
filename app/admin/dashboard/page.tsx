import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Building2, Briefcase, Send, Clock, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const [candidates, employers, pendingEmployers, pendingCandidates, activeJobs, pendingJobs, applications] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'candidate'),
    admin.from('employer_profiles').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    admin.from('employer_profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('candidate_profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    admin.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
    admin.from('applications').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Candidates', value: candidates.count ?? 0, icon: Users, href: '/admin/candidates' },
    { label: 'Approved Employers', value: employers.count ?? 0, icon: Building2, href: '/admin/employers' },
    { label: 'Active Jobs', value: activeJobs.count ?? 0, icon: Briefcase, href: '/admin/jobs' },
    { label: 'Total Applications', value: applications.count ?? 0, icon: Send, href: '/admin/reports' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Pending Employers
              <span className="ml-auto text-2xl font-bold">{pendingEmployers.count ?? 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/employers?status=pending">Review employers</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Pending Candidates
              <span className="ml-auto text-2xl font-bold">{pendingCandidates.count ?? 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/candidates?status=pending">Review candidates</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              Jobs Awaiting Review
              <span className="ml-auto text-2xl font-bold">{pendingJobs.count ?? 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/jobs?status=pending_review">Review jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

