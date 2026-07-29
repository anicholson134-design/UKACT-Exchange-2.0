import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Briefcase, Send, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reports' }

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const [candidates, employers, activeJobs, closedJobs, applications, hired] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'candidate'),
    admin.from('employer_profiles').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    admin.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    admin.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'closed'),
    admin.from('applications').select('id', { count: 'exact', head: true }),
    admin.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'hired'),
  ])

  const conversionRate = applications.count
    ? ((hired.count ?? 0) / applications.count * 100).toFixed(1)
    : '0'

  const stats = [
    { label: 'Total Candidates', value: candidates.count ?? 0, icon: Users },
    { label: 'Approved Collections', value: employers.count ?? 0, icon: Building2 },
    { label: 'Active Jobs', value: activeJobs.count ?? 0, icon: Briefcase },
    { label: 'Closed Jobs', value: closedJobs.count ?? 0, icon: Briefcase },
    { label: 'Total Applications', value: applications.count ?? 0, icon: Send },
    { label: 'Successful Hires', value: hired.count ?? 0, icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Platform Reports</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
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

      <Card>
        <CardHeader><CardTitle>Hire Conversion Rate</CardTitle></CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{conversionRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">
            {hired.count ?? 0} hires from {applications.count ?? 0} applications
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

