import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applicationSchema } from '@/lib/validations/application'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('applications')
    .select('*, jobs(title, location, contract_type, employer_profiles(company_name, logo_url))')
    .eq('candidate_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'candidate') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const parsed = applicationSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { data: candidateProfile } = await supabase
    .from('candidate_profiles').select('cv_url').eq('id', user.id).single()

  const { data, error } = await supabase
    .from('applications')
    .insert({
      job_id: parsed.data.job_id,
      candidate_id: user.id,
      cover_letter: parsed.data.cover_letter,
      considerations: parsed.data.considerations,
      cv_url: candidateProfile?.cv_url,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Already applied to this job' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
