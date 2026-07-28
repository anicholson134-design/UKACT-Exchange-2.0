import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? 'pending_review'

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('jobs')
    .select('id, title, status, created_at, contract_type, location, employer_id')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch company names separately to avoid any ambiguous FK issues
  const employerIds = [...new Set((data ?? []).map((j: any) => j.employer_id))]
  const { data: employers } = employerIds.length
    ? await admin.from('employer_profiles').select('id, company_name').in('id', employerIds)
    : { data: [] as any[] }

  const empMap = Object.fromEntries((employers ?? []).map((e: any) => [e.id, e.company_name]))

  const jobs = (data ?? []).map((j: any) => ({
    ...j,
    employer_profiles: { company_name: empMap[j.employer_id] ?? 'Unknown' },
  }))

  return NextResponse.json({ jobs })
}
