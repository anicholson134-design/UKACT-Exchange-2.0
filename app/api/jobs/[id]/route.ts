import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jobSchema } from '@/lib/validations/job'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*, employer_profiles(company_name, logo_url, location, website, description)')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job } = await supabase
    .from('jobs').select('employer_id').eq('id', id).single()
  if (!job || job.employer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const parsed = jobSchema.partial().safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { start_date, expires_at, application_deadline, ...rest } = parsed.data

  const { data, error } = await supabase
    .from('jobs')
    .update({
      ...rest,
      start_date: start_date || null,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
      application_deadline: application_deadline ? new Date(application_deadline).toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job } = await supabase
    .from('jobs').select('employer_id').eq('id', id).single()
  if (!job || job.employer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await supabase.from('jobs').update({ status: 'closed' }).eq('id', id)

  return NextResponse.json({ success: true })
}
