import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applicationStatusSchema } from '@/lib/validations/application'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // verify employer owns the job this application belongs to
  const { data: app } = await supabase
    .from('applications')
    .select('job_id, jobs(employer_id)')
    .eq('id', id)
    .single()

  const jobEmployerId = (app?.jobs as any)?.employer_id
  if (!app || jobEmployerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = applicationStatusSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { data, error } = await supabase
    .from('applications')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
