import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jobSchema } from '@/lib/validations/job'

const PAGE_SIZE = 20

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page = Number(searchParams.get('page') ?? 1)
  const search = searchParams.get('q') ?? ''
  const contractType = searchParams.get('contract_type')
  const remote = searchParams.get('remote')
  const location = searchParams.get('location')

  let query = supabase
    .from('jobs')
    .select('*, employer_profiles(company_name, logo_url, location)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) query = query.textSearch('title', search, { type: 'websearch' })
  if (contractType) query = query.eq('contract_type', contractType)
  if (remote === 'true') query = query.eq('remote', true)
  if (location) query = query.ilike('location', `%${location}%`)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ jobs: data, total: count, page, pageSize: PAGE_SIZE })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'employer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: emp } = await supabase
    .from('employer_profiles').select('status').eq('id', user.id).single()
  if (emp?.status !== 'approved') return NextResponse.json({ error: 'Account not approved' }, { status: 403 })

  const body = await request.json()
  const parsed = jobSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { start_date, expires_at, application_deadline, ...rest } = parsed.data

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      ...rest,
      employer_id: user.id,
      status: 'pending_review',
      contract_type: body.contract_type ?? 'contract',
      remote: false,
      start_date: start_date || null,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
      application_deadline: application_deadline ? new Date(application_deadline).toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
