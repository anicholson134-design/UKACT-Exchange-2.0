import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  const [candidates, employers, pendingEmployers, activeJobs, pendingJobs, applications] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'candidate'),
    admin.from('employer_profiles').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    admin.from('employer_profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    admin.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
    admin.from('applications').select('id', { count: 'exact', head: true }),
  ])

  return NextResponse.json({
    candidates: candidates.count ?? 0,
    employers: employers.count ?? 0,
    pendingEmployers: pendingEmployers.count ?? 0,
    activeJobs: activeJobs.count ?? 0,
    pendingJobs: pendingJobs.count ?? 0,
    applications: applications.count ?? 0,
  })
}
